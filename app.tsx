import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PageLayout from './components/layout/PageLayout.tsx';
import Home from './pages/Home.tsx';
import Gallery from './pages/Gallery.tsx';
import OurStory from './pages/OurStory.tsx';
import Contact from './pages/Contact.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Videos from './pages/Videos.tsx';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export default function App() {
  return (
    <Router>
      <PageLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/story" element={<OurStory />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </PageLayout>
    </Router>
  );
