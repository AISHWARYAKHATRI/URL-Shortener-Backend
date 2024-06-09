import jwt from 'jsonwebtoken';

export const generateToken = (id: number) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: '1d',
  });
};

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};
