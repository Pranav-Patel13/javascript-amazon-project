export let cart = JSON.parse(localStorage.getItem('cart'));

if(!cart){
  cart = [
    {
      productId:'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
      quantity: 2,
      deliveryOptionId: '1'
    },
    {
      productId:'15b6fc6f-327a-4ec4-896f-486349e85a3d',
      quantity: 1,
      deliveryOptionId: '2'
    }
  ];
}

// updateCheckOut();

function saveToStorage(){
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId){
    let matchingItem;

  cart.forEach((cartItem)=>{
    if(productId === cartItem.productId){
      matchingItem = cartItem;
    }
  });

  if(matchingItem){
    matchingItem.quantity += 1;
  }else{
    cart.push({
    productId : productId,  
    quantity : 1,
    deliveryOptionId: '1'
  });
  }

  saveToStorage();
}


export function removeFromCart(productId){
  let newCart = [];
  
  cart.forEach((cartItem)=>{
    if(cartItem.productId !== productId){
      newCart.push(cartItem);
    }
  });
  
  cart = newCart;
  saveToStorage();
  updateCheckOut();
}

// updateCheckOut();
export function updateCheckOut(){
  let cartQuantity = calculateCartItem();
  document.querySelector('.js-checkout-quantity').innerHTML = `${cartQuantity}items`;
}

export function calculateCartItem(){
  let cartQuantity = 0;
  cart.forEach((cartItem)=>{
    cartQuantity += cartItem.quantity;
  });
  return cartQuantity;
}

export function updateCartQuantity(productId,updatedQuantity){
  cart.forEach((cartItem)=>{
    if (cartItem.productId === productId) {
      cartItem.quantity = updatedQuantity;
    }
  });
  saveToStorage();
  updateCheckOut();
}

export function updateDeliveryOption(productId, deliveryOptionId){
  let matchingItem;

  cart.forEach((cartItem)=>{
    if(cartItem.productId === productId){
      matchingItem = cartItem;
    }
  });

  matchingItem.deliveryOptionId = deliveryOptionId;
  saveToStorage();
}

export function loadCart(fun){
  const xhr = new XMLHttpRequest();

  xhr.addEventListener('load', ()=>{
    // products = JSON.parse(xhr.response);
    fun();
  });
  
  xhr.open('GET', 'https://supersimplebackend.dev/cart');
  xhr.send();
}