const user = localStorage.getItem('user');

if (!user) {
  alert('로그인이 필요한 페이지입니다.');
  window.location.href = '/auth/login';
}
