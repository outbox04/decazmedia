import Link from 'next/link'
export default function Home(){
 return <main className='container'>
  <header className='flex justify-between py-6'>
   <h1 className='text-3xl font-semibold tracking-[0.25em]'>DECAZ MEDIA</h1>
   <Link href='/admin' className='btn'>Admin</Link>
  </header>
  <section className='card p-16 mt-10 text-center'>
   <p className='text-sm uppercase tracking-[0.4em] text-gray-400'>Black Luxury Edition</p>
   <h2 className='text-6xl mt-6'>Lưu giữ khoảnh khắc, nâng tầm thương hiệu</h2>
   <p className='mt-6 text-gray-300'>Giải pháp album khách hàng chuyên nghiệp cho studio & doanh nghiệp.</p>
   <div className='mt-10 flex gap-4 justify-center'>
    <Link href='/admin' className='btn'>Quản trị hệ thống</Link>
    <Link href='/project/demo' className='btn'>Xem demo khách hàng</Link>
   </div>
  </section>
 </main>
}