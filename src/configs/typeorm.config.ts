import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

export const getTypeOrmAsyncConfig = (): TypeOrmModuleAsyncOptions => {
  return {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
      return {
        type: 'postgres',
        url: process.env.DATABASE_URL_PROD ?? process.env.DATABASE_URL,
        ssl: process.env.DATABASE_URL_PROD
          ? {
              rejectUnauthorized: false,
            }
          : false,

        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
      };
    },
  };
};
// export const getTypeOrmAsyncConfig = (): TypeOrmModuleAsyncOptions => {
//   return {
//     imports: [ConfigModule],
//     inject: [ConfigService],
//     useFactory: (configService: ConfigService) => {
//       return {
//         type: 'postgres',
//         url:
//           configService.get('DATABASE_URL_PROD') ??
//           configService.get('DATABASE_URL'),
//         ssl: configService.get('DATABASE_URL_PROD')
//           ? {
//               rejectUnauthorized: false,
//             }
//           : false,
//         entities: [__dirname + '/../**/*.entity{.ts,.js}'],
//         synchronize: true,
//       };
//     },
//   };
// };
