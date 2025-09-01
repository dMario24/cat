'use server'

import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export type FormState = {
  error: string | null;
  success: boolean;
};

export async function createFeedingRecord(prevState: FormState, formData: FormData): Promise<FormState> {
  const notes = formData.get('notes') as string
  const picture = formData.get('picture') as File

  if (picture.size === 0) {
    return { error: '사진을 선택해주세요.', success: false };
  }

  // 1. Upload image to Supabase Storage
  const { data: imageData, error: imageError } = await supabase.storage
    .from('cat-pictures')
    .upload(`${Date.now()}-${picture.name}`, picture)

  if (imageError) {
    console.error('Error uploading image:', imageError)
    return { error: imageError.message, success: false }
  }

  // 2. Get public URL of the uploaded image
  const { data: urlData } = supabase.storage
    .from('cat-pictures')
    .getPublicUrl(imageData.path)

  const imageUrl = urlData.publicUrl

  // 3. Insert new record into the database
  const { error: recordError } = await supabase
    .from('feeding_records')
    .insert([{ notes, image_url: imageUrl }])

  if (recordError) {
    console.error('Error inserting record:', recordError)
    return { error: recordError.message, success: false }
  }

  // 4. Revalidate the page
  revalidatePath('/')

  return { success: true, error: null }
}
