import { ApiProperty } from '@nestjs/swagger';

export type ResponseMetadataStatus = 'success' | 'failure';

export class ResponseMetadataModel {
  @ApiProperty({
    enum: ['success', 'failure'],
    description:
      'Determines if given request has been processed successfully, without any domain or infra exceptions',
  })
  status: ResponseMetadataStatus;

  @ApiProperty({
    nullable: true,
    description:
      'Total amount of results in persistence (might me null or undefined on POST or "get one by id" results)',
  })
  totalResults: number;

  @ApiProperty({
    nullable: true,
    description:
      'Amount of results after filtering in persistence (might me null or undefined on POST or "get one by id" results)',
  })
  totalFilteredResults: number;

  @ApiProperty({
    nullable: true,
    description: 'Amount of results requested to select',
  })
  currentLimit: number;

  @ApiProperty({
    nullable: true,
    description: 'Amount of results requested to skip',
  })
  currentOffset: number;
}
