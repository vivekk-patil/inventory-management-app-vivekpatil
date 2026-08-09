import { LitElement, html, css } from "lit";

export class ToastNotification extends LitElement {
  static properties = {
    message: { type: String },
    type: { type: String }, // 'success' | 'error'
    open: { type: Boolean },
  };

  static styles = css`
    :host {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 100;
      pointer-events: none;
    }

    .toast {
      font-family: var(--font-body);
      font-size: 13px;
      padding: 12px 16px;
      border-radius: var(--radius-sm);
      box-shadow: var(--shadow-modal);
      transform: translateY(12px);
      opacity: 0;
      transition: transform 0.2s ease, opacity 0.2s ease;
      pointer-events: auto;
    }

    :host([open]) .toast {
      transform: translateY(0);
      opacity: 1;
    }

    .toast.success {
      background: var(--color-pine);
      color: white;
    }

    .toast.error {
      background: var(--color-danger);
      color: white;
    }
  `;

  constructor() {
    super();
    this.message = "";
    this.type = "success";
    this.open = false;
    this._timer = null;
  }

  updated(changed) {
    if (changed.has("open")) {
      this.toggleAttribute("open", this.open);
    }
    if (changed.has("message") && this.message) {
      clearTimeout(this._timer);
      this._timer = setTimeout(() => {
        this.open = false;
      }, 3200);
    }
  }

  render() {
    return html`<div class="toast ${this.type}">${this.message}</div>`;
  }
}

customElements.define("toast-notification", ToastNotification);
