import jwt from "jsonwebtoken";

export const getAccessToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "15m",
  });
};

export const getRefreshToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "7d",
  });
};
