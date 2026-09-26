import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';


import { DegreeUniversity } from 'src/degree-university/entities/degree-university.entity';
import { GraduationDegreeType } from 'src/enum/graduation-degree.enum';

@Entity('graduation_degrees')
export class GraduationDegree {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: GraduationDegreeType,
    unique: true,
  })
  name: GraduationDegreeType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(
    () => DegreeUniversity,
    (degreeUniversity) => degreeUniversity.degree,
  )
  universities: DegreeUniversity[];
}