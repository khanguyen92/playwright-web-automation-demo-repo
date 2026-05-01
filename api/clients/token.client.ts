import { APIRequestContext } from '@playwright/test';
import { env } from '../../utils/env';

export class TokenClient {
  constructor(private request: APIRequestContext) {}

  async createToken(payload: Record<string, any>) {
    const response = await this.request.post(`${env.BASE_URL}api/tokens`, {
      data: payload,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    return response;
  }
}
