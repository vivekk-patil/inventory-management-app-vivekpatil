# Official all-in-one Frappe/ERPNext image — already has bench, frappe and erpnext
# apps built. We just add our custom app source on top of it.
FROM frappe/erpnext:v15

USER root

# Custom app source (also bind-mounted in docker-compose for live editing during dev)
COPY apps/inventory_management /home/frappe/frappe-bench/apps/inventory_management

COPY init-scripts/start.sh /home/frappe/frappe-bench/init-scripts/start.sh
RUN chmod +x /home/frappe/frappe-bench/init-scripts/start.sh \
    && chown -R frappe:frappe /home/frappe/frappe-bench/apps/inventory_management \
    && chown -R frappe:frappe /home/frappe/frappe-bench/init-scripts

USER frappe

ENTRYPOINT ["/home/frappe/frappe-bench/init-scripts/start.sh"]
