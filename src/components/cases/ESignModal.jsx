import { useRef, useState, useEffect } from 'react'

export default function ESignModal({ onClose, onSign }) {
  const [mode, setMode] = useState('draw') // 'draw' | 'type'
  const [typedSig, setTypedSig] = useState('')
  const [fontStyle, setFontStyle] = useState('cursive')
  const canvasRef = useRef(null)
  const drawing = useRef(false)
  const lastPos = useRef(null)

  useEffect(() => {
    if (mode === 'draw') clearCanvas()
  }, [mode])

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect()
    const src = e.touches ? e.touches[0] : e
    return { x: src.clientX - rect.left, y: src.clientY - rect.top }
  }

  const startDraw = (e) => {
    e.preventDefault()
    drawing.current = true
    const canvas = canvasRef.current
    lastPos.current = getPos(e, canvas)
  }

  const draw = (e) => {
    e.preventDefault()
    if (!drawing.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const pos = getPos(e, canvas)
    ctx.beginPath()
    ctx.moveTo(lastPos.current.x, lastPos.current.y)
    ctx.lineTo(pos.x, pos.y)
    ctx.strokeStyle = '#1e1b4b'
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.stroke()
    lastPos.current = pos
  }

  const stopDraw = () => { drawing.current = false }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  const isCanvasEmpty = () => {
    const canvas = canvasRef.current
    if (!canvas) return true
    const ctx = canvas.getContext('2d')
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
    return !data.some(v => v !== 0)
  }

  const handleSign = () => {
    if (mode === 'draw' && isCanvasEmpty()) return
    if (mode === 'type' && !typedSig.trim()) return
    onSign()
  }

  const fonts = [
    { label: 'Cursive', value: 'cursive' },
    { label: 'Serif', value: 'Georgia, serif' },
    { label: 'Script', value: '"Brush Script MT", cursive' },
  ]

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="bg-[#351159] rounded-t-2xl px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-white font-bold">E-Sign Document</p>
            <p className="text-indigo-200 text-xs mt-0.5">Add your signature to proceed</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Mode toggle */}
          <div className="flex bg-gray-100 rounded-xl p-1">
            {['draw', 'type'].map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all capitalize ${mode === m ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500'}`}
              >
                {m === 'draw' ? '✏️ Draw' : '⌨️ Type'}
              </button>
            ))}
          </div>

          {mode === 'draw' && (
            <div>
              <p className="text-xs text-gray-400 mb-2">Draw your signature below</p>
              <div className="border-2 border-dashed border-indigo-200 rounded-xl overflow-hidden bg-indigo-50/30 relative">
                <canvas
                  ref={canvasRef}
                  width={380}
                  height={140}
                  className="w-full touch-none cursor-crosshair"
                  onMouseDown={startDraw}
                  onMouseMove={draw}
                  onMouseUp={stopDraw}
                  onMouseLeave={stopDraw}
                  onTouchStart={startDraw}
                  onTouchMove={draw}
                  onTouchEnd={stopDraw}
                />
                <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                  <div className="w-32 h-px bg-indigo-200" />
                </div>
              </div>
              <button onClick={clearCanvas} className="mt-2 text-xs text-gray-400 hover:text-red-500 transition-colors">
                Clear
              </button>
            </div>
          )}

          {mode === 'type' && (
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-400 mb-2">Type your full name</p>
                <input
                  type="text"
                  value={typedSig}
                  onChange={e => setTypedSig(e.target.value)}
                  placeholder="Your full name"
                  className="input-field"
                />
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-2">Choose font style</p>
                <div className="flex gap-2">
                  {fonts.map(f => (
                    <button
                      key={f.value}
                      onClick={() => setFontStyle(f.value)}
                      className={`flex-1 py-2 text-sm border rounded-xl transition-all ${fontStyle === f.value ? 'border-indigo-400 bg-indigo-50 text-indigo-600' : 'border-gray-200 text-gray-600'}`}
                      style={{ fontFamily: f.value }}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
              {typedSig && (
                <div className="border-2 border-dashed border-indigo-200 rounded-xl p-4 bg-indigo-50/30 text-center">
                  <p style={{ fontFamily: fontStyle, fontSize: '28px', color: '#1e1b4b' }}>{typedSig}</p>
                  <div className="w-32 h-px bg-indigo-200 mx-auto mt-2" />
                </div>
              )}
            </div>
          )}

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
            By signing, you confirm that this is your legal signature and you agree to the terms of the notarization.
          </div>

          <div className="flex gap-3">
            <button onClick={onClose} className="btn-secondary py-2.5 text-sm">Cancel</button>
            <button
              onClick={handleSign}
              disabled={mode === 'draw' ? false : !typedSig.trim()}
              className="btn-primary py-2.5 text-sm disabled:opacity-40"
            >
              Apply Signature
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
