import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Response } from 'express';
import { IExpressRequest } from '../../types/expressRequest.interface';
import { UserService } from '../../user/user.service';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async use(req: IExpressRequest, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = null;
      next();
      return;
    }

    const token = req.headers.authorization.split(' ')[1];

    try {
      const userData = this.authService.validateToken(
        token,
        process.env.JWT_SECRET,
      );

      if (userData) {
        const user = await this.userService.findByEmail(userData.email);

        req.user = user;
      } else {
        req.user = null;
      }

      next();
      return;
    } catch (error) {
      req.user = null;
      next();
      return;
    }
  }
}
