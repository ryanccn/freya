import { createClient } from '@supabase/supabase-js';
import { definitions } from '~/types/supabase';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_KEY || !SUPABASE_URL)
  throw new Error('incomplete environment variables');

const client = createClient(SUPABASE_URL, SUPABASE_KEY);

export const users = client.from<definitions['users']>('users');
export const profiles = client.from<definitions['profiles']>('profiles');
export const textures = client.from<definitions['textures']>('textures');
export const tokens = client.from<definitions['tokens']>('tokens');
// export const texturesBucket = client.storage.from('textures');
