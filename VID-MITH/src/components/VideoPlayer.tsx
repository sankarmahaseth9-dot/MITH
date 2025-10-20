'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Download, Play, Pause, Volume2, Maximize } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

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

export default function VideoPlayer({ 
  video, 
  onClose, 
  onDownload 
}: { 
  video: Video
  onClose: () => void
  onDownload: () => void
}) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Increment view count when video is opened
    fetch(`/api/videos/${video.id}/view`, { method: 'POST' })
  }, [video.id])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    if (videoRef.current) {
      videoRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value)
    if (videoRef.current) {
      videoRef.current.volume = vol
      setVolume(vol)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-900">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-white hover:bg-gray-800"
        >
          <X size={24} />
        </Button>
        <h1 className="text-white font-semibold truncate max-w-xs">{video.title}</h1>
        <div className="w-10" />
      </div>

      {/* Video Container */}
      <div className="flex-1 relative bg-black">
        <video
          ref={videoRef}
          src={video.fileUrl}
          className="w-full h-full object-contain"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onClick={togglePlay}
        />
        
        {/* Play/Pause Overlay */}
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          onClick={togglePlay}
        >
          {!isPlaying && (
            <div className="bg-black bg-opacity-50 rounded-full p-4 pointer-events-auto">
              <Play size={48} className="text-white" />
            </div>
          )}
        </div>
      </div>

      {/* Video Controls */}
      <div className="bg-gray-900 p-4">
        {/* Progress Bar */}
        <div className="mb-4">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={togglePlay}
              className="text-white hover:bg-gray-800"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </Button>
            
            <div className="flex items-center gap-2">
              <Volume2 size={20} className="text-gray-400" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="w-20 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-gray-800"
          >
            <Maximize size={20} />
          </Button>
        </div>

        {/* Video Info */}
        <div className="mb-4">
          <h2 className="text-white font-semibold text-lg mb-2">{video.title}</h2>
          {video.movieName && (
            <p className="text-gray-400 mb-2">Movie: {video.movieName}</p>
          )}
          {video.description && (
            <p className="text-gray-300 text-sm mb-4">{video.description}</p>
          )}
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>Views: {video.viewCount}</span>
            <span>Downloads: {video.downloadCount}</span>
          </div>
        </div>

        {/* Download Button */}
        <Button
          onClick={onDownload}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3"
        >
          <Download size={20} className="mr-2" />
          Download Video
        </Button>
      </div>
    </div>
  )
}