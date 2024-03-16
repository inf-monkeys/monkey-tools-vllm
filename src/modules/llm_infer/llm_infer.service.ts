import { config } from '@/common/config';
import { Injectable, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { random } from 'lodash';
import {
  CreateChatCompletionDto,
  CreateCompletionDto,
} from './req/llm_infer.dto';

interface ServerStatus {
  status: 'running' | 'stopped';
  model: string;
  ready: boolean;
}

@Injectable()
export class LLMInferService {
  async getModels() {
    const url = `http://${config.llmInferServer.hosts[0]}:${config.llmInferServer.controlApiPort}/v1/models`;
    const res = await axios.get(url);
    return res.data?.data as {
      id: string;
    }[];
  }

  async getCompletions(body: CreateCompletionDto) {
    const model = body.model;
    if (!this.checkModelExist(model)) {
      throw new NotFoundException(`Model ${model} not found`);
    }

    const readyServerHost = this.getReadyServerHost(model);
    const url = `http://${readyServerHost}:${config.llmInferServer.inferApiPort}/v1/completions`;
    const res = await axios.post(url, body, {
      responseType: 'stream',
    });
    return res;
  }

  async getChatCompletions(body: CreateChatCompletionDto) {
    const model = body.model;
    if (!this.checkModelExist(model)) {
      throw new NotFoundException(`Model ${model} not found`);
    }

    const readyServerHost = this.getReadyServerHost(model);
    const url = `http://${readyServerHost}:${config.llmInferServer.inferApiPort}/v1/chat/completions`;
    const res = await axios.post(url, body);
    return res.data;
  }

  private async checkModelExist(model: string) {
    const models = await this.getModels();
    return models.map((v) => v.id).includes(model);
  }

  private async startServer(host: string, model: string) {
    const url = `http://${host}:${config.llmInferServer.controlApiPort}/v1/start`;
    await axios.post(url, {
      model: model,
    });
  }

  private async stopServer(host: string, model: string) {
    const url = `http://${host}:${config.llmInferServer.controlApiPort}/v1/stop`;
    await axios.post(url, {
      model: model,
    });
  }

  private async getServerStatus(host: string) {
    const url = `http://${host}:${config.llmInferServer.controlApiPort}/v1/status`;
    const res = await axios.get(url);
    return res.data as ServerStatus;
  }

  private async getReadyServerHost(model: string) {
    let readyServerHost = '';

    // 获取所有服务器的状态
    const allServerStaus = await Promise.all(
      config.llmInferServer.hosts.map(async (host) => {
        const status = await this.getServerStatus(host);
        return {
          ...status,
          host,
        };
      }),
    );

    // 从服务器列表中找到一个已经启动且准备好的服务器
    for (const status of allServerStaus) {
      if (status.model === model && status.ready) {
        readyServerHost = status.host;
        break;
      }
    }

    if (readyServerHost === '') {
      // 从未开启的服务器中选一个，启动服务器
      for (const status of allServerStaus) {
        if (status.model !== model && status.status === 'stopped') {
          await this.startServer(status.host, model);
          readyServerHost = status.host;
          break;
        }
      }
    }

    if (readyServerHost === '') {
      // 随机选择一个服务器启动
      const index = random(0, config.llmInferServer.hosts.length - 1);
      const host = config.llmInferServer.hosts[index];
      let status: ServerStatus = allServerStaus[index];
      while (status.status === 'running' && !status.ready) {
        // 正在启动，需要等待服务器启动完成
        await new Promise((resolve) => setTimeout(resolve, 1000));
        status = await this.getServerStatus(host);
      }
      await this.startServer(host, model);
      readyServerHost = host;
    }

    return readyServerHost;
  }
}
