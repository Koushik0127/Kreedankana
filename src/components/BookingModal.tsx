import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase.ts';
import { OperationType, Booking } from '../types.ts';
import { handleFirestoreError } from '../lib/firestoreUtils.ts';
import { useAuth } from './FirebaseProvider.tsx';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trophy, Clock, Calendar, AlertCircle } from 'lucide-react';

export default function BookingModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    teamName: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '16:00',
    endTime: '18:00',
    sport: 'Cricket'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setError(null);

    try {
      // Collision detection check
      const q = query(
        collection(db, 'bookings'),
        where('date', '==', formData.date)
      );
      const snapshot = await getDocs(q);
      const existingBookings = snapshot.docs.map(doc => doc.data() as Booking);

      const hasCollision = existingBookings.some(b => {
        return (formData.startTime >= b.startTime && formData.startTime < b.endTime) ||
               (formData.endTime > b.startTime && formData.endTime <= b.endTime) ||
               (b.startTime >= formData.startTime && b.startTime < formData.endTime);
      });

      if (hasCollision) {
        setError('Ground is already occupied for this time slot. Please pick another.');
        return;
      }

      await addDoc(collection(db, 'bookings'), {
        ...formData,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });
      onClose();
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'bookings');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            className="relative bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-200"
          >
            <div className="bg-slate-900 p-8 text-white relative">
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="bg-orange-500 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-display font-extrabold tracking-tight">Reserve Ground Slot</h2>
              <p className="text-slate-400 text-sm font-medium mt-1">Book your team's time in the arena.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-rose-50 p-4 rounded-xl flex gap-3 items-center text-rose-700 border border-rose-100"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <p className="text-xs font-bold leading-tight">{error}</p>
                </motion.div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Team Name</label>
                <input
                  required
                  value={formData.teamName}
                  onChange={e => setFormData({...formData, teamName: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-orange-500/20 transition-all outline-none"
                  placeholder="E.g. Village Titans"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={e => setFormData({...formData, date: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm font-bold text-slate-700 outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Sport</label>
                  <select
                    value={formData.sport}
                    onChange={e => setFormData({...formData, sport: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none appearance-none"
                  >
                    <option>Cricket</option>
                    <option>Volleyball</option>
                    <option>Football</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Start Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="time"
                      required
                      value={formData.startTime}
                      onChange={e => setFormData({...formData, startTime: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm font-bold text-slate-700 outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">End Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="time"
                      required
                      value={formData.endTime}
                      onChange={e => setFormData({...formData, endTime: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm font-bold text-slate-700 outline-none"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl uppercase tracking-wider text-xs shadow-md transition-all active:scale-[0.98]"
              >
                Confirm Booking
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
