import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateStreamerVotesDto {
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
