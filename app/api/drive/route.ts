import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const folderId = searchParams.get('folderId')

  if (!folderId) {
    return NextResponse.json({ error: 'Missing folderId' }, { status: 400 })
  }

  try {
    const query = `'${folderId}' in parents and mimeType contains 'image/'`

    const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
      query
    )}&fields=files(id,name,mimeType,thumbnailLink)&pageSize=1000&key=${
      process.env.GOOGLE_API_KEY
    }`

    console.log('URL:', url)

    const res = await fetch(url)
    const data = await res.json()

    // 🔥 LOG để debug
    console.log('GOOGLE RESPONSE:', data)

    if (data.error) {
      return NextResponse.json(data.error, { status: 500 })
    }

    return NextResponse.json(data.files || [])
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Fetch failed' }, { status: 500 })
  }
}