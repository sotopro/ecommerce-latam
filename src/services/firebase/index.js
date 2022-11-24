import { getFirestore, query, getDocs, collection, where, addDoc } from "firebase/firestore";

export const firebaseServices = {
    getProducts: () => {
        const db = getFirestore();
        const getProductsCollection = collection(db, 'products');
        return getDocs(getProductsCollection)
            .then((snapshot) => {
                return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            });
    },
    getCategories: () => {
        const db = getFirestore();
        const getCategoryCollection = collection(db, 'categories');
        return getDocs(getCategoryCollection)
            .then((snapshot) => {
                return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            });
    },
    getProductsByCategory: (categoryId) => {
        const db = getFirestore();
        const q =  query(
            collection(db, 'products'),
            where('categoryId', '==', categoryId)
          );

        return getDocs(q)
        .then((snapshot) => {
            if(snapshot.size === 0) {
                return [];
              }
            return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data()}));
        });
    },
    createOrder: (order) => {
        const db = getFirestore();
        const ordersCollection = collection(db, 'orders');
        return addDoc(ordersCollection, order)
        .then((docRef) => {
            return docRef.id;
        });
    },
}