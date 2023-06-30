import {
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { StreamersService } from './streamers.service';
import { Streamer } from 'src/entities/streamer.entity';
import { ResponseMetadataModel } from 'src/swagger/ResponseMetadata.model';
import { CreateStreamerDto } from './dto/create-streamer.dto';

@ApiTags('streamers')
@Controller('streamers')
export class StreamersController {
  constructor(private readonly streamersService: StreamersService) {}

  @Post()
  @ApiOperation({
    summary: 'Creates a new streamer',
  })
  @ApiResponse({
    status: 201,
    description: 'The streamer has been successfully created.',
    schema: {
      type: 'object',
      properties: {
        data: {
          $ref: getSchemaPath(Streamer),
        },
        meta: {
          $ref: getSchemaPath(ResponseMetadataModel),
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Incorrect data or data type provided.',
  })
  @ApiResponse({
    status: 409,
    description: 'The streamer with the given details already exists.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  async createStreamer(@Body() createStreamerDto: CreateStreamerDto) {
    const createdStreamer = await this.streamersService.createOne(
      createStreamerDto,
    );

    return {
      data: createdStreamer,
      meta: {
        status: 'success',
      },
    };
  }

  @Get()
  @ApiOperation({
    summary: 'Returns a list of all streamers according to criteria.',
  })
  @ApiQuery({
    name: 'limit',
    description:
      'Specifies the number of streamers to be returned (default 20)',
    type: 'integer',
    required: false,
  })
  @ApiQuery({
    name: 'offset',
    description: 'Specifies the number of streamers to skip (default 0)',
    type: 'integer',
    required: false,
  })
  @ApiQuery({
    name: 'name',
    description: 'The name of the streamer you are looking for',
    type: 'string',
    required: false,
  })
  @ApiQuery({
    name: 'pseudonym',
    description:
      'Another name by which the streamer you are looking for is known',
    type: 'string',
    required: false,
  })
  @ApiQuery({
    name: 'streamingPlatforms',
    description:
      'The streaming platform or platforms for which streamers are being sought.',
    required: false,
    type: 'string',
    examples: {
      example1: {
        summary: 'Example with one platform',
        value: 'twitch',
      },
      example2: {
        summary: 'Example with multiple platforms',
        value: 'twitch,youtube,tiktok',
      },
    },
  })
  @ApiQuery({
    name: 'orderBy',
    description:
      'Select which property to sort by. If orderBy is passed without sortOrder, the default sort is ASC',
    type: 'string',
    enum: [
      'name',
      'pseudonym',
      'positive_votes',
      'negative_votes',
      'votes_difference',
    ],
    required: false,
  })
  @ApiQuery({
    name: 'sortOrder',
    description: 'Choosing a sorting method. ASC by default.',
    type: 'string',
    enum: ['DESC', 'ASC'],
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'The list of streamers has been successfully returned.',
    schema: {
      type: 'array',
      items: {
        $ref: getSchemaPath(Streamer),
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  async getStreamers(@Query() query: GetStreamersQuery) {
    const { streamers, totalResults, currentLimit, currentOffset } =
      await this.streamersService.getAll(query);

    return {
      data: streamers,
      totalResults,
      currentLimit,
      currentOffset,
      meta: {
        status: 'success',
      },
    };
  }
}
