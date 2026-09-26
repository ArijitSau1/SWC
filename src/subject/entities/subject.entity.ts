import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Course } from 'src/course/entities/course.entity';

@Entity('subjects')
export class Subject {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 150,
    unique: true,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  description: string;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  image: string;


  @OneToMany(
    () => Course,
    (course) => course.subject,
  )
  courses: Course[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}