import { Module } from '@nestjs/common';
import { MaterialService } from './material.service';
import { MaterialController } from './material.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Material, MaterialSchema } from './schema/material.schema';

@Module({
  controllers: [MaterialController],
  providers: [MaterialService],
  imports: [
    MongooseModule.forFeature([{ name: Material.name, schema: MaterialSchema }]),
  ],
})
export class MaterialModule {}
