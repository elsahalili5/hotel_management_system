export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmail = (email?: string) => {
  const isValid = email && emailRegex.test(email.trim());

  return isValid;
};
