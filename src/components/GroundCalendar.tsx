import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase.ts';
import { Booking, OperationType } from '../types.ts';
import { handleFirestoreError } from '../lib/firestoreUtils.ts';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar as CalendarIcon, Clock, Users, Trophy } from 'lucide-react';

export default function GroundCalendar() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const q = query(
      collection(db, 'bookings'),
      where('date', '==', selectedDate),
      orderBy('startTime', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
      setBookings(data);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'bookings');
    });

    return () => unsubscribe();
  }, [selectedDate]);

  const timeSlots = Array.from({ length: 15 }, (_, i) => {
    const hour = i + 6; // 6 AM to 8 PM
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  return (
    <div className="bg-white rounded-2xl p-7 border border-slate-100 shadow-sm relative overflow-hidden">
      <div className="flex flex-col mb-8">
        <div className="flex items-center gap-2 mb-1.5">
          <CalendarIcon className="text-orange-500 w-4 h-4" />
          <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ground Logistics</h2>
        </div>
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-xl font-display font-bold text-slate-900">Arena Timings</h3>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-[10px] font-bold text-slate-600 uppercase transition-all shadow-sm focus:ring-2 focus:ring-orange-500/10 outline-none cursor-pointer"
          />
        </div>
      </div>

      <div className="space-y-4 relative">
        <div className="absolute left-[3.25rem] top-0 bottom-0 w-px bg-slate-50" />
        
        {timeSlots.map((time) => {
          const booking = bookings.find(b => b.startTime <= time && b.endTime > time);
          
          return (
            <div key={time} className="flex gap-4 group items-center">
              <span className="text-[10px] font-mono font-bold text-slate-300 w-10 text-right py-1 group-hover:text-slate-600 transition-colors tabular-nums">
                {time}
              </span>
              
              <div className="flex-1">
                <AnimatePresence mode="wait">
                  {booking ? (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className={`relative overflow-hidden rounded-xl p-3 border ${
                        booking.sport === 'Cricket' ? 'bg-emerald-50 border-emerald-100 text-emerald-900' :
                        booking.sport === 'Volleyball' ? 'bg-orange-50 border-orange-100 text-orange-900' :
                        'bg-blue-50 border-blue-100 text-blue-900'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="min-w-0">
                          <p className={`text-[8px] font-bold uppercase tracking-wider mb-0.5 opacity-60`}>
                            {booking.sport}
                          </p>
                          <h3 className="text-xs font-bold truncate max-w-[120px]">{booking.teamName}</h3>
                        </div>
                        <div className="text-[9px] font-bold bg-white/50 px-2 py-1 rounded">
                          {booking.startTime}-{booking.endTime}
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="h-10 border border-dashed border-slate-100 rounded-xl flex items-center px-4 group-hover:bg-slate-50 transition-colors">
                      <span className="text-[9px] font-medium text-slate-200 group-hover:text-slate-300">Available</span>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
