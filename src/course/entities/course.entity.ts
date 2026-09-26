import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Subject } from 'src/subject/entities/subject.entity';

import { AcademicClass } from 'src/academic-class/entities/academic-class.entity';

import { AcademicSemester } from 'src/academic-semester/entities/academic-semester.entity';

import { GraduationSemester } from 'src/graduation-semester/entities/graduation-semester.entity';

import { OneToMany } from 'typeorm';
import { CourseContent } from 'src/course-content/entities/course-content.entity';


@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 200,
  })
  title: string;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  thumbnail: string;

  @Column({
    type: 'varchar',
    length: 1000,
    nullable: true,
  })
  description: string;

  
  @ManyToOne(
    () => Subject,
    (subject) => subject.courses,
    {
      nullable: false,
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'subjectId',
  })
  subject: Subject;

 
  @ManyToOne(
    () => AcademicClass,
    {
      nullable: true,
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'academicClassId',
  })
  academicClass: AcademicClass;

  
  @ManyToOne(
    () => AcademicSemester,
    {
      nullable: true,
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'academicSemesterId',
  })
  academicSemester: AcademicSemester;

  
  @ManyToOne(
    () => GraduationSemester,
    {
      nullable: true,
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'graduationSemesterId',
  })
  graduationSemester: GraduationSemester;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  price: number;

  @Column({
    type: 'boolean',
    default: true,
  })
  isFree: boolean;

  @OneToMany(
  () => CourseContent,
  (courseContent) => courseContent.course,
)
contents: CourseContent[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}