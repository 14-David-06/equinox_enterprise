/**
 * Configuración de Cloudinary para Equinox Enterprise
 * Manejo de subida de archivos (PDFs de inspecciones preoperacionales)
 */

import { v2 as cloudinary } from 'cloudinary';

// Configuración desde variables de entorno
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export interface CloudinaryUploadResult {
  secure_url: string;
  signed_url: string;
  public_id: string;
  format: string;
  bytes: number;
}

/**
 * Genera una URL firmada para un recurso raw (PDF) en Cloudinary.
 * Las URLs firmadas permiten acceder a PDFs incluso cuando la entrega
 * de PDFs no firmados está restringida en la configuración de seguridad.
 */
function getSignedUrl(publicId: string): string {
  return cloudinary.url(publicId, {
    resource_type: 'raw',
    sign_url: true,
    secure: true,
    type: 'upload',
  });
}

/**
 * Sube un buffer (PDF) a Cloudinary en la carpeta especificada
 */
export async function uploadPDFToCloudinary(
  pdfBuffer: Buffer,
  fileName: string,
  folder: string = 'Equinox/Preoperacionales'
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw',
        folder,
        public_id: fileName,
        format: 'pdf',
        overwrite: true,
      },
      (error, result) => {
        if (error) {
          console.error('Error subiendo PDF a Cloudinary:', error);
          reject(error);
        } else if (result) {
          const signedUrl = getSignedUrl(result.public_id);
          resolve({
            secure_url: result.secure_url,
            signed_url: signedUrl,
            public_id: result.public_id,
            format: result.format,
            bytes: result.bytes,
          });
        } else {
          reject(new Error('No se recibió resultado de Cloudinary'));
        }
      }
    );

    uploadStream.end(pdfBuffer);
  });
}

export default cloudinary;
