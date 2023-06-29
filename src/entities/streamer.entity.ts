import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export type StreamingPlatform =
  | 'twitch'
  | 'youtube'
  | 'tiktok'
  | 'kick'
  | 'rumble';

export const streamingPlatforms: StreamingPlatform[] = [
  'twitch',
  'youtube',
  'tiktok',
  'kick',
  'rumble',
];

@Entity('streamer')
export class Streamer {
  @PrimaryGeneratedColumn({ type: 'integer', unsigned: true, name: 'id' })
  @ApiProperty({ description: 'The unique identifier of the streamer' })
  id: number;

  @Column('text', { nullable: false, name: 'name' })
  @ApiProperty({ description: 'The name of the streamer' })
  name: string;

  @Column('text', { nullable: true, name: 'pseudonym' })
  @ApiProperty({
    description: 'Another name the streamer is known by to hide his real name',
  })
  pseudonym: string;

  @Column('text', { nullable: false, name: 'description' })
  @ApiProperty({ description: 'Streamer information' })
  description: string;

  @Column('text', { nullable: false, name: 'streaming_platform' })
  @ApiProperty({
    description: 'The platform on which the streamer conducts live broadcasts',
    enum: streamingPlatforms,
  })
  streamingPlatform: StreamingPlatform;

  @Column('text', { nullable: false, name: 'image_url' })
  @ApiProperty({ description: 'Streamer avatar URL' })
  avatarUrl: string;

  @Column('integer', { nullable: false, name: 'positive_votes' })
  @ApiProperty({
    description: 'The number of positive votes cast for the streamer',
  })
  positiveVotes: number;

  @Column('integer', { nullable: false, name: 'negative_votes' })
  @ApiProperty({
    description: 'The number of negative votes cast for the streamer',
  })
  negativeVotes: number;
}
