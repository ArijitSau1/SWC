import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';
import { NodeMailerModule } from './node-mailer/node-mailer.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AcademicLevelModule } from './academic-level/academic-level.module';
import { AcademicProgramModule } from './academic-program/academic-program.module';
import { AcademicClassModule } from './academic-class/academic-class.module';
import { AcademicStreamModule } from './academic-stream/academic-stream.module';
import { AcademicSemesterModule } from './academic-semester/academic-semester.module';
import { GraduationDegreeModule } from './graduation-degree/graduation-degree.module';
import { UniversityModule } from './university/university.module';
import { DegreeUniversityModule } from './degree-university/degree-university.module';
import { GraduationSemesterModule } from './graduation-semester/graduation-semester.module';
import { CacheModule } from '@nestjs/cache-manager';

import { createKeyv } from '@keyv/redis';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SubjectModule } from './subject/subject.module';
import { CourseModule } from './course/course.module';
import { CourseContentModule } from './course-content/course-content.module';
import { MockTestModule } from './mock-test/mock-test.module';
import { MockTestQuestionModule } from './mock-test-question/mock-test-question.module';
import { MockTestAttemptModule } from './mock-test-attempt/mock-test-attempt.module';
import { CompetitiveCategoryModule } from './competitive-category/competitive-category.module';
import { CompetitiveExamModule } from './competitive-exam/competitive-exam.module';
import { CompetitiveSubjectModule } from './competitive-subject/competitive-subject.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),

    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60000,
        limit: 10,
      },
    ]),

    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST'),
          port: Number(configService.get<string>('REDIS_PORT')),
        },
      }),
    }),

    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        stores: [createKeyv('redis://localhost:6379')],
      }),
    }),

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),

    AccountModule,
    AuthModule,
    NodeMailerModule,
    AcademicLevelModule,
    AcademicProgramModule,
    AcademicClassModule,
    AcademicStreamModule,
    AcademicSemesterModule,
    GraduationDegreeModule,
    UniversityModule,
    DegreeUniversityModule,
    GraduationSemesterModule,
    SubjectModule,
    CourseModule,
    CourseContentModule,
    MockTestModule,
    MockTestQuestionModule,
    MockTestAttemptModule,
    CompetitiveCategoryModule,
    CompetitiveExamModule,
    CompetitiveSubjectModule
  ],

  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
