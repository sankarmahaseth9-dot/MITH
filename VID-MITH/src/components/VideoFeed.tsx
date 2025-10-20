'use client'

import { useState, useEffect } from 'react'
import { Search, Play, Download, Eye } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import VideoPlayer from '@/components/VideoPlayer'

interface Video {
  id: string
  title: string
  description?: string
  movieName?: string
  category?: string
  fileUrl: string
  thumbnailUrl?: string
  viewCount: number
  downloadCount: number
  createdAt: string
}

export default function VideoFeed({ searchQuery, setSearchQuery }: { 
  searchQuery: string
  setSearchQuery: (query: string) => void 
}) {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [page, setPage] = useState(1)

  const fetchVideos = async (pageNum: number = 1, search: string = '') => {
    try {
      const response = await fetch(`/api/videos?page=${pageNum}&search=${encodeURIComponent(search)}`)
      if (response.ok) {
        const newVideos = await response.json()
        if (pageNum === 1) {
          setVideos(newVideos)
        } else {
          setVideos(prev => [...prev, ...newVideos])
        }
      }
    } catch (error) {
      console.error('Failed to fetch videos:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    setPage(1)
    fetchVideos(1, searchQuery)
  }, [searchQuery])

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop >= 
        document.documentElement.offsetHeight - 1000) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchVideos(nextPage, searchQuery)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [page, searchQuery])

  const handleDownload = async (video: Video) => {
    try {
      // Increment download count
      await fetch(`/api/videos/${video.id}/download`, { method: 'POST' })
      
      // Trigger download
      const link = document.createElement('a')
      link.href = video.fileUrl
      link.download = video.title
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Update local state
      setVideos(prev => prev.map(v => 
        v.id === video.id 
          ? { ...v, downloadCount: v.downloadCount + 1 }
          : v
      ))
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  if (selectedVideo) {
    return (
      <VideoPlayer 
        video={selectedVideo} 
        onClose={() => setSelectedVideo(null)}
        onDownload={() => handleDownload(selectedVideo)}
      />
    )
  }

  return (
    <div className="container mx-auto px-4 py-4">
      {/* Search Bar */}
      <div className="sticky top-0 z-10 bg-gray-900 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            type="text"
            placeholder="Search videos by title or movie name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
          />
        </div>
      </div>

      {/* Video Grid */}
      {loading && videos.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {videos.map((video) => (
            <Card 
              key={video.id} 
              className="bg-gray-800 border-gray-700 overflow-hidden hover:bg-gray-750 transition-colors cursor-pointer"
              onClick={() => setSelectedVideo(video)}
            >
              <div className="relative aspect-video bg-gray-700">
                {video.thumbnailUrl ? (
                  <img 
                    src={video.thumbnailUrl} 
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Play className="text-gray-500" size={48} />
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all flex items-center justify-center">
                  <Play className="text-white opacity-0 hover:opacity-100 transition-opacity" size={48} />
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-white mb-1 line-clamp-2">{video.title}</h3>
                {video.movieName && (
                  <p className="text-sm text-gray-400 mb-2">{video.movieName}</p>
                )}
                {video.category && (
                  <Badge variant="secondary" className="mb-2 bg-gray-700 text-gray-300">
                    {video.category}
                  </Badge>
                )}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Eye size={12} />
                    <span>{video.viewCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Download size={12} />
                    <span>{video.downloadCount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {loading && videos.length > 0 && (
        <div className="flex justify-center mt-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      )}
    </div>
  )
}