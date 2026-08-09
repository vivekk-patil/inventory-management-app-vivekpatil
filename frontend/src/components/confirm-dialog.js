import { LitElement, html, css } from "lit";

export class ConfirmDialog extends LitElement {
  static properties = {
    open: { type: Boolean },
    title: { type: String },
    message: { type: String },
    confirmLabel: { type: String },
  };

  static styles = css`
    :host {
      display: none;
    }

    :host([open]) {
      display: block;
    }

    .overlay {
      position: fixed;
      inset: 0;
      background: rgba(32, 29, 22, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 50;
    }

    .panel {
      background: var(--color-surface);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-modal);
      padding: 22px;
      width: 320px;
    }

    h3 {
      margin: 0 0 8px;
      font-family: var(--font-display);
      font-size: 16px;
    }

    p {
      margin: 0 0 18px;
      font-size: 13px;
      color: var(--color-ink-muted);
      line-height: 1.5;
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }

    button {
      border-radius: var(--radius-sm);
      padding: 8px 14px;
      font-size: 13px;
      cursor: pointer;
      border: 1px solid var(--color-border);
      background: var(--color-surface);
      color: var(--color-ink);
    }

    button.danger {
      background: var(--color-danger);
      border-color: var(--color-danger);
      color: white;
    }
  `;

  constructor() {
    super();
    this.open = false;
    this.title = "Are you sure?";
    this.message = "";
    this.confirmLabel = "Delete";
  }

  updated(changed) {
    if (changed.has("open")) this.toggleAttribute("open", this.open);
  }

  render() {
    if (!this.open) return html``;
    return html`
      <div class="overlay" @click=${this._onOverlayClick}>
        <div class="panel" @click=${(e) => e.stopPropagation()}>
          <h3>${this.title}</h3>
          <p>${this.message}</p>
          <div class="actions">
            <button @click=${this._cancel}>Cancel</button>
            <button class="danger" @click=${this._confirm}>${this.confirmLabel}</button>
          </div>
        </div>
      </div>
    `;
  }

  _onOverlayClick() {
    this._cancel();
  }

  _cancel() {
    this.dispatchEvent(new CustomEvent("cancel", { bubbles: true, composed: true }));
  }

  _confirm() {
    this.dispatchEvent(new CustomEvent("confirm", { bubbles: true, composed: true }));
  }
}

customElements.define("confirm-dialog", ConfirmDialog);
