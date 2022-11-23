import React, { useState, useEffect} from 'react';
import { getFirestore, getDocs, collection, addDoc, query, where } from "firebase/firestore";
import './App.css';
import { Card, CartItem, FilterMenu, Header, Loader, Sidebar } from './components';

function App() {
  const [allProducts, setAllProducts] = useState(null);
  const [allCategories, setAllCategories] = useState(null);
  const [cart, setCart] = useState([]);
  const [isFiltering, setIsFiltering] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState(null);
  const [cartId, setCartId] = useState(null);
  const [isOpenCart, setIsOpenCart] = useState(false);


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
        setFilteredProducts(products);
      }),
    getDocs(getCategoriesCollection)
      .then((snapshot) => {
        const categories = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setAllCategories(categories);
      }
    )])
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

  const getItemQuantity = (id) => {
    return cart?.find(item => item.id === id)?.quantity || 0
  }

  const onChangeInput = () => {
    console.log('onChangeInput');
  }

  const onDeleteItem = (id) => {
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
    const item = !isFiltering ? allProducts?.find(item => item.id === id) : filteredProducts?.find(item => item.id === id);
    console.log('item', item);
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

  const cartTotal = cart?.reduce((acc, item) => {
    return acc + item.price * item.quantity
  }, 0)

  const saveCart = () => {
    const myCart = {
      user: {
        name: 'John Doe',
        email: 'awdawd@gmail.com'
      },
      items: cart,
      total: cartTotal,
    }
    const db = getFirestore();
    const cartCollection = collection(db, 'carts');
    addDoc(cartCollection, myCart)
      .then((docRef) => {
        setCartId(docRef.id);
      })
  };

  const onHandlerCart = () => {
    setIsOpenCart(!isOpenCart);
  }

  const renderProducts = () => {
    switch (true) {
      case isFiltering && filteredProducts?.length === 0:
        return <h1>Product's not found</h1>
      case isFiltering && filteredProducts?.length > 0:
        return filteredProducts?.map((product) => (
          <Card
            key={product.id}
            product={product}
            increaseQuantity={increaseQuantity}
            decreaseQuantity={decreaseQuantity}
            numberOfItem={getItemQuantity(product.id)}
          />
        ))
      case !isFiltering && allProducts?.length > 0:
        return allProducts?.map((product) => (
          <Card
            key={product.id}
            product={product}
            increaseQuantity={increaseQuantity}
            decreaseQuantity={decreaseQuantity}
            numberOfItem={getItemQuantity(product.id)}
          />
        ))
      default:
        return <Loader />
    }
  };

  return (
    <div className="app">
      <Sidebar isOpenCart={isOpenCart} onHandlerCart={onHandlerCart}>
        <div className='cart-container'>
          {cart && cart.length > 0 ? (
            <>
              {cart?.map((item) => (
                <CartItem product={item} onDeleteItem={onDeleteItem} />
              ))
            }
            <div className='cart-footer'>
            <div className='cart-footer-total'>
              <h3 className='cart-footer-total-title'>Total</h3>
              <p className='cart-footer-total-price'>${cartTotal}</p>
            </div>
            <button className='button-save-cart' onClick={saveCart}>Save Cart</button>
          </div>
            </>
          ) : <h2 className='cart-empty-title'>Cart Empty</h2> }
        </div>
      </Sidebar>
      <Header numbersOfItems={cart.length} onHandlerCart={onHandlerCart} isOpenCart={isOpenCart}/>
      <div className='container'>
      <div className="filter-menu-container">
        {allCategories && allCategories.map((category) => (
          <FilterMenu key={category.id} {...category} onFilter={onFilter} /> 
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
