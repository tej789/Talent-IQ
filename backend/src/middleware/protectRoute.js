import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
  try {
    const { userId } = req.auth;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let user = await User.findOne({ clerkId: userId });

    if (!user) {
      // ✅ GUARANTEED EMAIL (fallback)
      const email =
        req.auth.sessionClaims?.email ||
        `${userId}@clerk.local`;

      user = await User.create({
        clerkId: userId,
        email: email,
        name: "New User",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("protectRoute error:", error);
    res.status(500).json({ message: error.message });
  }
};
