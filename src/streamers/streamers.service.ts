import { Injectable, ConflictException } from '@nestjs/common';
import { StreamersRepository } from 'src/repositories/streamers.repository';
import { CreateStreamerDto } from './dto/create-streamer.dto';
import { Streamer } from 'src/entities/streamer.entity';
import { CheckStreamerExistenceDto } from './dto/check-streamer-existence.dto';

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
    streamer.avatarUrl = streamerDto.avatarUrl;
    streamer.positiveVotes = INITIAL_VOTES;
    streamer.negativeVotes = INITIAL_VOTES;

    return await this.streamersRepository.save(streamer);
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
