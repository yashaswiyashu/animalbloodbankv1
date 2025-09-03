import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import '../../../styles/css/GallerySection.css';

const images = [
  { src: 'https://placedog.net/600/400?id=1', caption: 'Donation Camp Day' },
  { src: 'https://placedog.net/600/400?id=2', caption: 'Emergency Transfusion' },
  { src: 'https://placedog.net/600/400?id=3', caption: 'Vet Visit for Max' },
  { src: 'https://placedog.net/600/400?id=4', caption: 'Our Partnered Hospital' },
  { src: 'https://placedog.net/600/400?id=5', caption: 'Happy Donor Pup' },
  { src: 'https://placedog.net/600/400?id=6', caption: 'Spoorthidhama Event' },
  { src: 'https://placedog.net/600/400?id=7', caption: '24/7 Critical Care' },
  { src: 'https://placedog.net/600/400?id=8', caption: 'Awareness Workshop' },
];

const GallerySection: React.FC = () => {
  return (
    <section className="gallery-section">
      <h2 className="gallery-title">📸 Moments from Our Journey</h2>
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        loop
        spaceBetween={20}
        slidesPerView={3}
        breakpoints={{
          320: { slidesPerView: 1 },
          600: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="gallery-swiper"
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <div className="gallery-card">
              <img src={img.src} alt={img.caption} />
              <div className="caption">{img.caption}</div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default GallerySection;
