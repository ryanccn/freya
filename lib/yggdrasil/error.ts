import type { NextApiResponse } from 'next';
import { statusTexts } from '../statusTexts';

export const yggdrasilGenericError = (
  res: NextApiResponse,
  httpStatus: number
) => {
  res.status(httpStatus).json({
    error: `${httpStatus}`,
    errorMessage: `${httpStatus} ${statusTexts[httpStatus]}`,
  });
};

export const yggdrasilInvalidTokenError = (res: NextApiResponse) => {
  res.status(403).json({
    error: 'ForbiddenOperationException',
    errorMessage: 'Invalid token.',
  });
};

export const yggdrasilLoginError = (res: NextApiResponse) => {
  res.status(403).json({
    error: 'ForbiddenOperationException',
    errorMessage: 'Invalid credentials. Invalid username or password.',
  });
};
