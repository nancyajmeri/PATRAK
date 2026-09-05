import jwt from "jsonwebtoken";

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      clinicId: user.clinicId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

export default generateToken;