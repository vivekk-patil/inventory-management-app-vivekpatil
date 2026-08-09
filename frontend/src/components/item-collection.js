import { LitElement, html, css } from "lit";
import "./item-card.js";

export class ItemCollection extends LitElement {
  static properties = {
    items: { type: Array },
    isAdmin: { type: Boolean },
    view: { type: String }, // 'grid' | 'list'
    loading: { type: Boolean },
    hasActiveFilters: { type: Boolean },
  };

  static styles = css`
    :host {
      display: block;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 14px;
    }

    .list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 64px 20px;
      text-align: center;
      color: var(--color-ink-muted);
      border: 1px dashed var(--color-border);
      border-radius: var(--radius-md);
    }

    .empty h3 {
      font-family: var(--font-display);
      color: var(--color-ink);
      margin: 0;
    }

    .empty p {
      margin: 0;
      font-size: 13px;
      max-width: 320px;
    }

    .loading {
      padding: 48px 20px;
      text-align: center;
      color: var(--color-ink-muted);
      font-family: var(--font-mono);
      font-size: 13px;
    }
  `;

  constructor() {
    super();
    this.items = [];
    this.isAdmin = false;
    this.view = "grid";
    this.loading = false;
    this.hasActiveFilters = false;
  }

  render() {
    if (this.loading) {
      return html`<div class="loading">Loading items…</div>`;
    }

    if (!this.items || this.items.length === 0) {
      return html`
        <div class="empty">
          <h3>${this.hasActiveFilters ? "No items match" : "The shelf is empty"}</h3>
          <p>
            ${this.hasActiveFilters
              ? "Try a different search term, tag, or clear your filters."
              : this.isAdmin
              ? "Add your first item to start tracking inventory."
              : "No items have been added yet."}
          </p>
        </div>
      `;
    }

    return html`
      <div class=${this.view === "grid" ? "grid" : "list"}>
        ${this.items.map(
          (item) => html`
            <item-card
              .item=${item}
              .isAdmin=${this.isAdmin}
              .layout=${this.view}
            ></item-card>
          `
        )}
      </div>
    `;
  }
}

customElements.define("item-collection", ItemCollection);
