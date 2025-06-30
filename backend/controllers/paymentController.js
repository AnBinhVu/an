const Payment = require('../models/Payment');

exports.createPayment = async (req, res) => {
  try {
    const { user, amount, method, note } = req.body;
    const payment = new Payment({
      user,
      amount,
      method,
      note
    });
    await payment.save();
    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi tạo thanh toán', error: err.message });
  }
};
