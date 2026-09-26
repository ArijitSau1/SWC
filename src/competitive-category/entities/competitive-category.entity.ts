import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { CompetitiveExam } from 'src/competitive-exam/entities/competitive-exam.entity';

@Entity('competitive_categories')
export class CompetitiveCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
  })
  name: string;

  @OneToMany(
    () => CompetitiveExam,
    (exam) => exam.category,
  )
  exams: CompetitiveExam[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}