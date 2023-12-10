import type { NextApiRequest, NextApiResponse } from 'next'

import createCredentialsProvider from 'next-auth/providers/credentials'

export default function createIdentityProvider(_req: NextApiRequest, _res: NextApiResponse) {
  return createCredentialsProvider({
    id: 'identity',
    name: 'Identity',
    credentials: {
      username: { label: 'Username', type: 'text' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials) {
      // Any object returned will be saved in `user`
      // property of the JWT.
      return {
        id: '',
        name: '',
        email: '',
      }
    },
  })
}
