import { ApiProperty } from '@nestjs/swagger';
import * as Joiful from 'joiful';

export class CreateCompletionDto {
  @ApiProperty({
    description: 'Model name',
    type: String,
    required: true,
  })
  @Joiful.string()
  model: string;
}

export class CreateChatCompletionDto {
  @ApiProperty({
    description: 'Model name',
    type: String,
    required: true,
  })
  @Joiful.string()
  model: string;
}
