export const isValidEmail = (email: string) => /^\S+@\S+\.\S+$/.test(email);
export const isStrongPassword = (password: string) => password.length >= 8;