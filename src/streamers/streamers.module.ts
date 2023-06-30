import { Module } from '@nestjs/common';
import { StreamersService } from './streamers.service';
import { StreamersController } from './streamers.controller';
import { StreamersRepository } from 'src/repositories/streamers.repository';
import { Streamer } from 'src/entities/streamer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [StreamersController],
  providers: [StreamersService, StreamersRepository],
  imports: [TypeOrmModule.forFeature([Streamer])],
})
export class StreamersModule {}
