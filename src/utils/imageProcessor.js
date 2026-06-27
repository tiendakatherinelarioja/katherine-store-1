/**
 * Compresses an image file and converts it to WebP format using HTML5 Canvas.
 * 
 * Security constraints enforced:
 *  - MAX_FILE_SIZE_MB: Prevents browser memory exhaustion from huge files.
 *  - ALLOWED_MIME_TYPES: Strict whitelist instead of a loose prefix check (avoids MIME spoofing).
 *  - MAX_CANVAS_DIMENSION: Hard cap on canvas pixels to prevent coordinate-overflow DoS.
 * 
 * @param {File} file - The original image file (JPEG, PNG, etc.)
 * @param {Object} options - Compression options
 * @param {number} options.maxWidth - Maximum width of the output image (default: 1000)
 * @param {number} options.maxHeight - Maximum height of the output image (default: 1000)
 * @param {number} options.quality - Compression quality between 0 and 1 (default: 0.8)
 * @returns {Promise<Blob>} A promise that resolves to the compressed WebP Blob.
 */

const MAX_FILE_SIZE_MB = 15;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
const MAX_CANVAS_DIMENSION = 4096; // Hard limit to prevent DoS via enormous canvases

export function compressToWebP(file, { maxWidth = 1000, maxHeight = 1000, quality = 0.8 } = {}) {
  return new Promise((resolve, reject) => {
    // 1. Validate MIME type against explicit whitelist (not just a prefix)
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      reject(new Error(`Tipo de archivo no permitido. Solo se aceptan: JPEG, PNG, WebP, GIF, AVIF.`));
      return;
    }

    // 2. Validate file size before loading into memory
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      reject(new Error(`El archivo es demasiado grande. El máximo permitido es ${MAX_FILE_SIZE_MB}MB.`));
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        // 3. Clamp source dimensions to absolute max BEFORE applying user-defined limits
        //    This prevents DoS if the image header reports absurd dimensions.
        let width = Math.min(img.width, MAX_CANVAS_DIMENSION);
        let height = Math.min(img.height, MAX_CANVAS_DIMENSION);

        // 4. Scale down to user-defined maxWidth/maxHeight maintaining aspect ratio
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
        reject(new Error('El archivo de imagen está corrupto o no es válido.'));
      };
    };

    reader.onerror = () => {
      reject(new Error('Error al leer el archivo de imagen.'));
    };
  });
}
