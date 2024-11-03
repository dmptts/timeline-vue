import { timestamps } from './mocks.ts';
import { Timestamps } from './types.ts';

export const fetchTimestamps = async (): Promise<Timestamps> => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  return timestamps;
}