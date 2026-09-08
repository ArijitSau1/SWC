import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository,Brackets } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { Account } from './entities/account.entity';
import { CreateAccountDto, PaginationDto } from './dto/create-account.dto';


@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async register(createAccountDto: CreateAccountDto) {
    const {
      name,
      email,
      password,
      confirmPassword,
    } = createAccountDto;

    if (password !== confirmPassword) {
      throw new BadRequestException(
        'Password and confirm password do not match',
      );
    }

    const existingAccount = await this.accountRepository.findOne({
      where: { email },
    });

    if (existingAccount) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const account = this.accountRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    const savedAccount =
      await this.accountRepository.save(account);

    const { password: _, ...result } = savedAccount;

    return result;
  }

  async find(dto: PaginationDto) {
  const keyword = dto.keyword || '';

  const [result, total] = await this.accountRepository
    .createQueryBuilder('account')

    .where(
      new Brackets((qb) => {
        qb.where('account.name LIKE :name', {
          name: `%${keyword}%`,
        }).orWhere('account.email LIKE :email', {
          email: `%${keyword}%`,
        });
      }),
    )

    .skip(dto.offset)
    .take(dto.limit)

    .orderBy('account.createdAt', 'DESC')

    .getManyAndCount();

  return {
    result,
    total,
  };
}
}
