"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

const getFlash = () =>
  document.cookie
    .split("; ")
    .find((row) => row.startsWith("flash="))
    ?.split("=")[1]

const clearFlash = () => {
  document.cookie = "flash=; path=/; max-age=0"
}

const Notification = () => {
  const [message, setMessage] = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const flash = getFlash()
    if (!flash) {
      return
    }
    clearFlash()
    const decoded = decodeURIComponent(flash)
    const show = setTimeout(() => setMessage(decoded), 0)
    const hide = setTimeout(() => setMessage(null), 5000)
    return () => {
      clearTimeout(show)
      clearTimeout(hide)
    }
  }, [pathname])

  if (!message) {
    return null
  }

  return (
    <div
      data-testid="notification"
      className="mx-6 my-4 rounded border border-emerald-300 bg-emerald-100 px-4 py-2 text-emerald-800"
    >
      {message}
    </div>
  )
}

export default Notification
