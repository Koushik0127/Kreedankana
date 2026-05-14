import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, orderBy, limit, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase.ts';
import { MatchResult, OperationType } from '../types.ts';
import { handleFirestoreError } from '../lib/firestoreUtils.ts';
import { useAuth } from './FirebaseProvider.tsx';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, TrendingUp, Plus } from 'lucide-react';

export default function ScoreWall() {
  const { user } = useAuth();
  const [results, setResults] = useState<MatchResult[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newResult, setNewResult] = useState({ sport: 'Cricket', teamA: '', teamB: '', scoreA: 0, scoreB: 0 });

  useEffect(() => {
    const q = query(
      collection(db, 'results'),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setResults(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MatchResult)));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'results');
    });

    return () => unsubscribe();
  }, []);

  const handlePostScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await addDoc(collection(db, 'results'), {
        ...newResult,
        recordedBy: user.uid,
        date: new Date().toISOString().split('T')[0],
        createdAt: serverTimestamp(),
      });
      setShowForm(false);
      setNewResult({ sport: 'Cricket', teamA: '', teamB: '', scoreA: 0, scoreB: 0 });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'results');
    }
  };

  return (
    <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 font-mono text-[10px] text-slate-300 uppercase tracking-widest hidden sm:block">
        Live Scorebox v1.0
      </div>
      
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
            <Trophy className="text-emerald-600 w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-display font-extrabold text-slate-900 tracking-tight">Match Results</h2>
            <p className="text-xs font-medium text-slate-400">Latest scores from the field</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-slate-50 hover:bg-slate-100 p-2.5 rounded-xl text-slate-600 transition-colors border border-slate-200"
        >
          <Plus className={`w-5 h-5 transition-transform duration-300 ${showForm ? 'rotate-45' : ''}`} />
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-10"
          >
            <form onSubmit={handlePostScore} className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Team North</label>
                  <input required placeholder="E.g. Wolves" value={newResult.teamA} onChange={e => setNewResult({...newResult, teamA: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 text-sm font-semibold focus:ring-2 focus:ring-emerald-500/20 outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Team South</label>
                  <input required placeholder="E.g. Lions" value={newResult.teamB} onChange={e => setNewResult({...newResult, teamB: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 text-sm font-semibold focus:ring-2 focus:ring-emerald-500/20 outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Score North</label>
                  <input required type="number" value={newResult.scoreA} onChange={e => setNewResult({...newResult, scoreA: parseInt(e.target.value)})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 text-xl font-display font-bold" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Score South</label>
                  <input required type="number" value={newResult.scoreB} onChange={e => setNewResult({...newResult, scoreB: parseInt(e.target.value)})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 text-xl font-display font-bold" />
                </div>
              </div>
              <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl uppercase tracking-wider text-xs shadow-md transition-all">Submit Match Result</button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {results.map((res, i) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            key={res.id}
            className="group bg-slate-50 hover:bg-white border border-slate-100 hover:border-emerald-100 p-6 rounded-2xl transition-all duration-300"
          >
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-display font-bold text-lg text-slate-300 border border-slate-100">
                {res.sport[0]}
              </div>
              
              <div className="flex-1 flex items-center justify-between gap-4 w-full">
                <div className={`flex-1 text-right  ${res.scoreA > res.scoreB ? 'text-slate-900' : 'text-slate-400'}`}>
                  <p className="text-sm font-bold uppercase truncate">{res.teamA}</p>
                </div>
                
                <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
                  <span className={`text-2xl font-display font-black ${res.scoreA > res.scoreB ? 'text-emerald-600' : 'text-slate-400'}`}>{res.scoreA}</span>
                  <span className="text-slate-200 font-bold">:</span>
                  <span className={`text-2xl font-display font-black ${res.scoreB > res.scoreA ? 'text-emerald-600' : 'text-slate-400'}`}>{res.scoreB}</span>
                </div>

                <div className={`flex-1 text-left ${res.scoreB > res.scoreA ? 'text-slate-900' : 'text-slate-400'}`}>
                  <p className="text-sm font-bold uppercase truncate">{res.teamB}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-4 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> OFFICIAL</span>
                <span>•</span>
                <span>{res.sport} Match</span>
              </div>
              <span>{res.date}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
