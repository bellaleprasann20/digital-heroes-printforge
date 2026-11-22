
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    order_number TEXT NOT NULL UNIQUE,

    customer_id UUID NOT NULL
        REFERENCES public.profiles(id) ON DELETE RESTRICT,

    status TEXT NOT NULL DEFAULT 'order'
        CHECK (
            status IN (
                'quote',
                'order',
                'artwork',
                'proof',
                'production',
                'completed',
                'cancelled'
            )
        ),

    payment_status TEXT NOT NULL DEFAULT 'pending'
        CHECK (
            payment_status IN (
                'pending',
                'processing',
                'paid',
                'failed',
                'partially_refunded',
                'refunded'
            )
        ),

    subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0
        CHECK (subtotal >= 0),

    discount_amount NUMERIC(12, 2) NOT NULL DEFAULT 0
        CHECK (discount_amount >= 0),

    tax_rate NUMERIC(6, 3) NOT NULL DEFAULT 18,
    tax_amount NUMERIC(12, 2) NOT NULL DEFAULT 0
        CHECK (tax_amount >= 0),

    shipping_amount NUMERIC(12, 2) NOT NULL DEFAULT 0
        CHECK (shipping_amount >= 0),

    total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0
        CHECK (total_amount >= 0),

    currency CHAR(3) NOT NULL DEFAULT 'INR',

    shipping_address JSONB NOT NULL DEFAULT '{}'::JSONB,
    billing_address JSONB NOT NULL DEFAULT '{}'::JSONB,

    customer_notes TEXT,
    admin_notes TEXT,

    estimated_completion_date DATE,
    completed_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    cancellation_reason TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_customer
    ON public.orders (customer_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_orders_status
    ON public.orders (status);

CREATE INDEX IF NOT EXISTS idx_orders_payment_status
    ON public.orders (payment_status);

CREATE INDEX IF NOT EXISTS idx_orders_created_at
    ON public.orders (created_at DESC);

DROP TRIGGER IF EXISTS orders_updated_at ON public.orders;

CREATE TRIGGER orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();
