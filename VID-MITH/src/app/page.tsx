'use client'

import { useState } from 'react'
import { Home, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import VideoFeed from '@/components/VideoFeed'
import DownloadsScreen from '@/components/DownloadsScreen'

export default function StreamVidApp() {
  const [activeTab, setActiveTab] = useState<'home' | 'downloads'>('home')
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Main Content */}
      <main className="flex-1 pb-16">
        {activeTab === 'home' ? (
          <VideoFeed searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        ) : (
          <DownloadsScreen />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700">
        <div className="flex justify-around items-center py-2">
          <Button
            variant={activeTab === 'home' ? 'default' : 'ghost'}
            className="flex flex-col items-center gap-1 text-white hover:bg-gray-700"
            onClick={() => setActiveTab('home')}
          >
            <Home size={20} />
            <span className="text-xs">Home</span>
          </Button>
          <Button
            variant={activeTab === 'downloads' ? 'default' : 'ghost'}
            className="flex flex-col items-center gap-1 text-white hover:bg-gray-700"
            onClick={() => setActiveTab('downloads')}
          >
            <Download size={20} />
            <span className="text-xs">Downloads</span>
          </Button>
        </div>
      </nav>
    </div>
  )
}