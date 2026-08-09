import { LitElement, html, css } from "lit";

export class SearchBar extends LitElement {
  static properties = {
    value: { type: String },
  };

  static styles = css`
    :host {
      display: block;
    }

    .wrap {
      position: relative;
      display: flex;
      align-items: center;
    }

    input {
      width: 100%;
      font-family: var(--font-body);
      font-size: 14px;
      padding: 9px 12px 9px 32px;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      background: var(--color-surface);
      color: var(--color-ink);
    }

    input:focus {
      border-color: var(--color-accent);
    }

    .icon {
      position: absolute;
      left: 10px;
      color: var(--color-ink-muted);
      font-size: 13px;
      pointer-events: none;
    }
  `;

  constructor() {
    super();
    this.value = "";
    this._timer = null;
  }

  render() {
    return html`
      <div class="wrap">
        <span class="icon">⌕</span>
        <input
          type="search"
          placeholder="Search by name or description…"
          .value=${this.value}
          @input=${this._onInput}
        />
      </div>
    `;
  }

  _onInput(e) {
    const value = e.target.value;
    clearTimeout(this._timer);
    this._timer = setTimeout(() => {
      this.dispatchEvent(new CustomEvent("search-change", { detail: value, bubbles: true, composed: true }));
    }, 250);
  }
}

customElements.define("search-bar", SearchBar);
