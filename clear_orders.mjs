import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            "AIzaSyAA_M9I2-eYhPgpx2sWgCYgFLtXZvVOuDA",
  authDomain:        "dprintstudio-d37f1.firebaseapp.com",
  projectId:         "dprintstudio-d37f1",
  storageBucket:     "dprintstudio-d37f1.appspot.com",
  messagingSenderId: "760808426242",
  appId:             "1:760808426242:web:ca38abf1f04327b71e901b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function clearOrders() {
  console.log('Fetching orders from Firestore...');
  const snapshot = await getDocs(collection(db, 'orders'));
  console.log(`Found ${snapshot.docs.length} orders in Firestore.`);
  
  for (const document of snapshot.docs) {
    console.log(`Deleting order document ${document.id}...`);
    await deleteDoc(doc(db, 'orders', document.id));
  }
  
  console.log('All orders have been deleted successfully from Firebase Firestore!');
  process.exit(0);
}

clearOrders().catch(err => {
  console.error('Error clearing orders:', err);
  process.exit(1);
});
