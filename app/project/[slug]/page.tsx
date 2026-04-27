'use client'

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";


export default function PhotoGallery() {
  const params = useSearchParams()
  const fid = params.get("fid")

  const [photos, setPhotos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<string[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<"all" | "selected">("all");
  const [current, setCurrent] = useState<number | null>(null);
  const [sent, setSent] = useState(false);
  type Project = {
  id: string
  name: string
  status?: string
}

const [projects, setProjects] = useState<Project[]>([])

  const displayedPhotos =
    activeTab === "selected" ? photos.filter((p) => selected.includes(p.id)) : photos;

  const toggleSelect = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const submitRequest = () => {
    if (selected.length === 0) return;
    setSent(true);
  };

const prevPhoto = useCallback(
  () => setCurrent((c: number | null) => (c !== null && c > 0 ? c - 1 : photos.length - 1)),
  [photos.length]
)

const nextPhoto = useCallback(
  () => setCurrent((c: number | null) => (c !== null && c < photos.length - 1 ? c + 1 : 0)),
  [photos.length]
)

useEffect(() => {
  if (!fid) return

  fetch(`/api/drive?folderId=${fid}`)
    .then(res => res.json())
    .then(data => {
      setPhotos(data)
      setLoading(false)
    })
}, [fid])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (current === null) return;
      if (e.key === "ArrowLeft") prevPhoto();
      if (e.key === "ArrowRight") nextPhoto();
      if (e.key === "Escape") setCurrent(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, prevPhoto, nextPhoto]);

  const pct = photos.length > 0 ? Math.round((selected.length / photos.length) * 100) : 0;

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
          height: 320px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 48px 56px;
          overflow: hidden;
          background: linear-gradient(175deg, #111 0%, #080808 100%);
          border-bottom: 1px solid var(--border);
        }
        .hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 70% 80% at 15% 60%, rgba(201,168,76,0.07) 0%, transparent 60%);
          pointer-events: none;
        }
        .hero-ornament {
          display: flex;
          align-items: flex-end;
          gap: 4px;
          margin-bottom: 14px;
        }
        .hero-ornament span {
          display: block;
          width: 2px;
          background: var(--gold);
          opacity: 0.6;
        }
        .hero-label {
          font-size: 10px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 10px;
          opacity: 0.8;
        }
        .hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 3rem;
          font-weight: 300;
          line-height: 1.1;
          color: var(--text);
          margin-bottom: 22px;
        }
        .hero-title em { font-style: italic; color: var(--gold-light); }
        .hero-meta {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .hero-stat { display: flex; flex-direction: column; gap: 2px; }
        .hero-stat-number {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.6rem;
          font-weight: 400;
          color: var(--text);
          transition: color 0.3s;
        }
        .hero-stat-label { font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--text-dim); }
        .hero-divider { width: 1px; height: 36px; background: var(--border); }

        /* ── PROGRESS ── */
        .progress-wrap { padding: 20px 56px 0; }
        .progress-track {
          height: 2px;
          background: rgba(255,255,255,0.06);
          border-radius: 2px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--gold-dim), var(--gold-light));
          border-radius: 2px;
          transition: width 0.5s cubic-bezier(0.4,0,0.2,1);
        }
        .progress-label {
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--text-dim);
          margin-top: 8px;
        }

        /* ── TOOLBAR ── */
        .toolbar {
          position: sticky;
          top: 0;
          z-index: 20;
          background: rgba(8,8,8,0.94);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
          padding: 0 56px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 64px;
          margin-top: 20px;
        }
        .tabs { display: flex; gap: 2px; }
        .tab {
          padding: 8px 20px;
          font-family: 'Montserrat', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--text-dim);
          background: transparent;
          border: none;
          cursor: pointer;
          transition: color 0.2s;
          position: relative;
        }
        .tab::after {
          content: '';
          position: absolute;
          bottom: -1px; left: 20px; right: 20px;
          height: 1px;
          background: var(--gold);
          transform: scaleX(0);
          transition: transform 0.25s;
        }
        .tab:hover { color: var(--text); }
        .tab.active { color: var(--gold); }
        .tab.active::after { transform: scaleX(1); }

        /* ── SUBMIT BUTTON ── */
        .btn-submit {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 11px 28px;
          background: transparent;
          color: var(--gold);
          border: 1px solid var(--gold-dim);
          border-radius: 2px;
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          cursor: pointer;
          transition: color 0.25s, border-color 0.25s, transform 0.2s, box-shadow 0.25s;
          position: relative;
          overflow: hidden;
          white-space: nowrap;
        }
        .btn-submit::before {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--gold);
          transform: translateX(-101%);
          transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
        }
        .btn-submit:hover::before { transform: translateX(0); }
        .btn-submit:hover { color: #000; border-color: var(--gold); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(201,168,76,0.2); }
        .btn-submit:active { transform: translateY(0); box-shadow: none; }
        .btn-submit span { position: relative; z-index: 1; }
        .count-badge {
          position: relative; z-index: 1;
          background: var(--gold); color: #000;
          font-size: 10px; font-weight: 700;
          width: 20px; height: 20px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.25s, color 0.25s;
        }
        .btn-submit:hover .count-badge { background: #000; color: var(--gold); }

        /* ── GRID ── */
        .grid-section {
          padding: 32px 56px 80px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        /* ── PHOTO CARD ── */
        .photo-card {
          position: relative;
          border-radius: 3px;
          overflow: hidden;
          background: var(--surface);
          border: 1px solid var(--border);
          transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s;
          cursor: pointer;
        }
        .photo-card:hover {
          border-color: var(--border-hover);
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.5);
        }
        .photo-card.is-selected { border-color: var(--gold); }

        .photo-img-wrap { position: relative; aspect-ratio: 4/5; overflow: hidden; }
        .photo-img-wrap img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s cubic-bezier(0.4,0,0.2,1);
        }
        .photo-card:hover .photo-img-wrap img { transform: scale(1.04); }

        .photo-overlay {
          position: absolute; inset: 0;
          background: rgba(8,8,8,0.5);
          display: flex; align-items: center; justify-content: center;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .photo-card:hover .photo-overlay { opacity: 1; }
        .overlay-view {
          font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase;
          color: var(--text); border: 1px solid rgba(240,234,214,0.4);
          padding: 8px 18px; border-radius: 2px;
        }

        .selected-badge {
          position: absolute; top: 12px; right: 12px;
          width: 28px; height: 28px;
          background: var(--gold);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          opacity: 0; transform: scale(0.5);
          transition: opacity 0.25s, transform 0.25s;
        }
        .selected-badge.visible { opacity: 1; transform: scale(1); }
        .selected-badge svg { width: 14px; height: 14px; color: #000; }

        .photo-footer {
          padding: 14px 16px;
          display: flex; align-items: center; justify-content: space-between;
          border-top: 1px solid var(--border);
        }
        .photo-code { font-size: 10px; letter-spacing: 0.15em; color: var(--text-dim); }

        .btn-select {
          display: inline-flex; align-items: center; justify-content: center;
          padding: 7px 16px;
          font-family: 'Montserrat', sans-serif;
          font-size: 10px; font-weight: 500;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--gold);
          background: transparent;
          border: 1px solid var(--gold-dim);
          border-radius: 2px;
          cursor: pointer;
          position: relative; overflow: hidden;
          transition: color 0.2s, border-color 0.2s, transform 0.15s;
        }
        .btn-select::before {
          content: '';
          position: absolute; inset: 0;
          background: var(--gold);
          transform: translateX(-101%);
          transition: transform 0.25s cubic-bezier(0.4,0,0.2,1);
        }
        .btn-select:hover::before { transform: translateX(0); }
        .btn-select:hover { color: #000; border-color: var(--gold); }
        .btn-select span { position: relative; z-index: 1; }

        .btn-select.selected {
          background: var(--gold); color: #000;
          border-color: var(--gold);
          box-shadow: 0 4px 12px rgba(201,168,76,0.25);
        }
        .btn-select.selected::before { display: none; }

        /* ── EMPTY ── */
        .empty-state {
          grid-column: 1 / -1;
          padding: 80px 0;
          text-align: center;
          color: var(--text-dim);
          font-size: 13px;
          letter-spacing: 0.15em;
        }

        /* ── LIGHTBOX ── */
        .lightbox {
          position: fixed; inset: 0; z-index: 100;
          background: rgba(4,4,4,0.96);
          display: flex; align-items: center; justify-content: center;
          padding: 24px;
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .lb-close {
          position: fixed; top: 20px; right: 24px;
          background: none; border: none;
          color: var(--text-dim); font-size: 20px;
          cursor: pointer; z-index: 101;
          transition: color 0.2s;
          width: 40px; height: 40px;
          display: flex; align-items: center; justify-content: center;
        }
        .lb-close:hover { color: var(--text); }

        .lb-nav {
          position: fixed; top: 50%; transform: translateY(-50%);
          background: rgba(8,8,8,0.7); border: 1px solid var(--border);
          color: var(--text-dim); font-size: 24px;
          width: 48px; height: 64px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; z-index: 101;
          transition: color 0.2s, border-color 0.2s;
          border-radius: 2px;
        }
        .lb-nav:hover { color: var(--gold); border-color: var(--gold-dim); }
        .lb-nav.prev { left: 20px; }
        .lb-nav.next { right: 20px; }

        .lb-content {
          display: grid;
          grid-template-columns: 1fr 320px;
          width: min(960px, calc(100% - 140px));
          max-height: calc(100vh - 80px);
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 4px;
          overflow: hidden;
          animation: slideUp 0.25s ease;
        }
        @keyframes slideUp { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

        .lb-img-wrap { overflow: hidden; aspect-ratio: auto; max-height: calc(100vh - 80px); }
        .lb-img-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; }

        .lb-panel {
          padding: 28px 24px;
          border-left: 1px solid var(--border);
          display: flex; flex-direction: column; gap: 20px;
          overflow-y: auto;
        }
        .lb-panel-top { display: flex; flex-direction: column; gap: 6px; }
        .lb-code-label { font-size: 9px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--text-dim); }
        .lb-code { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; color: var(--text); }
        .lb-counter { font-size: 10px; color: var(--text-dim); }

        .btn-select-lb {
          padding: 12px 16px;
          font-family: 'Montserrat', sans-serif;
          font-size: 10px; font-weight: 500;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--gold);
          background: transparent;
          border: 1px solid var(--gold-dim);
          border-radius: 2px;
          cursor: pointer;
          transition: background 0.2s, color 0.2s, border-color 0.2s;
        }
        .btn-select-lb:hover { background: var(--gold); color: #000; border-color: var(--gold); }
        .btn-select-lb.selected { background: var(--gold); color: #000; border-color: var(--gold); }

        .lb-note-label { font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--text-dim); margin-bottom: 8px; }
        .lb-textarea {
          flex: 1;
          min-height: 120px;
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 2px;
          color: var(--text);
          font-family: 'Montserrat', sans-serif;
          font-size: 12px;
          font-weight: 300;
          padding: 12px;
          resize: none;
          outline: none;
          line-height: 1.6;
          transition: border-color 0.2s;
        }
        .lb-textarea::placeholder { color: var(--text-dim); }
        .lb-textarea:focus { border-color: var(--gold-dim); }

        /* ── MODAL ── */
        .modal-overlay {
          position: fixed; inset: 0; z-index: 200;
          background: rgba(4,4,4,0.9);
          display: flex; align-items: center; justify-content: center;
          animation: fadeIn 0.2s ease;
        }
        .modal-box {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 4px;
          padding: 48px 40px;
          text-align: center;
          width: min(400px, 90vw);
          animation: slideUp 0.25s ease;
        }
        .modal-icon {
          font-size: 2rem;
          color: var(--gold);
          margin-bottom: 20px;
          display: block;
        }
        .modal-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem;
          font-weight: 300;
          color: var(--text);
          margin-bottom: 12px;
        }
        .modal-sub {
          font-size: 12px;
          line-height: 1.8;
          color: var(--text-dim);
          margin-bottom: 28px;
        }
        .btn-close-modal {
          padding: 11px 32px;
          font-family: 'Montserrat', sans-serif;
          font-size: 10px; font-weight: 500;
          letter-spacing: 0.25em; text-transform: uppercase;
          color: var(--gold);
          background: transparent;
          border: 1px solid var(--gold-dim);
          border-radius: 2px;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }
        .btn-close-modal:hover { background: var(--gold); color: #000; border-color: var(--gold); }

        /* ── RESPONSIVE ── */
        @media (max-width: 1100px) {
          .grid-section { grid-template-columns: repeat(2,1fr); }
        }
        @media (max-width: 768px) {
          .hero { height: auto; padding: 32px 20px 28px; }
          .hero-title { font-size: 2.2rem; }
          .toolbar { padding: 0 20px; height: auto; flex-wrap: wrap; gap: 10px; padding-top: 12px; padding-bottom: 12px; }
          .progress-wrap { padding: 16px 20px 0; }
          .grid-section { grid-template-columns: 1fr; padding: 20px 16px 80px; gap: 12px; }
          .lb-content { grid-template-columns: 1fr; width: calc(100% - 32px); max-height: 90vh; overflow-y: auto; }
          .lb-panel { border-left: none; border-top: 1px solid var(--border); }
          .lb-nav.prev { left: 8px; }
          .lb-nav.next { right: 8px; }
          .btn-submit { width: 100%; justify-content: center; }
          .tabs { width: 100%; }
        }
      `}</style>

      <main className="page">

        {/* Hero */}
        <section className="hero">
          <div className="hero-ornament">
            <span style={{ height: 40 }} />
            <span style={{ height: 22 }} />
            <span style={{ height: 8 }} />
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
              <span className="hero-stat-number" style={{ color: selected.length > 0 ? "var(--gold)" : undefined }}>
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
              <div className="progress-fill" style={{ width: `${pct}%` }} />
            </div>
            <p className="progress-label">
              {selected.length > 0 ? `${pct}% đã chọn` : "Chưa có ảnh nào được chọn"}
            </p>
          </div>
        )}

        {/* Toolbar */}
        <div className="toolbar">
          <div className="tabs">
            <button className={`tab${activeTab === "all" ? " active" : ""}`} onClick={() => setActiveTab("all")}>
              Tất cả
            </button>
            <button className={`tab${activeTab === "selected" ? " active" : ""}`} onClick={() => setActiveTab("selected")}>
              Đã chọn {selected.length > 0 && `(${selected.length})`}
            </button>
          </div>

          <button className="btn-submit" onClick={submitRequest}>
            <span>Gửi yêu cầu</span>
            {selected.length > 0 && <span className="count-badge">{selected.length}</span>}
          </button>
        </div>

        {/* Grid */}
        <section className="grid-section">
          {displayedPhotos.length === 0 && activeTab === "selected" ? (
            <div className="empty-state">Bạn chưa chọn ảnh nào</div>
          ) : (
            displayedPhotos.map((p, index) => (
              <div
                key={p.id}
                className={`photo-card${selected.includes(p.id) ? " is-selected" : ""}`}
                style={{ animationDelay: `${Math.min(index * 60, 600)}ms` }}
              >
                <div className="photo-img-wrap" onClick={() => setCurrent(photos.findIndex((ph) => ph.id === p.id))}>
                  <img src={p.url} alt={p.code} loading="lazy" />
                  <div className="photo-overlay">
                    <span className="overlay-view">Xem ảnh</span>
                  </div>
                  <div className={`selected-badge${selected.includes(p.id) ? " visible" : ""}`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                </div>

                <div className="photo-footer">
                  <span className="photo-code">{p.code}</span>
                  <button className={`btn-select${selected.includes(p.id) ? " selected" : ""}`} onClick={() => toggleSelect(p.id)}>
                    <span>{selected.includes(p.id) ? "Đã chọn" : "Chọn"}</span>
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
                  className={`btn-select-lb${selected.includes(photos[current].id) ? " selected" : ""}`}
                  onClick={() => toggleSelect(photos[current].id)}
                >
                  {selected.includes(photos[current].id) ? "✓ Đã chọn ảnh này" : "Chọn ảnh này"}
                </button>

                <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                  <p className="lb-note-label">Ghi chú chỉnh sửa</p>
                  <textarea
                    className="lb-textarea"
                    placeholder="Nhập yêu cầu chỉnh sửa của bạn..."
                    value={notes[photos[current].id] || ""}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
  setNotes({ ...notes, [photos[current!].id]: e.target.value })
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
              <span className="modal-icon">✦</span>
              <h2 className="modal-title">Cảm ơn bạn</h2>
              <p className="modal-sub">
                Yêu cầu của bạn đã được gửi thành công.<br />
                Chúng tôi sẽ liên hệ sớm nhất có thể.
              </p>
              <button className="btn-close-modal" onClick={() => setSent(false)}>Đóng</button>
            </div>
          </div>
        )}

      </main>
    </>
  );
}
