import type { NextApiRequest, NextApiResponse } from 'next'

import createNextAuth from 'next-auth'
import createIdentityProvider from '@pandora/shared/identity/createIdentityProvider'
import settings from '@pandora/shared/settings'

function handler(req: NextApiRequest, res: NextApiResponse) {
  return createNextAuth(req, res, {
    providers: [createIdentityProvider(req, res)],
    session: {
      maxAge: settings.identity.sessionExpirySeconds,
    },
  })
}

export { handler as GET, handler as POST }
