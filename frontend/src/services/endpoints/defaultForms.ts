export const routes = {
  login: () => "user/login",
  registerPF: () => "user/registerPF",
  registerPJ: () => "user/registerPJ",
  recoverPassword: () => "user/forgot-password",
  createPassword: () => "user/reset-password",
  validateToken: (token: string) => `user/reset-password/${token}`,
  sendAccountActivation: () => "user/send-account-activation",
  validateTokenRegister: (token: string) => `user/activate-account/${token}`,
};
