import {orders} from '../data/orders.js';
import {products, getProduct, loadProductsFetch} from '../data/products.js';
import { formatCurrency } from './utils/money.js';
import {calculateCartItem, addToCart} from '../data/cart.js';

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
  
  renderOrdersPage();
}
loadPage();


function renderOrdersPage(){

  function renderOrderProducts(productsInOrder,orderId){
    let finalOrderProductHTML = '';
    productsInOrder.forEach((productItem)=>{
      // console.log(productItem);
      
      let matchingProduct;
      
      // console.log(products);
      
      products.forEach((product)=>{
        if(product.id === productItem.productId){
          matchingProduct = product;
        }
      });
      
      const myDate = new Date(productItem.estimatedDeliveryTime);  
      // console.log(matchingProduct);
      
      const orderProductHTML = 
      `
        <div class="product-image-container">
          <img src=${matchingProduct.image}>
        </div>

        <div class="product-details">
          <div class="product-name">
            ${matchingProduct.name}
          </div>
          <div class="product-delivery-date">
            Arriving on: ${myDate.toUTCString()}
          </div>
          <div class="product-quantity">
            Quantity: ${productItem.quantity}
          </div>
          <button class="buy-again-button button-primary js-buy-again" 
            data-product-id=${matchingProduct.id}>
            <img class="buy-again-icon" src="images/icons/buy-again.png">
            <span class="buy-again-message">Buy it again</span>
          </button>
        </div>

        <div class="product-actions">
            <button class="track-package-button button-secondary js-track-package"
              data-order-id=${orderId} data-product-id=${matchingProduct.id}>
              Track package
            </button>
        </div>
      `;

      // document.querySelector('.js-order-details-grid').innerHTML += orderProductHTML;
      finalOrderProductHTML += orderProductHTML;
    });
    document.querySelector(`.js-order-details-grid-${orderId}`).innerHTML = finalOrderProductHTML;
    
  }

  orders.forEach((order)=>{

    const myDate = new Date(order.orderTime);
    const orderHTML = `
      <div class="order-container">
        
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${myDate.toLocaleString()}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>$${formatCurrency(order.totalCostCents)}</div>
            </div>
          </div>

          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${order.id}</div>
          </div>
        </div>

        <div class="order-details-grid js-order-details-grid-${order.id}">
        </div>
      </div>
    `;

    // console.log(renderOrderProducts(order.products));
    
    document.querySelector('.js-orders-grid').innerHTML += orderHTML;
    
    renderOrderProducts(order.products,order.id);
    // document.querySelector('.js-order-details-grid').innerHTML = orderProductHTML;
  });
  
  document.querySelector('.js-cart-quantity').innerHTML = calculateCartItem();
  
  document.querySelectorAll('.js-buy-again')
    .forEach((buyAgainButton)=>{
      buyAgainButton.addEventListener('click',()=>{
        // console.log('clicked');
        const productId = buyAgainButton.dataset.productId;
        addToCart(productId);
        document.querySelector('.js-cart-quantity').innerHTML = calculateCartItem();
      });
    });

  document.querySelectorAll('.js-track-package')
    .forEach((trackButton)=>{
      trackButton.addEventListener('click',()=>{
        // console.log(clicked);
        const baseURL = 'http://127.0.0.1:5500/tracking.html';
        const params = new URLSearchParams();
        const {orderId,productId} = trackButton.dataset;
        params.set('orderId',orderId);
        params.set('productId', productId);
        
        window.location.href = `${baseURL}?${params.toString()}`;
      })
    });
}