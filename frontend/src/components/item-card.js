import { LitElement, html, css } from "lit";
import { resolveImageUrl } from "../services/erpnext-api.js";

export class ItemCard extends LitElement {
  static properties = {
    item: { type: Object },
    isAdmin: { type: Boolean },
    layout: { type: String }, // 'grid' | 'list'
  };

  static styles = css`
    :host {
      display: block;
    }

    .card {
      display: flex;
      gap: 14px;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-card);
      padding: 12px;
      height: 100%;
    }

    :host([layout="grid"]) .card {
      flex-direction: column;
    }

    :host([layout="list"]) .card {
      flex-direction: row;
      align-items: center;
    }

    .thumb {
      flex-shrink: 0;
      background: var(--color-pine-tint);
      border-radius: var(--radius-sm);
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-pine);
      font-family: var(--font-mono);
      font-size: 11px;
    }

    :host([layout="grid"]) .thumb {
      width: 100%;
      aspect-ratio: 4 / 3;
    }

    :host([layout="list"]) .thumb {
      width: 64px;
      height: 64px;
    }

    .thumb img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .body {
      display: flex;
      flex-direction: column;
      gap: 6px;
      min-width: 0;
      flex: 1;
    }

    .top-row {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 8px;
    }

    .name {
      font-family: var(--font-display);
      font-weight: 600;
      font-size: 15px;
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .date {
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--color-ink-muted);
      flex-shrink: 0;
    }

    .description {
      margin: 0;
      font-size: 13px;
      color: var(--color-ink-muted);
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: auto;
    }

    .tag {
      font-family: var(--font-mono);
      font-size: 10.5px;
      letter-spacing: 0.02em;
      text-transform: uppercase;
      background: var(--color-pine-tint);
      color: var(--color-pine);
      border-radius: 3px;
      padding: 3px 6px;
    }

    .actions {
      display: flex;
      gap: 6px;
      margin-top: 6px;
    }

    :host([layout="list"]) .actions {
      margin-top: 0;
      margin-left: auto;
    }

    button {
      border: 1px solid var(--color-border);
      background: var(--color-surface);
      border-radius: var(--radius-sm);
      padding: 5px 10px;
      font-size: 12px;
      cursor: pointer;
      color: var(--color-ink);
    }

    button:hover {
      border-color: var(--color-accent);
      color: var(--color-accent);
    }

    button.danger:hover {
      border-color: var(--color-danger);
      color: var(--color-danger);
    }
  `;

  constructor() {
    super();
    this.isAdmin = false;
    this.layout = "grid";
  }

  connectedCallback() {
    super.connectedCallback();
    // reflect layout to attribute so :host([layout="..."]) selectors work
    if (this.layout) this.setAttribute("layout", this.layout);
  }

  updated(changed) {
    if (changed.has("layout")) {
      this.setAttribute("layout", this.layout);
    }
  }

  get tagList() {
    if (!this.item?.tags) return [];
    return this.item.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }

  render() {
    if (!this.item) return html``;
    const imageUrl = resolveImageUrl(this.item.image);

    return html`
      <article class="card">
        <div class="thumb">
          ${imageUrl ? html`<img src="${imageUrl}" alt="${this.item.item_name}" loading="lazy" />` : html`No image`}
        </div>
        <div class="body">
          <div class="top-row">
            <h3 class="name" title="${this.item.item_name}">${this.item.item_name}</h3>
            <span class="date">${this.item.date_added || ""}</span>
          </div>
          ${this.item.description
            ? html`<p class="description">${this.item.description}</p>`
            : null}
          <div class="tags">
            ${this.tagList.map((t) => html`<span class="tag">${t}</span>`)}
          </div>
          ${this.isAdmin
            ? html`
                <div class="actions">
                  <button @click=${this._onEdit}>Edit</button>
                  <button class="danger" @click=${this._onDelete}>Delete</button>
                </div>
              `
            : null}
        </div>
      </article>
    `;
  }

  _onEdit() {
    this.dispatchEvent(new CustomEvent("edit-item", { detail: this.item, bubbles: true, composed: true }));
  }

  _onDelete() {
    this.dispatchEvent(new CustomEvent("delete-item", { detail: this.item, bubbles: true, composed: true }));
  }
}

customElements.define("item-card", ItemCard);
