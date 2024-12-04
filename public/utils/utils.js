export function isValidEmail(email) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

export function isValidPassword(password) {
  return (
    password.length >= 8 &&
    password.length <= 20 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[!@#$%^&*]/.test(password)
  );
}

export function isValidNickname(nickname) {
  return !includeSpacing(nickname) && nickname.length > 0 && nickname.length <= 10;
}

export function includeSpacing(nickname) {
  return nickname.includes(' ');
}
