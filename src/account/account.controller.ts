import { BadRequestException, Body, Controller, FileTypeValidator, Get, MaxFileSizeValidator, ParseFilePipe, Patch, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';

import { AccountService } from './account.service';
import { CreateAccountDto, PaginationDto } from './dto/create-account.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Account } from './entities/account.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { uploadStorage } from 'src/utils/upload.utils';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { BunnyService } from 'src/bunny/bunny.service';

@Controller('account')
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
    private readonly bunnyService: BunnyService,
  ) {}

  @Post('register')
  register(@Body() createAccountDto: CreateAccountDto) {
    return this.accountService.register(createAccountDto);
  }

   @Get()
  find(@Query() dto: PaginationDto) {
    return this.accountService.find(dto);
  }

  @Get('profile')
@UseGuards(JwtAuthGuard)
getProfile(@CurrentUser() user: Account) {
  return this.accountService.getMyProfile(user.id);
}


@Patch('profile')
@UseGuards(JwtAuthGuard)
updateProfile(
  @CurrentUser() user: Account,
  @Body() dto: UpdateProfileDto,
) {
  return this.accountService.updateProfile(
    user.id,
    dto,
  );
}

// @Put('profile/image')
// @UseGuards(AuthGuard('jwt'))
// @UseInterceptors(
//   FileInterceptor('file', {
//     storage: uploadStorage('Profile'),
//   }),
// )
// async uploadProfileImage(
//   @CurrentUser() user: Account,

//   @UploadedFile(
//     new ParseFilePipe({
//       validators: [
//         new FileTypeValidator({
//           fileType: '.(png|jpeg|jpg)',
//         }),
//         new MaxFileSizeValidator({
//           maxSize: 1024 * 1024,
//         }),
//       ],
//     }),
//   )
//   file: Express.Multer.File,
// ) {
//   return this.accountService.uploadProfileImage(
//     user.id,
//     file.path,
//   );
// }


@Put('profile/image')
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(
  FileInterceptor('file', {
    storage: uploadStorage('Profile'),

    fileFilter: (req, file, callback) => {
      const allowedTypes = [
        'image/png',
        'image/jpeg',
        'image/jpg',
      ];

      if (allowedTypes.includes(file.mimetype)) {
        callback(null, true);
      } else {
        callback(
          new BadRequestException(
            'Only PNG, JPEG and JPG images are allowed',
          ),
          false,
        );
      }
    },

    limits: {
      fileSize: 1024 * 1024,
    },
  }),
)
async uploadProfileImage(
  @CurrentUser() user: Account,
  @UploadedFile() file: Express.Multer.File,
) {
  return this.accountService.uploadProfileImage(
    user.id,
    file.path,
  );
}


@Put('profile/imageCDN')
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(
  FileInterceptor('file', {
    storage: memoryStorage(),
  }),
)
async uploadProfileImage1(
  @CurrentUser() user: Account,

  @UploadedFile(
    new ParseFilePipe({
      validators: [
        new FileTypeValidator({
          fileType: '.(png|jpeg|jpg)',
        }),
        new MaxFileSizeValidator({
          maxSize: 1024 * 1024 * 1,
        }),
      ],
    }),
  )
  file: Express.Multer.File,
) {
  const imagePath =
    await this.bunnyService.uploadFile(
      file,
      'Profile',
    );

  return this.accountService.uploadProfileImage(
    user.id,
    imagePath,
  );
}
}
