import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonMiddleware } from './common/middlewares/common.middleware';
import { LLMInferModule } from './modules/llm_infer/llm_infer.module';

@Module({
  imports: [LLMInferModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CommonMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
