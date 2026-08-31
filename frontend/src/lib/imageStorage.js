export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
export const MAX_IMAGE_SIZE_LABEL = "5 MB";
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
export const ALLOWED_IMAGE_EXTENSIONS = ".jpg,.jpeg,.png,.webp,.gif";

const hasValidSignature = async (file) => {
  const bytes = new Uint8Array(await file.slice(0, 16).arrayBuffer());

  if (file.type === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (file.type === "image/png") return bytes.slice(0, 8).every((byte, index) => byte === [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a][index]);
  if (file.type === "image/gif") return String.fromCharCode(...bytes.slice(0, 6)) === "GIF87a" || String.fromCharCode(...bytes.slice(0, 6)) === "GIF89a";
  if (file.type === "image/webp") return String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
  return false;
};

export const validateImageFile = async (file) => {
  if (!file) throw new Error("Lütfen bir görsel dosyası seçin.");
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Yalnızca JPG, PNG, WebP veya GIF görselleri yükleyebilirsiniz.");
  }
  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error(`Görsel boyutu ${MAX_IMAGE_SIZE_LABEL} sınırını aşamaz.`);
  }
  if (file.size === 0 || !(await hasValidSignature(file))) {
    throw new Error("Dosyanın içeriği geçerli bir görsel türüyle eşleşmiyor.");
  }
};
