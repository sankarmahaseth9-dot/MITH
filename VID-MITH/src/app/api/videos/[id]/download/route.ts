import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const videoId = params.id

    // Update download count
    await db.video.update({
      where: { id: videoId },
      data: { downloadCount: { increment: 1 } }
    })

    // Record download
    await db.download.create({
      data: { videoId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to record download:', error)
    return NextResponse.json({ error: 'Failed to record download' }, { status: 500 })
  }
}