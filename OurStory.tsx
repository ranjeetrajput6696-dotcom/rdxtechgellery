import { motion } from 'motion/react';
import { Camera, Heart, Star, Award } from 'lucide-react';

export default function OurStory() {
  const milestones = [
    {
      year: "2015",
      title: "The First Click",
      desc: "Founded by Engineer Suneel Kumar with a vision to revolutionize wedding photography with artistic flair."
    },
    {
      year: "2018",
      title: "Tech Integration",
      desc: "RDKTECH was born, bringing advanced post-processing and client dashboards to our workflow."
    },
    {
      year: "2024",
      title: "1000+ Weddings",
      desc: "Celebrating a decade of capturing love stories across the country."
    }
  ];

  return (
    <main className="pt-24 min-h-screen pb-24 font-body">
      {/* Header */}
      <section className="max-w-screen-2xl mx-auto px-6 mb-24 pt-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-12">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-6">
              <span className="w-6 h-px bg-primary"></span>
              Our Philosophy
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-on-surface leading-tight">
              Capturing the <br/>
              <span className="text-texture italic">Essence of Emotion.</span>
            </h1>
          </div>
          <div className="max-w-xs text-on-surface-variant text-sm leading-relaxed pb-2">
            RDXTECH SUNEEL GELLERY isn't just about cameras; it's about the connection between two souls.
          </div>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="bg-white border-y border-border py-24 mb-24">
        <div className="max-w-screen-2xl mx-auto px-6">
          <div className="sleek-card overflow-hidden grid grid-cols-1 lg:grid-cols-2 bg-slate-900 border-none">
            <img 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover min-h-[400px]" 
              src="https://picsum.photos/seed/story_photo/1000/1000" 
              alt="Photography in action"
            />
            <div className="p-12 md:p-24 flex flex-col justify-center text-white">
              <div className="flex gap-2 mb-8">
                <span className="tech-tag bg-white/10 text-white text-[10px] px-2 py-1 rounded font-mono">ARTISTRY</span>
                <span className="tech-tag bg-white/10 text-white text-[10px] px-2 py-1 rounded font-mono">PRECISION</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-8">A Decade of Vision.</h2>
              <p className="text-slate-400 leading-relaxed mb-8">
                Every wedding is a unique masterpiece. Our team of expert cameramen are trained to blend into your celebration while capturing every candid smile and royal ritual with absolute precision.
              </p>
              <div className="p-6 bg-white/5 border border-white/10 rounded-lg italic text-slate-300 text-sm">
                "Photography is the only language that can be understood anywhere in the world, and wedding photography is where it speaks the loudest."
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Milestones Grid */}
      <section className="max-w-screen-2xl mx-auto px-6 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {milestones.map((m) => (
            <div key={m.year} className="sleek-card p-10 border-primary/10">
              <span className="text-4xl font-black text-primary/10 mb-6 block font-mono">{m.year}</span>
              <h3 className="text-xl font-bold text-on-surface mb-3">{m.title}</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="max-w-screen-2xl mx-auto px-6">
        <div className="mb-12 flex justify-between items-end">
          <h2 className="text-3xl font-bold text-on-surface tracking-tight uppercase">THE MASTERMINDS</h2>
          <span className="text-xs font-mono text-on-surface-variant">EXPERTISE :: ELITE</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { 
              name: "Engineer Suneel Kumar", 
              role: "Founder & Lead", 
              icon: <Award />,
              bio: "Visionary leader with 10+ years of experience in creative portraiture and cinematic storytelling."
            },
            { 
              name: "Arjun Singh", 
              role: "Candid Specialist", 
              icon: <Camera />,
              bio: "Expert at capturing unscripted moments and raw emotions that tell the true story of your day."
            },
            { 
              name: "ENGINEER Ranjeet Kumar", 
              role: "Technical Support Team Head", 
              icon: <Heart />,
              bio: "Drives our post-processing excellence and ensures seamless digital delivery to all clients."
            }
          ].map((person, i) => (
            <div key={person.name} className="sleek-card p-8 flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-full bg-slate-100 border border-border overflow-hidden mb-6 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                {person.icon}
              </div>
              <h4 className="text-sm font-bold text-on-surface">{person.name}</h4>
              <p className="text-[11px] font-bold text-primary uppercase tracking-widest mt-1 mb-4">{person.role}</p>
              <p className="text-xs text-on-surface-variant leading-relaxed">{person.bio}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
