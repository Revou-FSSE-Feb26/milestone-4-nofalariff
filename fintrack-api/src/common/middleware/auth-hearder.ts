import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthHeaderMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['x-api'];

    if (!authHeader) {
      throw new UnauthorizedException('Missing API Header');
    } else if (authHeader == 'RevoU2026') {
      next();
    } else {
      throw new UnauthorizedException('Invalid API Header');
    }
  }
}
