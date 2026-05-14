import { useState } from 'react';
import { FirebaseProvider, useAuth } from './components/FirebaseProvider.tsx';
import GroundCalendar from './components/GroundCalendar.tsx';
import ChallengeBoard from './components/ChallengeBoard.tsx';
import ScoreWall from './components/ScoreWall.tsx';
import BookingModal from './components/BookingModal.tsx';
import { motion } from 'motion/react';
import { Trophy, LogOut, ChevronRight, User } from 'lucide-react';

function AppContent() {
  const { user, profile, loading, signIn, logout } = useAuth();
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl w-full relative z-10 text-center"
        >
          <div className="inline-flex items-center gap-2 mb-8 bg-orange-50 text-orange-700 px-4 py-1.5 rounded-full text-xs font-bold ring-1 ring-orange-200">
            <Trophy className="w-3.5 h-3.5" />
            VILLAGE SPORTS HUB
          </div>
          
          <h1 className="text-6xl font-display font-extrabold tracking-tight text-slate-900 mb-6 lowercase">
            kreeda<span className="text-brand-orange">ankana</span>
          </h1>
          
          <p className="text-lg text-slate-500 font-medium mb-10 leading-relaxed max-w-md mx-auto">
            Organize village sports efficiently. Book slots, track scores, and challenge neighboring teams in a unified arena.
          </p>

          <button
            onClick={signIn}
            className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-lg mx-auto"
          >
            Get Started with Google
            <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-orange-500 p-1.5 rounded-lg">
              <Trophy className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-display font-bold tracking-tight">ANKANA</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-semibold text-slate-900">{profile?.displayName || 'Athlete'}</span>
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Verified Player</span>
            </div>
            {profile?.photoURL ? (
              <img src={profile.photoURL} alt="Profile" className="w-9 h-9 rounded-full ring-2 ring-slate-100 shadow-sm" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
                <User className="text-slate-400 w-4 h-4" />
              </div>
            )}
            <button
              onClick={logout}
              className="p-2 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-10">
        <div className="mb-10">
          <h2 className="text-sm font-bold text-orange-500 uppercase tracking-widest mb-1">Play More, Win More</h2>
          <h1 className="text-3xl font-display font-extrabold text-slate-900 capitalize">
            Hello, {profile?.displayName?.split(' ')[0] || 'Champ'}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <ScoreWall />
            <ChallengeBoard />
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="bg-slate-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 blur-3xl -mr-16 -mt-16" />
              <h3 className="text-xl font-display font-bold mb-3 relative z-10">Reserve a Selection</h3>
              <p className="text-slate-400 text-sm mb-6 relative z-10 leading-relaxed">Schedule your match and invite local teams to compete on the village ground.</p>
              <button
                onClick={() => setIsBookingOpen(true)}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-bold transition-all relative z-10"
              >
                Book Instant Slot
              </button>
            </div>
            
            <GroundCalendar />
          </div>
        </div>
      </main>

      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <FirebaseProvider>
      <AppContent />
    </FirebaseProvider>
  );
}
