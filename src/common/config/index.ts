import _ from 'lodash';
import { readConfig } from './readYaml';

export interface ServerConfig {
  port: number;
}

export interface LLMInferServerConfig {
  hosts: string[];
  controlApiPort: number;
  inferApiPort: number;
}

export interface CredentialEncryptConfig {
  publicKey: string;
  privateKey: string;
}

export interface Config {
  server: ServerConfig;
  llmInferServer: LLMInferServerConfig;
  credentialEncrypt: CredentialEncryptConfig;
}

const port = readConfig('server.port', 3001);

// 检查去重并去空后的服务器列表
const llmInferServerHosts = _.uniq(
  _.compact(readConfig('llmInferServer.hosts', []) as string[]),
);
if (llmInferServerHosts.length === 0) {
  throw new Error('llmInferServer.hosts is required');
}

export const config: Config = {
  server: {
    port,
  },
  llmInferServer: {
    hosts: llmInferServerHosts,
    controlApiPort: readConfig('llmInferServer.controlApiPort', 3000),
    inferApiPort: readConfig('llmInferServer.inferApiPort', 8000),
  },
  credentialEncrypt: readConfig('credentialEncrypt', {}),
};
