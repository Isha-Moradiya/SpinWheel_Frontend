// Input validation and sanitization utilities

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters")
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain an uppercase letter")
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain a lowercase letter")
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain a number")
  }

  return { valid: errors.length === 0, errors }
}

export const validateCategoryName = (name: string): boolean => {
  return name.trim().length > 0 && name.trim().length <= 50
}

export const sanitizeInput = (input: string): string => {
  return input.replace(/[<>]/g, "").trim()
}

export const validateOTP = (otp: string): boolean => {
  return /^\d{6}$/.test(otp.trim())
}
