import createNextAuth from 'next-auth'
import createIdentityProvider from '@pandora/shared/identity/createIdentityProvider'
import settings from '@pandora/shared/settings'

function handler(req: Request, res: Response) {
  return createNextAuth({
    providers: [createIdentityProvider(req, res)],
    session: {
      maxAge: settings.identity.sessionExpirySeconds,
    },
  })
}

export { handler as GET, handler as POST }
