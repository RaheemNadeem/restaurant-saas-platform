-- Sprint 1 tenant-isolation baseline (PostgreSQL RLS)

CREATE TABLE IF NOT EXISTS tenant_menu_items (
  id uuid PRIMARY KEY,
  tenant_id text NOT NULL,
  name text NOT NULL,
  price numeric(10,2) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE tenant_menu_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tenant_isolation_select ON tenant_menu_items;
CREATE POLICY tenant_isolation_select
ON tenant_menu_items
FOR SELECT
USING (tenant_id = current_setting('app.tenant_id', true));

DROP POLICY IF EXISTS tenant_isolation_insert ON tenant_menu_items;
CREATE POLICY tenant_isolation_insert
ON tenant_menu_items
FOR INSERT
WITH CHECK (tenant_id = current_setting('app.tenant_id', true));

DROP POLICY IF EXISTS tenant_isolation_update ON tenant_menu_items;
CREATE POLICY tenant_isolation_update
ON tenant_menu_items
FOR UPDATE
USING (tenant_id = current_setting('app.tenant_id', true))
WITH CHECK (tenant_id = current_setting('app.tenant_id', true));

DROP POLICY IF EXISTS tenant_isolation_delete ON tenant_menu_items;
CREATE POLICY tenant_isolation_delete
ON tenant_menu_items
FOR DELETE
USING (tenant_id = current_setting('app.tenant_id', true));
