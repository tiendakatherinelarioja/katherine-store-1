/**
 * Compresses an image file and converts it to WebP format using HTML5 Canvas.
 * 
 * @param {File} file - The original image file (JPEG, PNG, etc.)
 * @param {Object} options - Compression options
 * @param {number} options.maxWidth - Maximum width of the output image (default: 1000)
 * @param {number} options.maxHeight - Maximum height of the output image (default: 1000)
 * @param {number} options.quality - Compression quality between 0 and 1 (default: 0.8)
 * @returns {Promise<Blob>} A promise that resolves to the compressed WebP Blob.
 */
export function compressToWebP(file, { maxWidth = 1000, maxHeight = 1000, quality = 0.8 } = {}) {
  return new Promise((resolve, reject) => {
    // Check if the file is an image
    if (!file.type.startsWith('image/')) {
      reject(new Error('El archivo proporcionado no es una imagen válida.'));
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        // Calculate new dimensions keeping aspect ratio
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

        // Create Canvas element
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        // Draw image on canvas
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas content to WebP blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Error al convertir la imagen a WebP.'));
            }
          },
          'image/webp',
          quality
        );
      };

      img.onerror = () => {
        reject(new Error('Error al cargar la imagen para compresión.'));
      };
    };

    reader.onerror = () => {
      reject(new Error('Error al leer el archivo de imagen.'));
    };
  });
}
