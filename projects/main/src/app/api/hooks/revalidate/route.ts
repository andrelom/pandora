import { revalidatePath } from 'next/cache'
import api, { parse } from '@pandora/lib/api'
import jwt from '@pandora/lib/jwt'

export async function POST(request: Request) {
  const authorization = await jwt.authorize<{ api: string }>(request)

  if (authorization.data?.api !== '/api/hooks/revalidate') {
    return api.getNotAuthorized()
  }

  const data = await parse(request)
  const routes: Array<string> = data?.routes ?? []

  for (const route of routes) {
    revalidatePath(route, 'page')
  }

  return api.getOk()
}
