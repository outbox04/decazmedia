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

        /* ================= GLOBAL ================= */
.page {
  min-height: 100vh;
  background: var(--black);
  color: var(--text);
  font-family: 'Montserrat', sans-serif;
  font-weight: 300;
  padding-bottom: env(safe-area-inset-bottom);
}

/* ================= HERO ================= */
.hero {
  position: relative;
  height: 380px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 48px 56px;
  overflow: hidden;
}

/* ================= TOOLBAR ================= */
.toolbar {
  position: sticky;
  top: 0;
  z-index: 20;
  background: rgba(8,8,8,0.92);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
  padding: 0 56px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
}

/* ================= BUTTON FIX ================= */
.btn-submit {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 30px;

  background: linear-gradient(135deg, var(--gold), var(--gold-light));
  color: #000;

  border: 1px solid transparent;

  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.25em;

  cursor: pointer;
  border-radius: 2px;
  transition: all 0.25s ease;
  position: relative;
  overflow: hidden;

  box-shadow: 0 6px 24px rgba(201,168,76,0.25);
}

.btn-submit::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.2);
  transform: translateX(-100%);
  transition: transform 0.3s ease;
}

.btn-submit:hover::before {
  transform: translateX(0);
}

.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 32px rgba(201,168,76,0.35);
}

.btn-submit span {
  position: relative;
  z-index: 1;
}

/* ================= GRID ================= */
.grid-section {
  padding: 40px 56px 80px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

@media (max-width: 1100px) {
  .grid-section {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* ================= PHOTO CARD ================= */
.photo-card {
  position: relative;
  border-radius: 3px;
  overflow: hidden;
  background: var(--surface);
  border: 1px solid var(--border);
  transition: border-color 0.3s, transform 0.3s;
  cursor: pointer;

  backdrop-filter: blur(4px);
}

.photo-card:hover {
  border-color: var(--border-hover);
  transform: translateY(-2px);
}

/* ================= SELECT BUTTON ================= */
.btn-select {
  padding: 8px 18px;
  font-size: 10px;
}

.btn-select.selected {
  background: var(--gold);
  color: #000;
  border-color: var(--gold);
  box-shadow: 0 4px 12px rgba(201,168,76,0.25);
}

/* ================= LIGHTBOX ================= */
@media (max-width: 900px) {
  .lb-content {
    grid-template-columns: 1fr;
    width: calc(100% - 48px);
  }

  .lb-panel {
    padding: 18px;
  }

  .lb-textarea {
    min-height: 100px;
  }
}

/* ================= MOBILE ================= */
@media (max-width: 640px) {

  /* HERO */
  .hero {
    height: auto;
    padding: 28px 20px;
  }

  .hero-title {
    font-size: 2rem;
    line-height: 1.2;
  }

  .hero-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  /* TOOLBAR */
  .toolbar {
    flex-direction: column;
    height: auto;
    padding: 12px 16px;
    gap: 12px;
  }

  .tabs {
    width: 100%;
    justify-content: space-between;
  }

  .btn-submit {
    width: 100%;
    justify-content: center;
    padding: 14px;
    font-size: 12px;
  }

  /* GRID */
  .grid-section {
    grid-template-columns: 1fr;
    padding: 20px 16px 80px;
    gap: 14px;
  }

  /* CARD */
  .photo-footer {
    padding: 16px;
  }

  .btn-select {
    min-height: 36px;
  }

  /* PROGRESS */
  .progress-wrap {
    padding: 0 16px;
  }
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
