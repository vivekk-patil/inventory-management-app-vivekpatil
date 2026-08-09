#!/bin/bash
set -e

: "${SITE_NAME:=inventory.localhost}"
: "${DB_HOST:=mariadb}"
: "${DB_ROOT_PASSWORD:=admin}"
: "${ADMIN_PASSWORD:=admin}"
: "${REDIS_CACHE:=redis://redis:6379/0}"
: "${REDIS_QUEUE:=redis://redis:6379/1}"
: "${FRONTEND_ORIGIN:=http://localhost:8080}"

cd /home/frappe/frappe-bench

echo "Waiting for MariaDB at ${DB_HOST}:3306 ..."
until mysqladmin ping -h "$DB_HOST" -u root -p"$DB_ROOT_PASSWORD" --silent 2>/dev/null; do
  sleep 2
done
echo "MariaDB is up."

echo "Waiting for Redis at redis:6379 ..."
until (exec 3<>/dev/tcp/redis/6379) 2>/dev/null; do
  sleep 2
done
exec 3<&- 3>&-
echo "Redis is up."

# Point bench's common config at the external db/redis containers
bench set-config -g db_host "$DB_HOST"
bench set-config -g redis_cache "$REDIS_CACHE"
bench set-config -g redis_queue "$REDIS_QUEUE"
bench set-config -g redis_socketio "$REDIS_QUEUE"

echo "Registering inventory_management app with the bench ..."

# apps.txt may already exist in the persistent Docker volume. Ensure each app
# is on its own line; an old/non-newline-terminated entry can otherwise turn
# into "erpnextinventory_management", which Frappe tries to import as a module.
touch sites/apps.txt
sed -i '/^erpnextinventory_management$/d' sites/apps.txt
sed -i '$a\' sites/apps.txt

# Keep the standard ERPNext app and our custom app registered exactly once.
if ! grep -qx "erpnext" sites/apps.txt 2>/dev/null; then
  printf '%s\n' "erpnext" >> sites/apps.txt
fi
if ! grep -qx "inventory_management" sites/apps.txt 2>/dev/null; then
  printf '%s\n' "inventory_management" >> sites/apps.txt
fi

./env/bin/pip install --quiet -e apps/inventory_management

if [ ! -d "sites/${SITE_NAME}" ]; then
  echo "Creating new site ${SITE_NAME} ..."
  bench new-site "$SITE_NAME" \
    --db-host "$DB_HOST" \
    --mariadb-root-password "$DB_ROOT_PASSWORD" \
    --admin-password "$ADMIN_PASSWORD" \
    --install-app erpnext \
    --set-default
else
  echo "Site ${SITE_NAME} already exists, skipping creation."
fi

echo "Installing inventory_management app ..."
bench --site "$SITE_NAME" install-app inventory_management

echo "Enabling developer mode and CORS for the frontend ..."
bench --site "$SITE_NAME" set-config developer_mode 1
bench --site "$SITE_NAME" set-config allow_cors "$FRONTEND_ORIGIN"
bench --site "$SITE_NAME" set-config ignore_csrf 1

echo "Running any pending migrations ..."
bench --site "$SITE_NAME" migrate

echo "Starting the ERPNext web server ..."
exec bench serve --port 8000
