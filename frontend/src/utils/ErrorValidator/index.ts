import { AxiosError } from "axios";
import { toast } from "vue-sonner";

export function errorValidator(error: unknown) {
  const defaultError = "Ocorreu um erro desconhecido";

  if (error instanceof AxiosError) {
    const messageError =
      error.response?.data?.msg ??
      error.response?.data?.data?.msg ??
      error.response?.data?.message ??
      error.response?.data?.data?.message ??
      defaultError;
    toast.error(messageError);
  } else {
    toast.error(defaultError);
  }
}
