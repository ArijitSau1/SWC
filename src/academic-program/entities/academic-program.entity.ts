import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { AcademicLevel } from 'src/academic-level/entities/academic-level.entity';
import { AcademicProgramType } from 'src/enum/academic-program.enum';

import { OneToMany } from 'typeorm';
import { AcademicClass } from 'src/academic-class/entities/academic-class.entity';

@Entity('academic_programs')
export class AcademicProgram {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: AcademicProgramType,
  })
  name: AcademicProgramType;

  @ManyToOne(
    () => AcademicLevel,
    (academicLevel) => academicLevel.programs,
    {
      nullable: false,
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'academicLevelId' })
  academicLevel: AcademicLevel;

  @OneToMany(
  () => AcademicClass,
  (academicClass) => academicClass.academicProgram,
 )
 classes: AcademicClass[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}