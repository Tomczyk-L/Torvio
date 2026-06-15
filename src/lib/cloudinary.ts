// lib/cloudinary.ts
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

/** Upload zdjęcia ogłoszenia — zwraca URL i public_id */
export async function uploadListingImage(
  file: Buffer | string,
  listingId: string,
  position: number
): Promise<{ url: string; publicId: string }> {
  const result = await cloudinary.uploader.upload(
    typeof file === "string" ? file : `data:image/jpeg;base64,${file.toString("base64")}`,
    {
      folder: `automarket/listings/${listingId}`,
      public_id: `photo_${position}`,
      overwrite: true,
      transformation: [
        { width: 1200, height: 900, crop: "limit" },
        { quality: "auto:good" },
        { fetch_format: "auto" },
      ],
    }
  );

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
}

/** Usuwa zdjęcie z Cloudinary */
export async function deleteListingImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

/** Generuje URL miniaturki ze zdjęcia Cloudinary */
export function getThumbnailUrl(url: string, width = 400, height = 300): string {
  // Wstawia transformację w URL Cloudinary
  return url.replace(
    "/upload/",
    `/upload/w_${width},h_${height},c_fill,f_auto,q_auto/`
  );
}
