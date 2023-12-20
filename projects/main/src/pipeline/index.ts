import type { NextRequest, NextResponse } from 'next/server'

import internal from './internal'
import authorize from './authorize'

export type Stage = (request: NextRequest) => Promise<NextResponse | null>

const pipeline: Array<Stage> = [internal, authorize]

export default pipeline
