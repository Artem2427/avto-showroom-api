import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { getTypeOrmAsyncConfig } from './configs/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { AuthMiddleware } from './auth/middleware/auth.middleware';
import { CarModule } from './car/car.module';
import { BrandModule } from './brand/brand.module';
import { ModelModule } from './model/model.module';
import { DriveModule } from './drive/drive.module';
import { BodyTypeModule } from './body-type/body-type.module';
import { ColorModule } from './color/color.module';
import { TransmissionModule } from './transmission/transmission.module';
import { EngineModule } from './engine/engine.module';
import { PriceModule } from './price/price.module';
import { ScheduleModule } from '@nestjs/schedule';
import { FuelModule } from './fuel/fuel.module';
import { FilterModule } from './filter/filter.module';
import { FileModule } from './file/file.module';
import { FeedbackModule } from './feedback/feedback.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: `.env` }),
    TypeOrmModule.forRootAsync(getTypeOrmAsyncConfig()),
    UserModule,
    AuthModule,
    CarModule,
    BrandModule,
    ModelModule,
    DriveModule,
    BodyTypeModule,
    ColorModule,
    TransmissionModule,
    EngineModule,
    PriceModule,
    ScheduleModule.forRoot(),
    FuelModule,
    FilterModule,
    FileModule,
    FeedbackModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
