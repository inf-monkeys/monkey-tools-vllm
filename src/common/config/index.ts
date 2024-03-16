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

export const config: Config = {
  server: {
    port,
  },
  llmInferServer: {
    hosts: readConfig('llmInferServer.hosts', []),
    controlApiPort: readConfig('llmInferServer.controlApiPort', 3000),
    inferApiPort: readConfig('llmInferServer.inferApiPort', 8000),
  },
  credentialEncrypt: readConfig('credentialEncrypt', {}),
};
