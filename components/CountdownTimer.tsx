'use client'

import { useState, useEffect } from 'react'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

interface CountdownTimerProps {
  targetDate: string
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null)
  const [isPast, setIsPast] = useState(false)

  useEffect(() => {
    const calculate = () => {
      const diff = new Date(targetDate).getTime() - Date.now()
      if (diff <= 0) {
        setIsPast(true)
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      })
    }
    calculate()
    const interval = setInterval(calculate, 1000)
    return () => clearInterval(interval)
  }, [targetDate])

  if (!timeLeft) return null

  if (isPast) {
    return (
      <p className="text-2xl font-bold text-accent">
        Le festival est en cours ! 🎉
      </p>
    )
  }

  const units = [
    { label: 'Jours', value: timeLeft.days },
    { label: 'Heures', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Secondes', value: timeLeft.seconds },
  ]

  return (
    <div className="flex gap-3 sm:gap-6 justify-center flex-wrap" aria-live="polite" aria-label="Décompte avant le festival">
      {units.map(({ label, value }) => (
        <div key={label} className="flex flex-col items-center">
          <div className="bg-white/20 backdrop-blur rounded-2xl w-20 sm:w-24 h-20 sm:h-24 flex items-center justify-center">
            <span className="text-3xl sm:text-4xl font-bold tabular-nums">
              {String(value).padStart(2, '0')}
            </span>
          </div>
          <span className="text-sm mt-2 font-medium opacity-80">{label}</span>
        </div>
      ))}
    </div>
  )
}
