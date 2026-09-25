export const colors = {
  light: {
    background: {
      primary: 'bg-white/90 backdrop-blur-xl',
      secondary: 'bg-[#faf8fd]/90 backdrop-blur-md',
      tertiary: 'bg-violet-50/70',
      hover: 'hover:bg-violet-50/80',
      active: 'active:bg-violet-100/80',
      overlay: 'bg-slate-900/40',
      line: 'bg-violet-500',
    },
    pattern: {
      color: 'text-violet-200',
      opacity: 'opacity-40'
    },
    text: {
      primary: 'text-slate-900',
      secondary: 'text-slate-600',
      muted: 'text-slate-400',
      hover: 'hover:text-slate-950',
      active: 'active:text-slate-800',
      link: 'text-violet-600',
      'link-hover': 'hover:text-violet-700'
    },
    hover: {
      primary: 'hover:bg-violet-50/60',
      secondary: 'hover:bg-violet-100/60',
      tertiary: 'hover:bg-violet-200/60'
    },
    border: {
      primary: 'border-slate-200/90',
      secondary: 'border-slate-300',
      divider: 'border-slate-200/80',
      accent: 'border-violet-500',
      hover: 'hover:border-violet-400',
      focus: 'focus:border-violet-500',
      error: 'border-rose-500',
      success: 'border-emerald-500',
      warning: 'border-amber-500',
      line: 'border-violet-500'
    },
    socialIcons: {
      linkedin: 'text-[#0A66C2]',
      facebook: 'text-[#1877F2]',
      instagram: 'text-[#E4405F]',
      github: 'text-[#0f172a]',
      hover: {
        linkedin: 'hover:text-[#004182]',
        facebook: 'hover:text-[#0D5FCC]',
        instagram: 'hover:text-[#C13584]',
        github: 'hover:text-black'
      }
    },
    button: {
      primary: 'bg-violet-600 text-white hover:bg-violet-700 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.35),0_4px_16px_rgba(139,92,246,0.25)] active:translate-y-0.5 active:scale-[0.98]',
      secondary: 'bg-white text-slate-800 hover:bg-violet-50/50 border border-slate-300/80 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_1px_3px_rgba(0,0,0,0.05)] active:translate-y-0.5 active:scale-[0.98]',
      hover: 'hover:bg-violet-700',
      'hover-secondary': 'hover:bg-violet-50',
      active: 'active:bg-violet-800',
      disabled: 'bg-slate-200 text-slate-400 cursor-not-allowed',
      text: 'text-white',
      'text-secondary': 'text-slate-700'
    },
    span: {
      primary: 'text-slate-900',
      secondary: 'text-slate-600',
      accent: 'text-violet-600',
      error: 'text-rose-500',
      success: 'text-emerald-500',
      warning: 'text-amber-500'
    },
    ring: {
      focus: 'ring-violet-500',
      error: 'ring-rose-500',
      success: 'ring-emerald-500'
    },
    logo: {
      text: 'text-slate-900',
      hover: 'hover:text-violet-600',
      primary: 'text-violet-600'
    },
    shadow: {
      primary: 'shadow-md shadow-violet-100/50',
      hover: 'hover:shadow-xl hover:shadow-violet-200/40',
      card: 'shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_2px_8px_rgba(15,23,42,0.04)]',
      timeline: 'shadow-md shadow-violet-100/50'
    },
    badge: {
      background: 'bg-violet-50',
      text: 'text-violet-700',
      border: 'border-violet-200',
      tech: {
        primary: 'bg-violet-50 text-violet-700 border-violet-200',
        secondary: 'bg-purple-50 text-purple-700 border-purple-200',
        tertiary: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        blue: 'bg-sky-50 border-sky-200 text-sky-700',
        green: 'bg-emerald-50 border-emerald-200 text-emerald-700',
        purple: 'bg-purple-50 border-purple-200 text-purple-700'
      }
    },
    timeline: {
      line: 'bg-violet-200',
      dot: 'bg-white border-violet-300',
      dotHover: 'hover:border-violet-500',
      dotShadow: 'shadow-md shadow-violet-200/50'
    },
    card: {
      background: 'bg-white/90 backdrop-blur-xl',
      border: 'border-slate-200/90',
      hover: 'hover:bg-white',
      shadow: 'shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_2px_12px_rgba(15,23,42,0.05)]'
    }
  },
  dark: {
    background: {
      primary: 'bg-[#0b0d14]/85 backdrop-blur-xl',
      secondary: 'bg-[#11131f]/90 backdrop-blur-md',
      tertiary: 'bg-[#17192b]/90',
      hover: 'hover:bg-[#1c1f36]',
      active: 'active:bg-[#232745]',
      overlay: 'bg-black/75',
      line: 'bg-violet-400',
    },
    pattern: {
      color: 'text-violet-300',
      opacity: 'opacity-[0.04]'
    },
    text: {
      primary: 'text-slate-100',
      secondary: 'text-slate-400',
      muted: 'text-slate-500',
      hover: 'hover:text-white',
      active: 'active:text-slate-200',
      link: 'text-violet-300',
      'link-hover': 'hover:text-violet-200'
    },
    hover: {
      primary: 'hover:bg-white/5',
      secondary: 'hover:bg-white/10',
      tertiary: 'hover:bg-white/15'
    },
    border: {
      primary: 'border-white/[0.08]',
      secondary: 'border-white/[0.14]',
      divider: 'border-white/[0.06]',
      accent: 'border-violet-400',
      hover: 'hover:border-violet-300/40',
      focus: 'focus:border-violet-400',
      error: 'border-rose-500',
      success: 'border-emerald-500',
      warning: 'border-amber-400',
      line: 'border-violet-400/60'
    },
    socialIcons: {
      all: 'text-slate-400',
      hover: 'hover:text-violet-200'
    },
    button: {
      primary: 'bg-violet-600 text-white hover:bg-violet-500 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_4px_16px_rgba(139,92,246,0.35)] active:translate-y-0.5 active:scale-[0.98]',
      secondary: 'bg-white/5 text-slate-200 hover:bg-white/10 border border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] active:translate-y-0.5 active:scale-[0.98]',
      hover: 'hover:bg-violet-500',
      'hover-secondary': 'hover:bg-white/10',
      active: 'active:bg-violet-700',
      disabled: 'bg-slate-900 text-slate-600 cursor-not-allowed',
      text: 'text-white',
      'text-secondary': 'text-slate-200'
    },
    span: {
      primary: 'text-slate-100',
      secondary: 'text-slate-400',
      accent: 'text-violet-300',
      error: 'text-rose-400',
      success: 'text-emerald-400',
      warning: 'text-amber-400'
    },
    ring: {
      focus: 'ring-violet-400',
      error: 'ring-rose-400',
      success: 'ring-emerald-400'
    },
    logo: {
      text: 'text-slate-100',
      hover: 'hover:text-violet-300',
      primary: 'text-violet-400'
    },
    shadow: {
      primary: 'shadow-lg shadow-black/40',
      hover: 'hover:shadow-2xl hover:shadow-black/50',
      card: 'shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_4px_24px_-4px_rgba(0,0,0,0.5)]',
      timeline: 'shadow-lg shadow-black/40'
    },
    badge: {
      background: 'bg-violet-950/40',
      text: 'text-violet-300',
      border: 'border-violet-800/60',
      tech: {
        primary: 'bg-violet-950/40 text-violet-300 border-violet-800/60',
        secondary: 'bg-purple-950/40 text-purple-300 border-purple-800/60',
        tertiary: 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60',
        blue: 'bg-sky-950/40 border-sky-800/60 text-sky-300',
        green: 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300',
        purple: 'bg-purple-950/40 border-purple-800/60 text-purple-300'
      }
    },
    timeline: {
      line: 'bg-violet-900/40',
      dot: 'bg-slate-900 border-violet-500/50',
      dotHover: 'hover:border-violet-300',
      dotShadow: 'shadow-lg shadow-violet-950/50'
    },
    card: {
      background: 'bg-[#121524]/80 backdrop-blur-xl',
      border: 'border-white/[0.08]',
      hover: 'hover:bg-[#161a2d]',
      shadow: 'shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_4px_24px_-4px_rgba(0,0,0,0.5)]'
    }
  }
}
