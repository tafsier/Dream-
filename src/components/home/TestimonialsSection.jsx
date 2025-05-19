
    import React from 'react';
    import { motion } from 'framer-motion';
    
    const TestimonialCard = ({ name, role, text, imageAlt, imageName, delay }) => (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, delay }}
        className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg flex flex-col items-center text-center"
      >
        <div className="mb-4">
          <img  alt={imageAlt} className="w-20 h-20 rounded-full object-cover border-4 border-primary/30 dark:border-green-500/40" src="https://images.unsplash.com/photo-1697256200022-f61abccad430" />
        </div>
        <p className="text-gray-700 dark:text-gray-300 italic mb-4">"{text}"</p>
        <p className="font-semibold text-gray-800 dark:text-white">{name}</p>
        <p className="text-sm text-primary dark:text-green-400">{role}</p>
      </motion.div>
    );
    
    const TestimonialsSection = ({ t, testimonials = [] }) => {
      return (
        <section>
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-white mb-12">{t('home.testimonialsTitle')}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard 
                key={testimonial.id} 
                name={t(testimonial.nameKey)} 
                role={t(testimonial.roleKey)} 
                text={testimonial.textKey ? t(testimonial.textKey) : t(testimonial.quoteKey)} 
                imageAlt={t(testimonial.imageAltKey)}
                imageName={testimonial.imageName}
                delay={(index + 1) * 0.1} 
              />
            ))}
          </div>
        </section>
      );
    };
    
    export default TestimonialsSection;
  