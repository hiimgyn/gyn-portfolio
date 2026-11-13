import { GITHUB } from '@/ui'

// Copy (kind, description, points, alt) lives in the locales under work.<id>.
// `mock` projects get an HTML/CSS preview instead of a screenshot; `private` ones show no source link.
export const PROJECTS = [
  {
    id: 'relighthost',
    title: 'ReLightHost',
    image: '/img/relight.jpg',
    host: 'ReLightHost — Windows',
    accent: '#A78BFA',
    links: [
      { label: 'website', href: 'https://relighthost.hiimgyn.cloud' },
      { label: 'source', href: `${GITHUB}/ReLightHost` }
    ]
  },
  {
    id: 'anivor',
    title: 'Animal Survivor',
    image: '/img/anivor.jpg',
    host: 'anivor.hiimgyn.cloud',
    accent: '#34D399',
    links: [
      { label: 'play', href: 'https://anivor.hiimgyn.cloud' },
      { label: 'source', href: `${GITHUB}/animal-survivor` }
    ]
  },
  {
    id: 'gfgames',
    title: 'GFGames',
    image: '/img/gfgames.jpg',
    host: 'arcade.hiimgyn.cloud',
    accent: '#FB7185',
    links: [
      { label: 'play', href: 'https://arcade.hiimgyn.cloud' },
      { label: 'source', href: `${GITHUB}/GFGames` }
    ]
  },
  {
    id: 'gpm',
    title: 'GPM Hub',
    image: '/img/gpm.jpg',
    host: 'gpm.hiimgyn.cloud',
    accent: '#8B8EF7',
    links: [
      { label: 'open', href: 'https://gpm.hiimgyn.cloud' },
      { label: 'source', href: `${GITHUB}/GProjectManager` }
    ]
  },
  {
    id: 'viethoa',
    title: 'viet-hoa-game',
    mock: 'skill',
    host: 'SKILL.md — viet-hoa-game',
    accent: '#FBBF24',
    private: true,
    links: []
  },
  {
    id: 'vbook',
    title: 'VBook Extensions',
    mock: 'vbook',
    host: 'plugin.json — vbook-personal',
    accent: '#38BDF8',
    links: []
  }
]
