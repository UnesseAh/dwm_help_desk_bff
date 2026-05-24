import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';


export default function authorize(roles: string[] = []) {
  return (req: any, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        error: 'Access denied',
      });
    }

    jwt.verify(
      token,
      process.env.JWT_SECRET as string,
      (err: any, decoded: any) => {
        if (err || !decoded) {
          return res.status(403).json({
            error: 'Invalid token',
          });
        }
        if (
          roles.length > 0 &&
          !roles.includes(decoded.user.role)
        ) {
          return res.status(403).json({
            error: 'Insufficient permissions',
          });
        }

        req.user = decoded;

        next();
      }
    );
  };
}