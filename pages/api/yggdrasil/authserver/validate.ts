import type { NextApiHandler } from 'next';
import { z } from 'zod';
import { tokens } from '~/lib/supabase';
import {
  yggdrasilGenericError,
  yggdrasilInvalidTokenError,
} from '~/lib/yggdrasil/error';

const jsonBodyZ = z.object({
  accessToken: z.string(),
  clientToken: z.string().optional(),
});

const h: NextApiHandler = async (req, res) => {
  if (req.method?.toLowerCase() !== 'post') {
    yggdrasilGenericError(res, 405);
    return;
  }

  const parsedBody = jsonBodyZ.safeParse(req.body);

  if (!parsedBody.success) {
    yggdrasilGenericError(res, 400);
    return;
  }

  let dbRes = tokens
    .select('*', { count: 'exact', head: true })
    .eq('access_token', parsedBody.data.accessToken);

  if (parsedBody.data.clientToken) {
    dbRes = dbRes.eq('client_token', parsedBody.data.clientToken);
  }

  const { count } = await dbRes;

  if (!count) {
    yggdrasilInvalidTokenError(res);
    return;
  }

  res.status(204).end();
};

export default h;
