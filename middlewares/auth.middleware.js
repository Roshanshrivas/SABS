import jwt from "jsonwebtoken";

// Middleware to authenticate JWT token
export const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1. Check if token exists and starts with "Bearer"
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized! No token provided.",
      });
    }

    // 2. Extract token from "Bearer <token>"
    const token = authHeader.split(" ")[1];

    // 3. Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);


    // 4. Attach user to request
    req.user = decoded;

    // 5. Proceed to next middleware
    next();
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    return res.status(403).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};


//admin Protected route
export const isAdmin = async(req, res, next) => {
  try {
    if(req.user.role !== "admin"){
       return res.status(401).json({
        success:false,
        message:"Failed to access! this is Admin protected Route!"
       })
    }
    next();
  } catch (error) {
    console.error("Failed to access!!", error.message);
    return res.status(500).json({
      success:false,
      message:"internal server Error!!"
    })
  }
}


//User Protected Route
export const isUser = async(req, res, next) => {
  try {
    if(req.user.role !== "user"){
       return res.status(401).json({
        success:false,
        message:"Failed to access! this is User protected Route!"
       })
    }
    next();
  } catch (error) {
    console.error("Failed to access!!", error.message);
    return res.status(500).json({
      success:false,
      message:"internal server Error!!"
    })
  }
}
