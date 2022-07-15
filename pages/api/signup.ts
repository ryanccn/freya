import type { NextApiHandler } from 'next';
import { z } from 'zod';

import { hash } from 'bcrypt';
import { users } from '~/lib/supabase';
import { generateCleanUUID } from '~/lib/cleanUUID';

const ReqData = z.object({
  email: z.string(),
  password: z.string(),
});

const handler: NextApiHandler = async (req, res) => {
  if (req.method?.toLowerCase() !== 'post') {
    res.status(405).end();
    return;
  }

  const zodParsed = ReqData.safeParse(req.body);
  if (!zodParsed.success) {
    res.status(400).end();
    return;
  }

  const data = zodParsed.data;

  const hashedPassword = await hash(data.password, 10);

  const { error } = await users.insert({
    id: generateCleanUUID(),
    email: data.email,
    password: hashedPassword,
  });

  if (!error) res.status(200).end();
  else res.status(500).json({ error: error.message });
};

export default handler;
