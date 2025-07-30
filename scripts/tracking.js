import {products, getProduct, loadProductsFetch} from '../data/products.js';
import {orders} from '../data/orders.js';
import {calculateCartItem} from '../data/cart.js';
async function loadPage(){
  try{
    // throw 'error1';
    console.log('load page');
    
    await loadProductsFetch();
    await new Promise((resolve)=>{
      loadCart(()=>{
        resolve();
      });
    });
  }catch(error){
    console.log('unexpected error occured!!!');
  }
  
  renderTrackingPage();
}
loadPage();

function renderTrackingPage(){
  const url = new URL(window.location.href);
  const orderId = url.searchParams.get('orderId');
  const productId = url.searchParams.get('productId');

  let matchingProduct = getProduct(productId);
  let orderedTime;

  let matchingOrderProduct;
  orders.forEach((order)=>{
    if(order.id === orderId){
      const matchingOrderForDate = order;
      orderedTime = new Date(matchingOrderForDate.orderTime);
    }
    
    order.products.forEach((product)=>{
      if(product.productId === productId){
        matchingOrderProduct = product;
      }
    });
  });

  const myDate = new Date(matchingOrderProduct.estimatedDeliveryTime);  

  let trackingHTML = `
      <div class="order-tracking">
      <a class="back-to-orders-link link-primary" href="orders.html">
        View all orders
      </a>

      <div class="delivery-date">
        ${myDate.toUTCString()}
      </div>

      <div class="product-info">
        ${matchingProduct.name}
      </div>

      <div class="product-info">
        Quantity: ${matchingOrderProduct.quantity}
      </div>

      <img class="product-image" src=${matchingProduct.image}>

      <div class="progress-labels-container">
        <div class="progress-label">
          Preparing
        </div>
        <div class="progress-label current-status">
          Shipped
        </div>
        <div class="progress-label">
          Delivered
        </div>
      </div>

      <div class="progress-bar-container">
        <div class="progress-bar js-progress-bar"></div>
      </div>
    </div>
  `;

  document.querySelector('.js-main').innerHTML += trackingHTML;
  document.querySelector('.ja-cart-quantity').innerHTML = calculateCartItem();

  const myDateCurrent = new Date();
  
  const width = 100 - ((myDateCurrent - myDate)/(orderedTime - myDate)*100);  

  document.querySelector('.js-progress-bar').style.width = `${width}%`;
  
}
