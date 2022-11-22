import React, { useState, useEffect, useCallback} from 'react';
import { getFirestore, doc, getDocs, collection } from "firebase/firestore";
import logo from './logo.svg';
import './App.css';
import { Card, FilterMenu, Header } from './components';

function App() {
  const [allProducts, setAllProducts] = useState(null);
  const [allCategories, setAllCategories] = useState(null);
  const [cart, setCart] = useState([]);
  const [isFiltering, setIsFiltering] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState(null);


  console.log('cart', cart);

  useEffect(() => {
    const db = getFirestore();
    const getProductsCollection = collection(db, 'products');
    const getCategoriesCollection = collection(db, 'categories');
    Promise.all([
    getDocs(getProductsCollection)
      .then((snapshot) => {
        const products = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setAllProducts(products);
      }),
    getDocs(getCategoriesCollection)
      .then((snapshot) => {
        const categories = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setAllCategories(categories);
      }
    )])
  }, []);

  const getItemQuantity = (id) => {
    return cart?.find(item => item.id === id)?.quantity || 0
  }

  const onChangeInput = () => {
    console.log('onChangeInput');
  }

  const removeSelectedProduct = (id) => {
    setCart(currItems => {
      return currItems.filter(item => item.id !== id)
    })
  }

  const decreaseQuantity = (id) => {
    setCart(currItems => {
      if (currItems?.find(item => item.id === id)?.quantity === 1) {
        return currItems?.filter(item => item.id !== id)
      } else {
        return currItems?.map(item => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity - 1 }
          } else {
            return item
          }
        })
      }
    })
  }

  const increaseQuantity = (id) => {
    const item = allProducts?.find(item => item.id === id);
    if (cart?.find(item => item.id === id)?.quantity == item.stock) {
      return
    }
    if(cart?.length === 0) {
      setCart([{
        ...item,
        quantity: 1
      }])
    } else if (cart.length > 0 && !cart?.find(item => item.id === id)) {
      setCart([...cart, {
        ...item,
        quantity: 1
      }])
    } else {
      setCart(currItems => {
        return currItems?.map(item => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity + 1 }
          } else {
            return item
          }
        })
      })
    }
  } 

  console.log('allProducts', allProducts, 'allCategories', allCategories);

  return (
    <div className="app">
      <Header numbersOfItems={cart.length} />
      <div className='container'>
      <div className="filter-menu-container">
        {allCategories && allCategories.map((category) => (
          <FilterMenu key={category.id} {...category} /> 
        ))}
      </div>
        <div className='products-container'>
        {allProducts && allProducts.map((product) => (
          <Card 
            key={product.id}
            product={product}
            decreaseQuantity={decreaseQuantity}
            increaseQuantity={increaseQuantity}
            onChangeInput={onChangeInput}
            numberOfItem={getItemQuantity(product.id)}
          />
        ))}
        </div>
      </div>
    </div>
  );
}

export default App;
