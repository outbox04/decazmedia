import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { project_slug, selections } = body

    const rows = selections.map((item: any) => ({
      project_slug,
      photo_id: item.id,
      note: item.note || ""
    }))

    const { error } = await supabase
      .from("selections")
      .upsert(rows, {
    onConflict: "project_slug,photo_id"
  })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}