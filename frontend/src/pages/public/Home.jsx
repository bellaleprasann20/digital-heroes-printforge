
import React from 'react';

import HeroSection from '../../components/home/HeroSection';
import DivisionGrid from '../../components/home/DivisionGrid';
import FeaturedProducts from '../../components/home/FeaturedProducts';
import WorkGallery from '../../components/home/WorkGallery';
import ProcessSection from '../../components/home/ProcessSection';
import CTASection from '../../components/home/CTASection';

const Home = ({
  products = [],
  galleryItems = [],
  loadingProducts = false,
  productsError = null,
  loadingGallery = false,
  galleryError = null,
  onRetryProducts,
  onRetryGallery,
  onAddToCart,
}) => {
  return (
    <main>
      <HeroSection />

      <DivisionGrid />

      <FeaturedProducts
        products={products}
        loading={loadingProducts}
        error={productsError}
        onRetry={onRetryProducts}
        onAddToCart={onAddToCart}
      />

      <WorkGallery
        items={galleryItems}
        loading={loadingGallery}
        error={galleryError}
        onRetry={onRetryGallery}
      />

      <ProcessSection />

      <CTASection />
    </main>
  );
};

export default Home;
