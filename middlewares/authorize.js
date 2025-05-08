module.exports =
  (...allowedRoles) =>
  (req, res, next) => {
    console.log("🟡 authorize() middleware");
    console.log("🔑 Allowed roles:", allowedRoles);
    console.log("🧾 User role from token:", req.user?.role);

    if (!allowedRoles.includes(req.user?.role)) {
      console.warn("⛔ Access denied: role mismatch");
      return res
        .status(403)
        .json({ message: "Forbidden: insufficient rights" });
    }

    console.log("✅ Access granted");
    next();
  };
