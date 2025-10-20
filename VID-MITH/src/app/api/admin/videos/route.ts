import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { writeFile } from 'fs/promises'
import path from 'path'

export async function GET() {
  try {
    const videos = await db.video.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(videos)
  } catch (error) {
    console.error('Failed to fetch admin videos:', error)
    return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const movieName = formData.get('movieName') as string
    const category = formData.get('category') as string
    const videoFile = formData.get('video') as File
    const thumbnailFile = formData.get('thumbnail') as File

    if (!title || !videoFile) {
      return NextResponse.json({ error: 'Title and video file are required' }, { status: 400 })
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    const videosDir = path.join(uploadsDir, 'videos')
    const thumbnailsDir = path.join(uploadsDir, 'thumbnails')

    try {
      await writeFile(videosDir, '')
    } catch {
      // Directory might not exist, create it
      const { mkdir } = await import('fs/promises')
      await mkdir(videosDir, { recursive: true })
      await mkdir(thumbnailsDir, { recursive: true })
    }

    // Save video file
    const videoBytes = await videoFile.arrayBuffer()
    const videoBuffer = Buffer.from(videoBytes)
    const videoFileName = `${Date.now()}-${videoFile.name}`
    const videoPath = path.join(videosDir, videoFileName)
    await writeFile(videoPath, videoBuffer)

    // Save thumbnail file if provided
    let thumbnailUrl = null
    if (thumbnailFile) {
      const thumbnailBytes = await thumbnailFile.arrayBuffer()
      const thumbnailBuffer = Buffer.from(thumbnailBytes)
      const thumbnailFileName = `${Date.now()}-${thumbnailFile.name}`
      const thumbnailPath = path.join(thumbnailsDir, thumbnailFileName)
      await writeFile(thumbnailPath, thumbnailBuffer)
      thumbnailUrl = `/uploads/thumbnails/${thumbnailFileName}`
    }

    // Create video record in database
    const video = await db.video.create({
      data: {
        title,
        description,
        movieName,
        category,
        fileUrl: `/uploads/videos/${videoFileName}`,
        thumbnailUrl
      }
    })

    return NextResponse.json(video)
  } catch (error) {
    console.error('Failed to upload video:', error)
    return NextResponse.json({ error: 'Failed to upload video' }, { status: 500 })
  }
}