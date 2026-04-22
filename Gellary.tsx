import React, { useState, useEffect } from 'react';
import { Camera, Image as ImageIcon, Plus, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getGalleryItems, addGalleryItem, subscribeToAuth, getUserProfile } from '../lib/firebase';
import { User } from 'firebase/auth';

export default function Gallery() {
  const [activeTab, setActiveTab] = useState('All');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newItem, setNewItem] = useState({
    title: '',
    imageUrl: '',
    category: 'Wedding' as 'Wedding' | 'Pre-wedding'
  });

  useEffect(() => {
    const unsub = subscribeToAuth(async (u) => {
      setUser(u);
      if (u) {
        const profile = await getUserProfile(u.uid);
        setIsAdmin(profile?.role === 'admin' || u.email === 'ranjeetrajput6696@gmail.com');
      } else {
        setIsAdmin(false);
      }
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      // Always fetch all items to allow client-side filtering
      const dbItems = await getGalleryItems('All');
      if (dbItems.length > 0) {
        setItems(dbItems);
      } else {
        useFallback();
      }
    } catch (error) {
      console.error("Error fetching gallery:", error);
      useFallback();
    } finally {
      setLoading(false);
    }
  };

  const useFallback = () => {
    const fallback = [
      { id: 1, title: "Royal Palace Wedding", category: "Wedding", imageUrl: "https://picsum.photos/seed/wed1/1200/800" },
      { id: 2, title: "Udaipur Lake Pre-wedding", category: "Pre-wedding", imageUrl: "https://picsum.photos/seed/pre1/1200/800" },
      { id: 3, title: "Traditional South Indian", category: "Wedding", imageUrl: "https://picsum.photos/seed/wed2/1200/800" },
      { id: 4, title: "Golden Hour Couple", category: "Pre-wedding", imageUrl: "https://picsum.photos/seed/pre2/1200/800" },
      { id: 5, title: "Grand Reception Night", category: "Wedding", imageUrl: "https://picsum.photos/seed/wed3/1200/800" },
      { id: 6, title: "Heritage Palace Corridor", category: "Wedding", imageUrl: "https://picsum.photos/seed/wed4/1200/800" },
    ];
    setItems(fallback);
  };

  const filteredItems = activeTab === 'All' 
    ? items 
    : items.filter(item => item.category === activeTab);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addGalleryItem(newItem);
      setShowAddForm(false);
      setNewItem({ title: '', imageUrl: '', category: 'Wedding' });
      fetchGallery();
    } catch (error) {
      alert("Failed to add image. Check permissions.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="pt-24 px-6 max-w-screen-2xl mx-auto mb-24 font-body min-h-screen">
      {/* Gallery Header */}
      <header className="mb-12 border-b border-border pb-12 pt-12 flex flex-col md:flex-row justify-between items-end gap-8">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-3">
            <Camera className="w-4 h-4" />
            Artist Visuals
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface">Our Signature Shots</h1>
            {isAdmin && (
              <button 
                onClick={() => setShowAddForm(true)}
                className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all text-sm shadow-xl"
              >
                <Plus className="w-4 h-4" /> New Masterpiece
              </button>
            )}
          </div>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          {['All', 'Wedding', 'Pre-wedding'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === tab 
                  ? 'bg-white text-primary shadow-sm' 
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, idx) => (
              <motion.div 
                layout
                key={item.id || idx} 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="sleek-card overflow-hidden group last:mb-0"
              >
                <div className="aspect-[4/3] overflow-hidden relative bg-slate-100">
                  <img 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" 
                    src={item.imageUrl || item.image}
                    alt={item.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <div className="text-white">
                      <span className="text-[10px] font-bold uppercase tracking-widest bg-primary px-2 py-0.5 rounded mb-2 inline-block">
                        {item.category}
                      </span>
                      <h3 className="text-lg font-bold">{item.title}</h3>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {/* Call to action card */}
          <div className="sleek-card p-12 bg-primary flex flex-col justify-center items-center text-center text-white">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-6">
              <ImageIcon className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Your shot could be next.</h3>
            <p className="text-white/70 text-sm mb-8">Let us capture your special day with our unique artistic lens.</p>
            <a href="tel:7351608249" className="bg-white text-primary px-8 py-3 rounded-xl font-bold text-sm hover:scale-105 transition-transform">
              Book My Date
            </a>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl"
            >
              <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-black italic">Archive <span className="text-primary">New Work</span></h3>
                </div>
                <button onClick={() => setShowAddForm(false)} className="p-3 hover:bg-white/10 rounded-full transition-all">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleAddItem} className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Image URL</label>
                    <input 
                      required
                      value={newItem.imageUrl}
                      onChange={(e) => setNewItem({...newItem, imageUrl: e.target.value})}
                      placeholder="https://..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Category</label>
                      <select 
                        value={newItem.category}
                        onChange={(e) => setNewItem({...newItem, category: e.target.value as any})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all"
                      >
                        <option value="Wedding">Wedding</option>
                        <option value="Pre-wedding">Pre-wedding</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Title</label>
                      <input 
                        required
                        value={newItem.title}
                        onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                        placeholder="Sunrise Vows..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : "Save to Gallery"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
