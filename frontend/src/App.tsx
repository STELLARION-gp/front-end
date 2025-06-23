// App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import Signup from './pages/Signup';
import Hero from './components/Hero';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />

        {/* ✅ Allow nested routes like /dashboard/profile */}
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path='/signup' element={<Signup />}  />
        <Route path='/home' element={<Hero />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
