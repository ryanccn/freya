import type { NextApiHandler } from 'next';
import { z } from 'zod';
import { tokens } from '~/lib/supabase';

import {
  yggdrasilGenericError,
  yggdrasilInvalidTokenError,
} from '~/lib/yggdrasil/error';
import type { User, Profile } from '~/types/yggdrasil';

const ReqData = z.object({
  accessToken: z.string(),
  clientToken: z.string().optional(),
  requestUser: z.boolean().default(false),
  selectedProfile: z.object({
    /** A no-dash UUID */
    id: z.string(),
    name: z.string(),

    properties: z.array(
      z.object({
        name: z.string(),
        value: z.string(),
        signature: z.string().optional(),
      })
    ),
  }),
});

interface ResData {
  accessToken: string;
  clientToken: string;
  selectedProfile: Profile;
  user: User;
}

const handler: NextApiHandler = async (req, res) => {
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

  let databaseQuery = tokens.select('*').eq('access_token', data.accessToken);
  if (data.clientToken)
    databaseQuery = databaseQuery.eq('client_token', data.clientToken);
  const { data: databaseData } = await databaseQuery;

  if (!databaseData || databaseData.length === 0) {
    yggdrasilInvalidTokenError(res);
    return;
  }

  let deleteCommand = tokens.delete().eq('access_token', data.accessToken);
  if (data.clientToken)
    deleteCommand = deleteCommand.eq('client_token', data.clientToken);
  await deleteCommand;
};

export default handler;
