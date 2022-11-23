import React, { useState, useEffect} from 'react';
import { getFirestore, query, getDocs, collection, where, addDoc } from "firebase/firestore";
import logo from './logo.svg';
import './App.css';
import { Card, FilterMenuItem } from './components';

function App() {
  const [allProducts, setAllProducts] = useState(null);
  const [allCategories, setAllCategories] = useState(null);
  const [isFiltering, setIsFiltering] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartId, setCartId] = useState(null);

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

  const descreaseQuantity = (id) => {
    setCart(currentCart => {
      if(currentCart?.find(item => item.id === id)?.quantity === 1) {
        return currentCart.filter(item => item.id !== id);
      } else {
        return currentCart?.map(item => {
          if(item.id === id) {
            return {
              ...item,
              quantity: item.quantity - 1,
            }
          } else {
            return item;
          }
        });
      }
    });
  }

  const increaseQuantity = (id) => {
    const item = allProducts?.find((product) => product.id === id);
    if(cart?.find((product) => product.id === id)?.quantity == item?.stock) return;
    if(cart?.length === 0){
      setCart([{ ...item, quantity: 1 }]);
    } else if(cart.length > 0 && !cart?.find(item => item.id === id)) {
      setCart([...cart, { ...item, quantity: 1 }]);
    } else {
      setCart(currentCart => {
        return currentCart.map((product) => {
          if(product.id === id) {
            return { ...product, quantity: product.quantity + 1 };
          } else {
            return product;
          }
        });
      });
    }
  }
  const getItemQuantity = (id) => {
    return cart?.find(item => item.id === id)?.quantity || 0;
  }

  const renderProducts = () => {
    if(isFiltering && filteredProducts) {
      return filteredProducts.map((product) => <Card key={product.id} product={product} descreaseQuantity={descreaseQuantity} increaseQuantity={increaseQuantity} numberOfItem={getItemQuantity(product.id)} />);
    }
    if(!isFiltering && allProducts) {
      return allProducts.map((product) => <Card key={product.id} product={product} descreaseQuantity={descreaseQuantity} increaseQuantity={increaseQuantity} numberOfItem={getItemQuantity(product.id)} />);
    }
  };

  const saveCart = () => {
    const myCart = {
      user: {
        name: 'John Doe',
        email: 'awdawd@gmail.com'
      },
      items: cart,
      total: 100,
    }
    const db = getFirestore();
    const cartCollection = collection(db, 'carts');
    addDoc(cartCollection, myCart)
      .then((docRef) => {
        setCartId(docRef.id);
      })
  };

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
        <button onClick={saveCart}>Save Cart</button>
      </div>
    </div>
  );
}

export default App;
