import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MaterialModule } from './material/material.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/guards/role/roles.guard';
import { AuthGuard } from './auth/guards/jwt/jwt.guard';
import { AllExceptionsFilter } from './helpers/errorHandler/all-exceptions.filter';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { DownloadModule } from './pdfDownloads/downloads.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGO_CONNECT'),
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    MaterialModule,
    ProductModule,
    OrderModule,
    DownloadModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
