
    import React from 'react';
    import { motion } from 'framer-motion';
    import HeroSection from '@/components/home/HeroSection';
    import FeaturesSection from '@/components/home/FeaturesSection';
    import HowItWorksSection from '@/components/home/HowItWorksSection';
    import PropheticGuidanceSection from '@/components/home/PropheticGuidanceSection';
    import TestimonialsSection from '@/components/home/TestimonialsSection';
    import PricingTeaserSection from '@/components/home/PricingTeaserSection';
    import CTASection from '@/components/home/CTASection';
    import { useLanguage } from '@/contexts/useLanguage';
    import { featuresData, howItWorksStepsData, testimonialsData, propheticGuidanceData } from '@/components/home/homePageData';
    
    const Home = () => {
      const { t } = useLanguage();
    
      return (
        <div className="space-y-16 md:space-y-24 overflow-hidden">
          <HeroSection t={t} />
          <FeaturesSection t={t} features={featuresData} />
          <HowItWorksSection t={t} steps={howItWorksStepsData} />
          <PropheticGuidanceSection t={t} propheticGuidance={propheticGuidanceData} />
          <TestimonialsSection t={t} testimonials={testimonialsData} />
          <PricingTeaserSection t={t} />
          <CTASection t={t} />
        </div>
      );
    };
    
    export default Home;
  