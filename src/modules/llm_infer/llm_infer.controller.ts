import { Body, Controller, Get, Logger, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { LLMInferService } from './llm_infer.service';
import {
  CreateChatCompletionDto,
  CreateCompletionDto,
} from './req/llm_infer.dto';

@Controller('')
export class LLMInferController {
  constructor(private readonly llmInferService: LLMInferService) {}

  @Get('/v1/models')
  public async getModels() {
    return await this.llmInferService.getModels();
  }

  @Post('/v1/completions')
  public async getCompletions(
    @Res() response: Response,
    @Body() body: CreateCompletionDto,
  ) {
    Logger.log(body);

    const res = await this.llmInferService.getCompletions(body);

    response.setHeader('content-type', res.headers['content-type']);
    response.status(200);

    res.data.on('data', (chunk) => {
      response.write(chunk);
    });
    res.data.on('end', () => {
      response.end();
    });
    res.data.on('error', () => {
      response.end();
    });
  }

  @Post('/v1/chat/completions')
  public async getChatCompletions(
    @Res() response: Response,
    @Body() body: CreateChatCompletionDto,
  ) {
    Logger.log(body);

    const res = await this.llmInferService.getChatCompletions(body);

    response.setHeader('content-type', res.headers['content-type']);
    response.status(200);

    res.data.on('data', (chunk) => {
      response.write(chunk);
    });
    res.data.on('end', () => {
      response.end();
    });
    res.data.on('error', () => {
      response.end();
    });
  }
}
