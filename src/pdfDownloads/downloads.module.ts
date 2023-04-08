import { Module } from '@nestjs/common';
import { DownloadService } from './downloads.service';
import { OrderModule } from '../order/order.module';
import { DownloadController } from './downloads.controller';

@Module({
  controllers: [DownloadController],
  providers: [DownloadService],
  imports: [OrderModule],
})
export class DownloadModule {}
