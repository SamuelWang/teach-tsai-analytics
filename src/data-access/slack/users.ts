import { get as getClient } from './client';

export async function list() {
  const client = getClient();

  try {
    const result = await client.users.list();

    return result.members;
  } catch (error) {
    console.error(error);
  }
}
