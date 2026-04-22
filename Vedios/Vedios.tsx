import React, { useState, useEffect } from 'react';
import { Youtube, ExternalLink, Play, Film, X, Plus, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { getVideos, addVideo, subscribeToAuth, getUserProfile } from '../lib/firebase';
import { User } from 'firebase/auth';

export default function Videos() {
  const [selectedVideo, setSelectedVideo] = useState<any | null>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newVideo, setNewVideo] = useState({
    title: '',
    desc: '',
    id: '',
    platform: 'youtube' as 'youtube' | 'instagram',
    views: 'New',
    thumbnail: '',
    link: ''
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

    fetchVideos();
    return () => unsub();
  }, []);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const dbVideos = await getVideos();
      if (dbVideos.length > 0) {
        setVideos(dbVideos);
      } else {
        useFallback();
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
      useFallback();
    } finally {
      setLoading(false);
    }
  };

  const useFallback = () => {
    setVideos([
      {
        id: "DG7rHyzSkKF",
        platform: "instagram",
        title: "Wedding Perfection: A Royal Entry",
        desc: "Capturing the grand entrance and the silent emotions of the bridal journey.",
        views: "200k+",
        thumbnail: "https://picsum.photos/seed/insta1/800/450",
        link: "https://www.instagram.com/reel/DG7rHyzSkKF/"
      },
      {
        id: "videoseries?list=PL_Xue_nzh-onO-eD_yB_vYt-J8Q",
        platform: "youtube",
        title: "The Emotional Vidaai Ceremony",
        desc: "A poignant look at the traditional farewell rituals and raw family emotions.",
        views: "150k+",
        thumbnail: "https://picsum.photos/seed/vidvidaai/800/450",
        link: "https://www.youtube.com/@TECHSuneel"
      }
    ]);
  };

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Auto-generate thumbnail if link is provided but thumbnail is empty
      let finalThumbnail = newVideo.thumbnail || `https://picsum.photos/seed/${newVideo.id}/800/450`;
      
      await addVideo({
        ...newVideo,
        thumbnail: finalThumbnail,
        link: newVideo.link || (newVideo.platform === 'youtube' ? `https://youtube.com/watch?v=${newVideo.id}` : `https://instagram.com/reel/${newVideo.id}/`)
      });
      
      setShowAddForm(false);
      setNewVideo({
        title: '',
        desc: '',
        id: '',
        platform: 'youtube',
        views: 'New',
        thumbnail: '',
        link: ''
      });
      fetchVideos();
    } catch (error) {
      alert("Failed to add video. Check permissions.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getEmbedUrl = (video: any) => {
    if (video.platform === 'youtube') {
      const isPlaylist = video.id.includes('videoseries');
      return `https://www.youtube.com/embed/${video.id}${isPlaylist ? '&' : '?'}autoplay=1&rel=0&modestbranding=1`;
    }
    return `https://www.instagram.com/p/${video.id}/embed`;
  };

  return (
    <main className="pt-24 min-h-screen pb-24 font-body bg-slate-50">
      {/* Header */}
      <section className="max-w-screen-2xl mx-auto px-6 mb-16 pt-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-widest mb-6 px-4 py-2 bg-red-50 rounded-full">
            <Youtube className="w-5 h-5" />
            Stream Professional Cinematography
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-8">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-on-surface leading-tight">
              Cinematic <span className="text-primary italic">Visions.</span>
            </h1>
            {isAdmin && (
              <button 
                onClick={() => setShowAddForm(true)}
                className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-xl"
              >
                <Plus className="w-5 h-5" /> Add New Film
              </button>
            )}
          </div>
          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            Explore our curated collection of wedding films and pre-wedding highlights. Each story is told through the lens of pure emotion and artistry.
          </p>
        </motion.div>
      </section>

      {/* Featured Player Placeholder or Main Video */}
      <section className="max-w-screen-2xl mx-auto px-6 mb-24">
        <div className="sleek-card overflow-hidden bg-black aspect-video relative group border-none shadow-2xl rounded-3xl">
          <iframe 
            className="w-full h-full"
            src="https://www.youtube.com/embed/videoseries?list=UU7-G9h_rZ-eD_yB_vYt-J8Q" 
            title="RDXTECH SUNEEL GELLERY Films" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowFullScreen
          ></iframe>
        </div>
      </section>

      {/* Dynamic Video Content Grid */}
      <section className="max-w-screen-2xl mx-auto px-6 mb-24">
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-2">
            <Film className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-extrabold text-on-surface">Digital Portfolio</h2>
          </div>
          <div className="text-xs font-bold text-on-surface-variant uppercase tracking-widest border-b border-divider pb-1">
            {videos.length} Masterpieces
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video, idx) => (
              <motion.div 
                key={video.id || idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
                className="sleek-card group overflow-hidden bg-white cursor-pointer rounded-3xl border border-border/50"
                onClick={() => setSelectedVideo(video)}
              >
                <div className="aspect-video bg-slate-900 relative">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title} 
                    className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-center">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center group-hover:bg-primary transition-all group-hover:scale-110 border border-white/30">
                      <Play className="w-6 h-6 text-white fill-white" />
                    </div>
                  </div>
                  <div className="absolute top-4 left-4 flex gap-2">
                     {video.platform === 'instagram' ? (
                       <div className="bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 p-2 rounded-xl text-white shadow-lg">
                         <ExternalLink className="w-3 h-3" />
                       </div>
                     ) : (
                       <div className="bg-red-600 p-2 rounded-xl text-white shadow-lg">
                         <Youtube className="w-3 h-3" />
                       </div>
                     )}
                  </div>
                  <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-white text-[10px] font-bold uppercase tracking-widest">
                    {video.platform.toUpperCase()} FEATURE
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-black mb-2 group-hover:text-primary transition-colors line-clamp-1">{video.title}</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed mb-6 line-clamp-2 h-10">{video.desc}</p>
                  <div className="pt-4 border-t border-divider flex justify-between items-center">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedVideo(video);
                      }}
                      className="text-xs font-black text-primary uppercase tracking-[0.1em] hover:underline flex items-center gap-2"
                    >
                      Stream Concept →
                    </button>
                    <div className="text-[10px] text-on-surface-variant font-mono font-bold bg-slate-100 px-2 py-1 rounded">
                      {video.views}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Add Video Modal */}
      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-[2rem] w-full max-w-xl overflow-hidden shadow-2xl border border-white/20"
            >
              <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-black italic">Upload <span className="text-primary">Featured Film</span></h3>
                  <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">Add to your digital portfolio</p>
                </div>
                <button onClick={() => setShowAddForm(false)} className="p-3 hover:bg-white/10 rounded-full transition-all">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleAddVideo} className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Platform</label>
                      <select 
                        value={newVideo.platform}
                        onChange={(e) => setNewVideo({...newVideo, platform: e.target.value as any})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all"
                      >
                        <option value="youtube">YouTube</option>
                        <option value="instagram">Instagram</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Video ID / Reel Code</label>
                      <input 
                        required
                        value={newVideo.id}
                        onChange={(e) => setNewVideo({...newVideo, id: e.target.value})}
                        placeholder="e.g. DG7rHyzSkKF"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Film Title</label>
                    <input 
                      required
                      value={newVideo.title}
                      onChange={(e) => setNewVideo({...newVideo, title: e.target.value})}
                      placeholder="Royal Heritage Wedding..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Narrative Description</label>
                    <textarea 
                      rows={3}
                      value={newVideo.desc}
                      onChange={(e) => setNewVideo({...newVideo, desc: e.target.value})}
                      placeholder="Describe the mood and location..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all resize-none"
                    />
                  </div>
                </div>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : "Publish to Gallery"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Video Modal Player */}
      <AnimatePresence>
        {selectedVideo && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVideo(null)}
              className="absolute inset-0 bg-slate-900/95 backdrop-blur-2xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="bg-black w-full max-w-6xl aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10 border border-white/5"
            >
              <button 
                onClick={() => setSelectedVideo(null)}
                className="absolute top-8 right-8 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white z-20 transition-all backdrop-blur-md"
              >
                <X className="w-6 h-6" />
              </button>
              
              <iframe 
                className="w-full h-full"
                src={getEmbedUrl(selectedVideo)} 
                title={selectedVideo.title} 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
              ></iframe>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Call to Action Footer */}
      <section className="max-w-screen-2xl mx-auto px-6 mt-12">
        <div className="bg-slate-900 rounded-[3rem] p-12 md:p-32 text-white text-center relative overflow-hidden group">
          <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]"></div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight italic">Capture the <span className="text-primary italic">Soul.</span></h2>
            <p className="text-slate-400 text-lg mb-12 font-medium">Ready to tell your story? Our high-end cinematic packages are now available for bookings worldwide.</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
               <a href="tel:7351608249" className="bg-primary text-white px-12 py-5 rounded-[2rem] font-black shadow-2xl hover:scale-105 transition-all text-sm uppercase tracking-widest">
                 Live Inquiry: 7351608249
                 Live Inquiry: 9027599535
               </a>
               <Link to="/contact" className="bg-white/5 backdrop-blur-xl border border-white/20 px-12 py-5 rounded-[2rem] font-black hover:bg-white/10 transition-all text-sm uppercase tracking-widest">
                 Submit Project Brief
               </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
