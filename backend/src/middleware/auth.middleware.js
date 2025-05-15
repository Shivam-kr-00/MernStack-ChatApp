import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        //  console.log("🔐 Checking for token in cookies...");
        // console.log("Cookies received:", req.cookies); // ✅ Log cookies

        // Check for JWT token in cookies
        const token = req.cookies.jwt;
        if (!token) {
            console.log("⛔ No token found in cookies.");
            return res.status(401).json({ msg: "Unauthorized - No Token Provided" });
        }

        // Verify the token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
            //   console.log("✅ Token successfully decoded:", decoded); // ✅ Log decoded token
        } catch (error) {
            console.log("⛔ Token verification failed:", error.message);
            return res.status(401).json({ message: "Unauthorized - Invalid Token" });
        }

        // Find the user associated with the decoded token
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            console.log("⛔ User not found for decoded userId:", decoded.userId);
            return res.status(404).json({ message: "User not found" });
        }

        //  console.log("✅ Authenticated user:", user.fullName, user._id); // ✅ Log authenticated user

        // Attach the user object to the request for further use
        req.user = user;

        // Proceed to the next middleware/route handler
        next();

    } catch (error) {
        console.log("🔥 Error in protection middleware:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export default protectRoute;
