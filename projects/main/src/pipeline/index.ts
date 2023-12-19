import type { NextRequest, NextResponse } from 'next/server'

import authorize from './authorize'

export type Stage = (request: NextRequest) => Promise<NextResponse | null>

const pipeline: Array<Stage> = [authorize]

export default pipeline
