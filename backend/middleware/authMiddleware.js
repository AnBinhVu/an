const jwt = require('jsonwebtoken');
const Session = require('../models/Session');

/**
 * Middleware xác thực & kiểm tra vai trò.
 * Mặc định cho phép tất cả các vai trò: user, owner, admin.
 * Có thể truyền 1 role hoặc mảng nhiều role.
 */
const authMiddleware = (requiredRoles = ['user', 'owner', 'admin']) => {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Không có token xác thực.' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const session = await Session.findOne({ token });
      if (!session || new Date() > new Date(session.expiresAt)) {
        return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
      }

      const decoded = jwt.verify(token, 'SECRET_KEY');

      const userRole = session.role;
      req.userId = decoded.id;
      req.userRole = userRole;

      // Kiểm tra vai trò nếu có yêu cầu
      const allowedRoles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ message: `Bạn không có quyền truy cập. Vai trò yêu cầu: ${allowedRoles.join(', ')}` });
      }

      next();
    } catch (err) {
      console.error('Auth Error:', err.message);
      return res.status(403).json({ message: 'Xác thực thất bại.' });
    }
  };
};

module.exports = authMiddleware;
