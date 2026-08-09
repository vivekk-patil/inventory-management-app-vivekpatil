import { LitElement, html, css } from "lit";

export class FilterBar extends LitElement {
  static properties = {
    tags: { type: Array },
    selected: { type: String },
  };

  static styles = css`
    select {
      font-family: var(--font-body);
      font-size: 13px;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      background: var(--color-surface);
      color: var(--color-ink);
      padding: 8px 10px;
      cursor: pointer;
      min-width: 140px;
    }

    select:focus {
      border-color: var(--color-accent);
    }
  `;

  constructor() {
    super();
    this.tags = [];
    this.selected = "";
  }

  render() {
    return html`
      <select @change=${this._onChange} .value=${this.selected}>
        <option value="">All tags</option>
        ${this.tags.map((tag) => html`<option value=${tag}>${tag}</option>`)}
      </select>
    `;
  }

  _onChange(e) {
    this.dispatchEvent(
      new CustomEvent("tag-change", { detail: e.target.value, bubbles: true, composed: true })
    );
  }
}

customElements.define("filter-bar", FilterBar);
