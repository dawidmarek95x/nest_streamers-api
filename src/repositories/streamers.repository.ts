import { Injectable } from '@nestjs/common';
import { Streamer } from 'src/entities/streamer.entity';
import { DataSource, Repository } from 'typeorm';

export interface StreamersSearchCriteria {
  limit: number;
  offset: number;
  name?: string;
  pseudonym?: string;
  streamingPlatforms?: string[];
  orderBy?:
    | 'name'
    | 'pseudonym'
    | 'positive_votes'
    | 'negative_votes'
    | 'votes_difference';
  sortOrder?: 'DESC' | 'ASC';
}

@Injectable()
export class StreamersRepository extends Repository<Streamer> {
  constructor(private dataSource: DataSource) {
    super(Streamer, dataSource.createEntityManager());
  }

  async findAndCountByCriteria(
    criteria: StreamersSearchCriteria,
  ): Promise<[Streamer[], number]> {
    const qb = this.createQueryBuilder('s')
      .skip(criteria.offset)
      .take(criteria.limit);

    if (criteria.name) {
      qb.andWhere('s.name LIKE :name', {
        name: `%${criteria.name}%`,
      });
    }

    if (criteria.pseudonym) {
      qb.andWhere('s.pseudonym LIKE :pseudonym', {
        pseudonym: `%${criteria.pseudonym}%`,
      });
    }

    if (criteria.streamingPlatforms) {
      qb.andWhere('s.streaming_platform IN(:...streamingPlatforms)', {
        streamingPlatforms: criteria.streamingPlatforms,
      });
    }

    switch (criteria.orderBy) {
      case 'name':
        qb.orderBy('s.name', criteria.sortOrder);
        break;

      case 'pseudonym':
        qb.orderBy('s.pseudonym', criteria.sortOrder);
        break;

      case 'positive_votes':
        qb.orderBy('s.positiveVotes', criteria.sortOrder);
        break;

      case 'negative_votes':
        qb.orderBy('s.negativeVotes', criteria.sortOrder);
        break;

      case 'votes_difference':
        qb.addSelect('(s.positiveVotes - s.negativeVotes)', 'votesDifference');
        qb.orderBy('votesDifference', criteria.sortOrder);
        break;

      default:
        qb.orderBy('s.id', criteria.sortOrder);
        break;
    }

    return await qb.getManyAndCount();
  }

  async findOneById(id: number) {
    return await this.createQueryBuilder('s')
      .where('s.id = :id', { id })
      .getOne();
  }
}
