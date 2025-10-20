'use client'

import { useState, useEffect } from 'react'
import { Play, Trash2, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface DownloadedVideo {
  id: string
  videoId: string
  title: string
  movieName?: string
  category?: string
  fileUrl: string
  thumbnailUrl?: string
  downloadedAt: string
  fileSize?: number
}

export default function DownloadsScreen() {
  const [downloads, setDownloads] = useState<DownloadedVideo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDownloads()
  }, [])

  const fetchDownloads = async () => {
    try {
      // In a real app, this would fetch from IndexedDB or local storage
      // For now, we'll simulate with empty data
      setDownloads([])
    } catch (error) {
      console.error('Failed to fetch downloads:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePlayOffline = (video: DownloadedVideo) => {
    // In a real implementation, this would open the downloaded file
    window.open(video.fileUrl, '_blank')
  }

  const handleDeleteDownload = async (videoId: string) => {
    try {
      // In a real app, this would remove from IndexedDB/local storage
      setDownloads(prev => prev.filter(v => v.videoId !== videoId))
    } catch (error) {
      console.error('Failed to delete download:', error)
    }
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size'
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="container mx-auto px-4 py-4">
      <h1 className="text-2xl font-bold text-white mb-6">Downloads</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      ) : downloads.length === 0 ? (
        <div className="text-center py-12">
          <Download className="mx-auto text-gray-500 mb-4" size={64} />
          <h2 className="text-xl font-semibold text-gray-400 mb-2">No Downloads Yet</h2>
          <p className="text-gray-500">Download videos to watch them offline</p>
        </div>
      ) : (
        <div className="space-y-4">
          {downloads.map((video) => (
            <Card key={video.id} className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Thumbnail */}
                  <div className="relative w-32 h-20 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                    {video.thumbnailUrl ? (
                      <img 
                        src={video.thumbnailUrl} 
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Play className="text-gray-500" size={24} />
                      </div>
                    )}
                  </div>

                  {/* Video Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white mb-1 truncate">{video.title}</h3>
                    {video.movieName && (
                      <p className="text-sm text-gray-400 mb-2">{video.movieName}</p>
                    )}
                    {video.category && (
                      <Badge variant="secondary" className="mb-2 bg-gray-700 text-gray-300">
                        {video.category}
                      </Badge>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Downloaded: {formatDate(video.downloadedAt)}</span>
                      <span>{formatFileSize(video.fileSize)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      onClick={() => handlePlayOffline(video)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Play size={16} className="mr-1" />
                      Play
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteDownload(video.videoId)}
                    >
                      <Trash2 size={16} className="mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}