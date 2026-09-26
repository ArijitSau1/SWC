import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository,Brackets } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { Account } from './entities/account.entity';
import { CreateAccountDto, PaginationDto } from './dto/create-account.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';


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

    const hashedPassword = await bcrypt.hash(password, 13);

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

async getMyProfile(accountId: string) {
  const account = await this.accountRepository.findOne({
    where: {
      id: accountId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      roles: true,
      phoneNumber: true,
      age: true,
      gender: true,
      institution: true,
      address: true,
      profileImage: true,
      createdAt: false,
      updatedAt: false,
    },
  });

  if (!account) {
    throw new NotFoundException(
      'Account not found',
    );
  }

  return account;
}


async updateProfile(
  accountId: string,
  dto: UpdateProfileDto,
) {
  const account = await this.accountRepository.findOne({
    where: {
      id: accountId,
    },
  });

  if (!account) {
    throw new NotFoundException(
      'Account not found',
    );
  }

  if (dto.email && dto.email !== account.email) {
    const existingAccount =
      await this.accountRepository.findOne({
        where: {
          email: dto.email,
        },
      });

    if (existingAccount) {
      throw new ConflictException(
        'Email already exists',
      );
    }
  }

  Object.assign(account, dto);

  const updatedAccount =
    await this.accountRepository.save(account);

  return {
    id: updatedAccount.id,
    name: updatedAccount.name,
    email: updatedAccount.email,
    roles: updatedAccount.roles,
    phoneNumber: updatedAccount.phoneNumber,
    age: updatedAccount.age,
    gender: updatedAccount.gender,
    institution: updatedAccount.institution,
    address: updatedAccount.address,
    profileImage: updatedAccount.profileImage,
  };
}

async uploadProfileImage(
  accountId: string,
  imagePath: string,
) {
  const account = await this.accountRepository.findOne({
    where: {
      id: accountId,
    },
  });

  if (!account) {
    throw new NotFoundException(
      'Account not found',
    );
  }

   const path = imagePath.replace(/\\/g, '/');
   account.profileImage =
    process.env.RE_CDN_LINK + path;

  await this.accountRepository.save(account);

  return {
    message: 'Profile image uploaded successfully',
    profileImage: account.profileImage,
  };
}
}
