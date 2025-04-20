
import { supabase } from './client';

/**
 * Verifica se o bucket de áudio existe e cria caso não exista
 */
export async function setupAudioBucket() {
  const AUDIO_BUCKET = 'audio-files';
  
  try {
    // Verifica se o bucket existe
    const { data: buckets, error: listError } = await supabase
      .storage
      .listBuckets();
    
    if (listError) {
      throw listError;
    }
    
    // Verifica se o bucket já existe
    const bucketExists = buckets?.some(bucket => bucket.name === AUDIO_BUCKET);
    
    if (!bucketExists) {
      // Cria o bucket se não existir
      const { error: createError } = await supabase
        .storage
        .createBucket(AUDIO_BUCKET, {
          public: false,
          fileSizeLimit: 52428800, // 50MB em bytes
        });
      
      if (createError) {
        throw createError;
      }
      
      console.log(`Bucket ${AUDIO_BUCKET} created successfully`);
    } else {
      console.log(`Bucket ${AUDIO_BUCKET} already exists`);
    }
    
    return true;
  } catch (error) {
    console.error('Error setting up audio bucket:', error);
    return false;
  }
}
