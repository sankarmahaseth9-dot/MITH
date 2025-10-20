import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const videoId = params.id

    await db.video.update({
      where: { id: videoId },
      data: { viewCount: { increment: 1 } }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to update view count:', error)
    return NextResponse.json({ error: 'Failed to update view count' }, { status: 500 })
  }
}