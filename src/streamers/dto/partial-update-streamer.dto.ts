import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateStreamerDto } from './create-streamer.dto';
import { IsOptional, IsNumber } from 'class-validator';

export class PartialUpdateStreamerDto extends PartialType(CreateStreamerDto) {
  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({
    description: 'The number of positive votes cast for the streamer',
  })
  positiveVotes?: number;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({
    description: 'The number of negative votes cast for the streamer',
  })
  negativeVotes?: number;
}
