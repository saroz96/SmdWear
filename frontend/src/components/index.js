import { Link } from 'react-router-dom';
import Slider from './Slider/Slider';
import '../../src/App.css';

function App() {
  return (
    <div className="App">
      <Slider />

      {/* Hero Section */}

      {/* Store Content Section */}
      <section className="store-content">
        <div className="container">
          <div className="content-grid">
            <div className="content-left">
              <span className="section-tag">ABOUT SMDWEAR</span>
              <h2>Premium Medical Solutions <span className="highlight">Engineered for Excellence</span></h2>
              <div className="divider"></div>
              <p className="lead-text">
                SmdWear is revolutionizing surgical and medical solutions with cutting-edge technology and uncompromising quality standards.
              </p>
              <div className="content-features">
                <div className="feature-item">
                  <div className="feature-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4>Certified Quality</h4>
                    <p>ISO and CE certified products meeting global healthcare standards</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                    </svg>
                  </div>
                  <div>
                    <h4>Innovative Technology</h4>
                    <p>Advanced manufacturing processes for superior performance</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.707 3.96a9.084 9.084 0 01-5.017 2.05c-3.578 0-6.491-2.003-6.491-5.445 0-3.072 2.922-5.428 6.555-5.428v1.5m0 0c1.953 0 3.571.794 4.616 2.07M12 8.25c1.953 0 3.571.794 4.616 2.07M15.75 10.5a3.23 3.23 0 00-1.134-.703m0 0a3.18 3.18 0 00-.915-.48 8.814 8.814 0 00-3.17 0 3.18 3.18 0 00-.915.48 3.23 3.23 0 00-1.134.703M15.75 10.5l1.441-1.233a3.286 3.286 0 012.24-.832 8.93 8.93 0 012.618 0 3.286 3.286 0 012.24.832L21 10.5M4.5 15.75l1.159-1.963a3.286 3.286 0 012.41-1.349 8.931 8.931 0 012.655 0 3.286 3.286 0 012.41 1.35L13.5 15.75" />
                    </svg>
                  </div>
                  <div>
                    <h4>Global Reach</h4>
                    <p>Trusted by hospitals and clinics worldwide</p>
                  </div>
                </div>
              </div>
              <div className="cta-buttons">
                <Link to="/brands/view/all" className="btn-primary">
                  Explore Products
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 10a.75.75 0 01.75-.75h6.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l2.158-1.96H5.75A.75.75 0 015 10z" clipRule="evenodd" />
                  </svg>
                </Link>
                <Link to="/about" className="btn-secondary">
                  Our Story
                </Link>
              </div>
            </div>
            <div className="content-right">
              <div className="image-container">
                <img
                  src="https://images.unsplash.com/photo-1581595219315-a187dd40c322?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="Medical professional wearing SMDWEAR gown"
                  className="content-image"
                />
                <div className="image-badge">
                  <div className="badge-content">
                    <span className="badge-number">25+</span>
                    <span className="badge-text">Years of Experience</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="container">
          <h2>Why Choose SmdWear?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">⚛️</div>
              <h3>React Frontend</h3>
              <p>Build dynamic UIs with reusable components and virtual DOM for high performance.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>Express & Node</h3>
              <p>Create robust backend APIs with middleware support and efficient routing.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🗄️</div>
              <h3>MongoDB Database</h3>
              <p>Flexible NoSQL database with JSON-like documents and horizontal scaling.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <h2>Ready to Build Trust?</h2>
          <p>Join us for serve humanity with reliable products</p>
          <button className="btn-primary">Get Started Today</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="logo">SMD<span>WEAR</span></div>
              <p>The complete solution for gown & dressings</p>
            </div>
            <div className="footer-links">
              <h4>Resources</h4>
              <ul>
                <li><a href="#about">Documentation</a></li>
                <li><a href="#tutorials">Tutorials</a></li>
                <li><a href="#community">Community</a></li>
              </ul>
            </div>
            <div className="footer-links">
              <h4>Company</h4>
              <ul>
                <li><a href="#about">About Us</a></li>
                <li><a href="#careers">Careers</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} SMDWEAR. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;