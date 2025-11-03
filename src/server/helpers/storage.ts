// import { createClient } from '@supabase/supabase-js'
import { supabase } from '../configs/db'

// Ganti dengan URL dan anon key dari project kamu
// const supabase = createClient(import.meta.env.SUPABASE_URL || "", import.meta.env.SUPABASE_KEY || "")
const BUCKET = "penelitian"

export const uploadFile = async (folder:string, fileName:string, file:File) => {

  const filePath = folder+'/'+fileName
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, file)
  if (error) {
    console.error('Upload error:', error)
    return ""
  } else {
    console.log('Uploaded:', data)
    return filePath
  }
}

export const downloadFile = async (filePath:string) => {
  // const filePath = `${folder}/${fileName}`

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .download(filePath)

  if (error) {
    console.error("Download error:", error)
    return null
  }

  console.log("Downloaded:", filePath)
  return data // data adalah Blob
}

export const uploadFilePermohonan = async (fileName:string, file:File) => {
    return await uploadFile("permohonan", fileName, file)
}