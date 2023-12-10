import { isNil } from '@pandora/lib/objects'

export function createURL(
  pathname: string,
  options?: {
    query?: Record<string, any>
    origin?: string
  },
): URL {
  const origin = options?.origin ?? process.env.PUBLIC_URL
  const url = new URL(pathname, origin)
  const query = options?.query ?? {}

  for (const [key, data] of Object.entries(query)) {
    if (Array.isArray(data)) {
      data.forEach((item) => (!isNil(item) ? url.searchParams.append(key, item as string) : null))
    } else {
      !isNil(data) ? url.searchParams.append(key, data as string) : null
    }
  }

  return url
}
