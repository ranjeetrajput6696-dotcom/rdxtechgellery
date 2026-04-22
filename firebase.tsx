import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  serverTimestamp, 
  doc, 
  getDoc, 
  setDoc,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  updateDoc
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId);
export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// --- Error Handling Utility ---

interface FirestoreErrorInfo {
  error: string;
  operationType: 'create' | 'update' | 'delete' | 'list' | 'get' | 'write';
  path: string | null;
  authInfo: {
    userId: string;
    email: string;
    emailVerified: boolean;
    isAnonymous: boolean;
    providerInfo: { providerId: string; displayName: string; email: string; }[];
  }
}

function handleFirestoreError(error: any, operationType: FirestoreErrorInfo['operationType'], path: string | null = null): never {
  if (error && error.code === 'permission-denied') {
    const user = auth.currentUser;
    const errorInfo: FirestoreErrorInfo = {
      error: error.message,
      operationType,
      path,
      authInfo: {
        userId: user?.uid || 'unauthenticated',
        email: user?.email || '',
        emailVerified: user?.emailVerified || false,
        isAnonymous: user?.isAnonymous || false,
        providerInfo: user?.providerData.map(p => ({
          providerId: p.providerId,
          displayName: p.displayName || '',
          email: p.email || ''
        })) || []
      }
    };
    throw new Error(JSON.stringify(errorInfo));
  }
  throw error;
}

// --- Auth Functions ---

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if user profile exists, create if not
    let userDoc;
    try {
      userDoc = await getDoc(doc(db, 'users', user.uid));
    } catch (e) {
      return handleFirestoreError(e, 'get', `users/${user.uid}`);
    }

    if (!userDoc.exists()) {
      const isAdmin = user.email === 'ranjeetrajput6696@gmail.com';
      try {
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          displayName: user.displayName,
          role: isAdmin ? 'admin' : 'user',
          createdAt: serverTimestamp()
        });
      } catch (e) {
        return handleFirestoreError(e, 'create', `users/${user.uid}`);
      }
    }
    return user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
}

export async function logout() {
  return signOut(auth);
}

// --- User Profile ---

export async function getUserProfile(uid: string) {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    return userDoc.exists() ? userDoc.data() : null;
  } catch (e) {
    return handleFirestoreError(e, 'get', `users/${uid}`);
  }
}

// --- Bookings ---

export interface BookingData {
  userId: string;
  userName: string;
  userEmail: string;
  scheduleDate: string;
  shootType: string;
  phoneNumber: string;
  notes?: string;
  cameramanName?: string;
  paymentStatus?: 'Unpaid' | 'Partial' | 'Paid';
  advanceAmount?: number;
  totalAmount?: number;
}

export async function createBooking(data: BookingData) {
  try {
    const docRef = await addDoc(collection(db, 'bookings'), {
      ...data,
      status: 'Pending',
      createdAt: serverTimestamp()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error creating booking:", error);
    return handleFirestoreError(error, 'create', 'bookings');
  }
}

export async function getUserBookings(userId: string) {
  try {
    const q = query(
      collection(db, 'bookings'), 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
  } catch (e) {
    return handleFirestoreError(e, 'list', 'bookings');
  }
}

export async function getAllBookings() {
  try {
    const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
  } catch (e) {
    return handleFirestoreError(e, 'list', 'bookings');
  }
}

export async function updateBookingStatus(bookingId: string, status: string, cameramanName?: string) {
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    const updates: any = { status };
    if (cameramanName) updates.cameramanName = cameramanName;
    return updateDoc(bookingRef, updates);
  } catch (e) {
    return handleFirestoreError(e, 'update', `bookings/${bookingId}`);
  }
}

export async function updateBookingPayment(bookingId: string, paymentStatus: string, advanceAmount: number) {
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    return updateDoc(bookingRef, { paymentStatus, advanceAmount });
  } catch (e) {
    return handleFirestoreError(e, 'update', `bookings/${bookingId}`);
  }
}

// --- Gallery ---

export async function getGalleryItems(category?: string) {
  try {
    let q;
    if (category && category !== 'All') {
      q = query(collection(db, 'gallery'), where('category', '==', category), orderBy('createdAt', 'desc'));
    } else {
      q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'), limit(12));
    }
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
  } catch (e) {
    return handleFirestoreError(e, 'list', 'gallery');
  }
}

export async function addGalleryItem(data: { title: string, imageUrl: string, category: string }) {
  try {
    const docRef = await addDoc(collection(db, 'gallery'), {
      ...data,
      createdAt: serverTimestamp()
    });
    return { success: true, id: docRef.id };
  } catch (e) {
    return handleFirestoreError(e, 'create', 'gallery');
  }
}

// --- Video Gallery ---

export interface VideoData {
  title: string;
  desc: string;
  id: string; // YouTube/Instagram ID
  platform: 'youtube' | 'instagram';
  views: string;
  thumbnail: string;
  link: string;
}

export async function addVideo(data: VideoData) {
  try {
    const docRef = await addDoc(collection(db, 'videos'), {
      ...data,
      createdAt: serverTimestamp()
    });
    return { success: true, id: docRef.id };
  } catch (e) {
    return handleFirestoreError(e, 'create', 'videos');
  }
}

export async function getVideos() {
  try {
    const q = query(collection(db, 'videos'));
    const querySnapshot = await getDocs(q);
    const videos = querySnapshot.docs.map(doc => ({ fbId: doc.id, ...(doc.data() as any) }));
    // Sort manually if needed, but let's see if it works without orderBy first
    return videos.sort((a, b) => {
      const dateA = a.createdAt?.toMillis?.() || 0;
      const dateB = b.createdAt?.toMillis?.() || 0;
      return dateB - dateA;
    });
  } catch (e) {
    return handleFirestoreError(e, 'list', 'videos');
  }
}

// --- Helper for Auth State ---

export function subscribeToAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
