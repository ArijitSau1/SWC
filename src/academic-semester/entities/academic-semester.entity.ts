import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { AcademicSemesterType } from 'src/enum/academic-semester.enum';
import { AcademicStream } from 'src/academic-stream/entities/academic-stream.entity';

@Entity('academic_semesters')
export class AcademicSemester {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: AcademicSemesterType,
  })
  name: AcademicSemesterType;

  @ManyToOne(
    () => AcademicStream,
    (academicStream) => academicStream.semesters,
    {
      nullable: false,
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'academicStreamId' })
  academicStream: AcademicStream;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}