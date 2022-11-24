import React, { useState, useEffect} from 'react';
import { getFirestore, query, getDocs, collection, where, addDoc } from "firebase/firestore";
import logo from './logo.svg';
import './App.css';
import { Card, CartItem, FilterMenuItem, Header, Loader, Sidebar } from './components';

function App() {
  const [allProducts, setAllProducts] = useState(null);
  const [allCategories, setAllCategories] = useState(null);
  const [isFiltering, setIsFiltering] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartId, setOrderId] = useState(null);
  const [isOpenCart, setIsOpenCart] = useState(false);

  useEffect(() => {
    const db = getFirestore();
    const getProductsCollection = collection(db, 'products');
    const getCategoryCollection = collection(db, 'categories');
    Promise.all([
      getDocs(getProductsCollection)
      .then((snapshot) => {
        const products = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setAllProducts(products);
        setFilteredProducts(products);
      }),
      getDocs(getCategoryCollection)
      .then((snapshot) => {
        const categories = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setAllCategories(categories);
      }
    )
    ])
  }, []);

  const onHandlerCart = () => {
    setIsOpenCart(!isOpenCart);
  }

  const onFilter = (categoryId) => {
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
    const item = !isFiltering ? allProducts?.find((product) => product.id === id) : filteredProducts?.find((product) => product.id === id);
    if(cart?.find((product) => product.id === id)?.quantity == item?.stock) return;
    if(cart?.length === 0){
      setCart([{ ...item, quantity: 1 }]);
      setIsOpenCart(!isOpenCart);
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
    switch(true) {
      case isFiltering && filteredProducts?.length === 0:
        return <h1>No products found</h1>;
      case isFiltering && filteredProducts?.length > 0:
        return filteredProducts.map((product) => (
          <Card
            key={product.id}
            product={product}
            increaseQuantity={increaseQuantity}
            descreaseQuantity={descreaseQuantity}
            numberOfItem={getItemQuantity(product.id)}
          />
        ));
      case !isFiltering && allProducts?.length > 0:
        return allProducts.map((product) => (
          <Card
            key={product.id}
            product={product}
            increaseQuantity={increaseQuantity}
            descreaseQuantity={descreaseQuantity}
            numberOfItem={getItemQuantity(product.id)}
          />
        ));
      default:
        return <Loader />;
    }
  };

  const cartTotal = cart?.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  const createOrder = () => {
    const myOrder = {
      user: {
        name: 'John Doe',
        email: 'awdawd@gmail.com'
      },
      items: cart,
      total: cartTotal,
    }
    const db = getFirestore();
    const orderCollection = collection(db, 'orders');
    addDoc(orderCollection, myOrder)
      .then((docRef) => {
        setOrderId(docRef.id);
        setCart([]);
        setIsFiltering(false);
        onHandlerCart();
      })
  };


  const onRemoveItemCart = (id) => {
    setCart(currentCart => {
      return currentCart.filter(item => item.id !== id);
    });
  }

  return (
    <div className="app">
      <Sidebar isOpenCart={isOpenCart} onHandlerCart={onHandlerCart}>
        {cart.length > 0 ? (
          <>
            {cart.map((item) => (
              <CartItem item={item} key={item.id} onRemoveItem={onRemoveItemCart}  />
            ))}
            <div className='cart-footer'>
              <div className='cart-footer-total'>
                <h3 className='cart-footer-total-title'>Total</h3>
                <h3 className='cart-footer-total-amout'>${cartTotal}</h3>
              </div>
              <button 
                className='button-create-order'
                onClick={createOrder}>
                Create order
                </button>
            </div>
          </>
        ): (
          <h2 className='cart-empty'>Your cart is empty</h2>
        )}
      </Sidebar>
      <Header numbersOfItems={cart.length} onHandlerCart={onHandlerCart}/>
      <div className='container'>
        <div className='filter-menu-container'>
          {allCategories && allCategories.map((category) => (
            <FilterMenuItem key={category.id} {...category} onFilter={onFilter} />
          ))}
        </div>
        <div className='products-container'>
          {renderProducts()}
        </div>
      </div>
    </div>
  );
}

export default App;
