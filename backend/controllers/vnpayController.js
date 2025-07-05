require('dotenv').config();
const qs = require('qs');
const crypto = require('crypto');
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const Payment = require('../models/Payment');
const User = require('../models/User');
const Plan = require('../models/Plan');

const paymentSessions = new Map();

const vnp_TmnCode = process.env.VNP_TMNCODE;
const vnp_HashSecret = process.env.VNP_HASH_SECRET;
const vnp_Url = process.env.VNP_URL;
const vnp_ReturnUrl = process.env.VNP_RETURN_URL;
const frontendReturnSuccess = process.env.FRONTEND_SUCCESS_URL || 'http://localhost:3000/payment-success';
const frontendReturnFail = process.env.FRONTEND_FAIL_URL || 'http://localhost:3000/payment-failed';

function sortObject(obj) {
  return Object.keys(obj).sort().reduce((result, key) => {
    result[key] = obj[key];
    return result;
  }, {});
}

exports.createPaymentUrl = async (req, res) => {
  try {
    const { user, plan, amount } = req.body;

    if (!user || !plan || !amount) {
      return res.status(400).json({ message: 'Thiếu thông tin user, plan hoặc amount' });
    }

    let ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress || '';
    if (ipAddr === '::1' || ipAddr === '::ffff:127.0.0.1') ipAddr = '127.0.0.1';

    const orderId = uuidv4().replace(/-/g, '').substring(0, 20);
    const createDate = moment().format('YYYYMMDDHHmmss');

    paymentSessions.set(orderId, { user, plan });

    const vnp_Params = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderId,
      vnp_OrderInfo: 'Thanh toan goi VIP',
      vnp_OrderType: 'other',
      vnp_Amount: amount * 100,
      vnp_ReturnUrl: vnp_ReturnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate
    };

    const sortedParams = sortObject(vnp_Params);
    const signData = qs.stringify(sortedParams, { encode: false });
    const signed = crypto.createHmac('sha512', vnp_HashSecret)
                         .update(Buffer.from(signData, 'utf-8'))
                         .digest('hex');

    sortedParams['vnp_SecureHash'] = signed;
    const paymentUrl = `${vnp_Url}?${qs.stringify(sortedParams, { encode: true })}`;

    return res.json({ paymentUrl });
  } catch (err) {
    console.error('Lỗi tạo URL thanh toán:', err);
    return res.status(500).json({ message: 'Lỗi tạo thanh toán' });
  }
};

exports.vnpayReturn = async (req, res) => {
  try {
    let vnp_Params = req.query;
    const secureHash = vnp_Params['vnp_SecureHash'];
    const txnRef = vnp_Params['vnp_TxnRef'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    const sortedParams = sortObject(vnp_Params);
    const signData = qs.stringify(sortedParams, { encode: false });
    const signed = crypto.createHmac('sha512', vnp_HashSecret)
                         .update(Buffer.from(signData, 'utf-8'))
                         .digest('hex');

    if (secureHash !== signed) {
      console.warn('Checksum mismatch!');
      return res.redirect(frontendReturnFail);
    }

    const session = paymentSessions.get(txnRef);
    if (!session) return res.redirect(frontendReturnFail);
    paymentSessions.delete(txnRef);

    const { user, plan } = session;

    if (vnp_Params['vnp_ResponseCode'] === '00') {
      const payment = new Payment({
        user: mongoose.Types.ObjectId(user),
        plan: mongoose.Types.ObjectId(plan),
        amount: Number(vnp_Params['vnp_Amount']) / 100,
        method: 'e_wallet',
        status: 'completed',
        transactionId: vnp_Params['vnp_TransactionNo'],
        paidAt: new Date()
      });
      await payment.save();

      const userDoc = await User.findById(user);
      const planDoc = await Plan.findById(plan);
      const now = new Date();
      const expireDate = new Date(now);
      expireDate.setMonth(now.getMonth() + planDoc.duration);

      userDoc.vip.push({
        plan: planDoc._id,
        remainingPosts: {
          gold: planDoc.vipGold,
          silver: planDoc.vipSilver,
          regular: planDoc.regularPosts,
          push: planDoc.pushPosts
        },
        startDate: now,
        expireDate
      });
      await userDoc.save();

      return res.redirect(frontendReturnSuccess);
    } else {
      return res.redirect(frontendReturnFail);
    }
  } catch (err) {
    console.error('Lỗi xử lý thanh toán:', err);
    return res.redirect(frontendReturnFail);
  }
};
