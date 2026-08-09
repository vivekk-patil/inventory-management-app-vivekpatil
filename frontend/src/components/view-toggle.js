import { LitElement, html, css } from "lit";

export class ViewToggle extends LitElement {
  static properties = {
    view: { type: String }, // 'grid' | 'list'
  };

  static styles = css`
    :host {
      display: inline-flex;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      overflow: hidden;
    }

    button {
      border: none;
      background: var(--color-surface);
      color: var(--color-ink-muted);
      padding: 8px 12px;
      font-size: 13px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    button + button {
      border-left: 1px solid var(--color-border);
    }

    button.active {
      background: var(--color-pine-tint);
      color: var(--color-pine);
      font-weight: 600;
    }
  `;

  constructor() {
    super();
    this.view = "grid";
  }

  render() {
    return html`
      <button class=${this.view === "grid" ? "active" : ""} @click=${() => this._select("grid")}>
        ▦ Grid
      </button>
      <button class=${this.view === "list" ? "active" : ""} @click=${() => this._select("list")}>
        ☰ List
      </button>
    `;
  }

  _select(view) {
    if (view === this.view) return;
    this.dispatchEvent(new CustomEvent("view-change", { detail: view, bubbles: true, composed: true }));
  }
}

customElements.define("view-toggle", ViewToggle);
