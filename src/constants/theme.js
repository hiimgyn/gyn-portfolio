import { overlay } from "three/tsl";

export const colors = {
  light: {
    background: {
      primary: 'bg-white/90',
      secondary: 'bg-gray-200/95',
      tertiary: 'bg-gray-100/90',
      hover: 'hover:bg-gray-100/95',
      active: 'active:bg-gray-200/95',
      overlay: 'bg-gray-300/80',
      line: 'bg-blue-500',
    },
    pattern: {
      color: 'text-slate-400',
      opacity: 'opacity-15'
    },
    text: {
      primary: 'text-gray-800',
      secondary: 'text-gray-600',
      muted: 'text-gray-400',
      hover: 'hover:text-gray-900',
      active: 'active:text-gray-700',
      link: 'text-blue-600',
      'link-hover': 'hover:text-blue-700'
    },
    hover: {
      primary: 'hover:bg-gray-200/80',
      secondary: 'hover:bg-gray-300/80',
      tertiary: 'hover:bg-gray-400/80'
    },
    border: {
      primary: 'border-gray-200/80',
      secondary: 'border-gray-300/80',
      divider: 'border-gray-200/60',
      hover: 'hover:border-gray-400',
      focus: 'focus:border-blue-500',
      error: 'border-red-500',
      success: 'border-green-500',
      warning: 'border-yellow-500',
      line: 'border-blue-500'
    },
    socialIcons: {
      linkedin: 'text-[#0A66C2]',
      facebook: 'text-[#1877F2]',
      instagram: 'text-[#E4405F]',
      github: 'text-[#181717]',
      hover: {
        linkedin: 'hover:text-[#004182]',
        facebook: 'hover:text-[#0D5FCC]',
        instagram: 'hover:text-[#C13584]',
        github: 'hover:text-[#000000]'
      }
    },
    button: {
      primary: 'bg-blue-600',
      secondary: 'bg-gray-200',
      hover: 'hover:bg-blue-700',
      'hover-secondary': 'hover:bg-gray-300',
      active: 'active:bg-blue-800',
      disabled: 'bg-gray-300',
      text: 'text-white',
      'text-secondary': 'text-gray-700'
    },
    span: {
      primary: 'text-gray-800',
      secondary: 'text-gray-600',
      accent: 'text-blue-600',
      error: 'text-red-500',
      success: 'text-green-500',
      warning: 'text-yellow-500'
    },
    ring: {
      focus: 'ring-blue-500',
      error: 'ring-red-500',
      success: 'ring-green-500'
    },
    logo: {
      text: 'text-gray-800',
      hover: 'hover:text-red-600'
    },
    shadow: {
      primary: 'shadow-md',
      hover: 'hover:shadow-lg',
      card: 'shadow-sm',
      timeline: 'shadow-md'
    },    badge: {
      background: 'bg-gray-100',
      text: 'text-gray-700',
      border: 'border-gray-200',
      tech: {
        primary: 'bg-blue-50 text-blue-700 border-blue-200',
        secondary: 'bg-purple-50 text-purple-700 border-purple-200',
        tertiary: 'bg-green-50 text-green-700 border-green-200',
        blue: 'bg-blue-100 border-blue-300 text-blue-700',
        green: 'bg-green-100 border-green-300 text-green-700',
        purple: 'bg-purple-100 border-purple-300 text-purple-700'
      }
    },
    timeline: {
      line: 'bg-gray-300',
      dot: 'bg-white border-gray-300',
      dotHover: 'hover:border-blue-500',
      dotShadow: 'shadow-md'
    },
    card: {
      background: 'bg-white',
      border: 'border-gray-200',
      hover: 'hover:bg-gray-50',
      shadow: 'shadow-sm hover:shadow-md'
    }
  },
  dark: {
    background: {
      primary: 'bg-[#0A0A18]/95',
      secondary: 'bg-[#121225]/95',
      tertiary: 'bg-[#1A1A30]/90',
      hover: 'hover:bg-[#1A1A30]',
      active: 'active:bg-[#222240]',
      overlay: 'bg-black/80',
      line: 'bg-gray-500',
    },
    pattern: {
      color: 'text-white',
      opacity: 'opacity-[0.03]'
    },
    text: {
      primary: 'text-gray-100',
      secondary: 'text-gray-400',
      muted: 'text-gray-500',
      hover: 'hover:text-white',
      active: 'active:text-gray-200',
      link: 'text-blue-400',
      'link-hover': 'hover:text-blue-300'
    },
    hover: {
      primary: 'hover:bg-white/10',
      secondary: 'hover:bg-white/20',
      tertiary: 'hover:bg-white/30'
    },
    border: {
      primary: 'border-white/[0.08]',
      secondary: 'border-white/[0.12]',
      divider: 'border-white/[0.06]',
      hover: 'hover:border-white/20',
      focus: 'focus:border-blue-400',
      error: 'border-red-400',
      success: 'border-green-400',
      warning: 'border-yellow-400',
      line: 'border-gray-500'
    },
    socialIcons: {
      all: 'text-white/50',
      hover: 'hover:text-white'
    },
    button: {
      primary: 'bg-blue-500',
      secondary: 'bg-gray-700',
      hover: 'hover:bg-blue-400',
      'hover-secondary': 'hover:bg-gray-600',
      active: 'active:bg-blue-600',
      disabled: 'bg-gray-800',
      text: 'text-white',
      'text-secondary': 'text-gray-100'
    },
    span: {
      primary: 'text-gray-100',
      secondary: 'text-gray-400',
      accent: 'text-blue-400',
      error: 'text-red-400',
      success: 'text-green-400',
      warning: 'text-yellow-400'
    },
    ring: {
      focus: 'ring-blue-400',
      error: 'ring-red-400',
      success: 'ring-green-400'
    },
    logo: {
      text: 'text-gray-100',
      hover: 'hover:text-blue-400'
    },
    shadow: {
      primary: 'shadow-md shadow-black/20',
      hover: 'hover:shadow-lg hover:shadow-black/30',
      card: 'shadow-sm shadow-black/10',
      timeline: 'shadow-md shadow-black/25'
    },    badge: {
      background: 'bg-gray-800',
      text: 'text-gray-200',
      border: 'border-gray-700',
      tech: {
        primary: 'bg-blue-900/30 text-blue-300 border-blue-700',
        secondary: 'bg-purple-900/30 text-purple-300 border-purple-700',
        tertiary: 'bg-green-900/30 text-green-300 border-green-700',
        blue: 'bg-blue-900/30 border-blue-700 text-blue-300',
        green: 'bg-green-900/30 border-green-700 text-green-300',
        purple: 'bg-purple-900/30 border-purple-700 text-purple-300'
      }
    },
    timeline: {
      line: 'bg-gray-700',
      dot: 'bg-gray-800 border-gray-600',
      dotHover: 'hover:border-blue-400',
      dotShadow: 'shadow-md shadow-black/25'
    },
    card: {
      background: 'bg-[#1A1A30]',
      border: 'border-white/[0.08]',
      hover: 'hover:bg-[#222240]',
      shadow: 'shadow-sm shadow-black/10 hover:shadow-md hover:shadow-black/20'
    }
  }
}
