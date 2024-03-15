import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonMiddleware } from './common/middlewares/common.middleware';
import { ArrayToStringModule } from './modules/array_to_string/array_to_string.module';

@Module({
  imports: [ArrayToStringModule],
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
