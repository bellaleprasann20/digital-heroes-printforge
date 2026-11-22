
CREATE TABLE IF NOT EXISTS public.designs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    customer_id UUID NOT NULL
        REFERENCES public.profiles(id) ON DELETE CASCADE,

    product_id UUID
        REFERENCES public.products(id) ON DELETE SET NULL,

    name TEXT NOT NULL,

    canvas_width NUMERIC(10, 2) NOT NULL,
    canvas_height NUMERIC(10, 2) NOT NULL,

    canvas_unit TEXT NOT NULL DEFAULT 'mm'
        CHECK (canvas_unit IN ('mm', 'cm', 'in')),

    design_data JSONB NOT NULL DEFAULT '{}'::JSONB,

    thumbnail_url TEXT,
    source_file_path TEXT,

    status TEXT NOT NULL DEFAULT 'draft'
        CHECK (
            status IN (
                'draft',
                'submitted',
                'archived'
            )
        ),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CHECK (canvas_width > 0),
    CHECK (canvas_height > 0)
);

CREATE INDEX IF NOT EXISTS idx_designs_customer
    ON public.designs (customer_id, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_designs_product
    ON public.designs (product_id);

DROP TRIGGER IF EXISTS designs_updated_at ON public.designs;

CREATE TRIGGER designs_updated_at
BEFORE UPDATE ON public.designs
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();
