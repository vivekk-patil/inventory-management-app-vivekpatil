import { LitElement, html, css } from "lit";
import "./search-bar.js";
import "./sort-bar.js";
import "./filter-bar.js";
import "./view-toggle.js";
import "./item-collection.js";
import "./item-form-modal.js";
import "./confirm-dialog.js";
import "./toast-notification.js";
import {
  listItems,
  createItem,
  updateItem,
  deleteItem,
  uploadImage,
} from "../services/erpnext-api.js";

export class AppRoot extends LitElement {
  static properties = {
    _items: { state: true },
    _loading: { state: true },
    _isAdmin: { state: true },
    _view: { state: true },
    _search: { state: true },
    _tag: { state: true },
    _sortField: { state: true },
    _sortOrder: { state: true },
    _modalOpen: { state: true },
    _editingItem: { state: true },
    _saving: { state: true },
    _confirmOpen: { state: true },
    _pendingDelete: { state: true },
    _toastMessage: { state: true },
    _toastType: { state: true },
    _toastOpen: { state: true },
  };

  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
    }

    header {
      background: var(--color-surface);
      border-bottom: 1px solid var(--color-border);
      padding: 18px 28px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      position: sticky;
      top: 0;
      z-index: 10;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .brand .mark {
      width: 28px;
      height: 28px;
      border-radius: 6px;
      background: var(--color-accent);
      color: var(--color-accent-ink);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 14px;
    }

    .brand h1 {
      font-family: var(--font-display);
      font-size: 17px;
      margin: 0;
    }

    .admin-toggle {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: var(--color-ink-muted);
    }

    .switch {
      width: 36px;
      height: 20px;
      border-radius: 999px;
      background: var(--color-border);
      position: relative;
      cursor: pointer;
      border: none;
      padding: 0;
    }

    .switch::after {
      content: "";
      position: absolute;
      top: 2px;
      left: 2px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: white;
      transition: transform 0.15s ease;
    }

    .switch.on {
      background: var(--color-pine);
    }

    .switch.on::after {
      transform: translateX(16px);
    }

    main {
      max-width: 1120px;
      margin: 0 auto;
      padding: 24px 28px 64px;
    }

    .toolbar {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      align-items: center;
      margin-bottom: 20px;
    }

    .toolbar search-bar {
      flex: 1;
      min-width: 220px;
    }

    .spacer {
      flex: 1;
    }

    .add-button {
      background: var(--color-accent);
      color: var(--color-accent-ink);
      border: none;
      border-radius: var(--radius-sm);
      padding: 9px 16px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
    }

    .add-button:hover {
      opacity: 0.92;
    }
  `;

  constructor() {
    super();
    this._items = [];
    this._loading = true;
    this._isAdmin = true; // demo default; in a real app this comes from auth/role
    this._view = "grid";
    this._search = "";
    this._tag = "";
    this._sortField = "date_added";
    this._sortOrder = "desc";
    this._modalOpen = false;
    this._editingItem = null;
    this._saving = false;
    this._confirmOpen = false;
    this._pendingDelete = null;
    this._toastMessage = "";
    this._toastType = "success";
    this._toastOpen = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this._fetchItems();
    this.addEventListener("search-change", (e) => this._onSearch(e.detail));
    this.addEventListener("sort-change", (e) => this._onSort(e.detail));
    this.addEventListener("tag-change", (e) => this._onTag(e.detail));
    this.addEventListener("view-change", (e) => (this._view = e.detail));
    this.addEventListener("edit-item", (e) => this._openEdit(e.detail));
    this.addEventListener("delete-item", (e) => this._openConfirm(e.detail));
    this.addEventListener("close-modal", () => this._closeModal());
    this.addEventListener("save-item", (e) => this._onSave(e.detail));
    this.addEventListener("confirm", () => this._onConfirmDelete());
    this.addEventListener("cancel", () => this._closeConfirm());
  }

  get _availableTags() {
    const set = new Set();
    for (const item of this._items) {
      (item.tags || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .forEach((t) => set.add(t));
    }
    return [...set].sort();
  }

  get _hasActiveFilters() {
    return Boolean(this._search || this._tag);
  }

  async _fetchItems() {
    this._loading = true;
    try {
      this._items = await listItems({
        search: this._search,
        tag: this._tag,
        sortField: this._sortField,
        sortOrder: this._sortOrder,
      });
    } catch (err) {
      this._toast(err.message || "Failed to load items.", "error");
      this._items = [];
    } finally {
      this._loading = false;
    }
  }

  _onSearch(value) {
    this._search = value;
    this._fetchItems();
  }

  _onSort({ field, order }) {
    this._sortField = field;
    this._sortOrder = order;
    this._fetchItems();
  }

  _onTag(value) {
    this._tag = value;
    this._fetchItems();
  }

  _toggleAdmin() {
    this._isAdmin = !this._isAdmin;
  }

  _openAdd() {
    this._editingItem = null;
    this._modalOpen = true;
  }

  _openEdit(item) {
    this._editingItem = item;
    this._modalOpen = true;
  }

  _closeModal() {
    this._modalOpen = false;
    this._editingItem = null;
    this._saving = false;
  }

  _openConfirm(item) {
    this._pendingDelete = item;
    this._confirmOpen = true;
  }

  _closeConfirm() {
    this._confirmOpen = false;
    this._pendingDelete = null;
  }

  async _onSave({ name, payload, file }) {
    this._saving = true;
    try {
      let saved;
      if (name) {
        saved = await updateItem(name, payload);
      } else {
        saved = await createItem(payload);
      }

      if (file) {
        const imageUrl = await uploadImage(file, saved.name);
        saved = await updateItem(saved.name, { image: imageUrl });
      }

      this._toast(name ? "Item updated." : "Item added.", "success");
      this._closeModal();
      await this._fetchItems();
    } catch (err) {
      this._toast(err.message || "Failed to save item.", "error");
    } finally {
      this._saving = false;
    }
  }

  async _onConfirmDelete() {
    const item = this._pendingDelete;
    this._closeConfirm();
    if (!item) return;
    try {
      await deleteItem(item.name);
      this._toast("Item deleted.", "success");
      await this._fetchItems();
    } catch (err) {
      this._toast(err.message || "Failed to delete item.", "error");
    }
  }

  _toast(message, type) {
    this._toastMessage = message;
    this._toastType = type;
    this._toastOpen = true;
  }

  render() {
    return html`
      <header>
        <div class="brand">
          <div class="mark">SR</div>
          <h1>Stockroom</h1>
        </div>
        <div class="admin-toggle">
          <span>Admin mode</span>
          <button
            class="switch ${this._isAdmin ? "on" : ""}"
            @click=${this._toggleAdmin}
            aria-pressed=${this._isAdmin}
            aria-label="Toggle admin mode"
          ></button>
        </div>
      </header>

      <main>
        <div class="toolbar">
          <search-bar .value=${this._search}></search-bar>
          <filter-bar .tags=${this._availableTags} .selected=${this._tag}></filter-bar>
          <sort-bar .sortField=${this._sortField} .sortOrder=${this._sortOrder}></sort-bar>
          <view-toggle .view=${this._view}></view-toggle>
          <div class="spacer"></div>
          ${this._isAdmin
            ? html`<button class="add-button" @click=${this._openAdd}>+ Add item</button>`
            : null}
        </div>

        <item-collection
          .items=${this._items}
          .isAdmin=${this._isAdmin}
          .view=${this._view}
          .loading=${this._loading}
          .hasActiveFilters=${this._hasActiveFilters}
        ></item-collection>
      </main>

      <item-form-modal
        .open=${this._modalOpen}
        .item=${this._editingItem}
        .saving=${this._saving}
      ></item-form-modal>

      <confirm-dialog
        .open=${this._confirmOpen}
        title="Delete this item?"
        message=${`This will permanently remove "${this._pendingDelete?.item_name || ""}" from inventory.`}
      ></confirm-dialog>

      <toast-notification
        .open=${this._toastOpen}
        .message=${this._toastMessage}
        .type=${this._toastType}
      ></toast-notification>
    `;
  }
}

customElements.define("app-root", AppRoot);
