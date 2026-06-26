export const authorize = (...roles) => {
  return (req, res, next) => {
    // 1. Ensure user is authenticated first
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login first.",
      });
    }

    // 2. Ensure role exists
    if (!req.user.role) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Role not assigned.",
      });
    }

    // 3. Check role permission
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role(s): ${roles.join(", ")}`,
      });
    }

    next();
  };
};