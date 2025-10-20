import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Get total views and downloads
    const totalStats = await db.video.aggregate({
      _sum: {
        viewCount: true,
        downloadCount: true
      }
    })

    // Get recent downloads (last 5 minutes as "active")
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
    const recentDownloads = await db.download.count({
      where: {
        createdAt: {
          gte: fiveMinutesAgo
        }
      }
    })

    // Simulate active viewers (in a real app, this would track active sessions)
    const activeViewers = Math.floor(Math.random() * 10) + 1

    const stats = {
      activeViewers,
      activeDownloads: recentDownloads,
      totalViews: totalStats._sum.viewCount || 0,
      totalDownloads: totalStats._sum.downloadCount || 0
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Failed to fetch stats:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}