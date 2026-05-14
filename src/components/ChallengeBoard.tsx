import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, orderBy, addDoc, serverTimestamp, doc, updateDoc, getDocs, where } from 'firebase/firestore';
import { db } from '../lib/firebase.ts';
import { Challenge, ChallengeResponse, OperationType, Booking } from '../types.ts';
import { handleFirestoreError } from '../lib/firestoreUtils.ts';
import { useAuth } from './FirebaseProvider.tsx';
import { motion, AnimatePresence } from 'motion/react';
import { Sword, MessageSquare, Send, CheckCircle2, Trophy, Plus, Calendar, Clock, AlertCircle } from 'lucide-react';

export default function ChallengeBoard() {
  const { user, profile } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [newChallenge, setNewChallenge] = useState({ 
    title: '', 
    description: '', 
    sport: 'Cricket',
    date: new Date().toISOString().split('T')[0],
    startTime: '16:00',
    endTime: '18:00',
    creatorTeam: ''
  });
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, 'challenges'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Challenge));
      setChallenges(data);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'challenges');
    });

    return () => unsubscribe();
  }, []);

  const handlePostChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile || isSubmitting) return;
    setError(null);
    setIsSubmitting(true);

    try {
      // 1. Check Availability
      const q = query(
        collection(db, 'bookings'),
        where('date', '==', newChallenge.date)
      );
      
      const snapshot = await getDocs(q);
      const existingBookings = snapshot.docs.map(doc => doc.data() as Booking);
      
      const hasOverlap = existingBookings.some(b => {
        return (newChallenge.startTime >= b.startTime && newChallenge.startTime < b.endTime) ||
               (newChallenge.endTime > b.startTime && newChallenge.endTime <= b.endTime) ||
               (b.startTime >= newChallenge.startTime && b.startTime < newChallenge.endTime);
      });

      if (hasOverlap) {
        setError("Ground is already booked for this slot. Please choose another time.");
        setIsSubmitting(false);
        return;
      }

      // 2. Create Challenge
      await addDoc(collection(db, 'challenges'), {
        creatorId: user.uid,
        creatorName: profile.displayName || 'Anonymous',
        creatorTeam: newChallenge.creatorTeam || 'Village Team',
        title: newChallenge.title,
        description: newChallenge.description,
        sport: newChallenge.sport,
        date: newChallenge.date,
        startTime: newChallenge.startTime,
        endTime: newChallenge.endTime,
        status: 'open',
        createdAt: serverTimestamp(),
      });

      // 3. Create Booking automatically
      await addDoc(collection(db, 'bookings'), {
        userId: user.uid,
        teamName: newChallenge.creatorTeam || 'Village Team',
        date: newChallenge.date,
        startTime: newChallenge.startTime,
        endTime: newChallenge.endTime,
        sport: newChallenge.sport,
        createdAt: serverTimestamp(),
      });

      setNewChallenge({ 
        title: '', 
        description: '', 
        sport: 'Cricket',
        date: new Date().toISOString().split('T')[0],
        startTime: '16:00',
        endTime: '18:00',
        creatorTeam: ''
      });
      setShowForm(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'challenges');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-50 p-2.5 rounded-xl border border-blue-100">
            <MessageSquare className="text-blue-600 w-5 h-5" />
          </div>
          <h2 className="text-xl font-display font-extrabold text-slate-900 tracking-tight">Open Challenges</h2>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Challenge
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handlePostChallenge} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 mb-6">
              {error && (
                <div className="bg-rose-50 text-rose-600 p-3 rounded-lg text-xs font-bold flex items-center gap-2 border border-rose-100">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}
              
              <input required placeholder="Challenge Title (e.g. Sunday Morning T20)" value={newChallenge.title} onChange={e => setNewChallenge({...newChallenge, title: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-blue-500/20 outline-none" />
              <textarea required placeholder="Description - specify time, place and level..." value={newChallenge.description} onChange={e => setNewChallenge({...newChallenge, description: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 outline-none min-h-[100px]" />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input required placeholder="Your Team Name" value={newChallenge.creatorTeam} onChange={e => setNewChallenge({...newChallenge, creatorTeam: e.target.value})} className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-blue-500/20 outline-none" />
                <select value={newChallenge.sport} onChange={e => setNewChallenge({...newChallenge, sport: e.target.value})} className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-blue-500/20 outline-none">
                  <option>Cricket</option>
                  <option>Volleyball</option>
                  <option>Football</option>
                  <option>Kabaddi</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Match Date</label>
                  <input type="date" required value={newChallenge.date} onChange={e => setNewChallenge({...newChallenge, date: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold h-[46px]" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Start Time</label>
                  <input type="time" required value={newChallenge.startTime} onChange={e => setNewChallenge({...newChallenge, startTime: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold h-[46px]" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">End Time</label>
                  <input type="time" required value={newChallenge.endTime} onChange={e => setNewChallenge({...newChallenge, endTime: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold h-[46px]" />
                </div>
              </div>

              <button 
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl uppercase tracking-wider text-xs shadow-md transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Verifying & Posting...' : 'Post Challenge & Reserve Slot'}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {challenges.map((c) => (
          <ChallengeCard key={c.id} challenge={c} />
        ))}
      </div>
    </div>
  );
}

interface ChallengeCardProps {
  challenge: Challenge;
  key?: string;
}

function ChallengeCard({ challenge }: ChallengeCardProps) {
  const { user, profile } = useAuth();
  const [responses, setResponses] = useState<ChallengeResponse[]>([]);
  const [showReply, setShowReply] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');

  useEffect(() => {
    if (!challenge.id) return;
    const q = query(
      collection(db, `challenges/${challenge.id}/responses`),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      setResponses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChallengeResponse)));
    });
  }, [challenge.id]);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile || !replyMessage.trim()) return;
    
    try {
      await addDoc(collection(db, `challenges/${challenge.id}/responses`), {
        userId: user.uid,
        userName: profile.displayName || 'Sportsman',
        message: replyMessage,
        createdAt: serverTimestamp()
      });
      setReplyMessage('');
      setShowReply(false);
    } catch (error) {
      console.error(error);
    }
  };

  const markAccepted = async () => {
    if (!challenge.id) return;
    try {
      await updateDoc(doc(db, 'challenges', challenge.id), {
        status: 'accepted',
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <motion.div
      layout
      className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group relative overflow-hidden"
    >
      <div className="flex justify-between items-start mb-4">
        <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${
          challenge.status === 'open' 
            ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
            : 'bg-blue-50 text-blue-700 border-blue-100'
        }`}>
          {challenge.status}
        </span>
        <span className="text-[10px] font-medium text-slate-400">
          {new Date(challenge.createdAt?.seconds * 1000).toLocaleDateString()}
        </span>
      </div>

      <h3 className="text-xl font-display font-extrabold text-slate-900 mb-2 tracking-tight group-hover:text-blue-600 transition-colors">
        {challenge.title}
      </h3>
      
      <div className="flex items-center gap-4 mb-4">
        <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded uppercase tracking-wider">{challenge.sport}</span>
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-orange-500 uppercase tracking-widest">
          <Calendar className="w-3 h-3" />
          {challenge.date}
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <Clock className="w-3 h-3" />
          {challenge.startTime}-{challenge.endTime}
        </div>
        <div className="h-px flex-1 bg-slate-50" />
      </div>

      <p className="text-slate-500 text-sm mb-6 leading-relaxed flex-1 italic line-clamp-2">
        "{challenge.description}"
      </p>

      <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
        <div>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Posted By</p>
          <p className="text-xs font-bold text-slate-700">
            {challenge.creatorName} <span className="text-blue-500">@{challenge.creatorTeam}</span>
          </p>
        </div>
        
        <div className="flex gap-2">
          {challenge.creatorId === user?.uid ? (
            <button
              onClick={markAccepted}
              disabled={challenge.status !== 'open'}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs font-bold disabled:opacity-30 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Accept
            </button>
          ) : (
            <button
              onClick={() => setShowReply(!showReply)}
              className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Reply
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showReply && (
          <motion.form
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onSubmit={handleReply}
            className="mt-4 pt-4 border-t border-slate-50 overflow-hidden"
          >
            <div className="flex gap-2">
              <input
                required
                value={replyMessage}
                onChange={e => setReplyMessage(e.target.value)}
                placeholder="Game on? Fix time..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:ring-2 focus:ring-blue-500/10 outline-none"
              />
              <button className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 transition-colors">
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {responses.length > 0 && (
        <div className="mt-6 space-y-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            Responses <span className="flex-1 h-px bg-slate-50" />
          </p>
          {responses.slice(0, 2).map((res) => (
            <div key={res.id} className="bg-slate-50 p-3 rounded-xl border border-white">
              <p className="text-[10px] font-bold text-slate-700 leading-tight">
                <span className="text-blue-500">{res.userName}:</span> {res.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
