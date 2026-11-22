
CREATE TABLE IF NOT EXISTS public.order_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    order_id UUID NOT NULL
        REFERENCES public.orders(id) ON DELETE CASCADE,

    actor_id UUID
        REFERENCES public.profiles(id) ON DELETE SET NULL,

    activity_type TEXT NOT NULL,

    old_status TEXT,
    new_status TEXT,

    description TEXT NOT NULL,

    metadata JSONB NOT NULL DEFAULT '{}'::JSONB,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_activity_order
    ON public.order_activity (order_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_order_activity_actor
    ON public.order_activity (actor_id);

CREATE INDEX IF NOT EXISTS idx_order_activity_type
    ON public.order_activity (activity_type);
