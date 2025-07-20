import { toast } from "vue-sonner";

const types = ["png", "jpg", "jpeg", "webp"];

/**
 * Função para validar o tamanho do arquivo ( max: 5MB )
 */
export function validateFileSize5MB(file: File) {
  if (file.size > 5 * 1024 * 1024) {
    toast.warning("O tamanho do arquivo excede 5MB. Selecione um arquivo menor!");
    return false;
  }

  if (!file.type.startsWith("image/")) {
    toast.error("Tipo de arquivo não suportado!");
    return false;
  }

  const type = file.type.replace("image/", "");

  if (!types.includes(type)) {
    toast.error("Tipo de arquivo não suportado!");
    return false;
  }

  return true;
}

/**
 * Função para validar o tamanho do arquivo ( max: 10 MB )
 */
export function validateFileSize10MB(file: File) {
  if (file.size > 10 * 1024 * 1024) {
    toast.warning("O tamanho do arquivo excede 10MB. Selecione um arquivo menor!");
    return false;
  }

  if (!file.type.startsWith("image/")) {
    toast.error("Tipo de arquivo não suportado!");
    return false;
  }

  const type = file.type.replace("image/", "");

  if (!types.includes(type)) {
    toast.error("Tipo de arquivo não suportado!");
    return false;
  }

  return true;
}
