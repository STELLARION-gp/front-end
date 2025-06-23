// App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import About from './pages/About';
import Dashboard from './pages/Dashboard';
import Signup from './pages/Signup';
import NewHome from './pages/NewHome';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<NewHome />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path='/signup' element={<Signup />}  />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
