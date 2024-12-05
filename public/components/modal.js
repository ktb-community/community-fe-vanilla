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
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: none;
          justify-content: center;
          align-items: center;
        }

        /* 모달 컨테이너 */
        .modal-content {
          background: white;
          padding: 20px;
          border-radius: 10px;
          max-width: 500px;
          width: 100%;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        /* 닫기 버튼 */
        .close-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          background: none;
          border: none;
          font-size: 18px;
          cursor: pointer;
        }
      </style>
      <div class="modal-overlay">
        <div class="modal-content">
          <button class="close-btn">&times;</button>
          <slot></slot>
        </div>
      </div>
    `;
  }

  // Web Component가 DOM에 추가될 때 실행
  connectedCallback() {
    this.overlay = this.shadowRoot.querySelector('.modal-overlay');
    this.closeButton = this.shadowRoot.querySelector('.close-btn');

    // 닫기 버튼 클릭 이벤트
    this.closeButton.addEventListener('click', () => this.close());

    // 백그라운드 클릭으로 모달 닫기
    this.overlay.addEventListener('click', event => {
      if (event.target === this.overlay) {
        this.close();
      }
    });
  }

  // Component가 DOM에서 제거될 때 이벤트 제거
  disconnectedCallback() {
    this.closeButton.removeEventListener('click', this.close);
    this.overlay.removeEventListener('click', this.close);
  }

  // 모달을 열기 위한 메서드
  open() {
    this.overlay.style.display = 'flex';
  }

  // 모달을 닫기 위한 메서드
  close() {
    this.overlay.style.display = 'none';
  }
}

// Custom Element 등록
customElements.define('custom-modal', Modal);
