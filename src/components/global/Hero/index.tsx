import type { Hero } from '../../../types';

const Hero = ({ heroTitle, heroSubtitle, heroImage }: Hero) => {

  return (
    <section className={`bg-primary-dark relative overflow-hidden bg-center bg-cover`} style={{ backgroundImage: heroImage ? `${heroImage}` : 'linear-gradient(to right, #2a3b4ce6, #1a2a3ce6)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-white text-shadow-[0 0 10px rgba(0, 0, 0, 0.5)]">{heroTitle}</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">{heroSubtitle}</p>
      </div>
    </section>
  );
};


export default Hero;
