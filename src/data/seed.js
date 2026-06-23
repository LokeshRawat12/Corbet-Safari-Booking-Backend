import { writeFile } from 'node:fs/promises'
import path from 'node:path'

import config from '../config/default.js'

const dbPath = path.resolve(config.dbFile)

const zones = [
  {
    slug: 'dhikala',
    title: 'Dhikala Zone',
    subtitle: 'The Heart of the Wild Kingdom',
    description:
      'Dhikala is famous for its vast Patli Dun Valley. It is the only zone where you can witness massive elephant herds crossing the river against a backdrop of ancient Sal forests.',
    image: '/images/Dhikala.jpg',
    highlights: ['Core Tiger Conservation Area', 'Best birding destination', 'Riverine ecosystem'],
    wildlife: [
      {
        name: 'Blue-throated Barbet',
        description: 'A colorful resident of the forest canopy.',
        image: '/images/167-2-909x623.webp',
      },
      {
        name: 'Majestic Elephants',
        description: 'Giant herds roaming the Ramganga riverbed.',
        image: '/images/akash-ctb-4-1184x789.webp',
      },
    ],
  },
  {
    slug: 'bijrani',
    title: 'Bijrani Zone',
    subtitle: 'Grasslands & Tiger Tracks',
    description:
      'Bijrani is known for its biodiversity and open grasslands. It is one of the most visited zones for tiger sightings and birding.',
    image: '/images/tiger2.jpg',
    highlights: [
      'High tiger sighting probability',
      'Open grassland habitats',
      'Popular for morning and evening safaris',
    ],
    wildlife: [
      {
        name: 'Royal Bengal Tiger',
        description: 'One of the most frequently sighted big cats in the park.',
        image: '/images/tiger walking.webp',
      },
      {
        name: 'Spotted Deer',
        description: 'Commonly seen grazing in the open meadows.',
        image: '/images/Dear.webp',
      },
    ],
  },
  {
    slug: 'jhirna',
    title: 'Jhirna Zone',
    subtitle: 'All-Year Birding & Wildlife',
    description:
      'Jhirna is open throughout the year and is famous for bird watching, sloth bear sightings, and peaceful forest drives.',
    image: '/images/bird.webp',
    highlights: ['Open during monsoon', 'Excellent bird watching', 'Dense deciduous forest'],
    wildlife: [
      {
        name: 'Sloth Bear',
        description: 'A shy but rewarding species to spot in the early morning.',
        image: '/images/Blackbear.webp',
      },
      {
        name: 'Birdlife',
        description: 'A wide variety of resident and migratory birds.',
        image: '/images/Bird-2.jpg',
      },
    ],
  },
  {
    slug: 'dhela',
    title: 'Dhela Zone',
    subtitle: 'Mixed Forests & Quiet Trails',
    description:
      'Dhela is a newer zone known for mixed forest types and rich biodiversity. It offers peaceful driving trails with a good chance of seeing leopards and deer.',
    image: '/images/Dhela Zone.jpg',
    highlights: ['All-year access', 'Hotspot for bird watching', 'Quiet and less crowded'],
    wildlife: [
      {
        name: 'Leopard',
        description: 'Elusive big cats often spotted in the early hours.',
        image: '/images/Elephant.jpg',
      },
      {
        name: 'Indian Roller',
        description: 'A colorful bird regularly seen in open forest areas.',
        image: '/images/Bird-3.webp',
      },
    ],
  },
  {
    slug: 'durgadevi',
    title: 'Durga Devi Zone',
    subtitle: 'Hilltop Views & Forest Trails',
    description:
      'Durga Devi zone offers a mix of hill terrain and dense forests, making it ideal for bird lovers and nature walks.',
    image: '/images/Durgadevi.webp',
    highlights: ['Hilly terrain', 'Quiet forest drives', 'Scenic viewpoints'],
    wildlife: [
      {
        name: 'Rajasthan Deer',
        description: 'Often spotted grazing in the early morning.',
        image: '/images/Durgadevilandscape.webp',
      },
      {
        name: 'Grey Langur',
        description: 'Commonly seen moving through the treetops.',
        image: '/images/Elephant.jpg',
      },
    ],
  },
  {
    slug: 'garjia',
    title: 'Garjia Zone',
    subtitle: 'River Views & Temple Trails',
    description:
      'Garjia zone features scenic riverbanks near the famous Garjia Temple and offers peaceful safari drives.',
    image: '/images/Garjia-2.webp',
    highlights: ['Waterfront safari routes', 'Temple views', 'Rich bird life'],
    wildlife: [
      {
        name: 'River Otter',
        description: 'A rare sight along the river banks.',
        image: '/images/Elephent-2.jpg',
      },
      {
        name: 'Kingfisher',
        description: 'Often seen hovering along the water.',
        image: '/images/Elephant.jpg',
      },
    ],
  },
  {
    slug: 'sitabani',
    title: 'Sitabani Zone',
    subtitle: 'Legendary Paths & Forest Peace',
    description:
      'Sitabani offers mythological trails and quiet forest paths, ideal for a relaxed wildlife experience.',
    image: '/images/Sitabani.webp',
    highlights: ['Mythological significance', 'Peaceful trails', 'Good for photography'],
    wildlife: [
      {
        name: 'Indian Bison',
        description: 'Grazes in the open grasslands.',
        image: '/images/Elephent-2.jpg',
      },
      {
        name: 'Peacock',
        description: 'Commonly seen displaying in the early morning.',
        image: '/images/Bird-3.webp',
      },
    ],
  },
  {
    slug: 'phato',
    title: 'Phato Zone',
    subtitle: 'Offbeat Trails & Quiet Forests',
    description:
      'Phato is an offbeat zone known for serene jungle environments and low visitor numbers.',
    image: '/images/Phato.webp',
    highlights: ['Quiet exploration', 'Scenic drives', 'Photo opportunities'],
    wildlife: [
      {
        name: 'Wild Boar',
        description: 'Frequently seen crossing the tracks.',
        image: '/images/Elephant.jpg',
      },
      {
        name: 'Painted Stork',
        description: 'Often found near water bodies.',
        image: '/images/Bird-2.jpg',
      },
    ],
  },
  {
    slug: 'sonanadi',
    title: 'Sonanadi Zone',
    subtitle: 'Riverine Forest & Wilderness',
    description:
      'Sonanadi is a blend of forest and river habitats, offering excellent wildlife sightings in a tranquil setting.',
    image: '/images/Sonanadi.webp',
    highlights: ['Riverine forest', 'Rich wildlife', 'Quiet drives'],
    wildlife: [
      {
        name: 'Sambar Deer',
        description: 'Commonly seen grazing near water.',
        image: '/images/Elephant.jpg',
      },
      {
        name: 'Water Monitor Lizard',
        description: 'Often seen near swampy areas.',
        image: '/images/Elephent-2.jpg',
      },
    ],
  },
]

const sampleBookings = [
  {
    id: 'booking-1',
    zoneSlug: 'dhikala',
    name: 'Aarav Patel',
    email: 'aarav@example.com',
    phone: '+91-9876543210',
    date: new Date().toISOString().split('T')[0],
    slot: 'morning',
    createdAt: new Date().toISOString(),
    status: 'confirmed',
  },
]

async function main() {
  const payload = {
    zones,
    bookings: sampleBookings,
  }

  await writeFile(dbPath, JSON.stringify(payload, null, 2), 'utf-8')
  // eslint-disable-next-line no-console
  console.log(`Seeded database to ${dbPath}`)
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error)
  process.exit(1)
})
