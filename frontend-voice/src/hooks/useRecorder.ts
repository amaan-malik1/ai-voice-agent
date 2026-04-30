import { useRef, useState, useCallback } from 'react'

export type RecorderStatus = 'idle' | 'recording' | 'stopped'

export function useRecorder() {
  const [status, setStatus]         = useState<RecorderStatus>('idle')
  const [audioBlob, setAudioBlob]   = useState<Blob | null>(null)
  const [error, setError]           = useState<string | null>(null)
  const [audioLevel, setAudioLevel] = useState(0)

  const mrRef      = useRef<MediaRecorder | null>(null)
  const chunksRef  = useRef<Blob[]>([])
  const analyserRef = useRef<AnalyserNode | null>(null)
  const rafRef     = useRef<number>(0)

  const trackLevel = useCallback(() => {
    if (!analyserRef.current) return
    const data = new Uint8Array(analyserRef.current.fftSize)
    analyserRef.current.getByteTimeDomainData(data)
    let sum = 0
    for (const v of data) sum += Math.abs(v - 128)
    setAudioLevel(Math.min(100, (sum / data.length) * 6))
    rafRef.current = requestAnimationFrame(trackLevel)
  }, [])

  const start = useCallback(async () => {
    setError(null)
    setAudioBlob(null)
    chunksRef.current = []
    try {
      const stream   = await navigator.mediaDevices.getUserMedia({ audio: true })
      const ctx      = new AudioContext()
      const source   = ctx.createMediaStreamSource(stream)
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 256
      source.connect(analyser)
      analyserRef.current = analyser

      const mr = new MediaRecorder(stream, { mimeType: 'audio/webm' })
      mrRef.current = mr
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      mr.onstop = () => {
        setAudioBlob(new Blob(chunksRef.current, { type: 'audio/webm' }))
        stream.getTracks().forEach(t => t.stop())
        cancelAnimationFrame(rafRef.current)
        setAudioLevel(0)
        ctx.close()
      }
      mr.start(100)
      setStatus('recording')
      rafRef.current = requestAnimationFrame(trackLevel)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Mic access denied')
    }
  }, [trackLevel])

  const stop = useCallback(() => {
    if (mrRef.current && status === 'recording') {
      mrRef.current.stop()
      setStatus('stopped')
    }
  }, [status])

  return { status, start, stop, audioBlob, error, audioLevel }
}
