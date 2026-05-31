import { useState, useEffect } from 'react';
import axios from 'axios';
import { Mail, Phone, Heart, ShieldAlert, Award, FileText, Landmark, User, MessageSquare, Send, CheckCircle2, ChevronRight, Menu, X, ArrowLeft } from 'lucide-react';
import Admin from './Admin';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

function App() {
  const [view, setView] = useState('home'); // 'home' | 'admin'
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Real-time Validation
  useEffect(() => {
    const newErrors = {};
    if (formData.name && formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (formData.message && formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    setErrors(newErrors);
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    // Mark all as touched
    const allTouched = { name: true, email: true, message: true };
    setTouched(allTouched);

    // Initial validation check
    const validationErrors = {};
    if (!formData.name.trim()) validationErrors.name = 'Name is required';
    else if (formData.name.trim().length < 2) validationErrors.name = 'Name must be at least 2 characters';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) validationErrors.email = 'Email is required';
    else if (!emailRegex.test(formData.email)) validationErrors.email = 'Please enter a valid email address';

    if (!formData.message.trim()) validationErrors.message = 'Message is required';
    else if (formData.message.trim().length < 10) validationErrors.message = 'Message must be at least 10 characters';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(`${API_URL}/api/contact`, formData);
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      setTouched({});
    } catch (err) {
      console.error(err);
      setSubmitError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-light flex flex-col font-sans selection:bg-brand-red/20 selection:text-brand-red">
      
      {/* Premium Navigation Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm backdrop-blur-md bg-white/95">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          {/* Logo Brand */}
          <a href="https://shecanfoundation.org/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
            <img 
              src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=32,h=32,fit=crop,f=png/Aq2NJ23MzBH2rx2j/she-A0x4keRWN9FkzVg3.jpg" 
              alt="She Can Foundation Logo"
              className="w-10 h-10 rounded-full border border-gray-100 shadow-sm group-hover:scale-105 transition-transform"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <span className="font-display font-bold text-xl tracking-tight flex flex-col md:flex-row md:gap-1.5 leading-none">
              <span className="text-brand-red">She Can</span>
              <span className="text-brand-dark">Foundation</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a 
              href="https://shecanfoundation.org/our-story" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm font-semibold text-brand-dark hover:text-brand-red transition-colors flex items-center gap-1 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-brand-red" />
              Our Story
            </a>
            <a 
              href="https://shecanfoundation.org/our-certificate" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm font-semibold text-brand-dark hover:text-brand-red transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Award className="w-4 h-4 text-brand-red" />
              Certificate
            </a>
            <a 
              href="https://shecanfoundation.org/donate" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm font-semibold text-brand-dark hover:text-brand-red transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Landmark className="w-4 h-4 text-brand-red" />
              Donate
            </a>

            <div className="w-px h-6 bg-gray-200" aria-hidden="true" />

            {view === 'home' ? (
              <button
                onClick={() => setView('admin')}
                className="text-sm font-semibold text-white bg-brand-dark px-5 py-2.5 rounded-xl hover:bg-brand-red transition-colors cursor-pointer shadow-md shadow-brand-dark/10"
              >
                Admin Panel
              </button>
            ) : (
              <button
                onClick={() => setView('home')}
                className="text-sm font-semibold text-white bg-brand-red px-5 py-2.5 rounded-xl hover:bg-brand-dark transition-colors cursor-pointer shadow-md shadow-brand-red/10 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Form
              </button>
            )}
          </nav>

          {/* Mobile Navigation Trigger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-brand-dark hover:text-brand-red transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 shadow-inner flex flex-col gap-4 animate-fadeIn">
            <a 
              href="https://shecanfoundation.org/our-story" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 py-2 text-brand-dark font-medium hover:text-brand-red transition-colors text-sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FileText className="w-4 h-4 text-brand-red" />
              Our Story
            </a>
            <a 
              href="https://shecanfoundation.org/our-certificate" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 py-2 text-brand-dark font-medium hover:text-brand-red transition-colors text-sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Award className="w-4 h-4 text-brand-red" />
              Certificate
            </a>
            <a 
              href="https://shecanfoundation.org/donate" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 py-2 text-brand-dark font-medium hover:text-brand-red transition-colors text-sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Landmark className="w-4 h-4 text-brand-red" />
              Donate
            </a>
            <div className="h-px bg-gray-100 my-1" />
            {view === 'home' ? (
              <button
                onClick={() => { setView('admin'); setMobileMenuOpen(false); }}
                className="w-full bg-brand-dark text-white py-3 rounded-xl font-semibold hover:bg-brand-red transition-all cursor-pointer text-center text-sm"
              >
                Admin Panel
              </button>
            ) : (
              <button
                onClick={() => { setView('home'); setMobileMenuOpen(false); }}
                className="w-full bg-brand-red text-white py-3 rounded-xl font-semibold hover:bg-brand-dark transition-all cursor-pointer text-center text-sm flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Form
              </button>
            )}
          </div>
        )}
      </header>

      {/* Main Core View Area */}
      <main className="flex-grow py-12 md:py-16">
        {view === 'admin' ? (
          <Admin />
        ) : (
          <div className="max-w-4xl mx-auto px-4 grid md:grid-cols-5 gap-12 items-center">
            
            {/* Left Hero Brand Callout */}
            <div className="md:col-span-2 space-y-6 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 bg-brand-red/10 text-brand-red px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
                <Heart className="w-3.5 h-3.5 fill-brand-red" />
                Empowering Women
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-brand-dark leading-tight">
                Global Vision, <br />
                <span className="text-brand-red">Local Action</span>
              </h1>
              <p className="text-brand-slate text-sm md:text-base leading-relaxed">
                We don't ask for much, just help us with what you can — be it money, skill, or your valuable time. Reach out today to create a lasting community impact!
              </p>
              
              <div className="hidden md:block pt-4 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-red/5 flex items-center justify-center text-brand-red">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-brand-dark">Registered under Indian Society Act</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-red/5 flex items-center justify-center text-brand-red">
                    <Award className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-brand-dark">Empowering through active support</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Form Card */}
            <div className="md:col-span-3">
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-gray-100 transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-brand-red" />
                
                {submitSuccess ? (
                  // Success State Card View
                  <div className="py-10 text-center animate-scaleUp">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-bold text-brand-dark mb-2">Form Submitted Successfully</h2>
                    <p className="text-brand-slate text-sm max-w-sm mx-auto mb-6">
                      Thank you for contacting the She Can Foundation. Our team will review your message and reach out shortly.
                    </p>
                    <button
                      onClick={() => setSubmitSuccess(false)}
                      className="inline-flex items-center gap-1.5 text-brand-red font-semibold hover:text-brand-dark hover:underline transition-all text-sm cursor-pointer"
                    >
                      Send another message
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  // Normal Form Fields State
                  <>
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-brand-dark">Get in Touch</h2>
                      <p className="text-xs text-brand-slate mt-1">
                        Please fill in the form fields below and click send.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      
                      {/* Name input */}
                      <div>
                        <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-2 flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-brand-red" />
                          Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          onBlur={() => handleBlur('name')}
                          placeholder="Your Name"
                          className={`w-full px-4 py-3 border ${
                            touched.name && errors.name ? 'border-brand-red ring-1 ring-brand-red/10' : 'border-gray-200'
                          } rounded-xl focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 outline-none transition-all font-sans text-sm`}
                        />
                        {touched.name && errors.name && (
                          <p className="text-xs font-semibold text-brand-red mt-1.5">{errors.name}</p>
                        )}
                      </div>

                      {/* Email input */}
                      <div>
                        <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-2 flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-brand-red" />
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          onBlur={() => handleBlur('email')}
                          placeholder="your.email@domain.com"
                          className={`w-full px-4 py-3 border ${
                            touched.email && errors.email ? 'border-brand-red ring-1 ring-brand-red/10' : 'border-gray-200'
                          } rounded-xl focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 outline-none transition-all font-sans text-sm`}
                        />
                        {touched.email && errors.email && (
                          <p className="text-xs font-semibold text-brand-red mt-1.5">{errors.email}</p>
                        )}
                      </div>

                      {/* Message input */}
                      <div>
                        <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-2 flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5 text-brand-red" />
                          Message
                        </label>
                        <textarea
                          name="message"
                          rows="4"
                          value={formData.message}
                          onChange={handleInputChange}
                          onBlur={() => handleBlur('message')}
                          placeholder="Tell us how you would like to help..."
                          className={`w-full px-4 py-3 border ${
                            touched.message && errors.message ? 'border-brand-red ring-1 ring-brand-red/10' : 'border-gray-200'
                          } rounded-xl focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 outline-none transition-all font-sans text-sm resize-none`}
                        />
                        {touched.message && errors.message && (
                          <p className="text-xs font-semibold text-brand-red mt-1.5">{errors.message}</p>
                        )}
                      </div>

                      {/* Global Submit Error Message */}
                      {submitError && (
                        <div className="text-xs font-semibold text-brand-red bg-brand-red/5 p-3 rounded-lg border border-brand-red/10">
                          {submitError}
                        </div>
                      )}

                      {/* Submit button */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-brand-red text-white py-3.5 px-4 rounded-xl font-semibold hover:bg-brand-dark hover:shadow-brand-dark/10 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-brand-red/15 hover:shadow-brand-red/25 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Send Message
                          </>
                        )}
                      </button>

                    </form>
                  </>
                )}

              </div>
            </div>

          </div>
        )}
      </main>

      {/* Styled Brand Footer */}
      <footer className="bg-brand-dark text-white border-t border-brand-dark py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <span className="font-display font-bold text-lg flex gap-1.5 leading-none">
              <span className="text-brand-red">She Can</span>
              <span>Foundation</span>
            </span>
            <p className="text-xs text-brand-light/75 leading-relaxed max-w-sm">
              We empower women and transform lives. Join us in making a real difference by contributing your skills, money, or support.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-red">Contact Us</h4>
            <div className="space-y-2 text-xs text-brand-light/75">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-red" />
                <a href="mailto:president@shecanfoundation.org" className="hover:text-brand-red">president@shecanfoundation.org</a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-red" />
                <a href="tel:+918283841830" className="hover:text-brand-red">+91- 8283841830</a>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-red">Social Handles</h4>
            <div className="flex items-center gap-4">
              <a 
                href="https://www.instagram.com/_shecanfoundation_" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-red transition-all cursor-pointer"
                title="Instagram"
              >
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a 
                href="https://www.linkedin.com/company/shecanfoundation" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-red transition-all cursor-pointer"
                title="LinkedIn"
              >
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 mt-8 pt-8 border-t border-white/10 text-center text-xs text-brand-light/50">
          &copy; {new Date().getFullYear()} She Can Foundation. All rights reserved. NGO Registered under Indian Society Act, 1860.
        </div>
      </footer>

    </div>
  );
}

export default App;
