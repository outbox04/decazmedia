'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Page() {
  const params = useParams()
  const slug = params.slug as string

  const [photos, setPhotos] = useState<any[]>([])
  const [selected, setSelected] = useState<number[]>([])
  const [notes, setNotes] = useState<Record<number, string>>({})
  const [current, setCurrent] = useState<number | null>(null)
  const [sent, setSent] = useState(false)
  const [activeTab, setActiveTab] = useState<'all' | 'selected'>('all')
  const nextPhoto = () => {
  if (current === null) return

  setCurrent(
    current < photos.length - 1
      ? current + 1
      : 0
  )
}

const prevPhoto = () => {
  if (current === null) return

  setCurrent(
    current > 0
      ? current - 1
      : photos.length - 1
  )
}

  const searchParams = useSearchParams()
  const folderId = searchParams.get('fid')
  console.log('FOLDER ID:', folderId)

useEffect(() => {
  if (!folderId) {
    console.error('Missing folderId')
    return
  }

  const load = async () => {
    try {
      const res = await fetch(`/api/drive?folderId=${folderId}`)
      const data = await res.json()

      console.log('API DATA:', data)

      if (!Array.isArray(data)) {
        console.error('API lỗi:', data)
        return
      }

      const mapped = data.map((file: any, index: number) => ({
        id: index,
        code: file.name,
        url: `https://lh3.googleusercontent.com/d/${file.id}`
      }))

      setPhotos(mapped)
    } catch (err) {
      console.error('Fetch error:', err)
    }
  }

  load()
}, [folderId])

if (!folderId) {
  return <div className="text-white p-10">Thiếu folderId</div>
}

  const toggleSelect = (id: number) => {
    setSelected(old =>
      old.includes(id) ? old.filter(x => x !== id) : [...old, id]
    )
  }

  const submitRequest = async () => {
  if (selected.length === 0) {
    alert('Chọn ít nhất 1 ảnh')
    return
  }

  const result = selected.map(id => ({
    image: photos.find(p => p.id === id)?.code,
    note: notes[id] || ''
  }))

  await supabase.from('requests').insert({
    project_slug: slug,
    data: result
  })

  setSent(true)
}

  const displayedPhotos =
    activeTab === 'selected'
      ? photos.filter(p => selected.includes(p.id))
      : photos

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Montserrat:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --gold: #C9A84C;
          --gold-light: #E8C97A;
          --gold-dim: #8A6E32;
          --black: #080808;
          --surface: #0F0F0F;
          --surface2: #161616;
          --border: rgba(201,168,76,0.15);
          --border-hover: rgba(201,168,76,0.5);
          --text: #F0EAD6;
          --text-dim: rgba(240,234,214,0.45);
        }

        body { background: var(--black); }

        .page {
          min-height: 100vh;
          background: var(--black);
          color: var(--text);
          font-family: 'Montserrat', sans-serif;
          font-weight: 300;
        }

        /* ── HERO ── */
        .hero {
          position: relative;
          height: 380px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 48px 56px;
          overflow: hidden;
        }

        .hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 50% 120%, rgba(201,168,76,0.08) 0%, transparent 70%),
            linear-gradient(180deg, #080808 0%, #0a0900 100%);
        }

        .hero-line {
          position: absolute;
          top: 0; left: 56px; right: 56px;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--gold), transparent);
          opacity: 0.4;
        }

        .hero-ornament {
          position: absolute;
          top: 36px; right: 56px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          opacity: 0.35;
        }

        .hero-ornament span {
          display: block;
          width: 1px;
          background: var(--gold);
        }

        .hero-label {
          position: relative;
          font-family: 'Montserrat', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 16px;
          opacity: 0.8;
        }

        .hero-title {
          position: relative;
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.8rem, 5vw, 4.2rem);
          font-weight: 300;
          line-height: 1.05;
          letter-spacing: 0.06em;
          color: var(--text);
        }

        .hero-title em {
          font-style: italic;
          color: var(--gold-light);
        }

        .hero-meta {
          position: relative;
          margin-top: 20px;
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .hero-stat {
          display: flex;
          align-items: baseline;
          gap: 6px;
        }

        .hero-stat-number {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.6rem;
          font-weight: 400;
          color: var(--gold);
        }

        .hero-stat-label {
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--text-dim);
        }

        .hero-divider {
          width: 1px;
          height: 28px;
          background: var(--border);
        }

        /* ── PROGRESS BAR ── */
        .progress-wrap {
          position: relative;
          padding: 0 56px;
          margin-bottom: -1px;
        }

        .progress-track {
          height: 2px;
          background: var(--surface2);
          border-radius: 1px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--gold-dim), var(--gold));
          border-radius: 1px;
          transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .progress-label {
          margin-top: 8px;
          font-size: 10px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--text-dim);
          text-align: right;
        }

        /* ── TOOLBAR ── */
        .toolbar {
          position: sticky;
          top: 0;
          z-index: 20;
          background: rgba(8,8,8,0.92);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
          padding: 0 56px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 64px;
        }

        .tabs {
          display: flex;
          gap: 2px;
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 4px;
          padding: 3px;
        }

        .tab {
          padding: 6px 20px;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          border: none;
          background: transparent;
          color: var(--text-dim);
          cursor: pointer;
          border-radius: 2px;
          transition: all 0.2s;
          font-family: 'Montserrat', sans-serif;
        }

        .tab.active {
          background: var(--gold);
          color: #000;
        }

        .btn-submit {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 28px;
          background: transparent;
          border: 1px solid var(--gold-dim);
          color: var(--gold);
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          cursor: pointer;
          border-radius: 2px;
          transition: all 0.25s;
          position: relative;
          overflow: hidden;
        }

        .btn-submit::before {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--gold);
          transform: translateX(-100%);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .btn-submit:hover::before { transform: translateX(0); }
        .btn-submit:hover { color: #000; border-color: var(--gold); }

        .btn-submit span { position: relative; z-index: 1; }
        .btn-submit .count-badge {
          position: relative;
          z-index: 1;
          background: var(--gold);
          color: #000;
          font-size: 10px;
          font-weight: 700;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.25s, color 0.25s;
        }
        .btn-submit:hover .count-badge { background: #000; color: var(--gold); }

        /* ── GRID ── */
        .grid-section {
          padding: 40px 56px 80px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        @media (max-width: 1100px) { .grid-section { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px) {
          .grid-section { grid-template-columns: 1fr; padding: 24px 20px; }
          .hero { padding: 32px 24px; }
          .toolbar { padding: 0 20px; }
          .progress-wrap { padding: 0 24px; }
        }

        .photo-card {
          position: relative;
          border-radius: 3px;
          overflow: hidden;
          background: var(--surface);
          border: 1px solid var(--border);
          transition: border-color 0.3s, transform 0.3s;
          cursor: pointer;
          opacity: 0;
          transform: translateY(16px);
          animation: fadeUp 0.5s ease forwards;
        }

        @keyframes fadeUp {
          to { opacity: 1; transform: translateY(0); }
        }

        .photo-card:hover { border-color: var(--border-hover); transform: translateY(-2px); }
        .photo-card.is-selected { border-color: var(--gold); }

        .photo-card.is-selected::after {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(201,168,76,0.06);
          pointer-events: none;
        }

        .photo-img-wrap {
          position: relative;
          overflow: hidden;
          aspect-ratio: 3/4;
        }

        .photo-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          display: block;
        }

        .photo-card:hover .photo-img-wrap img { transform: scale(1.04); }

        .photo-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.7) 100%);
          opacity: 0;
          transition: opacity 0.3s;
          display: flex;
          align-items: flex-end;
          padding: 20px;
        }

        .photo-card:hover .photo-overlay { opacity: 1; }

        .overlay-view {
          font-size: 10px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--gold-light);
          font-weight: 500;
        }

        .selected-badge {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 28px;
          height: 28px;
          background: var(--gold);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transform: scale(0.6);
          transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .selected-badge.visible { opacity: 1; transform: scale(1); }

        .selected-badge svg { width: 14px; height: 14px; color: #000; }

        .photo-footer {
          padding: 14px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid var(--border);
        }

        .photo-code {
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          letter-spacing: 0.15em;
          color: var(--text-dim);
          text-transform: uppercase;
        }

        .btn-select {
          padding: 6px 16px;
          font-family: 'Montserrat', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          border-radius: 2px;
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid var(--border);
          background: transparent;
          color: var(--text-dim);
        }

        .btn-select:hover { border-color: var(--gold-dim); color: var(--gold); }
        .btn-select.selected { background: var(--gold); color: #000; border-color: var(--gold); font-weight: 600; }

        /* ── LIGHTBOX ── */
        .lightbox {
          position: fixed;
          inset: 0;
          z-index: 50;
          background: rgba(4,4,4,0.97);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .lb-close {
          position: absolute;
          top: 24px; right: 28px;
          background: none;
          border: 1px solid var(--border);
          color: var(--text-dim);
          width: 40px; height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 18px;
          transition: all 0.2s;
          z-index: 10;
        }

        .lb-close:hover { border-color: var(--gold); color: var(--gold); }

        .lb-nav {
          position: absolute;
          top: 50%; transform: translateY(-50%);
          background: none;
          border: 1px solid var(--border);
          color: var(--text-dim);
          width: 44px; height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 22px;
          transition: all 0.2s;
          z-index: 10;
        }

        .lb-nav:hover { border-color: var(--gold); color: var(--gold); }
        .lb-nav.prev { left: 24px; }
        .lb-nav.next { right: 24px; }

        .lb-content {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 28px;
          max-width: 1100px;
          width: calc(100% - 160px);
          max-height: 90vh;
        }

        @media (max-width: 900px) {
          .lb-content { grid-template-columns: 1fr; width: calc(100% - 48px); }
          .lb-nav.prev { left: 8px; }
          .lb-nav.next { right: 8px; }
        }

        .lb-img-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border-radius: 3px;
        }

        .lb-img-wrap img {
          max-height: 85vh;
          max-width: 100%;
          object-fit: contain;
          border-radius: 3px;
        }

        .lb-panel {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 3px;
          padding: 28px 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .lb-panel-top { border-bottom: 1px solid var(--border); padding-bottom: 20px; }

        .lb-code-label {
          font-size: 9px;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: var(--gold-dim);
          margin-bottom: 6px;
        }

        .lb-code {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.8rem;
          font-weight: 400;
          color: var(--text);
          letter-spacing: 0.06em;
        }

        .lb-counter {
          font-size: 10px;
          color: var(--text-dim);
          letter-spacing: 0.15em;
          margin-top: 4px;
        }

        .btn-select-lb {
          width: 100%;
          padding: 12px;
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          cursor: pointer;
          border-radius: 2px;
          transition: all 0.2s;
          border: 1px solid var(--border);
          background: transparent;
          color: var(--text-dim);
        }

        .btn-select-lb:hover { border-color: var(--gold-dim); color: var(--gold); }
        .btn-select-lb.selected { background: var(--gold); color: #000; border-color: var(--gold); font-weight: 600; }

        .lb-note-label {
          font-size: 9px;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: var(--gold-dim);
          margin-bottom: 8px;
        }

        .lb-textarea {
          width: 100%;
          flex: 1;
          min-height: 140px;
          background: var(--black);
          border: 1px solid var(--border);
          border-radius: 2px;
          padding: 12px 14px;
          color: var(--text);
          font-family: 'Montserrat', sans-serif;
          font-size: 12px;
          font-weight: 300;
          resize: none;
          outline: none;
          transition: border-color 0.2s;
        }

        .lb-textarea:focus { border-color: var(--gold-dim); }
        .lb-textarea::placeholder { color: var(--text-dim); }

        /* ── SUCCESS MODAL ── */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.85);
          z-index: 60;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.2s ease;
        }

        .modal-box {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 3px;
          padding: 52px 48px;
          text-align: center;
          max-width: 420px;
          width: 90%;
        }

        .modal-icon {
          width: 56px; height: 56px;
          border: 1px solid var(--gold-dim);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          color: var(--gold);
          font-size: 22px;
        }

        .modal-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem;
          font-weight: 400;
          color: var(--text);
          margin-bottom: 12px;
          letter-spacing: 0.06em;
        }

        .modal-sub {
          font-size: 12px;
          line-height: 1.7;
          color: var(--text-dim);
          letter-spacing: 0.05em;
          margin-bottom: 32px;
        }

        .btn-close-modal {
          padding: 12px 36px;
          background: transparent;
          border: 1px solid var(--gold-dim);
          color: var(--gold);
          font-family: 'Montserrat', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          cursor: pointer;
          border-radius: 2px;
          transition: all 0.2s;
        }

        .btn-close-modal:hover { background: var(--gold); color: #000; border-color: var(--gold); }

        /* ── EMPTY STATE ── */
        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 80px 20px;
        }

        .empty-state p {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.4rem;
          font-style: italic;
          color: var(--text-dim);
        }
      `}</style>

      <main className="page">

        {/* Hero */}
        <section className="hero">
          <div className="hero-line" />
          <div className="hero-ornament">
            <span style={{ height: 40 }} />
            <span style={{ height: 8 }} />
            <span style={{ height: 4 }} />
          </div>
          <p className="hero-label">Studio · Private Gallery</p>
          <h1 className="hero-title">
            Album <em>Khách Hàng</em>
          </h1>
          <div className="hero-meta">
            <div className="hero-stat">
              <span className="hero-stat-number">{photos.length}</span>
              <span className="hero-stat-label">Tổng ảnh</span>
            </div>
            <div className="hero-divider" />
            <div className="hero-stat">
              <span className="hero-stat-number" style={{ color: selected.length > 0 ? 'var(--gold)' : undefined }}>
                {selected.length}
              </span>
              <span className="hero-stat-label">Đã chọn</span>
            </div>
          </div>
        </section>

        {/* Progress */}
        {photos.length > 0 && (
          <div className="progress-wrap">
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${(selected.length / photos.length) * 100}%` }}
              />
            </div>
            <p className="progress-label">
              {selected.length > 0
                ? `${Math.round((selected.length / photos.length) * 100)}% đã chọn`
                : 'Chưa có ảnh nào được chọn'}
            </p>
          </div>
        )}

        {/* Toolbar */}
        <div className="toolbar">
          <div className="tabs">
            <button
              className={`tab${activeTab === 'all' ? ' active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              Tất cả
            </button>
            <button
              className={`tab${activeTab === 'selected' ? ' active' : ''}`}
              onClick={() => setActiveTab('selected')}
            >
              Đã chọn {selected.length > 0 && `(${selected.length})`}
            </button>
          </div>

          <button className="btn-submit" onClick={submitRequest}>
            <span>Gửi yêu cầu</span>
            {selected.length > 0 && (
              <span className="count-badge">{selected.length}</span>
            )}
          </button>
        </div>

        {/* Grid */}
        <section className="grid-section">
          {displayedPhotos.length === 0 && activeTab === 'selected' ? (
            <div className="empty-state">
              <p>Bạn chưa chọn ảnh nào</p>
            </div>
          ) : (
            displayedPhotos.map((p, index) => (
              <div
                key={p.id}
                className={`photo-card${selected.includes(p.id) ? ' is-selected' : ''}`}
                style={{ animationDelay: `${Math.min(index * 60, 600)}ms` }}
              >
                <div className="photo-img-wrap" onClick={() => setCurrent(photos.findIndex(ph => ph.id === p.id))}>
                  <img src={p.url} alt={p.code} loading="lazy" />
                  <div className="photo-overlay">
                    <span className="overlay-view">Xem ảnh</span>
                  </div>
                  <div className={`selected-badge${selected.includes(p.id) ? ' visible' : ''}`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                </div>

                <div className="photo-footer">
                  <span className="photo-code">{p.code}</span>
                  <button
                    className={`btn-select${selected.includes(p.id) ? ' selected' : ''}`}
                    onClick={() => toggleSelect(p.id)}
                  >
                    {selected.includes(p.id) ? 'Đã chọn' : 'Chọn'}
                  </button>
                </div>
              </div>
            ))
          )}
        </section>

        {/* Lightbox */}
        {current !== null && (
          <div className="lightbox">
            <button className="lb-close" onClick={() => setCurrent(null)}>✕</button>
            <button className="lb-nav prev" onClick={prevPhoto}>‹</button>
            <button className="lb-nav next" onClick={nextPhoto}>›</button>

            <div className="lb-content">
              <div className="lb-img-wrap">
                <img src={photos[current].url} alt={photos[current].code} />
              </div>

              <div className="lb-panel">
                <div className="lb-panel-top">
                  <p className="lb-code-label">Mã ảnh</p>
                  <p className="lb-code">{photos[current].code}</p>
                  <p className="lb-counter">{current + 1} / {photos.length}</p>
                </div>

                <button
                  className={`btn-select-lb${selected.includes(photos[current].id) ? ' selected' : ''}`}
                  onClick={() => toggleSelect(photos[current].id)}
                >
                  {selected.includes(photos[current].id) ? '✓ Đã chọn ảnh này' : 'Chọn ảnh này'}
                </button>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <p className="lb-note-label">Ghi chú chỉnh sửa</p>
                  <textarea
                    className="lb-textarea"
                    placeholder="Nhập yêu cầu chỉnh sửa của bạn..."
                    value={notes[photos[current].id] || ''}
                    onChange={(e) =>
                      setNotes({ ...notes, [photos[current].id]: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {sent && (
          <div className="modal-overlay">
            <div className="modal-box">
              <div className="modal-icon">✦</div>
              <h2 className="modal-title">Cảm ơn bạn</h2>
              <p className="modal-sub">
                Yêu cầu của bạn đã được gửi thành công.<br />
                Chúng tôi sẽ liên hệ sớm nhất có thể.
              </p>
              <button className="btn-close-modal" onClick={() => setSent(false)}>
                Đóng
              </button>
            </div>
          </div>
        )}

      </main>
    </>
  )
}
