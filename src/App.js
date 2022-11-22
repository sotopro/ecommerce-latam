import React, { useState, useEffect} from 'react';
import { getFirestore, doc, getDocs, collection } from "firebase/firestore";
import logo from './logo.svg';
import './App.css';
import { Card } from './components';

function App() {
  const [allProducts, setAllProducts] = useState(null);
  // useEffect(() => {
  //   const db = getFirestore();
  //   const product = doc(db, 'products', 'ET5j1rEYFiNUoBAqL6I2');
  //   getDoc(product)
  //     .then((snapshot) => {
  //       if(snapshot.exists()) {
  //         setItem({ id: snapshot.id, ...snapshot.data() });
  //       }
  //     })
  // }, []);

  useEffect(() => {
    const db = getFirestore();
    const getProductsCollection = collection(db, 'products');
    getDocs(getProductsCollection)
      .then((snapshot) => {
        const products = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setAllProducts(products);
      })
  }, []);


  return (
    <div className="app">
      <div className='container'>
        <div className='products-container'>
        {allProducts && allProducts.map((product) => (
          <Card key={product.id} product={product} />
        ))}
        </div>
      </div>
    </div>
  );
}

export default App;
