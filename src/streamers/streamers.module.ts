import { Module } from '@nestjs/common';
import { StreamersService } from './streamers.service';
import { StreamersController } from './streamers.controller';
import { StreamerRepository } from 'src/repositories/streamer.repository';
import { Streamer } from 'src/entities/streamer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [StreamersController],
  providers: [StreamersService, StreamerRepository],
  imports: [TypeOrmModule.forFeature([Streamer])],
})
export class StreamersModule {}
