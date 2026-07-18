/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Image as ImageIcon, Sparkles, X, ZoomIn } from 'lucide-react';
import { i18n, type Language } from '../i18n';
import { GALLERY_ITEMS } from '../mockData';

interface GalleryPageProps {
  lang: Language;
}

export default function GalleryPage({ lang }: GalleryPageProps) {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [lightboxItem, setLightboxItem] = useState<typeof GALLERY_ITEMS[0] | null>(null);

  const t = i18n[lang];

  const filteredItems = activeFilter === 'all' 
    ? GALLERY_ITEMS 
    : GALLERY_ITEMS.filter(item => item.category === activeFilter);

  return (
    <div id="gallery-page-root" className="space-y-12 pb-16">
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-teal-500 to-[#44A8B3] text-white py-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent)] pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-4 space-y-3 relative z-10">
          <h1 className="text-3xl sm:text-4xl font-black font-sans">{t.galleryTitle}</h1>
          <p className="text-white/80 text-xs sm:text-sm max-w-xl mx-auto font-sans">
            {lang === 'en' 
              ? 'Browse captures of science projects, board rankers celebration, and active interactive school labs.' 
              : 'বিজ্ঞান মেলা, পর্ষদ কৃতি ছাত্র-ছাত্রী সম্মাননা এবং বিভিন্ন স্কুল ক্লাসরুমের আনন্দঘন মুহূর্তগুলো দেখুন।'}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-wrap justify-center gap-2">
          {[
            { id: 'all', label: t.allFilter },
            { id: 'events', label: t.eventFilter },
            { id: 'classes', label: t.classFilter },
            { id: 'achievements', label: t.achievementFilter }
          ].map((tab) => (
            <button
              key={tab.id}
              id={`gallery-filter-${tab.id}`}
              onClick={() => setActiveFilter(tab.id)}
              className={`py-2 px-5 rounded-xl font-bold text-xs transition-all shadow-sm cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-teal-500 text-white shadow-md shadow-teal-100'
                  : 'bg-white text-gray-700 border border-orange-100 hover:bg-orange-50/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Pinterest/Masonry Style Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              id={`gallery-card-${item.id}`}
              onClick={() => setLightboxItem(item)}
              className="bg-white rounded-3xl overflow-hidden border border-orange-100 shadow-sm hover:shadow-xl hover:border-teal-300 hover:-translate-y-1 transition-all duration-300 group cursor-pointer relative aspect-video"
            >
              {/* Image with hover scale zoom */}
              <img
                src={item.url}
                alt={item.titleEn}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />

              {/* Gradient Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/30 to-transparent opacity-90 flex flex-col justify-end p-5 text-left">
                <span className="text-[9px] font-black tracking-widest text-[#FFE66D] uppercase mb-1">
                  {item.category === 'events' ? t.eventFilter : item.category === 'classes' ? t.classFilter : t.achievementFilter}
                </span>
                
                <h3 className="text-white text-xs sm:text-sm font-bold font-sans">
                  {lang === 'en' ? item.titleEn : item.titleBn}
                </h3>

                {/* Hover zoom-in icon indicators */}
                <div className="absolute top-4 right-4 bg-white/20 p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn size={14} className="text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lighbox Overlay */}
      {lightboxItem && (
        <div 
          id="gallery-lightbox-overlay" 
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all"
          onClick={() => setLightboxItem(null)}
        >
          <div className="relative max-w-4xl w-full bg-transparent flex flex-col items-center">
            <button
              id="close-gallery-lightbox"
              onClick={() => setLightboxItem(null)}
              className="absolute -top-12 right-0 bg-white/10 hover:bg-white/30 text-white p-2.5 rounded-full"
            >
              <X size={20} />
            </button>
            <img
              id="lightbox-image-view"
              src={lightboxItem.url}
              alt={lightboxItem.titleEn}
              className="max-h-[75vh] object-contain rounded-2xl shadow-2xl border-4 border-white/10"
              onClick={(e) => e.stopPropagation()} // Prevent close on clicking image
            />
            <div className="text-center text-white mt-4 space-y-1">
              <span className="text-xs text-[#FFE66D] font-bold uppercase tracking-widest">{lightboxItem.category}</span>
              <h2 className="text-lg font-bold font-sans">{lang === 'en' ? lightboxItem.titleEn : lightboxItem.titleBn}</h2>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
