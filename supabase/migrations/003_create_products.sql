
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL
        REFERENCES public.categories(id) ON DELETE RESTRICT,

    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,

    division TEXT NOT NULL CHECK (
        division IN (
            'labels_stickers',
            'race_numbers',
            'mtb_boards',
            'stamps',
            'trophies',
            'laser_cut'
        )
    ),

    base_price NUMERIC(12, 2) NOT NULL DEFAULT 0
        CHECK (base_price >= 0),

    currency CHAR(3) NOT NULL DEFAULT 'INR',

    default_width NUMERIC(10, 2),
    default_height NUMERIC(10, 2),
    dimension_unit TEXT NOT NULL DEFAULT 'mm'
        CHECK (dimension_unit IN ('mm', 'cm', 'in')),

    min_width NUMERIC(10, 2),
    max_width NUMERIC(10, 2),
    min_height NUMERIC(10, 2),
    max_height NUMERIC(10, 2),

    print_dpi INTEGER NOT NULL DEFAULT 300
        CHECK (print_dpi > 0),

    bleed_mm NUMERIC(6, 2) NOT NULL DEFAULT 3
        CHECK (bleed_mm >= 0),

    safe_margin_mm NUMERIC(6, 2) NOT NULL DEFAULT 3
        CHECK (safe_margin_mm >= 0),

    materials JSONB NOT NULL DEFAULT '[]'::JSONB,
    specifications JSONB NOT NULL DEFAULT '{}'::JSONB,

    image_url TEXT,
    gallery_images JSONB NOT NULL DEFAULT '[]'::JSONB,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CHECK (
        default_width IS NULL OR default_width > 0
    ),
    CHECK (
        default_height IS NULL OR default_height > 0
    ),
    CHECK (
        min_width IS NULL OR min_width > 0
    ),
    CHECK (
        max_width IS NULL OR max_width > 0
    ),
    CHECK (
        min_height IS NULL OR min_height > 0
    ),
    CHECK (
        max_height IS NULL OR max_height > 0
    ),
    CHECK (
        min_width IS NULL OR max_width IS NULL OR min_width <= max_width
    ),
    CHECK (
        min_height IS NULL OR max_height IS NULL OR min_height <= max_height
    )
);

CREATE INDEX IF NOT EXISTS idx_products_category
    ON public.products (category_id);

CREATE INDEX IF NOT EXISTS idx_products_division
    ON public.products (division);

CREATE INDEX IF NOT EXISTS idx_products_active
    ON public.products (is_active);

CREATE INDEX IF NOT EXISTS idx_products_featured
    ON public.products (is_featured)
    WHERE is_featured = TRUE;

CREATE INDEX IF NOT EXISTS idx_products_created_at
    ON public.products (created_at DESC);

DROP TRIGGER IF EXISTS products_updated_at ON public.products;

CREATE TRIGGER products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();
