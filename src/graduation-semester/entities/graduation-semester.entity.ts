import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import { GraduationSemesterType } from 'src/enum/graduation-semester.enum';
import { DegreeUniversity } from 'src/degree-university/entities/degree-university.entity';

@Entity('graduation_semesters')
@Unique(
  'UQ_degree_university_semester',
  ['degreeUniversity', 'name'],
)
export class GraduationSemester {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: GraduationSemesterType,
  })
  name: GraduationSemesterType;

  @ManyToOne(
    () => DegreeUniversity,
    (degreeUniversity) =>
      degreeUniversity.semesters,
    {
      nullable: false,
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'degreeUniversityId',
  })
  degreeUniversity: DegreeUniversity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}