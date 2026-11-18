import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // bypass for docker health check
    if (req.originalUrl.includes('health')) {
      return next();
    }

    const tenantId = req.headers['x-tenant-id'];
    console.log('Incoming Tenant:', tenantId);

    if (!tenantId) {
      throw new BadRequestException('X-Tenant-Id header is missing. Access denied.');
    }

    req['tenantId'] = tenantId;
    console.log(`[TenantMiddleware] Intercepted request to: ${req.method} ${req.originalUrl} for tenant: ${tenantId}`);
    next();
  }
}

