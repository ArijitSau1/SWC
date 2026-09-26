import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { MockTest } from 'src/mock-test/entities/mock-test.entity';

@Entity('mock_test_questions')
export class MockTestQuestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
  })
  question: string;

  @Column({
    type: 'simple-array',
  })
  options: string[];

  @Column({
    type: 'int',
  })
  correctAnswer: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  explanation: string;

  @ManyToOne(
    () => MockTest,
    (mockTest) => mockTest.questions,
    {
      nullable: false,
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'mockTestId',
  })
  mockTest: MockTest;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}