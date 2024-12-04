class Header extends HTMLElement {
  constructor() {
    super();

    // Shadow DOM 생성
    this.attachShadow({ mode: 'open' });

    // 헤더 구조 정의
    this.shadowRoot.innerHTML = `
      <style>
        .header {
          width: 100%;
          min-height: 8vh;
          border-bottom: 2px solid gray;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        
        .header-item-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 600px;
          height: 100%;
          margin: auto;
        }
        
        .back-button {
          border: none;
          background: none;
          font-size: 26px;
          margin-left: 15px;
          cursor: pointer;
          color: darkgray;
        }
        
        .back-button,
        .avatar-dropdown-container {
          visibility: hidden; /* 기본적으로 숨김 */
        }
        
        .text {
          font-size: 24px;
          font-weight: bold;
        }
        
        .visible {
          visibility: visible; /* 보이는 요소 */
        }
        
        .avatar-dropdown-container {
          position: relative;
          display: inline-block;
        }  
        
        .avatar-dropdown-button {
          border: 1px solid lightgray;
          border-radius: 50%;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        
        .avatar-dropdown-menu {
          display: none;
          position: absolute;
          top: 47px;
          left: 0;
          background: lightgray;
          border 1px solid #ccc;
          border-radius: 5px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          min-width: 150px;
        }
        
        .avatar-dropdown-menu button {
          display: block;
          padding: 10px 15px;
          text-decoration: none;
          border: none;
          background: none;
          width: 100%;
          color: #333;
          font-size: 14px;
          cursor: pointer;
        }
        
        .avatar-dropdown-menu button:hover {
          background: #f4f4f4;
        }
        
        .avatar-dropdown-container:hover .avatar-dropdown-menu,
        .avatar-container-focus-within .avatar-dropdown-menu {
          display: block;
        }
      </style>
      
      <header class="header">
        <div class="header-item-container">
          <button class="back-button"><</button>
          <span class="text"></span>
          <div id="avatar-dropdown-container" class="avatar-dropdown avatar-dropdown-container">
            <button id="avatar-dropdown-btn" class="avatar-dropdown-button">
            </button>
            <div class="avatar-dropdown-menu">
              <button id="edit-user-info-btn">회원정보수정</button>
              <button id="edit-user-pw-btn">비밀번호수정</button>
              <button id="logout-btn">로그아웃</button>
            </div>
          </div>
        </div>
      </header>
    `;
  }

  // 컴포넌트가 DOM에 추가될 때 호출
  connectedCallback() {
    this.updateVisibility();

    const backBtnElement = this.shadowRoot.querySelector('.back-button');
    const editUserInfoBtnElement = this.shadowRoot.getElementById('edit-user-info-btn');
    const editUserPasswordBtnElement = this.shadowRoot.getElementById('edit-user-pw-btn');
    const logoutBtnElement = this.shadowRoot.getElementById('logout-btn');

    backBtnElement.addEventListener('click', e => {
      e.preventDefault();
      window.history.back();
    });

    editUserInfoBtnElement.addEventListener('click', e => {
      e.preventDefault();
      window.location.href = '/users/edit';
    });

    editUserPasswordBtnElement.addEventListener('click', e => {
      e.preventDefault();
      window.location.href = '/users/edit/password';
    });

    logoutBtnElement.addEventListener('click', e => {
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    });
  }

  // 속성 변경 감지
  static get observedAttributes() {
    return ['show-back', 'show-avatar', 'text'];
  }

  // 속성 변경 시 처리
  attributeChangedCallback(name, oldValue, newValue) {
    this.updateVisibility();
  }

  // 속성에 따라 요소 가시성 업데이트
  updateVisibility() {
    const showBack = this.getAttribute('show-back') === 'true';
    const showAvatar = this.getAttribute('show-avatar') === 'true';
    const text = this.getAttribute('text') || '';

    // 요소 선택
    const backButton = this.shadowRoot.querySelector('.back-button');
    const avatarDropdown = this.shadowRoot.querySelector('#avatar-dropdown-container');
    const avatarDropdownBtn = this.shadowRoot.querySelector('#avatar-dropdown-btn');
    const textElement = this.shadowRoot.querySelector('.text');

    // 가시성 설정
    backButton.classList.toggle('visible', showBack);
    avatarDropdown.classList.toggle('visible', showAvatar);

    // 텍스트 설정
    textElement.textContent = text;

    // 아바타가 설정되어 있으면 배경 설정
    if (avatarDropdown.classList.contains('visible')) {
      const user = JSON.parse(localStorage.getItem('user'));
      avatarDropdownBtn.style.backgroundImage = `url(${user.profile})`;
      avatarDropdownBtn.style.backgroundPosition = 'center center';
      avatarDropdownBtn.style.backgroundSize = 'cover';
      avatarDropdownBtn.style.backgroundRepeat = 'no-repeat';
    }
  }
}

// Web Component 등록
customElements.define('custom-header', Header);
