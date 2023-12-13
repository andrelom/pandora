import { revalidatePath } from 'next/cache'
import logger from '@pandora/lib/logger/server'
import api, { parse } from '@pandora/lib/api'
import jwt from '@pandora/lib/jwt'
import { webcrypto } from 'crypto'

export async function POST(request: Request) {
  const authorization = await jwt.authorize<{ api: string }>(request)

  if (authorization.data?.api !== '/api/hooks/revalidate') {
    const trace = webcrypto.randomUUID()

    logger.error(`Hook Revalidate (Trace: ${trace})`, authorization)

    return api.getNotAuthorized({ trace })
  }

  const data = await parse(request)
  const routes: Array<string> = data?.routes ?? []

  for (const route of routes) {
    revalidatePath(route, 'page')
  }

  return api.getOk()
}
