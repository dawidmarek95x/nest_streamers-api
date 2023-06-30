import { IsNotEmpty, IsString, IsOptional, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { streamingPlatforms } from 'src/entities/streamer.entity';

export class CreateStreamerDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The name of the streamer' })
  name: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Another name the streamer is known by to hide his real name',
  })
  pseudonym?: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Streamer information' })
  description: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(streamingPlatforms)
  @ApiProperty({
    description: 'The platform on which the streamer conducts live broadcasts',
    enum: streamingPlatforms,
  })
  streamingPlatform: StreamingPlatform;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Streamer avatar URL' })
  avatarUrl: string;
}
