export const routes = {
  login: () => "auth/login",
  registerPF: () => "auth/registerPF",
  registerPJ: () => "auth/registerPJ",
  recoverPassword: () => "auth/forgot-password",
  createPassword: () => "auth/reset-password",
  validateToken: (token: string) => `auth/reset-password/${token}`,
  sendAccountActivation: () => "auth/send-account-activation",
  validateTokenRegister: (token: string) => `auth/activate-account/${token}`,
};
