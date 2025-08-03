import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';

let firebaseInitialized = false;

export async function initializeFirebase() {
  if (firebaseInitialized) {
    return;
  }

  try {
    // Check if Firebase is already initialized
    if (getApps().length === 0) {
      const projectId = process.env.GOOGLE_CLOUD_PROJECT || process.env.FIREBASE_PROJECT_ID;
      
      if (!projectId) {
        throw new Error('GOOGLE_CLOUD_PROJECT or FIREBASE_PROJECT_ID environment variable is required');
      }

      // For local development, use the emulator
      if (process.env.NODE_ENV === 'development') {
        // Use default credentials for local development
        initializeApp({
          projectId,
        });
        
        // Set emulator hosts
        process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
        process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';
        process.env.FIREBASE_STORAGE_EMULATOR_HOST = 'localhost:9199';
      } else {
        // For production, use service account credentials
        const serviceAccount = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
        
        if (serviceAccount) {
          const credentials = JSON.parse(serviceAccount);
          initializeApp({
            credential: cert(credentials),
            projectId,
            storageBucket: `${projectId}.appspot.com`,
          });
        } else {
          // Use default credentials (for Cloud Run with Workload Identity)
          initializeApp({
            projectId,
            storageBucket: `${projectId}.appspot.com`,
          });
        }
      }
    }

    firebaseInitialized = true;
    console.log('✅ Firebase Admin initialized');
  } catch (error) {
    console.error('❌ Failed to initialize Firebase Admin:', error);
    throw error;
  }
}

// Export initialized services
export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage();