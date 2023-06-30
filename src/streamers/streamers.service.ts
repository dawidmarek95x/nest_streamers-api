import {
  Injectable,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { StreamersRepository } from 'src/repositories/streamers.repository';
import { CreateStreamerDto } from './dto/create-streamer.dto';
import { Streamer } from 'src/entities/streamer.entity';
import { isUrlValid } from 'src/utils/isUrlValid';
import { UpdateStreamerDataDto } from './dto/update-streamer-data.dto';
import { UpdateStreamerVotesDto } from './dto/update-streamer-votes.dto';
import { isNonNegativeNumber } from 'src/utils/isNonNegativeNumber';

@Injectable()
export class StreamersService {
  constructor(private readonly streamersRepository: StreamersRepository) {}

  async createOne(streamerDto: CreateStreamerDto) {
    await this.checkStreamerExistence(streamerDto.name);
    this.validateStreamerAvatarUrl(streamerDto.avatarUrl);

    const streamer = new Streamer();
    const INITIAL_VOTES = 0;

    streamer.name = streamerDto.name;
    streamer.pseudonym = streamerDto.pseudonym ?? null;
    streamer.description = streamerDto.description;
    streamer.streamingPlatform = streamerDto.streamingPlatform;
    streamer.avatarUrl = streamerDto.avatarUrl;
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

  async getOneById(streamerId: number) {
    const streamer = await this.streamersRepository.findOneById(streamerId);

    if (!streamer) {
      throw new NotFoundException('Streamer not found.');
    }

    return streamer;
  }

  async updateDataById(streamerId: number, streamerDto: UpdateStreamerDataDto) {
    const streamer = await this.getOneById(streamerId);

    if (streamerDto.name && streamer.name !== streamerDto.name) {
      await this.checkStreamerExistence(streamerDto.name);
      streamer.name = streamerDto.name;
    }

    if (streamerDto.pseudonym) {
      streamer.pseudonym = streamerDto.pseudonym;
    }
    if (streamerDto.description) {
      streamer.description = streamerDto.description;
    }
    if (streamerDto.streamingPlatform) {
      streamer.streamingPlatform = streamerDto.streamingPlatform;
    }
    if (streamerDto.avatarUrl && streamer.avatarUrl !== streamerDto.avatarUrl) {
      this.validateStreamerAvatarUrl(streamerDto.avatarUrl);

      streamer.avatarUrl = streamerDto.avatarUrl;
    }

    return await this.streamersRepository.save(streamer);
  }

  async updateVotesById(
    streamerId: number,
    streamerDto: UpdateStreamerVotesDto,
  ) {
    const streamer = await this.getOneById(streamerId);

    if (streamerDto.positiveVotes !== undefined) {
      if (isNonNegativeNumber(streamerDto.positiveVotes)) {
        streamer.positiveVotes = streamerDto.positiveVotes;
      } else {
        throw new BadRequestException('positiveVotes cannot be negative.');
      }
    }
    if (streamerDto.negativeVotes !== undefined) {
      if (isNonNegativeNumber(streamerDto.negativeVotes)) {
        streamer.negativeVotes = streamerDto.negativeVotes;
      } else {
        throw new BadRequestException('negativeVotes cannot be negative.');
      }
    }

    return await this.streamersRepository.save(streamer);
  }

  private async checkStreamerExistence(streamerName: string) {
    const checkedStreamer = await this.streamersRepository.findOne({
      where: {
        name: streamerName,
      },
    });

    if (checkedStreamer) {
      throw new ConflictException(
        'The streamer with the given details already exists.',
      );
    }
  }

  private validateStreamerAvatarUrl(avatarUrl: string) {
    if (!isUrlValid(avatarUrl)) {
      throw new BadRequestException('The avatar url is invalid');
    }
  }
}
