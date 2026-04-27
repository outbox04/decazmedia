import './globals.css'
import { Cormorant_Garamond } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"

const font = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300","400","600"],
});

export const metadata = {
  title: 'Decaz Media – Album cưới cao cấp',
  description: 'Lưu giữ khoảnh khắc đẹp nhất cuộc đời bạn. Album cưới cao cấp – trải nghiệm chọn ảnh tinh tế dành riêng cho cô dâu & chú rể.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
  <body className={font.className}>
    {children}
    <SpeedInsights />
    <Analytics />
  </body>
</html>
  )
}
