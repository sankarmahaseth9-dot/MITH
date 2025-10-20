import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { writeFile } from 'fs/promises'
import path from 'path'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const videoId = params.id
    const formData = await request.formData()
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const movieName = formData.get('movieName') as string
    const category = formData.get('category') as string
    const videoFile = formData.get('video') as File
    const thumbnailFile = formData.get('thumbnail') as File

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const updateData: any = {
      title,
      description,
      movieName,
      category
    }

    // Handle new video file if uploaded
    if (videoFile) {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
      const videosDir = path.join(uploadsDir, 'videos')

      const videoBytes = await videoFile.arrayBuffer()
      const videoBuffer = Buffer.from(videoBytes)
      const videoFileName = `${Date.now()}-${videoFile.name}`
      const videoPath = path.join(videosDir, videoFileName)
      await writeFile(videoPath, videoBuffer)

      updateData.fileUrl = `/uploads/videos/${videoFileName}`
    }

    // Handle new thumbnail file if uploaded
    if (thumbnailFile) {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
      const thumbnailsDir = path.join(uploadsDir, 'thumbnails')

      const thumbnailBytes = await thumbnailFile.arrayBuffer()
      const thumbnailBuffer = Buffer.from(thumbnailBytes)
      const thumbnailFileName = `${Date.now()}-${thumbnailFile.name}`
      const thumbnailPath = path.join(thumbnailsDir, thumbnailFileName)
      await writeFile(thumbnailPath, thumbnailBuffer)

      updateData.thumbnailUrl = `/uploads/thumbnails/${thumbnailFileName}`
    }

    const video = await db.video.update({
      where: { id: videoId },
      data: updateData
    })

    return NextResponse.json(video)
  } catch (error) {
    console.error('Failed to update video:', error)
    return NextResponse.json({ error: 'Failed to update video' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const videoId = params.id

    await db.video.delete({
      where: { id: videoId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete video:', error)
    return NextResponse.json({ error: 'Failed to delete video' }, { status: 500 })
  }
}