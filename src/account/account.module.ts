import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { Account } from './entities/account.entity';
import { BunnyModule } from 'src/bunny/bunny.module';

@Module({
  imports: [TypeOrmModule.forFeature([Account]),BunnyModule],

  controllers: [AccountController],

  providers: [AccountService],

  exports: [AccountService],
})
export class AccountModule {}