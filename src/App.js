import React, { useState, useEffect } from 'react';
import './App.css';
import useService from './hooks/useService';
// render react;
// props + state;
// xử lí độc lập, tính toàn vẹn dữ liệu

const items = []; // datasource

for (let i =0; i< 10; i++) {
  const item = {
    id: i,
    name: `item ${i}`,
    price: i * 100000,
  }
  items.push(item);
}

const getItems = ({ limit, offset }) => {
  if (offset > items.length) {
    return { status: 400, msg: 'No more element' };
  }
  return { items: items.slice(offset, offset + limit), total:items.length };
}

const getItemsDelay = ({ limit, offset }) => {
  return new Promise((resolve, reject) => {
    setTimeout(( ) => {
      resolve(getItems({ limit, offset }))
    }, 3000)
  })
}

const getItemsService = async ({ limit, offset }) => {
  try {

    const result = await getItemsDelay({ limit, offset });
    console.log('result', result)
    if (result.status >= 400) {
      throw result.msg
    }
    
    return {
      success: true,
      data: {
        list: result.items
      }
    }
  } catch (error) {
    return {
      success: false,
      msg: error
    }
  }
}


const Item = (props) =>{
  const { onAdd } = props;

  const handleClick = () => {
    onAdd && onAdd(props)
  };

  return <>
    <p>{props.name}</p>
    <p>{props.price}</p>
    <button onClick={handleClick}>Add</button>
  </>
};

const ItemShoppingCart = (props) => {
  const { onAdd, onSubtract, quantity } = props;

  const handleAdd = () => {
    onAdd && onAdd(props)
  };

  const handleSubtract = () => {
    onSubtract &&
     onSubtract(props)
  }

  return <>
    <div>
      <p>{props.name}</p>
      <p>{props.price * quantity}</p>
    </div>
    <button onClick={handleSubtract}>Subtract</button>
    <p>{quantity}</p>
    <button onClick={handleAdd}>Add</button>
  </>
}

const ShoppingCart = ({ cart, onAdd, onSubtract }) => {
  const getTotalMoney = () => {
    let total = 0
    cart.map(e => total += e.quantity * e.price)
    return total;
  }
  // totalItem, totalMoney, action tăng giảm số lượng item
return <div style={{ borderWidth: 1, borderStyle: 'solid' }}>
    Cart:
    Total money: {getTotalMoney()}
    {cart.map(item => <ItemShoppingCart {...item} onAdd={onAdd} onSubtract={onSubtract}/>)}
  </div>;
};


function App() {
  const [cart, setCart] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  // const [loading, setLoading] = useState(false);
  const [state, setState] = useState({ id: '1' });
  const [loading, items, _, triggerLoadItem] = useService(getItemsService);

  const onAddItem = item => {
    const findIndex = cart.findIndex(element => element.id === item.id);
    if (cart.length === 0) {
      setCart([{ ...item, quantity: 1 }]);
    }
    if (findIndex === -1) {
      // khong thay doi reference cua cart 
      // cart.push({ ...item, quantity: 1 });
      // thay doi reference cua cart
      setCart([...cart, { ...item, quantity: 1 }]);
    } else {
      const cloneCart = [...cart];      
      cloneCart[findIndex] = {...cloneCart[findIndex], quantity: cloneCart[findIndex].quantity + 1 }
      setCart(cloneCart);
    }
  }

  const onSubtractItem = () => {

  }

  useEffect(() => {
    triggerLoadItem({ limit: 10, offset: 0 })
  }, [triggerLoadItem])

  return (
    <div className="App">
      <ShoppingCart cart={cart} onAdd={onAddItem} onSubtract={onSubtractItem} />
      <div onClick={() => {
        setState({ id: '1' } );
      }} > SetAnotherID </div>
      {loading && <p>Loading</p>}
      {!loading && items && items.list.length <= 0 ? <div >Click to load items</div> :
      !loading && items && items.list.map(item => <Item {...item } onAdd={onAddItem}/>)}
    </div>
  );
}

export default App;
