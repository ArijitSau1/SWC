import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DegreeUniversity } from './entities/degree-university.entity';

import { GraduationDegree } from 'src/graduation-degree/entities/graduation-degree.entity';
import { University } from 'src/university/entities/university.entity';

import { CreateDegreeUniversityDto } from './dto/create-degree-university.dto';

@Injectable()
export class DegreeUniversityService {
  constructor(
    @InjectRepository(DegreeUniversity)
    private readonly degreeUniversityRepository: Repository<DegreeUniversity>,

    @InjectRepository(GraduationDegree)
    private readonly degreeRepository: Repository<GraduationDegree>,

    @InjectRepository(University)
    private readonly universityRepository: Repository<University>,
  ) {}

 
  async create(dto: CreateDegreeUniversityDto) {
    
    const degree =
      await this.degreeRepository.findOne({
        where: {
          id: dto.degreeId,
        },
      });

    if (!degree) {
      throw new NotFoundException(
        'Graduation degree not found',
      );
    }

    
    const university =
      await this.universityRepository.findOne({
        where: {
          id: dto.universityId,
        },
      });

    if (!university) {
      throw new NotFoundException(
        'University not found',
      );
    }

    
    const existing =
      await this.degreeUniversityRepository
        .createQueryBuilder('degreeUniversity')
        .leftJoin(
          'degreeUniversity.degree',
          'degree',
        )
        .leftJoin(
          'degreeUniversity.university',
          'university',
        )
        .where(
          'degree.id = :degreeId',
          {
            degreeId: dto.degreeId,
          },
        )
        .andWhere(
          'university.id = :universityId',
          {
            universityId: dto.universityId,
          },
        )
        .getOne();

    if (existing) {
      throw new ConflictException(
        'This university is already associated with this degree',
      );
    }

    
    const degreeUniversity =
      this.degreeUniversityRepository.create({
        degree,
        university,
      });

    
    const saved =
      await this.degreeUniversityRepository.save(
        degreeUniversity,
      );

    
    return {
      id: saved.id,
      degreeId: degree.id,
      universityId: university.id,
    };
  }

  
  async findAll(degreeId?: string) {
    const query =
      this.degreeUniversityRepository
        .createQueryBuilder('degreeUniversity')
        .leftJoinAndSelect(
          'degreeUniversity.degree',
          'degree',
        )
        .leftJoinAndSelect(
          'degreeUniversity.university',
          'university',
        )
        .select([
          'degreeUniversity.id',

          'degree.id',
          'degree.name',

          'university.id',
          'university.name',
        ])
        .orderBy(
          'degreeUniversity.createdAt',
          'ASC',
        );

    if (degreeId) {
      query.andWhere(
        'degree.id = :degreeId',
        {
          degreeId,
        },
      );
    }

    return query.getMany();
  }

  
  async findOne(id: string) {
    const degreeUniversity =
      await this.degreeUniversityRepository
        .createQueryBuilder('degreeUniversity')
        .leftJoinAndSelect(
          'degreeUniversity.degree',
          'degree',
        )
        .leftJoinAndSelect(
          'degreeUniversity.university',
          'university',
        )
        .select([
          'degreeUniversity.id',

          'degree.id',
          'degree.name',

          'university.id',
          'university.name',
        ])
        .where(
          'degreeUniversity.id = :id',
          { id },
        )
        .getOne();

    if (!degreeUniversity) {
      throw new NotFoundException(
        'Degree-university relationship not found',
      );
    }

    return degreeUniversity;
  }
}