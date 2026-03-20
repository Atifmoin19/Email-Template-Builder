import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Zap, Shield, Layout, ArrowRight, Github } from 'lucide-react';
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
          <span>EmailFlow</span>
        </div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#templates">Templates</a>
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
          <h1>Design <span className="text-gradient">Production-Ready</span> Emails in Minutes.</h1>
          <p>The first open-source email builder that guarantees compatibility with Outlook, Gmail, and 50+ other clients. No coding required.</p>
          <div className="hero-actions">
            <button className="btn-primary-lg" onClick={onStart}>
              Start Building Now
              <ArrowRight className="btn-icon" />
            </button>
            <button className="btn-secondary-lg">
              <Github className="btn-icon" />
              View on GitHub
            </button>
          </div>
        </motion.div>
        
        <motion.div 
          className="hero-preview"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 1 }}
        >
          <div className="preview-window">
             <div className="window-header">
               <div className="dot"></div><div className="dot"></div><div className="dot"></div>
             </div>
             <img src="https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&q=80&w=1200" alt="App Preview" />
          </div>
        </motion.div>
      </header>

      <section id="features" className="features-section">
        <div className="section-header">
          <h2>Why choose EmailFlow?</h2>
          <p>Everything you need to ship confident, beautiful emails.</p>
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
        <p>&copy; 2024 EmailFlow. Built for developers and designers.</p>
      </footer>
    </div>
  );
};
