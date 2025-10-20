'use client'

import { useState, useEffect } from 'react'
import { Upload, Trash2, Edit, Play, Download, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'

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

interface RealTimeStats {
  activeViewers: number
  activeDownloads: number
  totalViews: number
  totalDownloads: number
}

export default function AdminDashboard() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [editingVideo, setEditingVideo] = useState<Video | null>(null)
  const [stats, setStats] = useState<RealTimeStats>({
    activeViewers: 0,
    activeDownloads: 0,
    totalViews: 0,
    totalDownloads: 0
  })
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    movieName: '',
    category: '',
    videoFile: null as File | null,
    thumbnailFile: null as File | null
  })

  useEffect(() => {
    fetchVideos()
    fetchStats()
    
    // Set up WebSocket for real-time stats
    const ws = new WebSocket('ws://127.0.0.1:3000/api/socketio')
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'stats') {
        setStats(data.stats)
      }
    }
    
    return () => ws.close()
  }, [])

  const fetchVideos = async () => {
    try {
      const response = await fetch('/api/admin/videos')
      if (response.ok) {
        const videosData = await response.json()
        setVideos(videosData)
      }
    } catch (error) {
      console.error('Failed to fetch videos:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const statsData = await response.json()
        setStats(statsData)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const formDataToSend = new FormData()
    formDataToSend.append('title', formData.title)
    formDataToSend.append('description', formData.description)
    formDataToSend.append('movieName', formData.movieName)
    formDataToSend.append('category', formData.category)
    
    if (formData.videoFile) {
      formDataToSend.append('video', formData.videoFile)
    }
    if (formData.thumbnailFile) {
      formDataToSend.append('thumbnail', formData.thumbnailFile)
    }

    try {
      const url = editingVideo ? `/api/admin/videos/${editingVideo.id}` : '/api/admin/videos'
      const method = editingVideo ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        body: formDataToSend
      })

      if (response.ok) {
        fetchVideos()
        setShowUploadForm(false)
        setEditingVideo(null)
        setFormData({
          title: '',
          description: '',
          movieName: '',
          category: '',
          videoFile: null,
          thumbnailFile: null
        })
      }
    } catch (error) {
      console.error('Failed to save video:', error)
    }
  }

  const handleDelete = async (videoId: string) => {
    if (confirm('Are you sure you want to delete this video?')) {
      try {
        const response = await fetch(`/api/admin/videos/${videoId}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          fetchVideos()
        }
      } catch (error) {
        console.error('Failed to delete video:', error)
      }
    }
  }

  const handleEdit = (video: Video) => {
    setEditingVideo(video)
    setFormData({
      title: video.title,
      description: video.description || '',
      movieName: video.movieName || '',
      category: video.category || '',
      videoFile: null,
      thumbnailFile: null
    })
    setShowUploadForm(true)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button
            onClick={() => setShowUploadForm(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus size={20} className="mr-2" />
            Add Video
          </Button>
        </div>

        {/* Real-time Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Viewers</p>
                  <p className="text-2xl font-bold text-green-500">{stats.activeViewers}</p>
                </div>
                <Play className="text-green-500" size={24} />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Downloads</p>
                  <p className="text-2xl font-bold text-blue-500">{stats.activeDownloads}</p>
                </div>
                <Download className="text-blue-500" size={24} />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Views</p>
                  <p className="text-2xl font-bold">{stats.totalViews}</p>
                </div>
                <Play className="text-gray-400" size={24} />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Downloads</p>
                  <p className="text-2xl font-bold">{stats.totalDownloads}</p>
                </div>
                <Download className="text-gray-400" size={24} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Videos List */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>Manage Videos</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {videos.map((video) => (
                  <div key={video.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{video.title}</h3>
                      {video.movieName && (
                        <p className="text-sm text-gray-400">{video.movieName}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span>Views: {video.viewCount}</span>
                        <span>Downloads: {video.downloadCount}</span>
                        <span>Created: {new Date(video.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(video)}
                        className="border-gray-600 text-white hover:bg-gray-600"
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(video.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upload/Edit Modal */}
      {showUploadForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl bg-gray-800 border-gray-700 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{editingVideo ? 'Edit Video' : 'Upload New Video'}</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowUploadForm(false)
                    setEditingVideo(null)
                    setFormData({
                      title: '',
                      description: '',
                      movieName: '',
                      category: '',
                      videoFile: null,
                      thumbnailFile: null
                    })
                  }}
                  className="text-white hover:bg-gray-700"
                >
                  <X size={20} />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-gray-300">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="description" className="text-gray-300">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="movieName" className="text-gray-300">Movie/Show Name</Label>
                  <Input
                    id="movieName"
                    value={formData.movieName}
                    onChange={(e) => setFormData(prev => ({ ...prev, movieName: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="category" className="text-gray-300">Category/Genre</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="video" className="text-gray-300">Video File *</Label>
                  <Input
                    id="video"
                    type="file"
                    accept="video/*"
                    onChange={(e) => setFormData(prev => ({ ...prev, videoFile: e.target.files?.[0] || null }))}
                    className="bg-gray-700 border-gray-600 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-700"
                    required={!editingVideo}
                  />
                </div>
                
                <div>
                  <Label htmlFor="thumbnail" className="text-gray-300">Thumbnail Image</Label>
                  <Input
                    id="thumbnail"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData(prev => ({ ...prev, thumbnailFile: e.target.files?.[0] || null }))}
                    className="bg-gray-700 border-gray-600 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-700"
                  />
                </div>
                
                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {editingVideo ? 'Update Video' : 'Upload Video'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowUploadForm(false)
                      setEditingVideo(null)
                    }}
                    className="border-gray-600 text-white hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}