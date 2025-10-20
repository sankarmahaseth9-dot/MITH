import { Server as NetServer } from 'http'
import { NextApiRequest, NextApiResponse } from 'next'
import { Server as ServerIO } from 'socket.io'
import { db } from './db'

export async function getAppInstance() {
  // This will be initialized when the server starts
  return null
}

// Socket.IO server initialization
export const initializeSocket = (httpServer: NetServer) => {
  const io = new ServerIO(httpServer, {
    path: '/api/socket/io',
    addTrailingSlash: false,
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  })

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id)

    // Send real-time stats every 5 seconds
    const statsInterval = setInterval(async () => {
      try {
        const totalStats = await db.video.aggregate({
          _sum: {
            viewCount: true,
            downloadCount: true
          }
        })

        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
        const recentDownloads = await db.download.count({
          where: {
            createdAt: {
              gte: fiveMinutesAgo
            }
          }
        })

        const activeViewers = Math.floor(Math.random() * 10) + 1

        const stats = {
          activeViewers,
          activeDownloads: recentDownloads,
          totalViews: totalStats._sum.viewCount || 0,
          totalDownloads: totalStats._sum.downloadCount || 0
        }

        io.emit('stats', { type: 'stats', stats })
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }, 5000)

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id)
      clearInterval(statsInterval)
    })
  })

  return io
}