'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'


// ─── TYPES ───────────────────────────────────────────────
type Plan = 'basic' | 'medium' | 'premium'

interface FormData {
  name: string
  phone: string
  plan: Plan
  note: string
}

// ─── WAVE SVG BACKGROUND ─────────────────────────────────
function WaveBg() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="glow1" cx="30%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="glow2" cx="80%" cy="30%" r="40%">
          <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1440" height="900" fill="url(#glow1)" />
      <rect width="1440" height="900" fill="url(#glow2)" />
      <path d="M0,400 C200,350 400,450 600,380 C800,310 1000,420 1200,360 C1350,315 1420,340 1440,330 L1440,900 L0,900Z"
        fill="rgba(212,175,55,0.025)" />
      <path d="M0,500 C300,460 500,530 700,490 C900,450 1100,510 1300,470 L1440,460 L1440,900 L0,900Z"
        fill="rgba(212,175,55,0.015)" />
    </svg>
  )
}

// ─── HOOK: SCROLL REVEAL ─────────────────────────────────
function useReveal() {
  useEffect(() => {
    
    const els = document.querySelectorAll('.reveal')
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) }
        })
      },
      { threshold: 0.12 }
    )
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}


// ─── TESTIMONIALS ─────────────────────────────────────────
const testimonials = [
  { name: 'Cô dâu Linh', wedding: 'Tiệc cưới tháng 10/2024', text: 'Chọn ảnh dễ dàng hơn rất nhiều. Giao diện đẹp, sang trọng, mình cảm giác như đang dùng dịch vụ cao cấp thật sự.' },
  { name: 'Cô dâu Mai', wedding: 'Tiệc cưới tháng 8/2024', text: 'Studio xử lý nhanh, ảnh đẹp xuất sắc. Trải nghiệm chọn ảnh online tiện lợi hơn mình nghĩ rất nhiều.' },
  { name: 'Cô dâu Hà', wedding: 'Tiệc cưới tháng 12/2024', text: 'Gói Premium hoàn toàn xứng đáng. Đội ngũ tư vấn tận tâm, album cuối cùng vượt mọi kỳ vọng.' },
]

// ─── PRICING ──────────────────────────────────────────────
const plans = [
  {
    key: 'basic' as Plan,
    name: 'Basic',
    price: '1.500.000đ',
    desc: 'Phù hợp nếu bạn chỉ cần chọn ảnh cơ bản',
    included: ['Album chọn ảnh online', 'Khách tự chọn ảnh', 'Lưu danh sách'],
    excluded: ['Chỉnh sửa nâng cao', 'Ưu tiên xử lý'],
    special: [],
    highlight: false,
  },
  {
    key: 'medium' as Plan,
    name: 'Medium',
    price: '3.000.000đ',
    desc: 'Cân bằng giữa chi phí và chất lượng',
    included: ['Tất cả gói Basic', 'Chỉnh sửa màu sắc chuyên nghiệp', 'Tối ưu trải nghiệm khách'],
    excluded: [],
    special: ['🔥 Ưu tiên xử lý nhanh', '🔥 Hỗ trợ trực tiếp', '🔥 Album hiển thị đẹp hơn'],
    highlight: true,
    badge: 'Phổ biến nhất',
  },
  {
    key: 'premium' as Plan,
    name: 'Premium',
    price: '5.000.000đ',
    desc: 'Dành cho khách hàng yêu cầu hoàn hảo',
    included: ['Tất cả gói Medium', 'Thiết kế album riêng', 'Chỉnh sửa chuyên sâu'],
    excluded: [],
    special: ['✨ Trải nghiệm cao cấp', '✨ Hỗ trợ 1-1', '✨ Đảm bảo chất lượng'],
    highlight: false,
    glow: true,
  },
]

// ─── MAIN PAGE ────────────────────────────────────────────
export default function Home() {
  useReveal()

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<Plan>('medium')
  const [form, setForm] = useState<FormData>({name: "", phone: "", plan: "medium", note: ""})
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [photos, setPhotos] = useState<any[]>([])

  const openModal = (plan: Plan) => {
    setSelectedPlan(plan)
    setForm(f => ({ ...f, plan }))
    setModalOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeModal = () => {
    setModalOpen(false)
    setSubmitted(false)
    document.body.style.overflow = ''
  }

  const handleSubmit = async () => {
  if (!form.name || !form.phone) {
    alert("Vui lòng nhập tên và số điện thoại")
    return
  }

  setSending(true)

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()
    console.log("API:", data)

    if (data.error) {
      alert("Lỗi: " + data.error)
      return
    }

    setSubmitted(true)
  } catch (err) {
    console.log("ERROR:", err)
    alert("Gửi thất bại")
  }

  setSending(false)
}
useEffect(() => {
  const fetchPhotos = async () => {
    try {
      const res = await fetch('/api/drive?folderId=1Q0x6YezOt32SwpquMVIRj2_mAYvq5sSM')
      const data = await res.json()

      console.log("DRIVE:", data)

      setPhotos(data)
    } catch (err) {
      console.log(err)
    }
  }

  fetchPhotos()
}, [])
  return (
    <>
      {/* ══ GLOBAL PAGE STYLES ══ */}
      <style>{`
      .container {
  max-width: 1200px;
  margin: 0 auto;
  padding-left: clamp(16px, 4vw, 40px);
  padding-right: clamp(16px, 4vw, 40px);
}
  .nav-menu {
  display: flex;
  align-items: center;
  gap: 24px; /* 👈 QUAN TRỌNG */
}

.nav-link {
  font-size: 13px;
  letter-spacing: 2px;
  color: #ccc;
  text-decoration: none;
  min-width: max-content;
  min-width: max-content;
}
  @media (max-width: 768px) {
  .nav-menu {
    gap: 12px;
  }

  .nav-link {
    font-size: 12px;
    letter-spacing: 1px;
  }
}
  .navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
}
  .nav-link:hover {
  color: #D4AF37;
}
        .hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(3rem, 6vw, 5.5rem);
          font-weight: 300;
          line-height: 1.1;
          letter-spacing: 0.02em;
        }
        .hero-title em { font-style: italic; color: var(--gold-light); }

        .section-heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.2rem, 4vw, 3.5rem);
          font-weight: 300;
          line-height: 1.15;
          letter-spacing: 0.03em;
        }
        .section-heading em { font-style: italic; color: var(--gold-light); }

        .gold-text { color: var(--gold); font-weight: 600; }

        @media (max-width: 768px) {
  .nav-link {
    font-size: 12px;
    letter-spacing: 0.08em; /* 👈 GIẢM */
    min-width: max-content;
  }

  .nav-menu {
    gap: 14px; /* 👈 vừa đủ */
  }
}
        .nav-link:hover { color: var(--gold); }
@media (max-width: 768px) {
  .navbar {
    padding: 12px 16px;
  }
}
        /* PROBLEM CARDS */
        .problem-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--r-lg);
          padding: 28px 24px;
          transition: border-color 0.3s, transform 0.3s;
        }
        .problem-card:hover { border-color: rgba(212,175,55,0.3); transform: translateY(-4px); }

        /* STEP */
        .step-number {
          font-family: 'Cormorant Garamond', serif;
          font-size: 5rem;
          font-weight: 300;
          color: rgba(212,175,55,0.12);
          line-height: 1;
        }

.gallery-item {
  aspect-ratio: 3 / 4;
  overflow: hidden;
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

        /* GALLERY */
        .gallery-item {
          overflow: hidden;
          border-radius: var(--r-lg);
          border: 1px solid var(--border);
          cursor: pointer;
          position: relative;
        }
        .gallery-item-inner {
          width: 100%;
          height: 100%;
          transition: transform 0.6s cubic-bezier(0.4,0,0.2,1);
        }
        .gallery-item:hover .gallery-item-inner { transform: scale(1.06); }
        .gallery-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.7) 100%);
          opacity: 0;
          transition: opacity 0.3s;
          display: flex;
          align-items: flex-end;
          padding: 16px;
        }
        .gallery-item:hover .gallery-overlay { opacity: 1; }

@media (max-width: 768px) {
  .gallery-item {
    grid-row: span 1 !important;
  }
}

        /* PRICING */
        .pricing-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 36px 28px;
          transition: transform 0.3s, box-shadow 0.3s;
          position: relative;
          overflow: hidden;
        }
        .pricing-card:hover { transform: translateY(-6px); }
        .pricing-card.highlight {
          border-color: var(--gold);
          transform: scale(1.03);
          background: linear-gradient(180deg, rgba(212,175,55,0.06) 0%, var(--surface) 100%);
        }
        .pricing-card.highlight:hover { transform: scale(1.03) translateY(-4px); }
        .pricing-card.glow { box-shadow: 0 0 40px rgba(212,175,55,0.08); }
        .pricing-card.glow:hover { box-shadow: 0 0 60px rgba(212,175,55,0.14); }

        .price-amount {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.6rem;
          font-weight: 400;
          color: var(--gold-light);
          line-height: 1;
        }

        .feature-item {
          font-size: clamp(14px, 3.2vw, 15px);
          color: rgba(255,255,255,0.75);
          display: flex;
          align-items: flex-start;
          gap: 8px;
          line-height: 1.5;
        }
        .feature-item.excluded { color: rgba(255,255,255,0.28); text-decoration: line-through; }
        .feature-item.special { color: var(--gold-light); font-weight: 500; }

        /* TESTIMONIAL */
        .testi-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--r-lg);
          padding: 32px 28px;
          transition: border-color 0.3s, transform 0.3s;
        }
        .testi-card:hover { border-color: var(--border-hover); transform: translateY(-4px); }

        /* MODAL */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.88);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          backdrop-filter: blur(8px);
          animation: fadeIn 0.2s ease;
        }
        @media (max-width: 768px) {
  .container {
    padding: 0 32px;
    max-width: 1200px;
    margin: 0 auto;
  }

  
  .hero-title {
    font-size: 2.2rem;
  }

  .section-heading {
    font-size: 1.8rem;
  }

  .gallery-item {
    aspect-ratio: 3 / 4 !important;
    height: auto !important;
  }

}
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .modal-box {
          background: #0e0e0e;
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 44px 40px;
          max-width: 480px;
          width: 100%;
          animation: scaleIn 0.25s cubic-bezier(0.34,1.56,0.64,1);
          max-height: 90vh;
          overflow-y: auto;
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.92); }
          to   { opacity: 1; transform: scale(1); }
        }

        .modal-input {
          width: 100%;
          padding: 13px 16px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: var(--r);
          color: #fff;
          font-family: 'Jost', sans-serif;
          font-size: 14px;
          font-weight: 300;
          outline: none;
          transition: border-color 0.2s;
        }
        .modal-input:focus { border-color: var(--gold-dim); }
        .modal-input::placeholder { color: rgba(255,255,255,0.3); }

        .plan-radio {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: var(--r);
          border: 1px solid rgba(255,255,255,0.1);
          cursor: pointer;
          transition: all 0.2s;
          font-size: 13px;
        }
        .plan-radio.active { border-color: var(--gold); background: rgba(212,175,55,0.08); color: var(--gold); }

        .modal-label {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(212,175,55,0.7);
          margin-bottom: 8px;
          display: block;
        }
          .gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 0 32px;
}
    

@media (max-width: 768px) {
  .gallery-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
        /* DIVIDER */
        .gold-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--gold-dim), transparent);
          opacity: 0.3;
          margin: 80px 0;
        }

        /* USP ICONS */
        .usp-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--r-lg);
          padding: 32px 24px;
          text-align: center;
          transition: border-color 0.3s, transform 0.3s;
        }
        .usp-card:hover { border-color: var(--border-hover); transform: translateY(-4px); }
        .usp-icon {
          font-size: 2rem;
          margin-bottom: 16px;
          display: block;
        }

        /* FOOTER */
        .footer-link {
          font-size: clamp(13px, 3vw, 14px);
          color: rgba(255,255,255,0.4);
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer-link:hover { color: var(--gold); }

        @media (max-width: 768px) {
          .pricing-card.highlight { transform: scale(1); }
          .pricing-card.highlight:hover { transform: translateY(-4px); }
          .modal-box { padding: 32px 24px; }
        }
      `}</style>

      {/* ══════════════════════════════════════════════════
          NAV
      ══════════════════════════════════════════════════ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: 'rgba(5,5,5,0.85)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 64 }}>
          <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', fontWeight: 400, letterSpacing: '0.15em', color: 'var(--gold-light)' }}>
            DECAZ
          </span>
          <div className="nav-menu">
            <a href="#services" className="nav-link" style={{ display: 'none' }}>Dịch vụ</a>
            <a href="#pricing" className="nav-link">Bảng giá</a>
            <a href="#contact" className="nav-link">Liên hệ</a>
            <Link href="/admin" className="btn-outline" style={{ padding: '8px 20px', fontSize: 11 }}>Admin</Link>
          </div>
        </div>
      </nav>

      <main>

        {/* ══════════════════════════════════════════════════
            HERO
        ══════════════════════════════════════════════════ */}
        <section style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          paddingTop: 64,
          overflow: 'hidden',
          background: 'linear-gradient(180deg, #050505 0%, #0a0805 50%, #050505 100%)',
        }}>
          <WaveBg />

          {/* Grain texture */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.03\'/%3E%3C/svg%3E")',
            opacity: 0.4,
          }} />

          <div className="container" style={{
  position: 'relative',
  zIndex: 1,
  padding: '80px 32px',
  textAlign: 'center'   // 👈 thêm
}}>
            <div style={{ maxWidth: 760, margin: '0 auto',textAlign: 'center' }}>
              <p className="section-label reveal" style={{ marginBottom: 28 }}>
                Studio ảnh viện áo cưới · Premium
              </p>

              <h1 className="hero-title reveal reveal-delay-1" style={{ marginBottom: 28 }}>
                Lưu giữ khoảnh khắc<br />
                <em>đẹp nhất cuộc đời</em> bạn
              </h1>

              <p className="reveal reveal-delay-2" style={{
                fontSize: 'clamp(14px, 4vw, 16px)', lineHeight: 1.8, color: 'var(--text-sub)',
                maxWidth: 520, marginBottom: 44,
              }}>
                Album cưới cao cấp – trải nghiệm chọn ảnh tinh tế dành riêng cho cô dâu & chú rể. Hiện đại, sang trọng, và hoàn toàn cá nhân hoá.
              </p>

              <div className="reveal reveal-delay-3" style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
                <Link href="/project/demo" className="btn-gold">Xem album mẫu</Link>
                <button className="btn-outline" onClick={() => openModal('medium')}>Nhận tư vấn</button>
              </div>

              {/* Stats */}
              <div className="reveal reveal-delay-4" style={{
                display: 'flex', gap: 48, marginTop: 72, justifyContent: 'center',
                paddingTop: 40, borderTop: '1px solid var(--border)',
              }}>
                {[['200+', 'Cặp đôi tin tưởng'], ['5★', 'Đánh giá trung bình'], ['48h', 'Thời gian xử lý']].map(([n, l]) => (
                  <div key={n}>
                    <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.2rem', fontWeight: 300, color: 'var(--gold-light)', lineHeight: 1 }}>{n}</p>
                    <p style={{ fontSize: 11, letterSpacing: '0.15em', color: 'var(--text-sub)', marginTop: 6, textTransform: 'uppercase' }}>{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Decorative right edge */}
          <div style={{
            position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)',
            width: 1, height: '60%',
            background: 'linear-gradient(180deg, transparent, var(--gold-dim), transparent)',
            opacity: 0.3,
          }} />
        </section>

        {/* ══════════════════════════════════════════════════
            PROBLEM
        ══════════════════════════════════════════════════ */}
        <section style={{ padding: '100px 0', background: '#070707' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <p className="section-label reveal" style={{ marginBottom: 16 }}>Vấn đề thường gặp</p>
              <h2 className="section-heading reveal reveal-delay-1">
                Chọn ảnh cưới chưa bao giờ<br /><em>dễ dàng…</em>
              </h2>
            </div>

            <div className="gallery-grid">
              {[
                { icon: '📂', title: 'Quá nhiều ảnh khó chọn', desc: 'Hàng trăm tấm ảnh, không biết bắt đầu từ đâu, dễ bỏ sót những khoảnh khắc đẹp.' },
                { icon: '📧', title: 'Gửi file rối rắm', desc: 'Email qua lại, file đính kèm lung tung, dễ nhầm phiên bản và mất thông tin.' },
                { icon: '😵', title: 'Dễ nhầm lẫn', desc: 'Chọn xong lại quên, ghi chú thất lạc, studio và khách hiểu sai nhau.' },
              ].map((item, i) => (
                <div key={i} className={`problem-card reveal reveal-delay-${i + 1}`}>
                  <span style={{ fontSize: '2rem', marginBottom: 16, display: 'block' }}>{item.icon}</span>
                  <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', marginBottom: 10, fontWeight: 400 }}>{item.title}</h3>
                  <p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--text-sub)' }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="container"><div className="gold-divider" /></div>

        {/* ══════════════════════════════════════════════════
            SOLUTION
        ══════════════════════════════════════════════════ */}
        <section style={{ padding: '80px 0' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 80, alignItems: 'center' }}>
              <div>
                <p className="section-label reveal" style={{ marginBottom: 16 }}>Giải pháp</p>
                <h2 className="section-heading reveal reveal-delay-1" style={{ marginBottom: 32 }}>
                  Giải pháp chọn ảnh<br /><em>hiện đại</em>
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {[
                    ['Xem album online', 'Giao diện đẹp, không cần cài app, truy cập mọi thiết bị.'],
                    ['Chọn ảnh nhanh', 'Click một cái để chọn, ghi chú yêu cầu ngay trên ảnh.'],
                    ['Lưu ngay lập tức', 'Kết quả được lưu real-time, không lo mất dữ liệu.'],
                    ['Không cần đăng nhập', 'Chỉ cần link từ studio, khách hàng vào xem ngay lập tức.'],
                  ].map(([title, desc], i) => (
                    <div key={i} className={`reveal reveal-delay-${i + 1}`} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%',
                        border: '1px solid var(--gold-dim)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, color: 'var(--gold)', fontSize: 13, fontWeight: 500,
                      }}>✓</div>
                      <div>
                        <p style={{ fontWeight: 500, marginBottom: 4 }}>{title}</p>
                        <p style={{ fontSize: 13, color: 'var(--text-sub)', lineHeight: 1.6 }}>{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visual mock */}
              <div className="reveal reveal-delay-2" style={{
                background: 'linear-gradient(135deg, #0f0c06, #1a1508)',
                border: '1px solid var(--border)',
                borderRadius: 20,
                padding: 32,
                aspectRatio: '4/3',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}>
                <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                  {['#ff5f57','#ffbd2e','#28ca41'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
                </div>
                <p style={{ fontSize: 9, letterSpacing: '0.3em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 12 }}>Album Khách Hàng</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 8, flex: 1 }}>
                  {[...Array(6)].map((_, i) => (
                    <div key={i} style={{
                      borderRadius: 6,
                      background: `linear-gradient(135deg, #1a1208, #${['2d2010','231a0c','1e1a10','2a1e0e','1a1510','221808'][i]})`,
                      border: i === 2 ? '1px solid var(--gold)' : '1px solid rgba(212,175,55,0.08)',
                      position: 'relative',
                    }}>
                      {i === 2 && (
                        <div style={{
                          position: 'absolute', top: 6, right: 6,
                          width: 16, height: 16, borderRadius: '50%',
                          background: 'var(--gold)', display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                          fontSize: 9, color: '#000', fontWeight: 700,
                        }}>✓</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container"><div className="gold-divider" /></div>

        {/* ══════════════════════════════════════════════════
            HOW IT WORKS
        ══════════════════════════════════════════════════ */}
        <section style={{ padding: '80px 0' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <p className="section-label reveal" style={{ marginBottom: 16 }}>Quy trình</p>
              <h2 className="section-heading reveal reveal-delay-1">Chỉ 3 bước đơn giản</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 2, background: 'var(--border)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
              {[
                { n: '01', title: 'Nhận link từ studio', desc: 'Studio gửi đường link album riêng của bạn qua Zalo hoặc email.' },
                { n: '02', title: 'Chọn ảnh yêu thích', desc: 'Duyệt qua toàn bộ album, click chọn ảnh và ghi ghi chú chỉnh sửa.' },
                { n: '03', title: 'Gửi kết quả', desc: 'Nhấn gửi, studio nhận danh sách và bắt đầu xử lý ngay cho bạn.' },
              ].map((step, i) => (
                <div key={i} className={`reveal reveal-delay-${i + 1}`} style={{
                  background: '#070707', padding: '44px 36px',
                  transition: 'background 0.2s',
                }}>
                  <p className="step-number">{step.n}</p>
                  <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.35rem', fontWeight: 400, margin: '12px 0 12px', letterSpacing: '0.03em' }}>{step.title}</h3>
                  <p style={{ fontSize: 13, lineHeight: 1.75, color: 'var(--text-sub)' }}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            GALLERY
        ══════════════════════════════════════════════════ */}
        <section style={{ padding: '80px 0', background: '#060504' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <p className="section-label reveal" style={{ marginBottom: 16 }}>Portfolio</p>
              <h2 className="section-heading reveal reveal-delay-1">Khoảnh khắc <em>đẹp nhất</em></h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gridTemplateRows: 'auto', gap: 12 }}>
              {photos.map((photo, i) => (
  <div
    key={photo.id}
    className={`gallery-item reveal reveal-delay-${(i % 3) + 1}`}
    style={{ aspectRatio: '3 / 4' }}
  >

    <img
      
  src={`https://drive.google.com/uc?export=view&id=${photo.id}`}
  onError={(e) => {
    e.currentTarget.src = `https://lh3.googleusercontent.com/d/${photo.id}`
  }}
      alt={photo.name}
      className="gallery-item-inner"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover'
      }}
    />

    <div className="gallery-overlay">
      <span style={{
        fontSize: 11,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: 'rgba(212,175,55,0.85)'
      }}>
        {photo.name}
      </span>
    </div>

  </div>
))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            USP
        ══════════════════════════════════════════════════ */}
        <section style={{ padding: '100px 0' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <p className="section-label reveal" style={{ marginBottom: 16 }}>Điểm khác biệt</p>
              <h2 className="section-heading reveal reveal-delay-1">Tại sao chọn <em>Decaz</em></h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              {[
                { icon: '💎', title: 'Trải nghiệm sang trọng', desc: 'Giao diện được thiết kế chuẩn luxury, xứng tầm với ngày trọng đại của bạn.' },
                { icon: '👥', title: 'Đội ngũ chuyên nghiệp', desc: 'Nhiếp ảnh gia giàu kinh nghiệm, thấu hiểu cảm xúc và giá trị của từng khoảnh khắc.' },
                { icon: '🤝', title: 'Hỗ trợ tận tâm', desc: 'Đồng hành từ lúc chụp đến khi nhận album, luôn sẵn sàng giải đáp mọi thắc mắc.' },
                { icon: '⚡', title: 'Giảm thời gian xử lý', desc: 'Hệ thống chọn ảnh thông minh giúp rút ngắn 70% thời gian so với quy trình truyền thống.' },
              ].map((item, i) => (
                <div key={i} className={`usp-card reveal reveal-delay-${i + 1}`}>
                  <span className="usp-icon">{item.icon}</span>
                  <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.15rem', fontWeight: 400, marginBottom: 10 }}>{item.title}</h3>
                  <p style={{ fontSize: 12, lineHeight: 1.75, color: 'var(--text-sub)' }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            PRICING
        ══════════════════════════════════════════════════ */}
        <section id="pricing" style={{ padding: '100px 0', background: '#060504' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <p className="section-label reveal" style={{ marginBottom: 16 }}>Bảng giá dịch vụ</p>
              <h2 className="section-heading reveal reveal-delay-1">Chọn gói phù hợp<br /><em>với bạn</em></h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, alignItems: 'start' }}>
              {plans.map((plan, i) => (
                <div key={plan.key}
                  className={`pricing-card reveal reveal-delay-${i + 1}${plan.highlight ? ' highlight' : ''}${plan.glow ? ' glow' : ''}`}
                >
                  {plan.badge && (
                    <div style={{
                      position: 'absolute', top: -1, left: '50%', transform: 'translateX(-50%)',
                      background: 'linear-gradient(135deg, var(--gold-dim), var(--gold))',
                      color: '#000', fontSize: 9, fontWeight: 700,
                      letterSpacing: '0.25em', textTransform: 'uppercase',
                      padding: '5px 16px', borderRadius: '0 0 8px 8px',
                    }}>{plan.badge}</div>
                  )}

                  <p style={{ fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'var(--gold-dim)', marginBottom: 12, marginTop: plan.badge ? 16 : 0 }}>{plan.name}</p>
                  <p className="price-amount" style={{ marginBottom: 8 }}>{plan.price}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-sub)', marginBottom: 28, lineHeight: 1.6 }}>{plan.desc}</p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                    {plan.included.map(f => (
                      <p key={f} className="feature-item"><span style={{ color: 'var(--gold)', flexShrink: 0 }}>✔</span> {f}</p>
                    ))}
                    {plan.excluded.map(f => (
                      <p key={f} className="feature-item excluded"><span style={{ flexShrink: 0 }}>✘</span> {f}</p>
                    ))}
                    {plan.special.length > 0 && (
                      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10, marginTop: 4, display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {plan.special.map(f => (
                          <p key={f} className="feature-item special">{f}</p>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    className={plan.highlight ? 'btn-gold' : 'btn-outline'}
                    style={{ width: '100%' }}
                    onClick={() => openModal(plan.key)}
                  >
                    Chọn gói này
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            TESTIMONIALS
        ══════════════════════════════════════════════════ */}
        <section style={{ padding: '100px 0' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <p className="section-label reveal" style={{ marginBottom: 16 }}>Cảm nhận khách hàng</p>
              <h2 className="section-heading reveal reveal-delay-1">Họ nói gì về <em>Decaz</em></h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
              {testimonials.map((t, i) => (
                <div key={i} className={`testi-card reveal reveal-delay-${i + 1}`}>
                  <p style={{ fontSize: '1.4rem', color: 'var(--gold)', marginBottom: 16, letterSpacing: 2 }}>❝</p>
                  <p style={{ fontSize: 14, lineHeight: 1.8, color: 'rgba(255,255,255,0.8)', marginBottom: 24, fontStyle: 'italic' }}>{t.text}</p>
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: 18 }}>
                    <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', fontWeight: 400, color: 'var(--gold-light)' }}>{t.name}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-sub)', marginTop: 2, letterSpacing: '0.05em' }}>{t.wedding}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            CTA CUỐI
        ══════════════════════════════════════════════════ */}
        <section id="contact" style={{
          padding: '120px 0',
          background: 'linear-gradient(180deg, #060504 0%, #0a0805 50%, #050505 100%)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(212,175,55,0.06) 0%, transparent 70%)' }} />
          <div className="container" style={{ position: 'relative', textAlign: 'center' }}>
            <p className="section-label reveal" style={{ marginBottom: 20 }}>Bắt đầu ngay hôm nay</p>
            <h2 className="section-heading reveal reveal-delay-1" style={{ marginBottom: 20 }}>
              Bắt đầu trải nghiệm<br /><em>ngay hôm nay</em>
            </h2>
            <p className="reveal reveal-delay-2" style={{ fontSize: 15, color: 'var(--text-sub)', marginBottom: 44, lineHeight: 1.7 }}>
              Hàng trăm cặp đôi đã tin tưởng. Đến lượt bạn.
            </p>
            <div className="reveal reveal-delay-3" style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn-gold" style={{ fontSize: 13, padding: '16px 40px' }} onClick={() => openModal('medium')}>
                Nhận tư vấn miễn phí
              </button>
              <Link href="/project/demo" className="btn-outline" style={{ fontSize: 13, padding: '16px 40px' }}>
                Xem album demo
              </Link>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            FOOTER
        ══════════════════════════════════════════════════ */}
        <footer style={{
          borderTop: '1px solid var(--border)',
          padding: '48px 0 32px',
          background: '#030303',
        }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 48, marginBottom: 48 }}>
              <div>
                <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', fontWeight: 300, letterSpacing: '0.15em', color: 'var(--gold-light)', marginBottom: 12 }}>DECAZ</p>
                <p style={{ fontSize: 13, color: 'var(--text-sub)', lineHeight: 1.8, maxWidth: 280 }}>
                  Lưu giữ khoảnh khắc, nâng tầm thương hiệu.<br />Studio ảnh viện áo cưới cao cấp.
                </p>
              </div>
              <div>
                <p style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold-dim)', marginBottom: 16 }}>Liên kết</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[['#pricing', 'Bảng giá'], ['/project/demo', 'Album demo'], ['/admin', 'Admin']].map(([href, label]) => (
                    <a key={href} href={href} className="footer-link">{label}</a>
                  ))}
                </div>
              </div>
              <div>
                <p style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold-dim)', marginBottom: 16 }}>Liên hệ</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <a href="tel:0987603615" className="footer-link">0987 603 615</a>
                  <a href="mailto:decaztran@gmail.com" className="footer-link">decaztran@gmail.com</a>
                  <a href="https://www.facebook.com/transon.04201" className="footer-link">Facebook</a>
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>© 2025 Decaz Media. All rights reserved.</p>
              <p style={{ fontSize: 11, color: 'rgba(212,175,55,0.3)', letterSpacing: '0.15em' }}>LUXURY WEDDING STUDIO</p>
            </div>
          </div>
        </footer>

      </main>

      {/* ══════════════════════════════════════════════════
          MODAL TƯ VẤN
      ══════════════════════════════════════════════════ */}
      {modalOpen && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal-box">

            {!submitted ? (
              <>
                <div style={{ marginBottom: 28, paddingBottom: 24, borderBottom: '1px solid var(--border)' }}>
                  <p style={{ fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'var(--gold-dim)', marginBottom: 8 }}>Decaz Media · Tư vấn</p>
                  <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.9rem', fontWeight: 400 }}>Nhận tư vấn dịch vụ</h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

                  <div>
                    <label className="modal-label">Họ và tên *</label>
                    <input className="modal-input" placeholder="Nguyễn Thị Linh" value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                  </div>

                  <div>
                    <label className="modal-label">Số điện thoại *</label>
                    <input className="modal-input" placeholder="0900 000 000" value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                  </div>

                  <div>
                    <label className="modal-label">Chọn gói dịch vụ</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {plans.map(p => (
                        <div key={p.key}
                          className={`plan-radio${form.plan === p.key ? ' active' : ''}`}
                          onClick={() => setForm(f => ({ ...f, plan: p.key }))}
                        >
                          <span style={{ width: 16, height: 16, borderRadius: '50%', border: `2px solid ${form.plan === p.key ? 'var(--gold)' : 'rgba(255,255,255,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            {form.plan === p.key && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)', display: 'block' }} />}
                          </span>
                          <span style={{ flex: 1 }}>{p.name}</span>
                          <span style={{ fontSize: 12, color: form.plan === p.key ? 'var(--gold)' : 'rgba(255,255,255,0.4)' }}>{p.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="modal-label">Ghi chú thêm</label>
                    <textarea className="modal-input" rows={3} placeholder="Ngày cưới dự kiến, yêu cầu đặc biệt..."
                      value={form.note}
                      onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                      style={{ resize: 'none' }}
                    />
                  </div>

                  <button className="btn-gold" style={{ width: '100%', marginTop: 4 }} onClick={handleSubmit} disabled={sending}>
                    {sending ? 'Đang gửi...' : 'XÁC NHẬN'}
                  </button>

                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', textAlign: 'center', lineHeight: 1.6 }}>
                    Chúng tôi sẽ liên hệ trong vòng 2 giờ làm việc
                  </p>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  border: '1px solid var(--gold-dim)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 24px', fontSize: '1.5rem', color: 'var(--gold)',
                }}>✦</div>
                <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 400, marginBottom: 12 }}>Cảm ơn bạn!</h2>
                <p style={{ fontSize: 13, color: 'var(--text-sub)', lineHeight: 1.8, marginBottom: 32 }}>
                  Yêu cầu tư vấn đã được ghi nhận.<br />
                  Đội ngũ Decaz sẽ liên hệ với <strong style={{ color: 'var(--gold)' }}>{form.name}</strong> trong thời gian sớm nhất.
                </p>
                <button className="btn-gold" style={{ width: '100%' }} onClick={closeModal}>Đóng</button>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  )
}