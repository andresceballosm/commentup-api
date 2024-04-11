import * as admin from "firebase-admin";
const { Storage } = require("@google-cloud/storage");

let db: any;
let messaging: any;
let auth: any;
let storage: any;
let storageAdmin: any;

export const initFirebaseAdmin = () => {
  const params = {
    type: process.env.FIREBASE_TYPE || "",
    projectId: process.env.FIREBASE_PROJECT_ID || "",
    privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID || "",
    privateKey: process.env.FIREBASE_PRIVATE_KEY
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
      : "",
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || "",
    clientId: process.env.FIREBASE_CLIENT_ID || "",
    authUri: "https://accounts.google.com/o/oauth2/auth",
    tokenUri: "https://oauth2.googleapis.com/token",
    authProviderX509CertUrl: "https://www.googleapis.com/oauth2/v1/certs",
    clientC509CertUrl: process.env.FIREBASE_CLIENT_CERT_URL || "",
  };

  try {
    admin.initializeApp({
      credential: admin.credential.cert(params),
      databaseURL: process.env.FIREBASE_URL,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
  } catch (err) {
    console.log(err);
  }

  db = admin.firestore();
  messaging = admin.messaging();
  auth = admin.auth();
  storage = new Storage();
  storageAdmin = admin.storage().bucket();
};

export { db, messaging, auth, storage, storageAdmin };
