import type { definitions } from '~/types/supabase';
import { Profile, Texture } from '~/types/yggdrasil';

export const serializeProfile = async (
  profile: definitions['profiles'],
  texture: definitions['textures']
): Promise<Profile> => {
  return {
    id: profile.id.replace(/-/g, ''),
    name: profile.name,
    properties: [
      {
        name: 'skin',
        value: Buffer.from(
          JSON.stringify(await serializeTexture(profile, texture))
        ).toString('base64'),
      },
    ],
  };
};

export const serializeTexture = async (
  profile: definitions['profiles'],
  texture: definitions['textures']
): Promise<Texture> => {
  const publicURL = `http://localhost:3000/textures/${texture.hash}.png`;

  return {
    timestamp: texture.created_at,
    profileId: profile.id.replace(/-/g, ''),
    profileName: profile.name,
    textures: {
      skin: {
        url: publicURL,
        metadata: {
          model: texture.model as 'default' | 'slim',
        },
      },
    },
  };
};
