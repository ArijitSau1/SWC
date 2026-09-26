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

import { AcademicProgram } from 'src/academic-program/entities/academic-program.entity';
import { AcademicClassType } from 'src/enum/academic-class.enum';

import { AcademicStream } from 'src/academic-stream/entities/academic-stream.entity';

@Entity('academic_classes')
export class AcademicClass {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: AcademicClassType,
  })
  name: AcademicClassType;

  @ManyToOne(
    () => AcademicProgram,
    (academicProgram) => academicProgram.classes,
    {
      nullable: false,
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'academicProgramId' })
  academicProgram: AcademicProgram;

  @OneToMany(
  () => AcademicStream,
  (academicStream) => academicStream.academicClass,
)
streams: AcademicStream[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}