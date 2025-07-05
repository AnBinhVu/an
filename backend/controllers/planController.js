const Plan = require('../models/Plan');
const User = require('../models/User');
const mongoose = require('mongoose');

exports.getPlans = async (req, res) => {
  try {
    const plans = await Plan.find().sort({ createdAt: -1 }); 
    res.status(200).json(plans);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách gói', error: err.message });
  }
};

// Lấy chi tiết gói tin theo ID
exports.getPlanById = async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra ID hợp lệ
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID không hợp lệ' });
    }

    // Tìm gói tin
    const plan = await Plan.findById(id);

    if (!plan) {
      return res.status(404).json({ message: 'Không tìm thấy gói tin' });
    }

    res.status(200).json({ message: 'Lấy gói thành công', data: plan });
  } catch (err) {
    console.error('Lỗi khi lấy gói theo ID:', err);
    res.status(500).json({ message: 'Lỗi server khi lấy gói theo ID', error: err.message });
  }
};

exports.createPlan = async (req, res) => {
  try {
    const plan = await Plan.create(req.body); 
    res.status(201).json({ message: 'Tạo gói thành công', data: plan });
  } catch (err) {
    res.status(400).json({ message: 'Tạo gói thất bại', error: err.message });
  }
};

exports.updatePlan = async (req, res) => {
  try {
    const updated = await Plan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Không tìm thấy gói cần cập nhật' });
    }
    res.status(200).json({ message: 'Cập nhật thành công', data: updated });
  } catch (err) {
    res.status(400).json({ message: 'Cập nhật thất bại', error: err.message });
  }
};

exports.deletePlan = async (req, res) => {
  try {
    const deleted = await Plan.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Không tìm thấy gói để xóa' });
    }
    res.status(200).json({ message: 'Đã xóa thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Xóa thất bại', error: err.message });
  }
};

// Lưu gói tin đăng ký của người dùng
exports.SavePlan = async (req, res) => {
  try {
    const { planId, userId } = req.body;

    console.log("📥 Nhận dữ liệu từ client:", req.body);

    // Kiểm tra ID hợp lệ
    if (
      !userId || !planId ||
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(planId)
    ) {
      return res.status(400).json({ thongBao: 'ID người dùng hoặc gói không hợp lệ' });
    }

    // Lấy thông tin gói
    const goi = await Plan.findById(planId);
    if (!goi) {
      return res.status(404).json({ thongBao: 'Không tìm thấy gói' });
    }

    // Lấy thông tin người dùng
    const nguoiDung = await User.findById(userId);
    if (!nguoiDung) {
      return res.status(404).json({ thongBao: 'Không tìm thấy người dùng' });
    }

    // Tìm gói đã tồn tại trong vip
    const goiVipTonTai = nguoiDung.vip.find(v => v.plan && v.plan.toString() === planId);

    if (goiVipTonTai) {
      // Cộng dồn số lượng bài
      goiVipTonTai.remainingPosts.gold += goi.vipGold || 0;
      goiVipTonTai.remainingPosts.silver += goi.vipSilver || 0;
      goiVipTonTai.remainingPosts.regular += goi.regularPosts || 0;
      goiVipTonTai.remainingPosts.push += goi.pushPosts || 0;

      // Cập nhật thời hạn
      const currentExpire = new Date(goiVipTonTai.expireDate || Date.now());
      goiVipTonTai.expireDate = new Date(
        currentExpire.setMonth(currentExpire.getMonth() + (goi.duration || 1))
      );

      // Nếu là gói có VIP cao hơn, cập nhật lại
      if (goi.vipGold > 0) {
        goiVipTonTai.plan = new mongoose.Types.ObjectId(planId);
      }
    } else {
      // Tạo mới gói VIP
      const now = new Date();
      const expire = new Date(now);
      expire.setMonth(expire.getMonth() + (goi.duration || 1));

      // Đảm bảo plan là ObjectId hợp lệ
      const goiVipMoi = {
        plan: new mongoose.Types.ObjectId(planId),
        remainingPosts: {
          gold: goi.vipGold || 0,
          silver: goi.vipSilver || 0,
          regular: goi.regularPosts || 0,
          push: goi.pushPosts || 0
        },
        startDate: now,
        expireDate: expire
      };

      // Đẩy vào mảng vip
      nguoiDung.vip.push(goiVipMoi);
    }

    // Lưu người dùng
    await nguoiDung.save();

    return res.status(200).json({
      thongBao: 'Cập nhật gói thành công',
      duLieu: nguoiDung.vip
    });

  } catch (loi) {
    console.error('❌ Lỗi trong SavePlan:', loi);
    return res.status(500).json({
      thongBao: 'Lỗi server khi cập nhật gói',
      loi: loi.message
    });
  }
};
