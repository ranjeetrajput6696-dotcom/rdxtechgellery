import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, Calendar, Clock, User as UserIcon, Camera, CheckCircle, XCircle } from 'lucide-react';
import { 
  subscribeToAuth, 
  getUserProfile, 
  getUserBookings, 
  getAllBookings, 
  updateBookingStatus,
  BookingData,
  createBooking,
  signInWithGoogle,
  addGalleryItem,
  getGalleryItems,
  db
} from '../lib/firebase';
import { User } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import PaymentModal from '../components/PaymentModal';
import PromotionalVideoGenerator from '../components/PromotionalVideoGenerator';

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'bookings' | 'marketing' | 'gallery'>('bookings');
  const [selectedBookingForPayment, setSelectedBookingForPayment] = useState<any | null>(null);
  const [newBooking, setNewBooking] = useState({
    scheduleDate: '',
    shootType: 'Wedding',
    phoneNumber: '',
    notes: ''
  });

  useEffect(() => {
    const unsub = subscribeToAuth(async (u) => {
      setUser(u);
      if (u) {
        // Immediate check for admin by email to avoid flicker/permission race
        const isAdminByEmail = u.email === 'ranjeetrajput6696@gmail.com';
        
        try {
          const p = await getUserProfile(u.uid);
          setProfile(p);
          const effectiveRole = p?.role || (isAdminByEmail ? 'admin' : 'user');
          fetchBookings(u.uid, effectiveRole);
        } catch (err) {
          console.error("Profile fetch failed:", err);
          // Fallback to email-based role check if Firestore call fails (e.g. permission rules still syncing)
          fetchBookings(u.uid, isAdminByEmail ? 'admin' : 'user');
        }
      } else {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  const fetchBookings = async (uid: string, role: string) => {
    setLoading(true);
    try {
      if (role === 'admin') {
        const b = await getAllBookings();
        setBookings(b);
      } else {
        const b = await getUserBookings(uid);
        setBookings(b);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await createBooking({
        userId: user.uid,
        userName: user.displayName || 'Guest',
        userEmail: user.email || '',
        ...newBooking
      });
      setShowBookingForm(false);
      fetchBookings(user.uid, profile?.role);
    } catch (error) {
      alert("Failed to post booking. Please try again.");
    }
  };

  const handleStatusUpdate = async (bookingId: string, status: string) => {
    const cameraman = status === 'Confirmed' ? prompt("Enter assigned cameraman name:") : undefined;
    if (status === 'Confirmed' && !cameraman) return;

    try {
      await updateBookingStatus(bookingId, status, cameraman || undefined);
      if (user) fetchBookings(user.uid, profile?.role);
    } catch (error) {
      alert("Failed to update status.");
    }
  };

  const handleSetTotalAmount = async (bookingId: string) => {
    const amount = prompt("Enter total project amount in INR:");
    if (!amount || isNaN(Number(amount))) return;

    try {
      await updateDoc(doc(db, 'bookings', bookingId), {
        totalAmount: Number(amount),
        paymentStatus: 'Unpaid'
      });
      if (user) fetchBookings(user.uid, profile?.role);
    } catch (error) {
      alert("Failed to update total amount.");
    }
  };

  if (!user) {
    return (
      <div className="pt-32 flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-6">
          <UserIcon className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold mb-4 text-on-surface">Private Dashboard</h2>
        <p className="text-on-surface-variant max-w-md mb-8">Access your bookings, track payments, and explore our AI Marketing Studio by signing in with your Google account.</p>
        <button 
          onClick={() => signInWithGoogle()}
          className="bg-primary text-white px-10 py-4 rounded-xl font-bold shadow-lg hover:bg-blue-600 transition-all flex items-center gap-3"
        >
          Sign In with Google
        </button>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-slate-50 pb-12">
      <div className="max-w-screen-2xl mx-auto px-6">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 pt-12">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-on-surface">
              {profile?.role === 'admin' ? 'Administrative Control' : 'My Bookings'}
            </h1>
            <p className="text-on-surface-variant">
              {profile?.role === 'admin' ? 'Manage all photography schedules and cameramen.' : 'Track your wedding and pre-wedding shoots.'}
            </p>
          </div>
          {profile?.role !== 'admin' && (
            <button 
              onClick={() => setShowBookingForm(true)}
              className="bg-primary text-white px-6 py-3 rounded-lg font-bold shadow-lg hover:bg-blue-600 transition-all flex items-center gap-2"
            >
              <Camera className="w-5 h-5" />
              New Booking Request
            </button>
          )}
        </header>

        {profile?.role === 'admin' && (
          <div className="flex gap-4 mb-8">
            <button 
              onClick={() => setActiveTab('bookings')}
              className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest border transition-all ${
                activeTab === 'bookings' 
                ? 'bg-slate-900 text-white border-slate-900' 
                : 'bg-white text-on-surface-variant border-divider hover:bg-slate-50'
              }`}
            >
              Bookings & Finance
            </button>
            <button 
              onClick={() => setActiveTab('marketing')}
              className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest border transition-all ${
                activeTab === 'marketing' 
                ? 'bg-slate-900 text-white border-slate-900' 
                : 'bg-white text-on-surface-variant border-divider hover:bg-slate-50'
              }`}
            >
              AI Marketing Studio
            </button>
            <button 
              onClick={() => setActiveTab('gallery')}
              className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest border transition-all ${
                activeTab === 'gallery' 
                ? 'bg-slate-900 text-white border-slate-900' 
                : 'bg-white text-on-surface-variant border-divider hover:bg-slate-50'
              }`}
            >
              Gallery Manager
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : activeTab === 'marketing' && profile?.role === 'admin' ? (
          <PromotionalVideoGenerator />
        ) : activeTab === 'gallery' && profile?.role === 'admin' ? (
          <GalleryManager />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-12">
              <div className="sleek-card overflow-hidden bg-white border-none shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-divider bg-slate-50/50">
                        <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Shoot Date</th>
                        {profile?.role === 'admin' && (
                          <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Client</th>
                        )}
                        <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Type</th>
                        <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Status</th>
                        <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Payment</th>
                        <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Cameraman</th>
                        <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-divider">
                      {bookings.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center text-on-surface-variant">
                            No bookings found.
                          </td>
                        </tr>
                      ) : (
                        bookings.map((booking) => (
                          <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-primary" />
                                <span className="font-bold text-sm text-on-surface">{booking.scheduleDate}</span>
                              </div>
                            </td>
                            {profile?.role === 'admin' && (
                              <td className="px-6 py-4">
                                <div className="flex flex-col">
                                  <span className="text-sm font-bold">{booking.userName}</span>
                                  <span className="text-xs text-on-surface-variant">{booking.phoneNumber}</span>
                                </div>
                              </td>
                            )}
                            <td className="px-6 py-4">
                              <span className="badge badge-info">{booking.shootType}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`badge ${
                                booking.status === 'Confirmed' ? 'badge-success' : 
                                booking.status === 'Pending' ? 'badge-warning' : 'bg-slate-100 text-slate-500'
                              }`}>
                                {booking.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                               <div className="flex flex-col gap-1">
                                 <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full w-fit ${
                                   booking.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' :
                                   booking.paymentStatus === 'Partial' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
                                 }`}>
                                   {booking.paymentStatus || 'Quote Pending'}
                                 </span>
                                 {booking.totalAmount && (
                                   <span className="text-xs font-mono font-bold">₹{booking.totalAmount.toLocaleString()}</span>
                                 )}
                               </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <Camera className="w-4 h-4 text-on-surface-variant" />
                                <span className="text-sm">{booking.cameramanName || 'TBD'}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex gap-2">
                                  {profile?.role === 'admin' ? (
                                    <>
                                      {booking.status === 'Pending' && (
                                        <button 
                                          onClick={() => handleStatusUpdate(booking.id, 'Confirmed')}
                                          className="p-1 text-success hover:bg-success/10 rounded flex items-center gap-1 text-xs font-bold"
                                        >
                                          <CheckCircle className="w-4 h-4" /> Approve
                                        </button>
                                      )}
                                      {!booking.totalAmount && (
                                        <button 
                                          onClick={() => handleSetTotalAmount(booking.id)}
                                          className="p-1 text-primary hover:bg-primary/10 rounded flex items-center gap-1 text-xs font-bold"
                                        >
                                          Set Price
                                        </button>
                                      )}
                                      <button 
                                        onClick={() => handleStatusUpdate(booking.id, 'Cancelled')}
                                        className="p-1 text-red-500 hover:bg-red-50 rounded flex items-center gap-1 text-xs font-bold"
                                      >
                                        <XCircle className="w-4 h-4" /> Cancel
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      {booking.totalAmount && booking.paymentStatus !== 'Paid' && booking.paymentStatus !== 'Partial' && (
                                        <button 
                                          onClick={() => setSelectedBookingForPayment(booking)}
                                          className="bg-primary text-white px-3 py-1.5 rounded text-xs font-bold shadow-sm hover:bg-blue-600 transition-all"
                                        >
                                          Pay Advance (₹5000)
                                        </button>
                                      )}
                                    </>
                                  )}
                                </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <PaymentModal 
        isOpen={!!selectedBookingForPayment}
        onClose={() => setSelectedBookingForPayment(null)}
        bookingId={selectedBookingForPayment?.id || ''}
        amount={500000} // Custom amount in cents (₹5000)
        onSuccess={() => {
          setSelectedBookingForPayment(null);
          if (user) fetchBookings(user.uid, profile?.role);
        }}
      />

      {/* Booking Form Overlay */}
      <AnimatePresence>
        {showBookingForm && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
            >
              <div className="p-8 border-b border-divider flex justify-between items-center">
                <h3 className="text-xl font-bold">New Booking Request</h3>
                <button onClick={() => setShowBookingForm(false)} className="p-2 hover:bg-slate-100 rounded-full">
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleBookingSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Shoot Date</label>
                    <input 
                      type="date"
                      required
                      value={newBooking.scheduleDate}
                      onChange={(e) => setNewBooking({...newBooking, scheduleDate: e.target.value})}
                      className="w-full bg-slate-50 border border-border rounded-lg px-4 py-3 text-sm focus:border-primary focus:bg-white outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Type</label>
                    <select 
                      value={newBooking.shootType}
                      onChange={(e) => setNewBooking({...newBooking, shootType: e.target.value})}
                      className="w-full bg-slate-50 border border-border rounded-lg px-4 py-3 text-sm outline-none"
                    >
                      <option>Wedding</option>
                      <option>Pre-wedding</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Phone Number</label>
                  <input 
                    type="tel"
                    required
                    placeholder="+91 XXXXX XXXXX"
                    value={newBooking.phoneNumber}
                    onChange={(e) => setNewBooking({...newBooking, phoneNumber: e.target.value})}
                    className="w-full bg-slate-50 border border-border rounded-lg px-4 py-3 text-sm focus:border-primary focus:bg-white outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Special Notes</label>
                  <textarea 
                    rows={4}
                    value={newBooking.notes}
                    onChange={(e) => setNewBooking({...newBooking, notes: e.target.value})}
                    placeholder="Tell us about your venue or special requests..."
                    className="w-full bg-slate-50 border border-border rounded-lg px-4 py-3 text-sm focus:border-primary focus:bg-white outline-none resize-none"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg hover:bg-blue-600 transition-all"
                >
                  Confirm Booking Request
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function GalleryManager() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    imageUrl: '',
    category: 'Wedding' as 'Wedding' | 'Pre-wedding'
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const it = await getGalleryItems();
      setItems(it);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addGalleryItem(newItem);
      setNewItem({ title: '', imageUrl: '', category: 'Wedding' });
      fetchItems();
    } catch (e) {
      alert("Error adding item");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-12">
      <div className="sleek-card p-8 bg-white border-none shadow-sm">
        <h3 className="text-xl font-bold mb-6">Archive New Work</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Image URL (Instagram/Direct Link)</label>
            <input 
              required
              placeholder="https://..."
              value={newItem.imageUrl}
              onChange={(e) => setNewItem({...newItem, imageUrl: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:border-primary outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Title</label>
            <input 
              required
              placeholder="Event Title..."
              value={newItem.title}
              onChange={(e) => setNewItem({...newItem, title: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:border-primary outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Category</label>
            <select 
              value={newItem.category}
              onChange={(e) => setNewItem({...newItem, category: e.target.value as any})}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm outline-none"
            >
              <option value="Wedding">Wedding</option>
              <option value="Pre-wedding">Pre-wedding</option>
            </select>
          </div>
          <div className="flex items-end">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold shadow-lg hover:bg-slate-800 transition-all disabled:opacity-50"
            >
               {isSubmitting ? 'Saving...' : 'Add to Collection'}
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12">Loading collection...</div>
        ) : items.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-slate-100 rounded-xl text-slate-400 font-bold italic uppercase tracking-widest text-xs">No uploaded items yet</div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="sleek-card overflow-hidden h-48 relative group">
              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <span className="text-[8px] font-bold text-white uppercase bg-primary px-1.5 py-0.5 rounded w-fit mb-1">{item.category}</span>
                <p className="text-white font-bold text-xs truncate">{item.title}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
