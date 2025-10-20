import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const search = searchParams.get('search') || ''
    const limit = 20
    const offset = (page - 1) * limit

    let whereClause = {}
    if (search) {
      whereClause = {
        OR: [
          { title: { contains: search } },
          { movieName: { contains: search } }
        ]
      }
    }

    const videos = await db.video.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit
    })

    return NextResponse.json(videos)
  } catch (error) {
    console.error('Failed to fetch videos:', error)
    return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 })
  }
}