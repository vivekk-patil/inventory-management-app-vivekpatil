app_name = "inventory_management"
app_title = "Inventory Management"
app_publisher = "Levelworks Intern"
app_description = "Custom Inventory Item DocType backing the Lit inventory management frontend"
app_email = "grow@levelworks.co"
app_license = "MIT"

# Doctypes defined under inventory_management/inventory_management/doctype are
# auto-synced by `bench migrate` — no fixtures export needed.

# Allow the Lit frontend (served from a different origin) to call the REST API.
# The actual allowed origin is set via site_config.json (see init-scripts/start.sh),
# this is just documenting intent.
