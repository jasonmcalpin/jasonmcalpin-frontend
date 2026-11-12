import type { Hero as HeroProps } from '../../../types';
import { responsiveImage } from '../../../services/responsiveImages';

const Hero = ({ heroTitle, heroSubtitle, heroImage }: HeroProps) => {
  const image = heroImage ? responsiveImage(heroImage) : null;
  return (
    <section className="py-24 bg-primary-dark relative overflow-hidden">
      {heroImage && (
        <picture className="absolute inset-0 block" aria-hidden="true">
          {image?.srcSet && <source type="image/webp" srcSet={image.srcSet} sizes="100vw" />}
          <img src={heroImage} alt="" loading="eager" fetchPriority="high"
            decoding="async" width={image?.width} height={image?.height}
            className="w-full h-full object-cover" />
        </picture>
      )}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to right, #2a3b4ce6, #1a2a3ce6)' }} aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-white text-shadow-[0_0_10px_rgba(0,0,0,0.5)]">{heroTitle}</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">{heroSubtitle}</p>
      </div>
    </section>
  );
};

export default Hero;
