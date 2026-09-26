import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { AcademicLevelType } from 'src/enum/academic-level.enum';
import { OneToMany } from 'typeorm';
import { AcademicProgram } from 'src/academic-program/entities/academic-program.entity';

@Entity('academic_levels')
export class AcademicLevel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: AcademicLevelType,
    unique: true,
  })
  name: AcademicLevelType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(
    () => AcademicProgram,
    (academicProgram) => academicProgram.academicLevel,
  )
  programs: AcademicProgram[];
}