import { revalidatePath } from 'next/cache'
import api, { parse } from '@pandora/lib/api'

// @protected
export async function POST(request: Request) {
  const data = await parse(request)
  const routes: Array<string> = data?.routes ?? []

  for (const route of routes) {
    revalidatePath(route, 'page')
  }

  return api.getOk({
    value: process.env.FILES_WITH_COMMENTS ?? '?',
  })
}
