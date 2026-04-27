import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)
console.log("KEY:", process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  const { name, phone, plan, note } = await req.json()

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'sentotran2001@gmail.com',
      subject: 'Khách mới đăng ký',
      html: `
        <h3>Khách mới</h3>
        <p>Tên: ${name}</p>
        <p>Phone: ${phone}</p>
        <p>Gói: ${plan}</p>
        <p>Note: ${note}</p>
      `
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.log(err)
    return NextResponse.json({ error: "Send mail failed" }, { status: 500 })
  }
}