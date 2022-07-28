import type { NextApiHandler } from 'next';
import { z } from 'zod';

import { compare } from 'bcrypt';
import { users, profiles, textures, tokens } from '~/lib/supabase';
import {
  yggdrasilGenericError,
  yggdrasilLoginError,
} from '~/lib/yggdrasil/error';

import type { User, Profile } from '~/types/yggdrasil';
import { generateCleanUUID } from '~/lib/cleanUUID';
import { serializeProfile } from '~/lib/yggdrasil/serialize';

const ReqData = z.object({
  username: z.string(),
  password: z.string(),
  clientToken: z.string().optional(),
  requestUser: z.boolean().default(false),
  agent: z.unknown(),
});

interface ResData {
  accessToken: string;
  clientToken?: string;
  availableProfiles: Profile[];
  selectedProfile: Profile;
  user?: User;
}

const handler: NextApiHandler<ResData> = async (req, res) => {
  if (req.method?.toLowerCase() !== 'post') {
    yggdrasilGenericError(res, 405);
    return;
  }

  const zodParsed = ReqData.safeParse(req.body);
  if (!zodParsed.success) {
    yggdrasilGenericError(res, 400);
    return;
  }

  const data = zodParsed.data;

  const { data: userData } = await users.select('*').eq('email', data.username);
  if (!userData || !userData.length) {
    yggdrasilGenericError(res, 404);
    return;
  }
  if (!(await compare(data.password, userData[0].password))) {
    yggdrasilLoginError(res);
    return;
  }

  const { data: profileData } = await profiles
    .select('*')
    .eq('id', userData[0].selected_profile);

  if (!profileData || !profileData.length) {
    yggdrasilGenericError(res, 500);
    return;
  }

  const { data: textureData } = await textures
    .select('*')
    .eq('uuid', profileData[0].texture ?? '');

  if (!textureData || !textureData.length) {
    yggdrasilGenericError(res, 500);
    return;
  }

  const newClientToken = generateCleanUUID();

  // Issue a new token
  await tokens.insert({
    access_token: newClientToken,
    client_token: data.clientToken,
    profile: profileData[0].id,
  });

  const serializedProfile = await serializeProfile(
    profileData[0],
    textureData[0]
  );

  res.json({
    accessToken: newClientToken,
    clientToken: data.clientToken,
    availableProfiles: [serializedProfile],
    selectedProfile: serializedProfile,
    ...(data.requestUser
      ? {
          id: userData[0].id,
          properties: [
            {
              name: 'preferredLanguage',
              value: 'en',
            },
          ],
        }
      : {}),
  });
};

export default handler;
