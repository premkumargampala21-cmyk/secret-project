/**
 * Firebase Storage & Firestore Configuration and Utilities
 *
 * If you configure your Firebase project, this module can directly connect
 * to Firebase Storage for binary image storage and Cloud Firestore for metadata.
 *
 * Current State: The website uses the secure authenticated full-stack backend
 * (/api/photos) by default to ensure real, permanent cloud photo storage
 * across all devices without requiring manual cloud keys.
 */

export interface FirebaseConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

export function getFirebaseConfig(): FirebaseConfig | null {
  try {
    // Check environment variables if provided
    const envKey = import.meta.env.VITE_FIREBASE_API_KEY;
    if (envKey) {
      return {
        apiKey: envKey,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID,
      };
    }
  } catch {
    // ignore
  }
  return null;
}

export function isFirebaseConfigured(): boolean {
  const config = getFirebaseConfig();
  return Boolean(config && config.apiKey && config.projectId);
}
