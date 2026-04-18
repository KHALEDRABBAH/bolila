'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Star, Quote } from 'lucide-react';

export default function Testimonials() {
  const t = useTranslations('testimonials');

  const testimonialKeys = ['t1', 't2', 't3'] as const;

  return (
    <section className="py-24 bg-cream">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-gold font-semibold text-sm uppercase tracking-wider">{t('label')}</span>
          <h2 className="section-title mt-2">{t('title')}</h2>
          <p className="section-subtitle mx-auto">{t('subtitle')}</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonialKeys.map((key, index) => (
            <motion.div key={key} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.15 }}>
              <div className="card h-full relative">
                <Quote className="absolute top-6 start-6 w-10 h-10 text-gold/20" />
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (<Star key={i} className="w-5 h-5 text-gold fill-gold" />))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">"{t(`items.${key}.quote`)}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center">
                    <span className="text-2xl font-heading font-bold text-gold">{t(`items.${key}.name`).charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-primary">{t(`items.${key}.name`)}</p>
                    <p className="text-sm text-gold">{t(`items.${key}.role`)}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
