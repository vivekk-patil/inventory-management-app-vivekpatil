import { LitElement, html, css } from "lit";
import { resolveImageUrl } from "../services/erpnext-api.js";

export class ItemFormModal extends LitElement {
  static properties = {
    open: { type: Boolean },
    item: { type: Object }, // null = add mode, object = edit mode
    saving: { type: Boolean },
    _preview: { state: true },
    _file: { state: true },
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
      z-index: 60;
      padding: 20px;
    }

    form {
      background: var(--color-surface);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-modal);
      padding: 24px;
      width: 420px;
      max-width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    h2 {
      margin: 0;
      font-family: var(--font-display);
      font-size: 18px;
    }

    label {
      display: flex;
      flex-direction: column;
      gap: 5px;
      font-size: 12.5px;
      color: var(--color-ink-muted);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.02em;
    }

    input[type="text"],
    textarea {
      font-family: var(--font-body);
      font-size: 14px;
      color: var(--color-ink);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      padding: 9px 10px;
      font-weight: 400;
      text-transform: none;
      letter-spacing: normal;
    }

    textarea {
      resize: vertical;
      min-height: 64px;
    }

    input:focus,
    textarea:focus {
      border-color: var(--color-accent);
    }

    .image-row {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .preview {
      width: 64px;
      height: 64px;
      border-radius: var(--radius-sm);
      background: var(--color-pine-tint);
      overflow: hidden;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      color: var(--color-pine);
      font-family: var(--font-mono);
    }

    .preview img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .error {
      background: var(--color-danger-tint);
      color: var(--color-danger);
      font-size: 12.5px;
      padding: 8px 10px;
      border-radius: var(--radius-sm);
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 4px;
    }

    button {
      border-radius: var(--radius-sm);
      padding: 9px 16px;
      font-size: 13px;
      cursor: pointer;
      border: 1px solid var(--color-border);
      background: var(--color-surface);
      color: var(--color-ink);
    }

    button[type="submit"] {
      background: var(--color-accent);
      border-color: var(--color-accent);
      color: var(--color-accent-ink);
      font-weight: 600;
    }

    button[disabled] {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `;

  constructor() {
    super();
    this.open = false;
    this.item = null;
    this.saving = false;
    this._preview = "";
    this._file = null;
    this._error = "";
  }

  updated(changed) {
    if (changed.has("open")) this.toggleAttribute("open", this.open);
    if (changed.has("item")) {
      this._preview = this.item?.image ? resolveImageUrl(this.item.image) : "";
      this._file = null;
      this._error = "";
    }
  }

  get isEdit() {
    return Boolean(this.item?.name);
  }

  render() {
    if (!this.open) return html``;
    const item = this.item || {};

    return html`
      <div class="overlay" @click=${this._onOverlayClick}>
        <form @click=${(e) => e.stopPropagation()} @submit=${this._onSubmit}>
          <h2>${this.isEdit ? "Edit item" : "Add item"}</h2>

          ${this._error ? html`<div class="error">${this._error}</div>` : null}

          <label>
            Name
            <input type="text" name="item_name" required .value=${item.item_name || ""} />
          </label>

          <label>
            Description
            <textarea name="description" .value=${item.description || ""}></textarea>
          </label>

          <label>
            Tags (comma-separated)
            <input type="text" name="tags" placeholder="Shirts, Pants" .value=${item.tags || ""} />
          </label>

          <label>
            Date added
            <input type="date" name="date_added" .value=${item.date_added || ""} />
          </label>

          <label>
            Image
            <div class="image-row">
              <div class="preview">
                ${this._preview ? html`<img src=${this._preview} alt="" />` : "No image"}
              </div>
              <input type="file" accept="image/*" @change=${this._onFileChange} />
            </div>
          </label>

          <div class="actions">
            <button type="button" @click=${this._onCancel}>Cancel</button>
            <button type="submit" ?disabled=${this.saving}>
              ${this.saving ? "Saving…" : this.isEdit ? "Save changes" : "Add item"}
            </button>
          </div>
        </form>
      </div>
    `;
  }

  _onOverlayClick() {
    if (!this.saving) this._onCancel();
  }

  _onFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    this._file = file;
    this._preview = URL.createObjectURL(file);
  }

  _onCancel() {
    this.dispatchEvent(new CustomEvent("close-modal", { bubbles: true, composed: true }));
  }

  setError(message) {
    this._error = message;
  }

  _onSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.target);
    const payload = {
      item_name: form.get("item_name")?.trim(),
      description: form.get("description")?.trim() || "",
      tags: form.get("tags")?.trim() || "",
      date_added: form.get("date_added") || "",
    };

    if (!payload.item_name) {
      this._error = "Name is required.";
      return;
    }
    this._error = "";

    this.dispatchEvent(
      new CustomEvent("save-item", {
        detail: {
          name: this.item?.name || null,
          payload,
          file: this._file,
        },
        bubbles: true,
        composed: true,
      })
    );
  }
}

customElements.define("item-form-modal", ItemFormModal);
