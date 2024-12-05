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

/**
 * 10진수를 간략한 표현으로 변환
 * @param {number} num 10진수
 * @returns {string} 변환된 문자열 형식의 수
 * @description 1,000 이상 -> 1K, 10,000 이상 -> 10K, 100,000 이상 -> 100K
 */
export function changeNumberExpression(num) {
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}B`;
  else if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  else if (num >= 1_000) return `${(num / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  return num.toString();
}

export function isValidNickname(nickname) {
  return !includeSpacing(nickname) && nickname.length > 0 && nickname.length <= 10;
}

export function includeSpacing(nickname) {
  return nickname.includes(' ');
}
