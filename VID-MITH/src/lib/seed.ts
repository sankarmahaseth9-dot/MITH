import { db } from './db'

async function seed() {
  try {
    // Create sample videos
    const sampleVideos = [
      {
        title: 'Amazing Nature Documentary',
        description: 'Explore the wonders of nature in this breathtaking documentary featuring stunning landscapes and wildlife.',
        movieName: 'Nature\'s Beauty',
        category: 'Documentary',
        fileUrl: '/sample-videos/nature-doc.mp4',
        thumbnailUrl: '/sample-thumbnails/nature-doc.jpg',
        viewCount: 1250,
        downloadCount: 89
      },
      {
        title: 'Action Movie Trailer',
        description: 'Get ready for the most thrilling action movie of the year with explosive scenes and intense drama.',
        movieName: 'Thunder Strike',
        category: 'Action',
        fileUrl: '/sample-videos/action-trailer.mp4',
        thumbnailUrl: '/sample-thumbnails/action-trailer.jpg',
        viewCount: 3420,
        downloadCount: 234
      },
      {
        title: 'Comedy Show Highlights',
        description: 'Laugh out loud with the best moments from this hit comedy show.',
        movieName: 'Laugh Factory',
        category: 'Comedy',
        fileUrl: '/sample-videos/comedy-highlights.mp4',
        thumbnailUrl: '/sample-thumbnails/comedy-highlights.jpg',
        viewCount: 892,
        downloadCount: 67
      },
      {
        title: 'Tech Review Latest Smartphone',
        description: 'In-depth review of the latest smartphone with all features, pros, and cons.',
        movieName: 'Tech Talk',
        category: 'Technology',
        fileUrl: '/sample-videos/tech-review.mp4',
        thumbnailUrl: '/sample-thumbnails/tech-review.jpg',
        viewCount: 2156,
        downloadCount: 178
      },
      {
        title: 'Cooking Masterclass',
        description: 'Learn to cook like a professional chef with this step-by-step cooking tutorial.',
        movieName: 'Chef\'s Table',
        category: 'Cooking',
        fileUrl: '/sample-videos/cooking-class.mp4',
        thumbnailUrl: '/sample-thumbnails/cooking-class.jpg',
        viewCount: 1567,
        downloadCount: 145
      }
    ]

    for (const video of sampleVideos) {
      await db.video.create({
        data: video
      })
    }

    console.log('Database seeded successfully!')
  } catch (error) {
    console.error('Error seeding database:', error)
  }
}

seed()