import React, { useState } from 'react';
import './App.css';


// render react;
// props + state;
// xử lí độc lập, tính toàn vẹn dữ liệu


const items = [];

for (let i =0; i< 10; i++) {
  const item = {
    id: i,
    name: `item ${i}`,
    price: i * 100000,
  }
  items.push(item);
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

  const onSubtractItem = (item) => {

  };

  return (
    <div className="App">
      <ShoppingCart cart={cart} onAdd={onAddItem} onSubtract={onSubtractItem} />
      {items.map(item => <Item {...item } onAdd={onAddItem}/>)}

    </div>
  );
}

export default App;
