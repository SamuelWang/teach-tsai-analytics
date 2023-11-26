import { UsersListResponse } from '@slack/web-api';
import { get as getClient } from './client';

export async function list(): Promise<UsersListResponse> {
  const client = getClient();

  try {
    const result = await client.users.list();

    return result;
  } catch (error) {
    console.error(error);
    return Promise.resolve({ ok: false, members: [] });
  }
}
