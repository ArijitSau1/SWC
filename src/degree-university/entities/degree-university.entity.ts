import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import { GraduationDegree } from 'src/graduation-degree/entities/graduation-degree.entity';
import { University } from 'src/university/entities/university.entity';
import { GraduationSemester } from 'src/graduation-semester/entities/graduation-semester.entity';

@Entity('degree_universities')
@Unique(
  'UQ_degree_university',
  ['degree', 'university'],
)
export class DegreeUniversity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => GraduationDegree,
    (degree) => degree.universities,
    {
      nullable: false,
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'degreeId' })
  degree: GraduationDegree;

  @ManyToOne(
    () => University,
    (university) => university.degrees,
    {
      nullable: false,
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'universityId' })
  university: University;

  @OneToMany(
  () => GraduationSemester,
  (semester) => semester.degreeUniversity,
)
semesters: GraduationSemester[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}