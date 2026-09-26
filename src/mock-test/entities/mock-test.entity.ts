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

import { CourseContent } from 'src/course-content/entities/course-content.entity';
import { MockTestQuestion } from 'src/mock-test-question/entities/mock-test-question.entity';

@Entity('mock_tests')
export class MockTest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 200,
  })
  title: string;

  @Column({
    type: 'varchar',
    length: 1000,
    nullable: true,
  })
  description: string;

  @Column({
    type: 'int',
  })
  duration: number;

  @Column({
    type: 'int',
    default: 0,
  })
  totalQuestions: number;

  @Column({
    type: 'int',
    default: 1,
  })
  marksPerQuestion: number;

  @Column({
    type: 'boolean',
    default: true,
  })
  isFree: boolean;

  @ManyToOne(
    () => CourseContent,
    (courseContent) => courseContent.mockTests,
    {
      nullable: false,
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'courseContentId',
  })
  courseContent: CourseContent;

  @OneToMany(
    () => MockTestQuestion,
    (question) => question.mockTest,
  )
  questions: MockTestQuestion[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}