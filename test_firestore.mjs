import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDocs, collection, deleteDoc } from 'firebase/firestore';

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

async function testFirestoreOrder() {
  console.log('Testing setDoc on orders collection...');
  const testId = 'test-ord-' + Date.now();
  const testOrder = {
    id: testId,
    orderNumber: '#TEST-1234',
    userId: 'test-user-id',
    userName: 'Test User',
    userEmail: 'test@example.com',
    items: [],
    subtotal: 10,
    shippingCost: 0,
    totalAmount: 10,
    status: 'pending_approval',
    createdAt: new Date().toISOString()
  };

  try {
    await setDoc(doc(db, 'orders', testId), testOrder);
    console.log('SUCCESSFULLY written test order to Firestore!');

    const snap = await getDocs(collection(db, 'orders'));
    console.log('Current orders count in Firestore:', snap.docs.length);

    // Clean up test order
    await deleteDoc(doc(db, 'orders', testId));
    console.log('Test order cleaned up.');
  } catch (err) {
    console.error('FIRESTORE ERROR:', err);
  }
  process.exit(0);
}

testFirestoreOrder();
