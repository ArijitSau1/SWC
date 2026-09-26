import {
  BadRequestException,
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

import { CourseContentService } from './course-content.service';
import { CreateCourseContentDto } from './dto/create-course-content.dto';

import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/enum/user-role.enum';
import { CourseContentType } from 'src/enum/course-content-type.enum';

@Controller('course-content')
export class CourseContentController {
  constructor(private readonly courseContentService: CourseContentService) {}

  @Post('video')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
    }),
  )
  createVideo(
    @Body() dto: CreateCourseContentDto,

    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: 'video/mp4',
          }),

          new MaxFileSizeValidator({
            maxSize: 500 * 1024 * 1024,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.courseContentService.create(dto, file);
  }

@Get('course/:courseId')
findByCourse(
  @Param('courseId') courseId: string,
  @Query('type') type?: CourseContentType,
) {
  return this.courseContentService.findByCourse(
    courseId,
    type,
  );
}

  @Post('study-material')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@UseInterceptors(
  FileInterceptor('file', {
    storage: memoryStorage(),
  }),
)
createStudyMaterial(
  @Body() dto: CreateCourseContentDto,

  @UploadedFile(
    new ParseFilePipe({
      validators: [
        new FileTypeValidator({
          fileType: 'application/pdf',
        }),
        new MaxFileSizeValidator({
          maxSize: 20 * 1024 * 1024,
        }),
      ],
    }),
  )
  file: Express.Multer.File,
) {
  return this.courseContentService.create(
    dto,
    file,
  );
}

@Post('radio')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@UseInterceptors(
  FileInterceptor('file', {
    storage: memoryStorage(),
  }),
)
createRadio(
  @Body() dto: CreateCourseContentDto,

  @UploadedFile(
    new ParseFilePipe({
      validators: [
        new FileTypeValidator({
          fileType: 'audio/mpeg',
        }),
        new MaxFileSizeValidator({
          maxSize: 50 * 1024 * 1024,
        }),
      ],
    }),
  )
  file: Express.Multer.File,
) {
  return this.courseContentService.create(
    dto,
    file,
  );
}

@Post('mock-test')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
createMockTestContent(
  @Body() dto: CreateCourseContentDto,
) {
  return this.courseContentService.createMockTestContent(
    dto,
  );
}
}
