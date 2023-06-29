import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { Controller, Post, Body } from '@nestjs/common';
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
}
