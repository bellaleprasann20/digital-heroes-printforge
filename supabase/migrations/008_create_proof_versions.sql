
CREATE TABLE IF NOT EXISTS public.proof_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    order_id UUID NOT NULL
        REFERENCES public.orders(id) ON DELETE CASCADE,

    order_item_id UUID
        REFERENCES public.order_items(id) ON DELETE SET NULL,

    version_number INTEGER NOT NULL CHECK (version_number > 0),

    proof_file_path TEXT NOT NULL,
    preview_file_path TEXT,

    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (
            status IN (
                'pending',
                'approved',
                'changes_requested',
                'superseded'
            )
        ),

    customer_feedback TEXT,
    admin_notes TEXT,

    uploaded_by UUID
        REFERENCES public.profiles(id) ON DELETE SET NULL,

    reviewed_by UUID
        REFERENCES public.profiles(id) ON DELETE SET NULL,

    reviewed_at TIMESTAMPTZ,
    approved_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (order_id, order_item_id, version_number)
);

CREATE INDEX IF NOT EXISTS idx_proof_versions_order
    ON public.proof_versions (order_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_proof_versions_status
    ON public.proof_versions (status);

CREATE INDEX IF NOT EXISTS idx_proof_versions_item
    ON public.proof_versions (order_item_id);
