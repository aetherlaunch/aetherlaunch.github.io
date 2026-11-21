import { useCallback, useEffect, useState } from 'react'
import { DAY_START, NIGHT_START } from './config.js'

const KEY = 'aether-theme-mode' // 'auto' | 'light' | 'dark'

export function themeByHour(date = new Date()) {
  const h = date.getHours()
  return h >= DAY_START && h < NIGHT_START ? 'light' : 'dark'
}

function readMode() {
  try {
    const v = localStorage.getItem(KEY)
    return v === 'light' || v === 'dark' ? v : 'auto'
  } catch {
    return 'auto'
  }
}

export function useTheme() {
  const [mode, setModeState] = useState(readMode)
  const [autoTheme, setAutoTheme] = useState(() => themeByHour())

  // Kiểm tra lại mỗi 30 giây và khi tab được mở lại, để sang 18:00 là tự đổi.
  useEffect(() => {
    const tick = () => setAutoTheme(themeByHour())
    const id = setInterval(tick, 30_000)
    document.addEventListener('visibilitychange', tick)
    window.addEventListener('focus', tick)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', tick)
      window.removeEventListener('focus', tick)
    }
  }, [])

  const theme = mode === 'auto' ? autoTheme : mode

  useEffect(() => {
    const root = document.documentElement
    root.classList.add('theme-anim')
    root.dataset.theme = theme
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0b0d1a' : '#eef1ff')
    const t = setTimeout(() => root.classList.remove('theme-anim'), 700)
    return () => clearTimeout(t)
  }, [theme])

  const setMode = useCallback((m) => {
    setModeState(m)
    try {
      if (m === 'auto') localStorage.removeItem(KEY)
      else localStorage.setItem(KEY, m)
    } catch {
      /* bỏ qua nếu trình duyệt chặn storage */
    }
  }, [])

  // Vòng: auto -> light -> dark -> auto
  const cycle = useCallback(() => {
    setMode(mode === 'auto' ? 'light' : mode === 'light' ? 'dark' : 'auto')
  }, [mode, setMode])

  return { mode, theme, setMode, cycle }
}
