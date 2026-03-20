import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Zap, Shield, Layout, ArrowRight, Github } from 'lucide-react';
import homepageImg from '../../assets/homepage.png';
import previewModalImg from '../../assets/PreviewModal.png';
import './LandingPage.css';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="nav-logo">
          <Mail className="logo-icon" />
          <span>EmailTemplate<span className="text-primary">Flow</span></span>
        </div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <button className="btn-primary-sm" onClick={onStart}>Launch Builder</button>
        </div>
      </nav>

      <header className="hero-section">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>The <span className="text-gradient">No-Code</span> Email HTML Builder.</h1>
          <p>Design production-ready, highly compatible email templates in minutes without writing a single line of code. Export clean HTML ready for any ESP.</p>
          <div className="hero-actions">
            <button className="btn-primary-lg" onClick={onStart}>
              Start Building Now
              <ArrowRight className="btn-icon" />
            </button>
            <a 
              href="https://github.com/Atifmoin19/Email-Template-Builder" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-secondary-lg"
            >
              <Github className="btn-icon" />
              View on GitHub
            </a>
          </div>
        </motion.div>
        
        <motion.div 
          className="hero-preview"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 1 }}
        >
          <div className="preview-container">
            <div className="preview-window main-window">
               <div className="window-header">
                 <div className="dot"></div><div className="dot"></div><div className="dot"></div>
               </div>
               <img src={homepageImg} alt="EmailTemplateFlow Builder" />
            </div>
            <motion.div 
              className="preview-window overlay-window"
              initial={{ x: 50, y: 50, opacity: 0 }}
              animate={{ x: 0, y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
               <div className="window-header">
                 <div className="dot"></div><div className="dot"></div><div className="dot"></div>
               </div>
               <img src={previewModalImg} alt="Email Preview" />
            </motion.div>
          </div>
        </motion.div>
      </header>

      <section id="features" className="features-section">
        <div className="section-header">
          <h2>Why choose EmailTemplateFlow?</h2>
          <p>Everything you need to ship confident, beautiful emails with zero code.</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Zap className="feature-icon" />
            </div>
            <h3>Instant Preview</h3>
            <p>See exactly how your email looks on mobile and desktop as you build it.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Shield className="feature-icon" />
            </div>
            <h3>Outlook Safe</h3>
            <p>Automatically generates the complex MSO code required for Outlook compatibility.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Layout className="feature-icon" />
            </div>
            <h3>Nested Layouts</h3>
            <p>Drag and drop columns inside sections for advanced responsive designs.</p>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <p>&copy; 2024 EmailTemplateFlow. The world's easiest no-code email builder.</p>
      </footer>
    </div>
  );
};
