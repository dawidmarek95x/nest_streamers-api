import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { StreamersRepository } from 'src/repositories/streamers.repository';
import { CreateStreamerDto } from './dto/create-streamer.dto';
import { Streamer } from 'src/entities/streamer.entity';
import { CheckStreamerExistenceDto } from './dto/check-streamer-existence.dto';
import { isUrlValid } from 'src/utils/isUrlValid';

@Injectable()
export class StreamersService {
  constructor(private readonly streamersRepository: StreamersRepository) {}

  async createOne(streamerDto: CreateStreamerDto) {
    await this.checkStreamerExistence(streamerDto);

    const streamer = new Streamer();
    const INITIAL_VOTES = 0;

    streamer.name = streamerDto.name;
    streamer.pseudonym = streamerDto.pseudonym ?? null;
    streamer.description = streamerDto.description;
    streamer.streamingPlatform = streamerDto.streamingPlatform;

    if (isUrlValid(streamerDto.avatarUrl)) {
      streamer.avatarUrl = streamerDto.avatarUrl;
    } else {
      throw new BadRequestException('The avatar url is invalid');
    }

    streamer.positiveVotes = INITIAL_VOTES;
    streamer.negativeVotes = INITIAL_VOTES;

    return await this.streamersRepository.save(streamer);
  }

  async getAll(query: GetStreamersQuery) {
    const limit = isNaN(+query.limit) === false ? +query.limit : 20;
    const offset = isNaN(+query.offset) === false ? +query.offset : 0;

    let streamingPlatforms: string[];
    if (query.streamingPlatforms) {
      query.streamingPlatforms.includes(',')
        ? (streamingPlatforms = query.streamingPlatforms
            .split(',')
            .map((sp) => sp.toLowerCase()))
        : (streamingPlatforms = [query.streamingPlatforms.toLowerCase()]);
    }

    if (query.orderBy) {
      query.orderBy = query.orderBy.toLowerCase();
    }

    if (query.sortOrder) {
      const sortOrder = query.sortOrder.toUpperCase();

      ['DESC', 'ASC'].includes(sortOrder)
        ? (query.sortOrder = sortOrder)
        : (query.sortOrder = 'ASC');
    }

    const [streamers, totalResults]: [Streamer[], number] =
      await this.streamersRepository.findAndCountByCriteria({
        limit,
        offset,
        name: query.name,
        pseudonym: query.pseudonym,
        streamingPlatforms,
        orderBy: query.orderBy,
        sortOrder: query.sortOrder as SortOrder,
      });

    return {
      streamers,
      totalResults,
      currentLimit: limit,
      currentOffset: offset,
    };
  }

  private async checkStreamerExistence(streamerDto: CheckStreamerExistenceDto) {
    const checkedStreamer = await this.streamersRepository.findOne({
      where: {
        name: streamerDto.name,
        streamingPlatform: streamerDto.streamingPlatform,
      },
    });

    if (checkedStreamer) {
      throw new ConflictException(
        'The streamer with the given details already exists.',
      );
    }
  }
}
