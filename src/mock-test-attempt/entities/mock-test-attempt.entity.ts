import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { MockTest } from 'src/mock-test/entities/mock-test.entity';
import { Account } from 'src/account/entities/account.entity';

@Entity('mock_test_attempts')
export class MockTestAttempt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => MockTest,
    {
      nullable: false,
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'mockTestId',
  })
  mockTest: MockTest;

  @ManyToOne(
    () => Account,
    {
      nullable: false,
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'accountId',
  })
  account: Account;

  @Column({
    type: 'int',
    default: 0,
  })
  score: number;

  @Column({
    type: 'int',
    default: 0,
  })
  totalMarks: number;

  @Column({
    type: 'int',
    default: 0,
  })
  correctAnswers: number;

  @Column({
    type: 'int',
    default: 0,
  })
  wrongAnswers: number;

  @Column({
    type: 'json',
  })
  answers: Record<string, number>;

  @CreateDateColumn()
  submittedAt: Date;
}