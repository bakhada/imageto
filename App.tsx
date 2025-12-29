import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ToolPage from './pages/ToolPage';
import About from './pages/About';
import Privacy from './pages/Privacy';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import { TOOLS } from './constants';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  return (
    <Router>
      <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDarkMode ? 'dark:bg-slate-950 dark:text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
        <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        
        <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
          <Routes>
            <Route path="/" element={<Home />} />
            {TOOLS.map((tool) => (
              <Route 
                key={tool.id} 
                path={`/${tool.slug}`} 
                element={<ToolPage tool={tool} />} 
              />
            ))}
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
};

export default App;