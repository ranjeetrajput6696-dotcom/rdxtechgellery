import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Camera, Calendar, Phone, Heart, Star, Image as ImageIcon, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [phoneNumber] = useState("7351608249");

  return (
    <div className="pt-24 min-h-screen pb-12 bg-white">
      {/* Hero Section */}
      <section className="max-w-screen-2xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24 min-h-[70vh]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-12 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-pink-50 text-pink-600 px-4 py-1 rounded-full text-xs font-bold tracking-tight mb-8 shadow-sm">
            <Heart className="w-4 h-4 fill-pink-600" />
            VOTED #1 WEDDING PHOTOGRAPHER 2024
          </div>
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight text-on-surface leading-[1.0] mb-8">
            Your Love Story, <br/>
            <span className="text-primary italic">Captured Forever.</span>
          </h1>
          <p className="text-xl text-on-surface-variant leading-relaxed max-w-2xl mx-auto mb-12">
            Professional wedding and pre-wedding photography that turns moments into timeless memories. Book your cameraman with just a single phone call.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
            <a 
              href={`tel:${phoneNumber}`}
              className="bg-slate-900 text-white px-10 py-5 text-lg font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl flex items-center gap-3 active:scale-95"
            >
              <Phone className="w-6 h-6 animate-bounce" />
              Call to Book: {phoneNumber}
            </a>
            <Link 
              to="/gallery"
              className="bg-white text-on-surface border border-divider px-10 py-5 text-lg font-bold rounded-2xl hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              <ImageIcon className="w-5 h-5" />
              View Gallery
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Featured Grid (Pre-wedding Showcase) */}
      <section className="max-w-screen-2xl mx-auto px-6 mb-24">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-extrabold tracking-tight mb-2">Pre-Wedding Magic</h2>
            <p className="text-on-surface-variant">Selected shots from our most recent pre-wedding journeys.</p>
          </div>
          <Link to="/gallery" className="text-primary font-bold hover:underline mb-2">View All →</Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div whileHover={{ y: -10 }} className="sleek-card overflow-hidden group">
            <div className="overflow-hidden">
              <img src="https://picsum.photos/seed/wedding1/800/1000" className="w-full aspect-[4/5] object-cover group-hover:scale-110 transition-all duration-500" referrerPolicy="no-referrer" />
            </div>
            <div className="p-6">
              <span className="badge badge-info">Udaipur, 2024</span>
              <h3 className="text-xl font-bold mt-2">Sun-kissed Romance</h3>
            </div>
          </motion.div>
          <motion.div whileHover={{ y: -10 }} className="sleek-card overflow-hidden group mt-12 md:mt-0">
            <div className="overflow-hidden">
              <img src="https://picsum.photos/seed/wedding2/800/1000" className="w-full aspect-[4/5] object-cover group-hover:scale-110 transition-all duration-500" referrerPolicy="no-referrer" />
            </div>
            <div className="p-6">
              <span className="badge badge-success">Jaipur, 2024</span>
              <h3 className="text-xl font-bold mt-2">Royal Heritage Shoot</h3>
            </div>
          </motion.div>
          <motion.div whileHover={{ y: -10 }} className="sleek-card overflow-hidden group">
            <div className="overflow-hidden">
              <img src="https://picsum.photos/seed/wedding3/800/1000" className="w-full aspect-[4/5] object-cover group-hover:scale-110 transition-all duration-500" referrerPolicy="no-referrer" />
            </div>
            <div className="p-6">
              <span className="badge badge-warning">Goa, 2024</span>
              <h3 className="text-xl font-bold mt-2">Sunset Beach Clicks</h3>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-slate-900 text-white py-24 mb-24 border-y border-white/10">
        <div className="max-w-screen-2xl mx-auto px-6 text-center mb-16">
          <h2 className="text-4xl font-extrabold mb-4">Cinematic Short Films</h2>
          <p className="text-slate-400 max-w-xl mx-auto">Experience the motion, the music, and the raw emotion of our cinematic highlights.</p>
        </div>
        <div className="max-w-screen-2xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl relative group">
            <iframe 
              className="w-full h-full"
              src="https://www.youtube.com/embed/videoseries?list=UU7-G9h_rZ-eD_yB_vYt-J8Q" 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowFullScreen
            ></iframe>
          </div>
          <div className="space-y-8">
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
              <h3 className="text-xl font-bold mb-2">Visual Storytelling</h3>
              <p className="text-sm text-slate-400">Our short films are edited to capture the rhythm of your celebration. Watch more on our official channel.</p>
              <div className="mt-4 flex flex-wrap gap-4">
                <a 
                  href="https://www.youtube.com/@TECHSuneel" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:underline"
                >
                  YouTube Channel →
                </a>
                <Link 
                  to="/videos"
                  className="inline-flex items-center gap-2 text-white font-bold text-sm hover:underline"
                >
                  View All Films →
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-4">
                <div className="text-3xl font-extrabold text-primary">500k+</div>
                <div className="text-xs text-slate-500 uppercase font-bold tracking-widest">Views</div>
              </div>
              <div className="text-center p-4">
                <div className="text-3xl font-extrabold text-primary">10k+</div>
                <div className="text-xs text-slate-500 uppercase font-bold tracking-widest">Subscribers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="bg-slate-50 py-24 mb-24">
        <div className="max-w-screen-2xl mx-auto px-6 text-center mb-16">
          <h2 className="text-4xl font-extrabold mb-4">Investment & Packages</h2>
          <p className="text-on-surface-variant max-w-xl mx-auto">Transparent pricing for every budget. Every package comes with a professional cameraman and premium editing.</p>
        </div>
        <div className="max-w-screen-2xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <PackageCard 
            title="Standard" 
            price="₹21,000" 
            features={["1 Lead Cameraman", "Unlimited Photos", "Digital Delivery", "10 Retouched Images"]} 
          />
          <PackageCard 
            title="Premium" 
            price="₹51,000" 
            highlight 
            features={["2 Lead Cameramen", "Cinematic Short Movie", "Physical Album", "Pre-Wedding Shoot (1 Day)"]} 
          />
          <PackageCard 
            title="Luxury" 
            price="₹1,21,000" 
            features={["Full Team Coverage", "Live Streaming", "Drone Shots", "Destination Pre-Wedding"]} 
          />
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-screen-2xl mx-auto px-6 mb-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold mb-4">What Our Clients Say</h2>
          <div className="flex justify-center gap-1">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <TestimonialCard 
            text="Suneel and his team captured our Udaipur wedding like a dream. The candid shots are our absolute favorite!" 
            author="Priya & Rahul" 
          />
          <TestimonialCard 
            text="The technical support from Ranjeet was amazing. We got our high-res photos within 15 days in an easy-to-use dashboard." 
            author="Ananya S." 
          />
          <TestimonialCard 
            text="Professional, punctual, and highly creative. The pre-wedding shoot was handled so well by Arjun Singh." 
            author="Vikram K." 
          />
        </div>
      </section>

      {/* Feature Section */}
      <section className="max-w-screen-2xl mx-auto px-6 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center text-on-surface">
            <FeatureItem icon={<Camera className="w-10 h-10" />} title="Expert Cameramen" desc="Pro equipment & experienced eye" />
            <FeatureItem icon={<Calendar className="w-10 h-10" />} title="Easy Scheduling" desc="Single call booking system" />
            <FeatureItem icon={<Star className="w-10 h-10" />} title="Premium Editing" desc="Professional color grading" />
            <FeatureItem icon={<Users className="w-10 h-10" />} title="Client Dashboard" desc="Track your photos and dates" />
          </div>
      </section>

      {/* Simple CTA */}
      <section className="max-w-4xl mx-auto px-6 text-center mb-24">
        <h2 className="text-4xl font-extrabold mb-6">Don't miss a single moment.</h2>
        <p className="text-lg text-on-surface-variant mb-12">Spaces are filling up fast for the upcoming wedding season. Call us now to finalize your dates and assign your pro photographer.</p>
        <div className="p-8 sleek-card bg-primary/5 border-primary/20">
          <h3 className="text-2xl font-bold mb-4">Book in 60 seconds</h3>
          <a href={`tel:${phoneNumber}`} className="text-4xl font-extrabold text-primary hover:scale-105 transition-transform block">
            {phoneNumber}
          </a>
          <p className="text-xs text-on-surface-variant mt-4 font-bold uppercase tracking-widest">Available 24/7 for booking inquiries</p>
        </div>
      </section>
    </div>
  );
}

function TestimonialCard({ text, author }: { text: string, author: string }) {
  return (
    <div className="sleek-card p-8 bg-white border border-divider shadow-sm">
      <p className="text-on-surface-variant italic mb-6 leading-relaxed">"{text}"</p>
      <div className="font-bold text-sm text-on-surface">— {author}</div>
    </div>
  );
}

function PackageCard({ title, price, features, highlight = false }: { title: string, price: string, features: string[], highlight?: boolean }) {
  return (
    <div className={`sleek-card p-8 flex flex-col ${highlight ? 'bg-slate-900 text-white ring-4 ring-primary/20 border-primary shadow-2xl relative scale-105 z-10' : 'bg-white'}`}>
      {highlight && <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-primary text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">Most Popular</div>}
      <h3 className="text-xl font-black mb-1">{title}</h3>
      <div className={`text-3xl font-extrabold mb-8 ${highlight ? 'text-primary' : 'text-on-surface'}`}>{price}</div>
      <ul className="space-y-4 mb-10 flex-grow">
        {features.map(f => (
          <li key={f} className="flex gap-3 text-sm items-start">
            <Heart className={`w-4 h-4 shrink-0 mt-0.5 ${highlight ? 'text-primary fill-primary' : 'text-primary'}`} />
            <span className={highlight ? 'text-slate-300' : 'text-on-surface-variant'}>{f}</span>
          </li>
        ))}
      </ul>
      <a 
        href="tel:7351608249"
        className={`w-full py-4 rounded-xl font-bold text-center transition-all ${highlight ? 'bg-primary text-white hover:bg-blue-600' : 'bg-slate-100 text-on-surface hover:bg-slate-200'}`}
      >
        Choose Plan
      </a>
    </div>
  );
}

function FeatureItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="p-4 bg-white/10 rounded-2xl text-primary">{icon}</div>
      <h4 className="text-xl font-bold">{title}</h4>
      <p className="text-slate-400 text-sm">{desc}</p>
    </div>
  );
}


      
