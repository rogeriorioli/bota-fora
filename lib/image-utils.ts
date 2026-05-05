/**
 * Converts a File object to a Base64 string.
 * @param file The file to convert
 * @returns A promise that resolves to the Base64 string
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Redimensiona e comprime um arquivo de imagem para evitar o limite de 16MB do MongoDB.
 * @param file O arquivo original
 * @param maxWidth Largura máxima
 * @param maxHeight Altura máxima
 * @param quality Qualidade (0.0 a 1.0)
 */
export const compressImage = async (file: File, maxWidth = 800, maxHeight = 800, quality = 0.6): Promise<string> => {
  const originalBase64 = await fileToBase64(file);
  
  // Se o arquivo for pequeno (< 200KB), não precisa comprimir
  if (file.size < 200 * 1024) {
    return originalBase64;
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(originalBase64);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Usar JPEG para compressão real de pixels
        const compressed = canvas.toDataURL('image/jpeg', quality);
        console.log(`Imagem comprimida: de ${(file.size/1024).toFixed(1)}KB para ${(compressed.length/1333).toFixed(1)}KB`);
        resolve(compressed);
      } catch (err) {
        resolve(originalBase64);
      }
    };
    img.onerror = () => resolve(originalBase64);
    img.src = originalBase64;
  });
};

export const cleanBase64 = (base64: string): string => {
  return base64.replace(/^data:image\/[a-z]+;base64,/, '');
};
