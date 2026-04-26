import './globals.css'
export const metadata = { title: 'DECAZ MEDIA', description: 'Lưu giữ khoảnh khắc, nâng tầm thương hiệu' }
export default function RootLayout({children}:{children:React.ReactNode}){
 return <html lang='vi'><body>{children}</body></html>
}