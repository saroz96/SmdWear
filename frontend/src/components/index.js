import { Link } from 'react-router-dom';
import Slider from './Slider/Slider';
import '../../src/App.css';

function App() {
  return (
    <div className="App">
      <Slider />
      {/* Hero Section */}
      {/* <header className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Build Trust With Us</h1>
            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
            <div className="cta-buttons">
              <button className="btn-primary">Get Quote</button>
              <button className="btn-secondary">All Aroducts</button>
            </div>
          </div>
          <div className="hero-image">
            <div className="terminal-window">
              <div className="terminal-header">
                <div className="terminal-buttons">
                  <span className="terminal-btn red"></span>
                  <span className="terminal-btn yellow"></span>
                  <span className="terminal-btn green"></span>
                </div>
              </div>
              <div className="terminal-body">
                <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQlEdfElGxnWk30bwSE7BJDI6PktBvkNGd8g&s' alt='avatar'></img>
              </div>
            </div>
          </div>
        </div>
      </header> */}

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