import { Controller, Get } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import {
  ApiType,
  AuthType,
  ManifestJson,
  SchemaVersion,
} from './common/interfaces';

@Controller()
export class AppController {
  constructor() {}

  @Get('/manifest.json')
  @ApiExcludeEndpoint()
  public getManifestJson(): ManifestJson {
    return {
      schema_version: SchemaVersion.v1,
      display_name: 'vllm',
      namespace: 'monkey_tools_vllm',
      auth: {
        type: AuthType.none,
      },
      api: {
        type: ApiType.openapi,
        url: `/openapi-json`,
      },
      contact_email: 'dev@inf-monkeys.com',
    };
  }
}
