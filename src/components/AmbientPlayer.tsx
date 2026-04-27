import { useState, useRef, useEffect } from 'react'

interface Sound {
  id: string
  label: string
  emoji: string
  color: string
  generate: (ctx: AudioContext, destination: AudioNode) => { cleanup: () => void }
}

function makeRain(ctx: AudioContext, destination: AudioNode) {
  const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  const source = ctx.createBufferSource()
  source.buffer = buffer
  source.loop = true
  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = 1200
  filter.Q.value = 0.3
  const gain = ctx.createGain()
  gain.gain.value = 0.18
  source.connect(filter)
  filter.connect(gain)
  gain.connect(destination)
  source.start()
  return { cleanup: () => source.stop() }
}

function makeFireplace(ctx: AudioContext, destination: AudioNode) {
  const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  const source = ctx.createBufferSource()
  source.buffer = buffer
  source.loop = true
  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 500
  const gain = ctx.createGain()
  gain.gain.value = 0.22
  source.connect(filter)
  filter.connect(gain)
  gain.connect(destination)
  source.start()
  return { cleanup: () => source.stop() }
}

function makeCafe(ctx: AudioContext, destination: AudioNode) {
  const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  const source = ctx.createBufferSource()
  source.buffer = buffer
  source.loop = true
  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = 400
  filter.Q.value = 1.5
  const gain = ctx.createGain()
  gain.gain.value = 0.1
  source.connect(filter)
  filter.connect(gain)
  gain.connect(destination)
  source.start()
  return { cleanup: () => source.stop() }
}

function makeForest(ctx: AudioContext, destination: AudioNode) {
  const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  const source = ctx.createBufferSource()
  source.buffer = buffer
  source.loop = true
  const filter = ctx.createBiquadFilter()
  filter.type = 'highpass'
  filter.frequency.value = 800
  const gain = ctx.createGain()
  gain.gain.value = 0.07
  source.connect(filter)
  filter.connect(gain)
  gain.connect(destination)
  source.start()
  return { cleanup: () => source.stop() }
}

const SOUNDS: Sound[] = [
  { id: 'rain', label: 'Rain', emoji: '🌧️', color: '#7b9eb5', generate: makeRain },
  { id: 'fire', label: 'Fireplace', emoji: '🔥', color: '#c97b4b', generate: makeFireplace },
  { id: 'cafe', label: 'Café', emoji: '☕', color: '#a0856c', generate: makeCafe },
  { id: 'forest', label: 'Forest', emoji: '🌿', color: '#6a9b72', generate: makeForest },
]

export default function AmbientPlayer() {
  const [active, setActive] = useState<string | null>(null)
  const [volume, setVolume] = useState(0.7)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const cleanupRef = useRef<(() => void) | null>(null)
  const gainRef = useRef<GainNode | null>(null)

  useEffect(() => {
    return () => {
      cleanupRef.current?.()
      cleanupRef.current = null
      gainRef.current = null

      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {
          // Context close can fail if browser blocks audio APIs.
        })
      }
    }
  }, [])

  useEffect(() => {
    if (gainRef.current) gainRef.current.gain.value = volume
  }, [volume])

  const toggle = (sound: Sound) => {
    if (active === sound.id) {
      cleanupRef.current?.()
      cleanupRef.current = null
      setActive(null)
      return
    }

    cleanupRef.current?.()
    cleanupRef.current = null

    if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
      audioCtxRef.current = new AudioContext()
    }
    const ctx = audioCtxRef.current
    if (ctx.state === 'suspended') ctx.resume()

    const masterGain = ctx.createGain()
    masterGain.gain.value = volume
    masterGain.connect(ctx.destination)
    gainRef.current = masterGain

    const { cleanup } = sound.generate(ctx, masterGain)
    cleanupRef.current = cleanup
    setActive(sound.id)
  }

  const stopAll = () => {
    cleanupRef.current?.()
    cleanupRef.current = null
    setActive(null)
  }

  return (
    <div className="ambient">
      <h2 className="card-title">Ambience</h2>
      <div className="sound-grid">
        {SOUNDS.map(s => (
          <button
            key={s.id}
            className={`sound-btn ${active === s.id ? 'active' : ''}`}
            style={{ '--accent': s.color } as React.CSSProperties}
            onClick={() => toggle(s)}
          >
            <span className="sound-emoji">{s.emoji}</span>
            <span className="sound-label">{s.label}</span>
            {active === s.id && <span className="playing-dot" />}
          </button>
        ))}
      </div>

      <p className="ambient-status" aria-live="polite">
        {active ? `Now playing: ${SOUNDS.find(sound => sound.id === active)?.label}` : 'Silence mode'}
      </p>

      <div className="volume-row">
        <span className="vol-label">🔈</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={e => setVolume(parseFloat(e.target.value))}
          className="vol-slider"
        />
        <span className="vol-label">🔊</span>
      </div>

      <button className="ctrl-btn secondary" onClick={stopAll} disabled={!active}>
        stop audio
      </button>
    </div>
  )
}
