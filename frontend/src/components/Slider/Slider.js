import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const Slider = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await axios.get('/api/slides');
        setSlides(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching slides:', error);
        setLoading(false);
      }
    };
    fetchSlides();
  }, []);

  if (loading) return <div className="slider-loading">Loading slides...</div>;
  if (slides.length === 0) return null;

  return (
    <div className="home-slider">
      <Carousel
        showArrows={true}
        showThumbs={false}
        infiniteLoop={true}
        autoPlay={true}
        interval={5000}
        showStatus={false}
      >
        {slides.map((slide) => (
          <div key={slide._id}>
            <img 
              src={slide.image.url} 
              alt={slide.title || 'Promotional slide'} 
              className="slider-image"
            />
            {slide.title && (
              <div className="slider-caption">
                <h3>{slide.title}</h3>
                {slide.description && <p>{slide.description}</p>}
                {slide.link && (
                  <a href={slide.link} className="slider-button">
                    Learn More
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Slider;