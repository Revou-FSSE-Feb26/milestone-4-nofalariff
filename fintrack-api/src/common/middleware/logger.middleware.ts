import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Request, next: NextFunction) {
    //check waktu yang digunakan dalam satu API call

    const start = Date.now();
    const { method, originalUrl } = req;

    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(
        `${method} -- ${originalUrl} | ${res.statusCode} | ${duration}ms`,
      );
    });

    next();
  }
}
