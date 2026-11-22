
-- ==========================================
-- ADMIN HELPER
-- ==========================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE id = (SELECT auth.uid())
          AND role = 'admin'
          AND is_active = TRUE
    );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- ==========================================
-- ENABLE ROW LEVEL SECURITY
-- ==========================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proof_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_activity ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- PROFILES
-- ==========================================

CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (
    id = (SELECT auth.uid())
    OR (SELECT public.is_admin())
);

CREATE POLICY "Customers can update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (
    id = (SELECT auth.uid())
    AND role = 'customer'
)
WITH CHECK (
    id = (SELECT auth.uid())
    AND role = 'customer'
);

CREATE POLICY "Admins can manage profiles"
ON public.profiles
FOR ALL
TO authenticated
USING ((SELECT public.is_admin()))
WITH CHECK ((SELECT public.is_admin()));

-- ==========================================
-- CATEGORIES
-- ==========================================

CREATE POLICY "Anyone can view active categories"
ON public.categories
FOR SELECT
TO anon, authenticated
USING (
    is_active = TRUE
    OR (SELECT public.is_admin())
);

CREATE POLICY "Admins can manage categories"
ON public.categories
FOR ALL
TO authenticated
USING ((SELECT public.is_admin()))
WITH CHECK ((SELECT public.is_admin()));

-- ==========================================
-- PRODUCTS
-- ==========================================

CREATE POLICY "Anyone can view active products"
ON public.products
FOR SELECT
TO anon, authenticated
USING (
    is_active = TRUE
    OR (SELECT public.is_admin())
);

CREATE POLICY "Admins can manage products"
ON public.products
FOR ALL
TO authenticated
USING ((SELECT public.is_admin()))
WITH CHECK ((SELECT public.is_admin()));

-- ==========================================
-- PRODUCT OPTIONS
-- ==========================================

CREATE POLICY "Anyone can view active product options"
ON public.product_options
FOR SELECT
TO anon, authenticated
USING (
    is_active = TRUE
    OR (SELECT public.is_admin())
);

CREATE POLICY "Admins can manage product options"
ON public.product_options
FOR ALL
TO authenticated
USING ((SELECT public.is_admin()))
WITH CHECK ((SELECT public.is_admin()));

-- ==========================================
-- DESIGNS
-- ==========================================

CREATE POLICY "Customers can view their own designs"
ON public.designs
FOR SELECT
TO authenticated
USING (
    customer_id = (SELECT auth.uid())
    OR (SELECT public.is_admin())
);

CREATE POLICY "Customers can create their own designs"
ON public.designs
FOR INSERT
TO authenticated
WITH CHECK (
    customer_id = (SELECT auth.uid())
);

CREATE POLICY "Customers can update their own designs"
ON public.designs
FOR UPDATE
TO authenticated
USING (
    customer_id = (SELECT auth.uid())
)
WITH CHECK (
    customer_id = (SELECT auth.uid())
);

CREATE POLICY "Customers can delete their own designs"
ON public.designs
FOR DELETE
TO authenticated
USING (
    customer_id = (SELECT auth.uid())
);

CREATE POLICY "Admins can manage designs"
ON public.designs
FOR ALL
TO authenticated
USING ((SELECT public.is_admin()))
WITH CHECK ((SELECT public.is_admin()));

-- ==========================================
-- ORDERS
-- ==========================================

CREATE POLICY "Customers can view their own orders"
ON public.orders
FOR SELECT
TO authenticated
USING (
    customer_id = (SELECT auth.uid())
    OR (SELECT public.is_admin())
);

CREATE POLICY "Admins can manage orders"
ON public.orders
FOR ALL
TO authenticated
USING ((SELECT public.is_admin()))
WITH CHECK ((SELECT public.is_admin()));

-- Order creation, cancellation and status changes
-- are handled through the trusted backend service role.

-- ==========================================
-- ORDER ITEMS
-- ==========================================

CREATE POLICY "Customers can view their own order items"
ON public.order_items
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.orders
        WHERE orders.id = order_items.order_id
          AND orders.customer_id = (SELECT auth.uid())
    )
    OR (SELECT public.is_admin())
);

CREATE POLICY "Admins can manage order items"
ON public.order_items
FOR ALL
TO authenticated
USING ((SELECT public.is_admin()))
WITH CHECK ((SELECT public.is_admin()));

-- ==========================================
-- PROOF VERSIONS
-- ==========================================

CREATE POLICY "Customers can view their own proofs"
ON public.proof_versions
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.orders
        WHERE orders.id = proof_versions.order_id
          AND orders.customer_id = (SELECT auth.uid())
    )
    OR (SELECT public.is_admin())
);

CREATE POLICY "Admins can manage proof versions"
ON public.proof_versions
FOR ALL
TO authenticated
USING ((SELECT public.is_admin()))
WITH CHECK ((SELECT public.is_admin()));

-- Proof creation, approval and revision requests
-- are handled by the trusted backend.

-- ==========================================
-- PRODUCTION FILES
-- ==========================================

CREATE POLICY "Admins can access production file records"
ON public.production_files
FOR ALL
TO authenticated
USING ((SELECT public.is_admin()))
WITH CHECK ((SELECT public.is_admin()));

-- Customers cannot directly access production file records.

-- ==========================================
-- ORDER ACTIVITY
-- ==========================================

CREATE POLICY "Customers can view their own order activity"
ON public.order_activity
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.orders
        WHERE orders.id = order_activity.order_id
          AND orders.customer_id = (SELECT auth.uid())
    )
    OR (SELECT public.is_admin())
);

CREATE POLICY "Admins can manage order activity"
ON public.order_activity
FOR ALL
TO authenticated
USING ((SELECT public.is_admin()))
WITH CHECK ((SELECT public.is_admin()));

-- Activity creation is performed by the backend.
