import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign(
    {
      userId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

export default generateToken;

// export const generateToken= async (userId)=>{
//   try{
//     let token = await jwt.sign({userId}, process.env.JWT_SECRET, {
//       expiresIn: "7d"})
//       return token;
//   }catch(error){
//     throw new Error("JWT_SECRET is not configured error: ",error.message)
//   }
//   }