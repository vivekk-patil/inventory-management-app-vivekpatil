import frappe
from frappe.model.document import Document


class InventoryItem(Document):
    def validate(self):
        # Normalize tags: trim whitespace around each comma-separated tag
        if self.tags:
            cleaned = [t.strip() for t in self.tags.split(",") if t.strip()]
            self.tags = ", ".join(cleaned)
