import { randomUUID } from 'crypto';

export const generateCleanUUID = () => cleanUUID(randomUUID());
export const cleanUUID = (str: string) => str.replace(/-/g, '');
