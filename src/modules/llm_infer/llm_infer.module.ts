import { Module } from '@nestjs/common';
import { LLMInferController } from './llm_infer.controller';
import { LLMInferService } from './llm_infer.service';

@Module({
  controllers: [LLMInferController],
  providers: [LLMInferService],
})
export class LLMInferModule {}
