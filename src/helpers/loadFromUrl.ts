import { api } from 'src/boot/axios';
import { Buffer } from 'buffer';

export async function fileFromUrl(url: string): Promise<Buffer> {
  const response = await api.get(url, { responseType: 'arraybuffer' });
  return Buffer.from(response.data, 'binary');
}
