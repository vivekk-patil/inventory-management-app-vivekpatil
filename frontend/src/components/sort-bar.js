import { LitElement, html, css } from "lit";

export class SortBar extends LitElement {
  static properties = {
    sortField: { type: String },
    sortOrder: { type: String },
  };

  static styles = css`
    :host {
      display: flex;
      gap: 6px;
    }

    select,
    button {
      font-family: var(--font-body);
      font-size: 13px;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      background: var(--color-surface);
      color: var(--color-ink);
      padding: 8px 10px;
      cursor: pointer;
    }

    select:focus,
    button:focus-visible {
      border-color: var(--color-accent);
    }

    button {
      font-family: var(--font-mono);
      min-width: 34px;
    }
  `;

  constructor() {
    super();
    this.sortField = "date_added";
    this.sortOrder = "desc";
  }

  render() {
    return html`
      <select @change=${this._onFieldChange} .value=${this.sortField}>
        <option value="date_added">Date Added</option>
        <option value="item_name">Name</option>
      </select>
      <button
        @click=${this._toggleOrder}
        title=${this.sortOrder === "asc" ? "Ascending" : "Descending"}
      >
        ${this.sortOrder === "asc" ? "↑" : "↓"}
      </button>
    `;
  }

  _onFieldChange(e) {
    this._emit(e.target.value, this.sortOrder);
  }

  _toggleOrder() {
    this._emit(this.sortField, this.sortOrder === "asc" ? "desc" : "asc");
  }

  _emit(field, order) {
    this.dispatchEvent(
      new CustomEvent("sort-change", { detail: { field, order }, bubbles: true, composed: true })
    );
  }
}

customElements.define("sort-bar", SortBar);
