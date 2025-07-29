import {orders} from '../data/orders.js';
import {products, getProduct, loadProductsFetch} from '../data/products.js';
import { formatCurrency } from './utils/money.js';

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
            Arriving on: ${productItem.estimatedDeliveryTime}
          </div>
          <div class="product-quantity">
            Quantity: ${productItem.quantity}
          </div>
          <button class="buy-again-button button-primary">
            <img class="buy-again-icon" src="images/icons/buy-again.png">
            <span class="buy-again-message">Buy it again</span>
          </button>
        </div>

        <div class="product-actions">
          <a href="tracking.html">
            <button class="track-package-button button-secondary">
              Track package
            </button>
          </a>
        </div>
      `;

      // document.querySelector('.js-order-details-grid').innerHTML += orderProductHTML;
      finalOrderProductHTML += orderProductHTML;
    });
    document.querySelector(`.js-order-details-grid-${orderId}`).innerHTML = finalOrderProductHTML;
    
  }

  orders.forEach((order)=>{

    const orderHTML = `
      <div class="order-container">
        
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${order.orderTime}</div>
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
}