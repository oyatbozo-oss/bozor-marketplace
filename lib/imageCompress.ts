// Клиентское сжатие/конвертация фото перед загрузкой.
// Уменьшает размер до maxSize по большей стороне и кодирует в WebP —
// файлы становятся легче в разы при минимальной потере качества.
// При любой ошибке возвращает исходный файл (безопасный откат).
export async function compressImage(
  file: File,
  maxSize = 1280,
  quality = 0.82
): Promise<File> {
  if (!file.type.startsWith('image/')) return file;
  try {
    const bitmap = await createImageBitmap(file);
    let { width, height } = bitmap;
    if (width > maxSize || height > maxSize) {
      const scale = Math.min(maxSize / width, maxSize / height);
      width = Math.round(width * scale);
      height = Math.round(height * scale);
    }
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close?.();

    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob(resolve, 'image/webp', quality)
    );
    if (!blob || blob.size === 0) return file;
    // Если вдруг WebP вышел тяжелее оригинала — оставляем оригинал
    if (blob.size >= file.size) return file;

    const name = file.name.replace(/\.[^.]+$/, '') + '.webp';
    return new File([blob], name, { type: 'image/webp' });
  } catch {
    return file;
  }
}
