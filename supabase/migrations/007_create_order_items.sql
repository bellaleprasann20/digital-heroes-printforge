
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    order_id UUID NOT NULL
        REFERENCES public.orders(id) ON DELETE CASCADE,

    product_id UUID
        REFERENCES public.products(id) ON DELETE SET NULL,

    design_id UUID
        REFERENCES public.designs(id) ON DELETE SET NULL,

    product_name TEXT NOT NULL,
    product_slug TEXT,

    quantity INTEGER NOT NULL CHECK (quantity > 0),

    width NUMERIC(10, 2),
    height NUMERIC(10, 2),
    dimension_unit TEXT NOT NULL DEFAULT 'mm'
        CHECK (dimension_unit IN ('mm', 'cm', 'in')),

    material TEXT,
    orientation TEXT,

    configuration JSONB NOT NULL DEFAULT '{}'::JSONB,

    unit_price NUMERIC(12, 2) NOT NULL DEFAULT 0
        CHECK (unit_price >= 0),

    discount_amount NUMERIC(12, 2) NOT NULL DEFAULT 0
        CHECK (discount_amount >= 0),

    tax_amount NUMERIC(12, 2) NOT NULL DEFAULT 0
        CHECK (tax_amount >= 0),

    line_total NUMERIC(12, 2) NOT NULL DEFAULT 0
        CHECK (line_total >= 0),

    artwork_path TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CHECK (width IS NULL OR width > 0),
    CHECK (height IS NULL OR height > 0)
);

CREATE INDEX IF NOT EXISTS idx_order_items_order
    ON public.order_items (order_id);

CREATE INDEX IF NOT EXISTS idx_order_items_product
    ON public.order_items (product_id);

CREATE INDEX IF NOT EXISTS idx_order_items_design
    ON public.order_items (design_id);

DROP TRIGGER IF EXISTS order_items_updated_at ON public.order_items;

CREATE TRIGGER order_items_updated_at
BEFORE UPDATE ON public.order_items
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();
