class Modal extends HTMLElement {
  constructor() {
    super();

    // Shadow DOM 생성
    this.attachShadow({ mode: 'open' });

    // 기본 구조 정의
    this.shadowRoot.innerHTML = `
      <style>
        /* 모달 배경 */
        .modal-overlay {
          display: flex;
          position: fixed;
          width: 100%;
          height: 100%;
          z-index: 9;
          justify-content: center;
          align-items: center;
          visibility: hidden;
        }

        /* 모달 컨테이너 */
        .modal-content {
          position: relative;
          background-color: white;
          padding: 0 20px 20px 20px;
          border-radius: 25px;
          max-width: 400px;
          max-height: 150px;
          z-index: 10;
          width: 100%;
          height: 100%;
          box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.3);
          border: 1px solid #ccc;
        }
      </style>
      
      <div class="modal-overlay">
        <div class="modal-content">
          <slot></slot>
        </div>
      </div>
      
      <div class="back-drop"></div>
    `;
  }

  // Web Component가 DOM에 추가될 때 실행
  connectedCallback() {
    this.overlay = this.shadowRoot.querySelector('.modal-overlay');

    // 백그라운드 클릭으로 모달 닫기
    this.overlay.addEventListener('click', e => {
      if (e.target === this.overlay) this.close();
    });
  }

  // Component가 DOM에서 제거될 때 이벤트 제거
  disconnectedCallback() {
    this.overlay.removeEventListener('click', this.close);
  }

  // 모달을 열기 위한 메서드
  open() {
    this.overlay.style.visibility = 'visible';
  }

  // 모달을 닫기 위한 메서드
  close() {
    this.overlay.style.visibility = 'hidden';
  }
}

// Custom Element 등록
customElements.define('custom-modal', Modal);
