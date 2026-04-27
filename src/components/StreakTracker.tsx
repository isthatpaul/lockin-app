interface Props {
  sessionCount: number
  focusMinutesToday: number
}

export default function StreakTracker({ sessionCount: count, focusMinutesToday }: Props) {
  const getMessage = () => {
    if (count === 0) return 'ready to lock in?'
    if (count === 1) return 'great start!'
    if (count < 4) return `${count} sessions deep 🔥`
    if (count < 8) return `on a roll! ${count} sessions`
    return `beast mode: ${count} sessions 🏆`
  }

  return (
    <div className="streak">
      <div className="streak-flames">
        {Array.from({ length: Math.min(count, 8) }).map((_, i) => (
          <span
            key={i}
            className="flame"
            style={{ animationDelay: `${i * 0.1}s`, opacity: 1 - i * 0.08 }}
          >
            🔥
          </span>
        ))}
        {count === 0 && <span className="flame dim">🕯️</span>}
      </div>
      <span className="streak-msg">{getMessage()} • {focusMinutesToday} min today</span>
    </div>
  )
}
