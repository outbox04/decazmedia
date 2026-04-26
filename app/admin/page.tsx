'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'


export default function Page() {
  const [projects, setProjects] = useState<any[]>([])
  const [requests, setRequests] = useState<any[]>([])

  const [open, setOpen] = useState(false)
  

  const [name, setName] = useState('')
  const [customer, setCustomer] = useState('')
  const [date, setDate] = useState('')
  const [drive, setDrive] = useState('')
 const total = projects.length
const done = projects.filter((p) => p.status === 'done').length
const pending = total - done
const pendingJobs = requests.filter((r) => !r.done)

  // ===== HELPER =====
 const extractFolderId = (url: string) => {
  if (!url) return null

  const match = url.match(/folders\/([a-zA-Z0-9_-]+)/)
  return match ? match[1] : null
}

  const createSlug = (text: string) =>
    text.toLowerCase().replaceAll(' ', '-').replace(/[^\w-]+/g, '')



  // ===== LOAD DATA =====
  const loadProjects = async () => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('id', { ascending: false }) // 🔥 FIX

  console.log('PROJECTS:', data)
  console.log('ERROR:', error)

  if (!error) {
    setProjects(data || [])
  }
}



  const loadRequests = async () => {
    const { data } = await supabase
      .from('requests')
      .select('*')
      .order('created_at', { ascending: false })

    setRequests(data || [])
  }

  // ===== REALTIME =====
  useEffect(() => {
  loadRequests()
  loadProjects()

  const channel = supabase
    .channel('requests-live')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'requests'
      },
      () => {
        loadRequests()
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}, [])

useEffect(() => {
  const channel = supabase
    .channel('projects-live')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'projects'
      },
      () => {
        loadProjects()
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}, [])

  // ===== CREATE PROJECT =====
  const createProject = async () => {
  const folderId = extractFolderId(drive)

console.log('DRIVE:', drive)
console.log('FOLDER ID:', folderId)

if (!folderId) {
  alert('Link Google Drive không hợp lệ')
  return
}

  const slug = createSlug(customer + '-' + date)

  const { data, error } = await supabase.from('projects').insert({
    slug,
    folder_id: folderId,
    name,
    customer,
    date
  })

  console.log('DATA:', data)
  console.log('ERROR:', error)

  if (error) {
    alert(error.message) // 🔥 hiển thị lỗi thật
    return
  }
  // 🔥 FIX QUAN TRỌNG (update UI ngay)
  await loadProjects()

  // reset form
  setName('')
  setCustomer('')
  setDate('')
  setDrive('')
  setOpen(false)
}

  // ===== COPY LINK =====
  const copyLink = async (slug: string, folderId: string) => {
    const fullLink =
  typeof window !== 'undefined'
    ? `${window.location.origin}/project/${job.slug}?fid=${job.folder_id}`
    : ''

    await navigator.clipboard.writeText(fullLink)
    alert('Đã copy link')
  }

  // ===== DONE REQUEST =====
  const markDone = async (id: string) => {
  const { error } = await supabase
    .from('projects')
    .update({ status: 'done' })
    .eq('id', id)

  if (error) {
    alert(error.message)
    return
  }

  await loadProjects() // 🔥 update UI ngay
}

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Montserrat:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --gold: #C9A84C;
          --gold-light: #E8C97A;
          --gold-dim: #7A6030;
          --gold-glow: rgba(201,168,76,0.10);
          --black: #070707;
          --surface: #0D0D0D;
          --surface2: #131313;
          --border: rgba(201,168,76,0.12);
          --border-hover: rgba(201,168,76,0.4);
          --text: #EDE8D8;
          --text-dim: rgba(237,232,216,0.38);
          --text-mid: rgba(237,232,216,0.65);
          --green: #4CAF82;
          --green-bg: rgba(76,175,130,0.1);
          --red: #E07070;
          --red-bg: rgba(224,112,112,0.08);
          --r: 3px;
        }

        html, body { background: var(--black); }

        .page {
          min-height: 100vh;
          background: var(--black);
          color: var(--text);
          font-family: 'Montserrat', sans-serif;
          font-weight: 300;
          padding-bottom: 80px;
        }

        .layout {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 48px;
        }

        @media (max-width: 768px) { .layout { padding: 0 20px; } }

        /* ── TOPBAR ── */
        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 36px 0 32px;
          border-bottom: 1px solid var(--border);
          margin-bottom: 40px;
        }

        .brand-eyebrow {
          font-size: 9px;
          letter-spacing: 0.5em;
          text-transform: uppercase;
          color: var(--gold);
          opacity: 0.75;
          margin-bottom: 10px;
        }

        .brand-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.9rem, 3vw, 2.7rem);
          font-weight: 300;
          letter-spacing: 0.1em;
          line-height: 1;
        }

        .brand-title em { font-style: italic; color: var(--gold-light); }

        /* ── BTN PRIMARY ── */
        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 12px 26px;
          background: transparent;
          border: 1px solid var(--gold-dim);
          color: var(--gold);
          font-family: 'Montserrat', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          cursor: pointer;
          border-radius: var(--r);
          transition: all 0.25s;
          position: relative;
          overflow: hidden;
          white-space: nowrap;
        }

        .btn-primary::before {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--gold);
          transform: translateX(-101%);
          transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
        }

        .btn-primary:hover::before { transform: translateX(0); }
        .btn-primary:hover { color: #000; border-color: var(--gold); }
        .btn-primary > * { position: relative; z-index: 1; }

        /* ── STATS ── */
        .stats-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: var(--border);
          border: 1px solid var(--border);
          border-radius: var(--r);
          overflow: hidden;
          margin-bottom: 48px;
        }

        @media (max-width: 580px) { .stats-row { grid-template-columns: 1fr; } }

        .stat-card {
          background: var(--surface);
          padding: 30px 36px;
          position: relative;
          overflow: hidden;
          transition: background 0.2s;
        }

        .stat-card:hover { background: var(--surface2); }

        .stat-card::after {
          content: '';
          position: absolute;
          bottom: 0; left: 36px; right: 36px;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--gold), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .stat-card:hover::after { opacity: 0.35; }

        .stat-label {
          font-size: 9px;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: var(--text-dim);
          margin-bottom: 14px;
        }

        .stat-number {
          font-family: 'Cormorant Garamond', serif;
          font-size: 3.4rem;
          font-weight: 300;
          line-height: 1;
          color: var(--text);
        }

        .stat-number.accent { color: var(--gold); }

        .stat-bg-num {
          position: absolute;
          top: 16px; right: 24px;
          font-family: 'Cormorant Garamond', serif;
          font-size: 5rem;
          font-weight: 300;
          color: rgba(201,168,76,0.05);
          line-height: 1;
          pointer-events: none;
          user-select: none;
        }

        /* ── SECTION HEADER ── */
        .section-header {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border);
        }

        .section-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.45rem;
          font-weight: 400;
          letter-spacing: 0.05em;
        }

        .section-meta {
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--text-dim);
        }

        /* ── JOB LIST ── */
        .jobs-list {
          display: flex;
          flex-direction: column;
          gap: 1px;
          background: var(--border);
          border: 1px solid var(--border);
          border-radius: var(--r);
          overflow: hidden;
        }

        .job-row {
          background: var(--surface);
          padding: 22px 28px;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 20px;
          align-items: center;
          transition: background 0.2s;
          animation: slideIn 0.3s ease both;
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .job-row:hover { background: var(--surface2); }

        .job-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.2rem;
          font-weight: 400;
          letter-spacing: 0.04em;
          margin-bottom: 5px;
        }

        .job-meta {
          font-size: 11px;
          letter-spacing: 0.1em;
          color: var(--text-dim);
          margin-bottom: 10px;
        }

        .job-meta strong { color: var(--text-mid); font-weight: 500; }

        .job-link {
          font-size: 11px;
          color: var(--gold-dim);
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          font-family: 'Montserrat', sans-serif;
          font-weight: 400;
          letter-spacing: 0.02em;
          text-align: left;
          word-break: break-all;
          transition: color 0.2s;
          display: block;
          margin-bottom: 4px;
        }

        .job-link:hover { color: var(--gold); }

        .job-api {
          font-size: 10px;
          color: rgba(237,232,216,0.18);
          letter-spacing: 0.04em;
          word-break: break-all;
        }

        .job-actions {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 10px;
        }

        .status-pill {
          padding: 5px 13px;
          border-radius: 2px;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          border: 1px solid;
          white-space: nowrap;
        }

        .status-pill.pending {
          background: var(--red-bg);
          color: var(--red);
          border-color: rgba(224,112,112,0.2);
        }

        .status-pill.done {
          background: var(--green-bg);
          color: var(--green);
          border-color: rgba(76,175,130,0.2);
        }

        .btn-done {
          padding: 7px 18px;
          background: transparent;
          border: 1px solid var(--border);
          color: var(--text-dim);
          font-family: 'Montserrat', sans-serif;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          cursor: pointer;
          border-radius: var(--r);
          transition: all 0.2s;
          white-space: nowrap;
        }

        .btn-done:hover {
          border-color: var(--green);
          color: var(--green);
          background: var(--green-bg);
        }

        /* ── EMPTY STATE ── */
        .empty-state {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--r);
          padding: 80px 40px;
          text-align: center;
        }

        .empty-glyph {
          font-family: 'Cormorant Garamond', serif;
          font-size: 3.5rem;
          color: rgba(201,168,76,0.12);
          margin-bottom: 18px;
          display: block;
        }

        .empty-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.2rem;
          font-style: italic;
          color: var(--text-dim);
        }

        /* ── MODAL ── */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.87);
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          animation: fadeIn 0.2s ease;
          backdrop-filter: blur(6px);
        }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .modal-box {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--r);
          padding: 40px 44px;
          max-width: 500px;
          width: 100%;
          animation: slideUp 0.25s ease;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 28px;
          padding-bottom: 22px;
          border-bottom: 1px solid var(--border);
        }

        .modal-eyebrow {
          font-size: 9px;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: var(--gold-dim);
          margin-bottom: 7px;
        }

        .modal-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.75rem;
          font-weight: 400;
          letter-spacing: 0.06em;
        }

        .modal-close {
          background: none;
          border: 1px solid var(--border);
          color: var(--text-dim);
          width: 34px; height: 34px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 15px;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .modal-close:hover { border-color: var(--gold-dim); color: var(--gold); }

        .form-group { margin-bottom: 14px; }

        .form-label {
          display: block;
          font-size: 9px;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: var(--gold-dim);
          margin-bottom: 7px;
        }

        .form-input {
          width: 100%;
          padding: 12px 15px;
          background: var(--black);
          border: 1px solid var(--border);
          border-radius: var(--r);
          color: var(--text);
          font-family: 'Montserrat', sans-serif;
          font-size: 13px;
          font-weight: 300;
          outline: none;
          transition: border-color 0.2s;
        }

        .form-input:focus { border-color: var(--gold-dim); }
        .form-input::placeholder { color: var(--text-dim); }

        .form-submit {
          width: 100%;
          margin-top: 22px;
          padding: 14px;
          background: transparent;
          border: 1px solid var(--gold-dim);
          color: var(--gold);
          font-family: 'Montserrat', sans-serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          cursor: pointer;
          border-radius: var(--r);
          transition: all 0.25s;
          position: relative;
          overflow: hidden;
        }

        .form-submit::before {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--gold);
          transform: translateX(-101%);
          transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
        }

        .form-submit:hover::before { transform: translateX(0); }
        .form-submit:hover { color: #000; }
        .form-submit span { position: relative; z-index: 1; }
      `}</style>

      <main className="page">
        <div className="layout">

          {/* TOP BAR */}
          <div className="topbar">
            <div>
              <p className="brand-eyebrow">Decaz Media · Studio</p>
              <h1 className="brand-title">Admin <em>Dashboard</em></h1>
            </div>
            <button className="btn-primary" onClick={() => setOpen(true)}>
              <span>＋</span>
              <span>Tạo dự án mới</span>
            </button>
          </div>

          {/* STATS */}
          <div className="stats-row">
            <div className="stat-card">
              <p className="stat-label">Tổng Job</p>
              <p className="stat-number">{total}</p>
              <span className="stat-bg-num">{total || '0'}</span>
            </div>
            <div className="stat-card">
              <p className="stat-label">Đã hoàn thiện</p>
              <p className="stat-number accent">{done}</p>
              <span className="stat-bg-num">{done || '0'}</span>
            </div>
            <div className="stat-card">
              <p className="stat-label">Chưa hoàn thiện</p>
              <p className="stat-number">{pending}</p>
              <span className="stat-bg-num">{pending || '0'}</span>
            </div>
          </div>

          {/* LIST */}
          <div className="section-header">
            <h2 className="section-title">Danh sách dự án</h2>
            <span className="section-meta">{pendingJobs.length} đang xử lý</span>
          </div>

          {projects.length === 0 ? (
  <div className="empty-state">
    <span className="empty-glyph">✦</span>
    <p className="empty-text">Chưa có dự án nào được tạo</p>
  </div>
) : (
  <div className="jobs-list">
    {projects.map((job: any) => {
      const fullLink = `${window.location.origin}/project/${job.slug}?fid=${job.folder_id}`
      

const apiLink = `${window.location.origin}/api/drive?folderId=${job.folder_id}`

      return (
        <div key={job.id} className="job-row">
          <div>
            <p className="job-name">{job.name}</p>

            <p className="job-meta">
              <strong>{job.customer}</strong>&nbsp;·&nbsp;{job.date}
            </p>

            <button
              className="job-link"
              onClick={() => copyLink(job.slug, job.folder_id)}
            >
              {fullLink}
            </button>

            <p className="job-api">API: {apiLink}</p>
          </div>

          <div className="job-actions">
            <span className={`status-pill ${job.status || 'pending'}`}>
  {job.status === 'done' ? 'Hoàn thiện' : 'Đang xử lý'}
</span>
{/* 🔥 THÊM NÚT NÀY */}
  {job.status !== 'done' && (
    <button
      className="btn-done"
      onClick={() => markDone(job.id)}
    >
      DONE
    </button>
  )}
          </div>
        </div>
      )
    })}
  </div>
)}

        </div>
      </main>

      {/* MODAL */}
      {open && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div className="modal-box">
            <div className="modal-header">
              <div>
                <p className="modal-eyebrow">Studio · Dự án mới</p>
                <h2 className="modal-title">Tạo dự án</h2>
              </div>
              <button className="modal-close" onClick={() => setOpen(false)}>✕</button>
            </div>

            <div className="form-group">
              <label className="form-label">Tên dự án</label>
              <input
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="VD: Wedding — Anh & Minh"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tên khách hàng</label>
              <input
                className="form-input"
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                placeholder="VD: Nguyễn Minh Anh"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Ngày chụp</label>
              <input
                className="form-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="VD: 26-04"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Link Google Drive</label>
              <input
                className="form-input"
                value={drive}
                onChange={(e) => setDrive(e.target.value)}
                placeholder="https://drive.google.com/drive/folders/..."
              />
            </div>

            <button className="form-submit" onClick={createProject}>
              <span>Tạo dự án</span>
            </button>
          </div>
        </div>
      )}
    </>
  )
}
