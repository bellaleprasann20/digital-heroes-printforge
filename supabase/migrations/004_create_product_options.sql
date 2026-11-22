
CREATE TABLE IF NOT EXISTS public.product_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    product_id UUID NOT NULL
        REFERENCES public.products(id) ON DELETE CASCADE,

    option_group TEXT NOT NULL,
    option_name TEXT NOT NULL,
    option_value TEXT NOT NULL,

    price_adjustment NUMERIC(12, 2) NOT NULL DEFAULT 0,

    metadata JSONB NOT NULL DEFAULT '{}'::JSONB,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    display_order INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (product_id, option_group, option_value)
);

CREATE INDEX IF NOT EXISTS idx_product_options_product
    ON public.product_options (product_id, is_active);

DROP TRIGGER IF EXISTS product_options_updated_at
    ON public.product_options;

CREATE TRIGGER product_options_updated_at
BEFORE UPDATE ON public.product_options
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();
