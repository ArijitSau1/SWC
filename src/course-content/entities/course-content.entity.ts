import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Course } from 'src/course/entities/course.entity';
import { CourseContentType } from 'src/enum/course-content-type.enum';
import { MockTest } from 'src/mock-test/entities/mock-test.entity';

@Entity('course_contents')
export class CourseContent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 200,
  })
  title: string;

  @Column({
    type: 'enum',
    enum: CourseContentType,
  })
  type: CourseContentType;

  @Column({
    type: 'varchar',
    length: 1000,
    nullable: true,
  })
  url: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  duration: string;

  @Column({
  type: 'boolean',
  default: true,
})
isFree: boolean;

  @ManyToOne(
    () => Course,
    (course) => course.contents,
    {
      nullable: false,
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'courseId',
  })
  course: Course;

  @OneToMany(
  () => MockTest,
  (mockTest) => mockTest.courseContent,
)
mockTests: MockTest[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}