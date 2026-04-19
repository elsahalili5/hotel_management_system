import jwt from "jsonwebtoken";

if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
  throw new Error("JWT secrets are missing in .env file");
}
// kontrollon nëse ekzistojnë këto dy “çelësa sekret”:

export const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
//  e ka short life , e marrum  prej .env e bajna triperdorshme nkrejt sistemin si konstante
export const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
// tash kjo e ka long life
export const generateAccessToken = (userId: number) => {
  return jwt.sign({ userId }, ACCESS_SECRET, { expiresIn: "15m" });
};

export const generateRefreshToken = (userId: number) => {
  return jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: "7d" });
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_SECRET) as { userId: number };
};
