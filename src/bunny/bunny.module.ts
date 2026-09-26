import { Module } from '@nestjs/common';
import { BunnyService } from './bunny.service';

@Module({
  providers: [BunnyService],
  exports: [BunnyService],
})
export class BunnyModule {}