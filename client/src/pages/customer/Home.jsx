import Hero from '@/sections/Hero';
import FeaturedCategories from '@/sections/FeaturedCategories';
import BrandStory from '@/sections/BrandStory';
import PremiumBanner from '@/sections/PremiumBanner';
import Newsletter from '@/sections/Newsletter';

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedCategories />
      <BrandStory />
      <PremiumBanner />
      <Newsletter />
    </>
  );
}
