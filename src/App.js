import React, { useState, useEffect} from 'react';
import { getFirestore, query, getDocs, collection, where } from "firebase/firestore";
import logo from './logo.svg';
import './App.css';
import { Card, FilterMenuItem } from './components';

function App() {
  const [allProducts, setAllProducts] = useState(null);
  const [allCategories, setAllCategories] = useState(null);
  const [isFiltering, setIsFiltering] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState(null);

  useEffect(() => {
    const db = getFirestore();
    const getProductsCollection = collection(db, 'products');
    const getCategoryCollection = collection(db, 'categories');
    Promise.all([
      getDocs(getProductsCollection)
      .then((snapshot) => {
        const products = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setAllProducts(products);
      }),
      getDocs(getCategoryCollection)
      .then((snapshot) => {
        const categories = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setAllCategories(categories);
      }
    )
    ])
  }, []);

  const onFilter = (categoryId) => {
    console.log('categoryId', categoryId);
    const db = getFirestore();
    const q =  query(
      collection(db, 'products'),
      where('categoryId', '==', categoryId)
    );
    getDocs(q)
      .then((snapshot) => {
        if(snapshot.size === 0) {
          setFilteredProducts([]);
          setIsFiltering(true);
        }
        const products = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data()}));
        setFilteredProducts(products);
        setIsFiltering(true);
      })
      .catch((error) => {
        console.log('error', error);
      });
  }

  const renderProducts = () => {
    if(isFiltering && filteredProducts) {
      return filteredProducts.map((product) => <Card key={product.id} product={product} />);
    }
    if(!isFiltering && allProducts) {
      return allProducts.map((product) => <Card key={product.id} product={product} />);
    }
  };

  console.log('isFiltering', isFiltering);

  return (
    <div className="app">
      <div className='container'>
        <div className='filter-menu-container'>
          {allCategories && allCategories.map((category) => (
            <FilterMenuItem key={category.id} {...category} onFilter={onFilter} />
          ))}
        </div>
        <div className='products-container'>
          {renderProducts()}
          {/* {isFiltering ? <p>No hay productos</p> : null} */}
        </div>
      </div>
    </div>
  );
}

export default App;
