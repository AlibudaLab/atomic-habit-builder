
import { useState, useRef, useEffect, useCallback } from 'react';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

const step1 = require('../../imgs/steps/step1.png');
const step2 = require('../../imgs/steps/step2.png');
const step3 = require('../../imgs/steps/step3.png');

type CardData = {
  image: string;
  title: string;
  description: string;
};

const cardData: CardData[] = [
  {
    image: step1,
    title: 'Stake USDC',
    description: 'Join the challenge with a fixed deposit',
  },
  {
    image: step2,
    title: 'Log Strava',
    description: 'Verify your activities before the deadline',
  },
  {
    image: step3,
    title: 'Win or Lose',
    description: 'Complete to share the pool, or forfeit your stake',
  },
];

function CardSlider() {
  const [currentCard, setCurrentCard] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToCard = (index: number) => {
    if (sliderRef.current) {
      const cardWidth = sliderRef.current.offsetWidth;
      sliderRef.current.scrollTo({
        left: cardWidth * index,
        behavior: 'smooth',
      });
    }
  };

  const handleScroll = () => {
    if (sliderRef.current) {
      const scrollPosition = sliderRef.current.scrollLeft;
      const cardWidth = sliderRef.current.offsetWidth;
      const newIndex = Math.round(scrollPosition / cardWidth);
      setCurrentCard(newIndex);
    }
  };

  const debouncedHandleScroll = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (sliderRef.current) {
        const scrollPosition = sliderRef.current.scrollLeft;
        const cardWidth = sliderRef.current.offsetWidth;
        const newIndex = Math.round(scrollPosition / cardWidth);
        setCurrentCard(newIndex);
      }
    }, 100); // Adjust this value to balance responsiveness and performance
  }, []);

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener('scroll', debouncedHandleScroll);
      return () => {
        slider.removeEventListener('scroll', debouncedHandleScroll);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [debouncedHandleScroll]);

  const nextCard = () => {
    const newIndex = (currentCard + 1) % cardData.length;
    setCurrentCard(newIndex);
    scrollToCard(newIndex);
  };

  const prevCard = () => {
    const newIndex = (currentCard - 1 + cardData.length) % cardData.length;
    setCurrentCard(newIndex);
    scrollToCard(newIndex);
  };

  return (
    <div className="relative mx-auto w-full max-w-md rounded-lg shadow-md">
      <div ref={sliderRef} className="snap-x snap-mandatory overflow-x-auto scrollbar-hide">
        <div className="flex">
          {cardData.map((card, index) => (
            <div key={`${card.description}`} className="w-full flex-shrink-0 snap-center">
              <div className="flex h-48 items-center justify-center rounded-t-lg">
                <Image
                  src={card.image}
                  alt={`Step ${index + 1}`}
                  width={200}
                  height={200}
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <p className="flex h-24 flex-col rounded-b-lg px-4 py-2 text-center text-sm">
                <span className="font-xl mb-1 font-bold"> {card.title} </span>
                <span>{card.description} </span>
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 transform space-x-2">
        {cardData.map((card, index) => (
          <div
            key={`c-${card.description}`}
            className={`h-2 w-2 rounded-full ${
              index === currentCard ? 'bg-primary' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={prevCard}
        className="absolute left-2 top-1/2 -translate-y-1/2 transform rounded-full bg-white/50 p-2"
      >
        <ChevronLeft className="h-4 w-4 text-gray-500" />
      </button>
      <button
        type="button"
        onClick={nextCard}
        className="absolute right-2 top-1/2 -translate-y-1/2 transform rounded-full bg-white/50 p-2"
      >
        <ChevronRight className="h-4 w-4 text-gray-500" />
      </button>
    </div>
  );
}

export default CardSlider;
