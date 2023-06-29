import { PickType } from '@nestjs/swagger';
import { CreateStreamerDto } from './create-streamer.dto';

export class CheckStreamerExistenceDto extends PickType(CreateStreamerDto, [
  'name',
  'streamingPlatform',
] as const) {}
