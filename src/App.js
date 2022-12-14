import React, { useState, useEffect} from 'react';
import { firebaseServices } from './services';
import './App.css';
import { Card, CartItem, FilterMenuItem, Header, Loader, Sidebar } from './components';
import { getCartTotal } from './utils';

function App() {
  const [allProducts, setAllProducts] = useState(null);
  const [allCategories, setAllCategories] = useState(null);
  const [isFiltering, setIsFiltering] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartId, setOrderId] = useState(null);
  const [isOpenCart, setIsOpenCart] = useState(false);

  const { getProducts, getCategories, getProductsByCategory, createOrder } = firebaseServices;

  useEffect(() => {
    const getData = async () => {
      try {
        const products = await getProducts();
        const categories = await getCategories();
        setAllProducts(products);
        setAllCategories(categories);
      } catch (error) {
        console.log(error);
      } 
    }

    getData();
  }, [getCategories, getProducts]);

  const onHandlerCart = () => {
    setIsOpenCart(!isOpenCart);
  }

  const onFilter = async (categoryId) => {
    const filterByCategory = await getProductsByCategory(categoryId);
      setFilteredProducts(filterByCategory);
      setIsFiltering(true);
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

  const cartTotal = getCartTotal(cart);

  const onHandlerOrder = async () => {
    const myOrder = {
      user: {
        name: 'John Doe',
        email: 'awdawd@gmail.com'
      },
      items: cart,
      total: cartTotal,
    }
    const orderId = await createOrder(myOrder);
    setOrderId(orderId);
    setCart([]);
    setIsFiltering(false);
    onHandlerCart();
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
                onClick={onHandlerOrder}>
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
