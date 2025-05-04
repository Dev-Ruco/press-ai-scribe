
/**
 * Utility functions for file handling
 */

/**
 * Convert a File object to a data URL for preview
 */
export const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Check if a file is within size limits
 */
export const isFileSizeValid = (file: File, maxSizeMB: number = 50): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

/**
 * Get a file type category based on MIME type
 */
export const getFileTypeCategory = (file: File): 'audio' | 'document' | 'image' | 'video' | 'unknown' => {
  const mimeType = file.type.toLowerCase();
  
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  
  // Documents
  const documentTypes = [
    'application/pdf', 
    'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'text/markdown'
  ];
  
  if (documentTypes.includes(mimeType)) return 'document';
  
  return 'unknown';
};

/**
 * Format file size in a human-readable way
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / 1048576).toFixed(1) + ' MB';
};
