
CREATE TABLE IF NOT EXISTS public.production_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    order_id UUID NOT NULL
        REFERENCES public.orders(id) ON DELETE CASCADE,

    order_item_id UUID
        REFERENCES public.order_items(id) ON DELETE SET NULL,

    customer_id UUID NOT NULL
        REFERENCES public.profiles(id) ON DELETE RESTRICT,

    file_name TEXT NOT NULL,
    storage_path TEXT NOT NULL UNIQUE,

    mime_type TEXT NOT NULL,
    file_size BIGINT NOT NULL CHECK (file_size >= 0),

    format TEXT NOT NULL
        CHECK (format IN ('pdf', 'png', 'svg', 'csv', 'other')),

    dpi INTEGER,
    width_mm NUMERIC(10, 2),
    height_mm NUMERIC(10, 2),
    bleed_mm NUMERIC(6, 2),

    generation_status TEXT NOT NULL DEFAULT 'completed'
        CHECK (
            generation_status IN (
                'queued',
                'processing',
                'completed',
                'failed'
            )
        ),

    generated_by UUID
        REFERENCES public.profiles(id) ON DELETE SET NULL,

    generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    metadata JSONB NOT NULL DEFAULT '{}'::JSONB,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_production_files_order
    ON public.production_files (order_id);

CREATE INDEX IF NOT EXISTS idx_production_files_customer
    ON public.production_files (customer_id);

CREATE INDEX IF NOT EXISTS idx_production_files_status
    ON public.production_files (generation_status);
