import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class MaintenanceMiddleware implements NestMiddleware {
  constructor(private configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    //Mengambil nilai .env Maintenance Mode

    const maintenanceValue = this.configService.get<String>('MAINTENANCE_MODE');

    //Konversi string ke boolean
    const isMaintenance = maintenanceValue === 'true';

    if (isMaintenance) {
      return res.status(503).json({
        statusCode: 503,
        messege: 'Aplikasi sedang dalam perbaikan',
      });
    }
    next();
  }
}
