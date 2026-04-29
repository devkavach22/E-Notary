// Indian Non-Judicial Stamp Paper — pixel-perfect, govType-aware

function renderLayout(layout, formValues, dateStrLong) {
  if (!layout) return ''
  const today = new Date()
  const dateStr = today.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })
  let html = layout
  // Replace {{Date}} and {{Place}} special tokens
  html = html.replace(/\{\{Date\}\}/g, dateStrLong || dateStr)
  html = html.replace(/\{\{Place\}\}/g, formValues?.['Place'] || formValues?.['place'] || '___________')
  // Replace all {{Key}} placeholders from formValues
  if (formValues) {
    Object.entries(formValues).forEach(([key, value]) => {
      const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      html = html.replace(new RegExp(`\\{\\{${escaped}\\}\\}`, 'g'), value || `<span style="display:inline-block;min-width:80px;border-bottom:1px solid #999;">&nbsp;</span>`)
    })
  }
  // Replace any remaining unfilled placeholders with blank underline
  html = html.replace(/\{\{[^}]+\}\}/g, '<span style="display:inline-block;min-width:80px;border-bottom:1px solid #999;">&nbsp;</span>')
  return html
}

export default function NotaryDocPreview({
  selectedTemplate, formValues, templatesMeta,
  preview = false, paid = false, signatureData = null,
  govType = 'central',
}) {
  const docId      = selectedTemplate?._id ? selectedTemplate._id.slice(-8).toUpperCase() : 'CS740001'
  const today      = new Date()
  const dateStr    = today.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })
  const dateStrLong = today.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
  const advocateName = templatesMeta?.advocateName || 'E-Notary Advocate'

  // ── govType theme ──────────────────────────────────────────────
  const isCentral      = govType !== 'state'
  const MAROON         = isCentral ? '#8B0000' : '#1B5E20'
  const MAGENTA        = isCentral ? '#D81B60' : '#2E7D32'
  const TEAL           = isCentral ? '#00838F' : '#00695C'
  const NAVY           = '#1A237E'
  const RED_SER        = '#C62828'
  const authorityHindi = isCentral ? 'भारतीय गैर न्यायिक' : 'राज्य गैर न्यायिक'
  const authorityEng   = isCentral ? 'INDIA NON JUDICIAL' : 'STATE NON JUDICIAL'
  const bharatLine     = isCentral ? 'भारत INDIA' : 'राज्य सरकार'
  const govLabel       = isCentral ? 'GOVT. OF INDIA' : 'STATE GOVERNMENT'
  const headerBg       = isCentral
    ? 'linear-gradient(180deg,#7a0000 0%,#a00000 40%,#7a0000 100%)'
    : 'linear-gradient(180deg,#1b5e20 0%,#2e7d32 40%,#1b5e20 100%)'
  // ──────────────────────────────────────────────────────────────

  const val = (fieldName) => {
    if (!formValues) return ''
    const key = Object.keys(formValues).find(k => k.toLowerCase() === fieldName.toLowerCase())
    return key ? (formValues[key] || '') : ''
  }

  const city  = val('city') || 'Delhi'
  const state = val('state') || 'Delhi'

  const s = (n) => preview ? Math.round(n * 0.62) : n

  return (
    <div style={{ width: '100%', maxWidth: preview ? '100%' : 700, margin: '0 auto', background: '#fff', fontFamily: 'Georgia, serif', fontSize: s(13) }}>

      {/* ── TOP ORNATE BORDER ── */}
      <div style={{ height: s(10), background: MAROON, position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='10' viewBox='0 0 20 10' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolygon points='10,1 19,5 10,9 1,5' fill='none' stroke='rgba(255,200,100,0.55)' stroke-width='0.8'/%3E%3C/svg%3E")`,
          backgroundSize: '20px 10px'
        }} />
      </div>

      {/* ── MAIN HEADER ── */}
      <div style={{ background: headerBg, padding: `${s(10)}px ${s(18)}px ${s(8)}px`, position: 'relative', overflow: 'hidden' }}>

        {/* Dot watermark */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='8' cy='8' r='1.8' fill='rgba(255,255,255,0.13)'/%3E%3C/svg%3E")`,
          backgroundSize: '16px 16px'
        }} />

        {/* Hindi authority title */}
        <div style={{ textAlign: 'center', marginBottom: s(6), position: 'relative' }}>
          <span style={{ color: MAGENTA, fontWeight: 900, fontSize: s(20), fontFamily: 'serif', letterSpacing: s(2) }}>
            {authorityHindi}
          </span>
        </div>

        {/* Three-column denomination row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>

          {/* LEFT */}
          <div style={{ minWidth: s(110), textAlign: 'left' }}>
            <div style={{ color: MAGENTA, fontWeight: 700, fontSize: s(14), fontFamily: 'serif' }}>एक सौ रुपये</div>
            <div style={{ color: MAGENTA, fontWeight: 900, fontSize: s(26), lineHeight: 1.1, marginTop: s(2) }}>रु. 100</div>
          </div>

          {/* CENTER — Ashoka Stambh */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            <div style={{
              width: s(96), height: s(96), borderRadius: '50%',
              border: `${s(3)}px solid rgba(255,180,100,0.6)`,
              background: isCentral
                ? 'radial-gradient(circle,rgba(100,0,0,0.5) 0%,rgba(60,0,0,0.7) 100%)'
                : 'radial-gradient(circle,rgba(0,60,0,0.5) 0%,rgba(0,40,0,0.7) 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 0 ${s(14)}px rgba(255,150,50,0.25), inset 0 0 ${s(10)}px rgba(0,0,0,0.3)`
            }}>
              <svg viewBox="0 0 100 100" width={s(82)} height={s(82)}>
                {/* Outer dashed ring */}
                <circle cx="50" cy="50" r="46" fill="none" stroke={MAGENTA} strokeWidth="1.5" strokeDasharray="3,2" />
                <circle cx="50" cy="50" r="40" fill="none" stroke={MAGENTA} strokeWidth="0.8" />

                {/* Ashoka Chakra — 24 spokes */}
                <circle cx="50" cy="63" r="10" fill="none" stroke={MAGENTA} strokeWidth="1.2" />
                {Array.from({ length: 24 }).map((_, i) => {
                  const a = (i * 15 * Math.PI) / 180
                  return <line key={i}
                    x1={50 + 4 * Math.cos(a)} y1={63 + 4 * Math.sin(a)}
                    x2={50 + 9.5 * Math.cos(a)} y2={63 + 9.5 * Math.sin(a)}
                    stroke={MAGENTA} strokeWidth="0.8" />
                })}
                <circle cx="50" cy="63" r="2.5" fill={MAGENTA} />

                {/* Abacus base */}
                <rect x="30" y="56" width="40" height="4.5" rx="1.5" fill={MAGENTA} />

                {/* Three lion bodies */}
                <ellipse cx="37" cy="48" rx="5.5" ry="7" fill={MAGENTA} />
                <ellipse cx="50" cy="46" rx="5.5" ry="8" fill={MAGENTA} />
                <ellipse cx="63" cy="48" rx="5.5" ry="7" fill={MAGENTA} />

                {/* Lion heads */}
                <circle cx="37" cy="40" r="5" fill={MAGENTA} />
                <circle cx="50" cy="37" r="5.5" fill={MAGENTA} />
                <circle cx="63" cy="40" r="5" fill={MAGENTA} />

                {/* Manes */}
                <circle cx="37" cy="40" r="7" fill="none" stroke={MAGENTA} strokeWidth="1.8" />
                <circle cx="50" cy="37" r="7.5" fill="none" stroke={MAGENTA} strokeWidth="1.8" />
                <circle cx="63" cy="40" r="7" fill="none" stroke={MAGENTA} strokeWidth="1.8" />

                {/* Eyes */}
                <circle cx="35.5" cy="39" r="0.9" fill={isCentral ? '#8B0000' : '#1B5E20'} />
                <circle cx="38.5" cy="39" r="0.9" fill={isCentral ? '#8B0000' : '#1B5E20'} />
                <circle cx="48.5" cy="36" r="0.9" fill={isCentral ? '#8B0000' : '#1B5E20'} />
                <circle cx="51.5" cy="36" r="0.9" fill={isCentral ? '#8B0000' : '#1B5E20'} />
                <circle cx="61.5" cy="39" r="0.9" fill={isCentral ? '#8B0000' : '#1B5E20'} />
                <circle cx="64.5" cy="39" r="0.9" fill={isCentral ? '#8B0000' : '#1B5E20'} />

                {/* Satyamev Jayate */}
                <text x="50" y="78" textAnchor="middle" fontSize="5" fill={MAGENTA} fontWeight="bold" fontFamily="serif">सत्यमेव जयते</text>
              </svg>
            </div>

            {/* भारत INDIA / राज्य सरकार */}
            <div style={{ color: MAGENTA, fontWeight: 900, fontSize: s(13), letterSpacing: s(3), marginTop: s(4), textAlign: 'center' }}>
              {bharatLine}
            </div>
          </div>

          {/* RIGHT */}
          <div style={{ minWidth: s(110), textAlign: 'right' }}>
            <div style={{ color: MAGENTA, fontWeight: 700, fontSize: s(14) }}>Rs. 100</div>
            <div style={{ color: MAGENTA, fontWeight: 900, fontSize: s(15), lineHeight: 1.3, marginTop: s(2) }}>
              ONE<br />HUNDRED RUPEES
            </div>
          </div>
        </div>

        {/* Binary / teal watermark strip */}
        <div style={{
          textAlign: 'center', color: TEAL, fontSize: s(7),
          fontFamily: 'monospace', letterSpacing: 1,
          margin: `${s(8)}px 0 ${s(4)}px`,
          overflow: 'hidden', whiteSpace: 'nowrap', opacity: 0.9
        }}>
          100100100100100100100100100100100100100100100100100100100100100100100100100100100100100100
        </div>

        {/* Large bharatLine repeat */}
        <div style={{ textAlign: 'center', marginBottom: s(4) }}>
          <div style={{ color: MAGENTA, fontWeight: 900, fontSize: s(16), letterSpacing: s(4), fontFamily: 'serif' }}>
            {bharatLine}
          </div>
        </div>

        {/* Authority banner */}
        <div style={{
          background: 'rgba(0,0,0,0.22)',
          borderTop: '1px solid rgba(255,180,80,0.35)',
          borderBottom: '1px solid rgba(255,180,80,0.35)',
          padding: `${s(4)}px 0`, textAlign: 'center'
        }}>
          <span style={{ color: MAGENTA, fontWeight: 900, fontSize: s(16), letterSpacing: s(5) }}>
            {authorityEng}
          </span>
        </div>
      </div>

      {/* ── BOTTOM ORNATE BORDER ── */}
      <div style={{ height: s(10), background: MAROON, position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='10' viewBox='0 0 20 10' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolygon points='10,1 19,5 10,9 1,5' fill='none' stroke='rgba(255,200,100,0.55)' stroke-width='0.8'/%3E%3C/svg%3E")`,
          backgroundSize: '20px 10px'
        }} />
      </div>

      {/* ── STATE + SERIAL BAR ── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: `${s(5)}px ${s(18)}px`, background: '#f5f5f5',
        borderBottom: '1px solid #ccc', fontSize: s(11)
      }}>
        <span style={{ fontWeight: 700, color: '#333', fontFamily: 'serif' }}>
          {state.toUpperCase()} &nbsp;·&nbsp; {govLabel}
        </span>
        <span style={{ fontWeight: 900, color: RED_SER, fontSize: s(13), letterSpacing: 1 }}>{docId}</span>
      </div>

      {/* ── CIRCULAR STAMP + VENDOR INFO ── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: `${s(10)}px ${s(18)}px`, background: '#fff', borderBottom: '1px solid #ddd'
      }}>
        <svg viewBox="0 0 110 110" width={s(90)} height={s(90)}>
          <circle cx="55" cy="55" r="50" fill="none" stroke="#555" strokeWidth="2" />
          <circle cx="55" cy="55" r="42" fill="none" stroke="#555" strokeWidth="0.8" />
          <path id="ca" d="M 13 55 A 42 42 0 0 1 97 55" fill="none" />
          <path id="cb" d="M 15 62 A 42 42 0 0 0 95 62" fill="none" />
          <text style={{ fontSize: '7.5px', fill: '#333', fontWeight: 'bold', fontFamily: 'serif' }}>
            <textPath href="#ca" startOffset="4%">{state.toUpperCase()} • {isCentral ? 'CENTRAL' : 'STATE'} NOTARY</textPath>
          </text>
          <text style={{ fontSize: '7px', fill: '#333', fontFamily: 'serif' }}>
            <textPath href="#cb" startOffset="10%">GOVT. REGISTERED • VERIFIED</textPath>
          </text>
          <text x="55" y="50" textAnchor="middle" style={{ fontSize: '10px', fill: '#222', fontWeight: 'bold', fontFamily: 'serif' }}>E-NOT</text>
          <text x="55" y="62" textAnchor="middle" style={{ fontSize: '9px', fill: '#222', fontFamily: 'serif' }}>ARY</text>
        </svg>

        <div style={{ textAlign: 'right', color: NAVY, fontSize: s(10), lineHeight: 1.6 }}>
          <div style={{ fontStyle: 'italic', fontSize: s(13), fontWeight: 700 }}>{advocateName}</div>
          <div style={{ fontWeight: 700, textTransform: 'uppercase' }}>{advocateName}</div>
          <div>NOTARY ADVOCATE</div>
          <div>L.No. EN-{docId}/2024</div>
          <div>Dt. {dateStr}</div>
        </div>
      </div>

      {/* ── DOCUMENT BODY ── */}
      <div style={{
        padding: `${s(16)}px ${s(22)}px`,
        borderLeft: `${s(5)}px solid ${MAROON}`,
        borderRight: `${s(5)}px solid ${MAROON}`,
        background: '#fff', lineHeight: 1.85,
        fontSize: s(12), color: '#111', fontFamily: 'Georgia, serif'
      }}>
        {selectedTemplate?.templateLayout
          ? <div
              className="template-body"
              style={{ fontSize: s(12) }}
              dangerouslySetInnerHTML={{ __html: renderLayout(selectedTemplate.templateLayout, formValues, dateStrLong) }}
            />
          : <p style={{ color: '#aaa', textAlign: 'center' }}>No template content available.</p>
        }

        {/* Notary stamp */}
        <div style={{ marginTop: s(20), display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          {paid ? (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <svg viewBox="0 0 100 100" width={s(90)} height={s(90)}>
                  <circle cx="50" cy="50" r="46" fill="none" stroke={NAVY} strokeWidth="2.5" />
                  <circle cx="50" cy="50" r="38" fill="none" stroke={NAVY} strokeWidth="1" />
                  <path id="ta" d="M 12 50 A 38 38 0 0 1 88 50" fill="none" />
                  <path id="ba" d="M 15 56 A 36 36 0 0 0 85 56" fill="none" />
                  <text style={{ fontSize: '7.5px', fill: NAVY, fontWeight: 'bold' }}>
                    <textPath href="#ta" startOffset="8%">NOTARY PUBLIC • {govLabel}</textPath>
                  </text>
                  <text style={{ fontSize: '6.5px', fill: NAVY }}>
                    <textPath href="#ba" startOffset="12%">{state.toUpperCase()} • ATTESTED</textPath>
                  </text>
                  <text x="50" y="46" textAnchor="middle" style={{ fontSize: '9px', fill: NAVY, fontWeight: 'bold' }}>E-NOTARY</text>
                  <text x="50" y="58" textAnchor="middle" style={{ fontSize: '7px', fill: NAVY }}>VERIFIED</text>
                </svg>
                <div style={{ fontSize: s(9), fontWeight: 700, color: NAVY, marginTop: s(2) }}>ATTESTED</div>
              </div>
              <div style={{ textAlign: 'right', fontSize: s(10), color: NAVY }}>
                <div style={{ fontWeight: 700, fontSize: s(12) }}>Notary Public</div>
                <div>Appt. by {govLabel}</div>
                <div>Regn. No: EN-{docId}</div>
                <div style={{ fontWeight: 700, marginTop: s(4) }}>{dateStrLong}</div>
              </div>
            </>
          ) : (
            <div style={{ width: '100%', border: '2px dashed #ccc', borderRadius: s(8), padding: s(12), textAlign: 'center', color: '#aaa', fontSize: s(11) }}>
              🔒 Official notary stamp will appear here after payment
            </div>
          )}
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: `${s(6)}px ${s(18)}px`, background: '#f5f5f5',
        borderTop: `${s(3)}px solid ${MAROON}`,
        fontSize: s(9), color: '#666', fontFamily: 'Georgia, serif'
      }}>
        <span>Doc ID: <strong style={{ color: '#333' }}>{docId}</strong></span>
        <span style={{ fontWeight: 900, color: MAROON, letterSpacing: 1 }}>E-NOTARY PLATFORM</span>
        <span>{dateStr}</span>
      </div>
    </div>
  )
}
