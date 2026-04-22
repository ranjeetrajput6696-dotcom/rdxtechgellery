import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Video, Sparkles, Loader2, Play, Download, AlertTriangle, Key } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

export default function PromotionalVideoGenerator() {
  const [prompt, setPrompt] = useState('A cinematic montage of a royal Indian wedding, showcasing vibrant colors, emotional candid moments, and slow-motion transitions of the bride and groom.');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    checkKey();
  }, []);

  const checkKey = async () => {
    if (window.aistudio) {
      const selected = await window.aistudio.hasSelectedApiKey();
      setHasKey(selected);
    }
  };

  const handleSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setHasKey(true);
    }
  };

  const generateVideo = async () => {
    if (!hasKey) {
      handleSelectKey();
      return;
    }

    setIsGenerating(true);
    setError(null);
    setVideoUrl(null);
    setProgress(0);

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("Gemini API key not found. Please ensure it is set in the environment.");
      }

      const ai = new GoogleGenAI({ apiKey });
      
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-lite-generate-preview',
        prompt,
        config: {
          numberOfVideos: 1,
          resolution: '1080p',
          aspectRatio: '16:9'
        }
      });

      // Poll for completion
      let interval = setInterval(() => {
        setProgress(prev => Math.min(prev + 1, 95));
      }, 2000);

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      clearInterval(interval);
      setProgress(100);

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (!downloadLink) throw new Error("Video generation failed - no download link.");

      // Fetch the video with the API key header
      const fetchResponse = await fetch(downloadLink, {
        method: 'GET',
        headers: {
          'x-goog-api-key': apiKey,
        },
      });

      if (!fetchResponse.ok) {
        if (fetchResponse.status === 404) {
          setError("Requested entity was not found. Please try re-selecting your API key.");
          setHasKey(false);
          return;
        }
        throw new Error("Failed to fetch generated video.");
      }

      const blob = await fetchResponse.blob();
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);

    } catch (err: any) {
      console.error("Video Generation Error:", err);
      setError(err.message || "An unexpected error occurred during generation.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Video className="w-48 h-48" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 text-primary font-bold text-xs uppercase tracking-[0.2em] mb-4">
            <Sparkles className="w-5 h-5" />
            AI Marketing Studio
          </div>
          <h2 className="text-3xl font-black mb-4">Promotional Video Generator</h2>
          <p className="text-slate-400 text-sm max-w-xl leading-relaxed mb-8">
            Create high-end cinematic promotional clips using Google's Veo technology. Define your vision, and let the AI bring your photography packages to life.
          </p>

          {!hasKey ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
              <Key className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">API Key Required</h3>
              <p className="text-sm text-slate-400 mb-6">You must select a paid Google Cloud project API key to use Veo Video Generation.</p>
              <button 
                onClick={handleSelectKey}
                className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-600 transition-all flex items-center gap-2 mx-auto"
              >
                Select API Key
              </button>
              <p className="mt-4 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                See <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="underline">Billing Docs</a> for details
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Video Concept & Prompt</label>
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-sm text-white focus:outline-none focus:border-primary focus:bg-white/10 transition-all resize-none min-h-[120px]"
                  placeholder="Describe your promotional video..."
                  disabled={isGenerating}
                />
              </div>

              <div className="flex flex-wrap gap-3">
                {[
                  "Cinematic Indian Wedding Montage",
                  "Romantic Pre-Wedding Session in Nature",
                  "Luxury Wedding Photography Package Promo",
                  "Candid Smiles & Royal Rituals Highlights"
                ].map((tag) => (
                  <button 
                    key={tag}
                    onClick={() => setPrompt(tag)}
                    disabled={isGenerating}
                    className="text-[10px] font-bold bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-4 py-2 transition-all"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <div className="pt-4">
                <button 
                  onClick={generateVideo}
                  disabled={isGenerating}
                  className="w-full md:w-auto bg-primary text-white px-12 py-4 rounded-xl font-black shadow-2xl hover:bg-blue-600 transition-all disabled:opacity-50 flex items-center justify-center gap-3 text-sm uppercase tracking-[0.1em]"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating Masterpiece... {progress}%
                    </>
                  ) : (
                    <>
                      <Video className="w-5 h-5" />
                      Generate Promotional Video
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isGenerating && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="sleek-card p-12 bg-white flex flex-col items-center text-center"
          >
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6 animate-pulse">
              <Video className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold mb-2">Creating Your Vision</h3>
            <p className="text-sm text-on-surface-variant max-w-md mx-auto mb-8 leading-relaxed">
              Google's Veo is processing your prompt. Video generation typically takes 1-2 minutes. We'll show you the result as soon as it's ready.
            </p>
            <div className="w-full max-w-md h-2 bg-slate-100 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1 }}
              />
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl pt-8 border-t border-divider">
              <div className="text-center">
                <div className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1 text-primary">Status</div>
                <div className="text-xs font-bold">Model Polling</div>
              </div>
              <div className="text-center">
                <div className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1 text-primary">Resolution</div>
                <div className="text-xs font-bold">1080p HD</div>
              </div>
              <div className="text-center">
                <div className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1 text-primary">Model</div>
                <div className="text-xs font-bold">Veo 3.1 Lite</div>
              </div>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-4 text-red-600"
          >
            <AlertTriangle className="w-6 h-6 shrink-0" />
            <div className="space-y-1">
              <h4 className="font-bold text-sm">Generation Error</h4>
              <p className="text-xs leading-relaxed opacity-80">{error}</p>
            </div>
          </motion.div>
        )}

        {videoUrl && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="sleek-card p-1 bg-slate-900 border-none overflow-hidden"
          >
            <div className="relative group aspect-video">
              <video 
                src={videoUrl} 
                controls 
                className="w-full h-full object-contain"
                poster="https://picsum.photos/seed/promo/1920/1080"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-primary/90 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest backdrop-blur-md border border-white/20">AI Generated</span>
                <span className="bg-slate-900/90 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest backdrop-blur-md border border-white/20">Veo 3.1</span>
              </div>
            </div>
            <div className="p-8 bg-white border-t border-divider flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <h3 className="text-xl font-bold mb-1">Your Promotional Video is Ready</h3>
                <p className="text-xs text-on-surface-variant font-medium">Resolution: 1080p • Aspect Ratio: 16:9 • Style: Cinematic</p>
              </div>
              <div className="flex gap-4">
                <a 
                  href={videoUrl} 
                  download="rdxtech-promo.mp4"
                  className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all text-sm shadow-xl"
                >
                  <Download className="w-5 h-5" />
                  Download Promo
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
        <div className="sleek-card p-8 bg-slate-50/50">
          <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-border flex items-center justify-center text-primary mb-6">
            <Play className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-on-surface mb-2">Social Sharing</h4>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Download your AI-generated videos and share them directly on Instagram Reels or YouTube Shorts to increase your booking engagement.
          </p>
        </div>
        <div className="sleek-card p-8 bg-slate-50/50">
          <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-border flex items-center justify-center text-primary mb-6">
            <Sparkles className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-on-surface mb-2">Dynamic Prompts</h4>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Use descriptive words like "cinematic," "golden hour," "raw emotions," and "high contrast" to get the best results from the Veo model.
          </p>
        </div>
      </div>
    </div>
  );
}
