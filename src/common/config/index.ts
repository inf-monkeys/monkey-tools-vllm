import { readConfig } from './readYaml';

export interface ServerConfig {
  port: number;
}

export interface Baichuan2Config {
  baseUrl?: string;
  modelPath?: string;
}

export interface CredentialEncryptConfig {
  publicKey: string;
  privateKey: string;
}

export interface S3Config {
  accessKeyId: string;
  secretAccessKey: string;
  endpoint: string;
  region: string;
  modelBucketName: string;
  assetsBucketName: string;
  assetsBucketPublicUrl: string;
}

export interface Config {
  server: ServerConfig;
  credentialEncrypt: CredentialEncryptConfig;
  s3: S3Config;
}

const port = readConfig('server.port', 3001);

export const config: Config = {
  server: {
    port,
  },
  credentialEncrypt: readConfig('credentialEncrypt', {}),
  s3: readConfig('s3', {}),
};
