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

import { AcademicStreamType } from 'src/enum/academic-stream.enum';
import { AcademicClass } from 'src/academic-class/entities/academic-class.entity';
import { AcademicSemester } from 'src/academic-semester/entities/academic-semester.entity';

@Entity('academic_streams')
export class AcademicStream {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: AcademicStreamType,
  })
  name: AcademicStreamType;

  @ManyToOne(() => AcademicClass, (academicClass) => academicClass.streams, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'academicClassId' })
  academicClass: AcademicClass;

  @OneToMany(
    () => AcademicSemester,
    (academicSemester) => academicSemester.academicStream,
  )
  semesters: AcademicSemester[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
