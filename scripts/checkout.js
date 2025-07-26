import {cart,removeFromCart,updateCheckOut,updateCartQuantity, updateDeliveryOption} from '../data/cart.js';
import {products} from '../data/products.js';
import { formatCurrency } from './utils/money.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import { deliveryOptions } from '../data/deliveryOptions.js';

let cartSummaryHTML = '';

updateCheckOut();
cart.forEach((cartItem)=>{
  const productId = cartItem.productId;

  let matchingProduct;

  products.forEach((product)=>{
    if(product.id === productId){
      matchingProduct = product;
    }
  });
  // console.log(matchingProduct.image);
  
  const deliveryOptionId = cartItem.deliveryOptionId;

  let deliveryOption;
  deliveryOptions.forEach((option)=>{
    if(option.id == deliveryOptionId){
      deliveryOption = option;
    }
  });

  const today = dayjs();
  const deliveryDate = today.add(
    deliveryOption.deliveryDays,
    'days'
  );
  const dateString = deliveryDate.format('dddd, MMMM D');

  cartSummaryHTML +=  `
    <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
      <div class="delivery-date">
        Delivery date: ${dateString}
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image"
          src="${matchingProduct.image}">

        <div class="cart-item-details">
          <div class="product-name">
            ${matchingProduct.name}
          </div>
          <div class="product-price">
            $${formatCurrency(matchingProduct.priceCents)}
          </div>
          <div class="product-quantity">
            <span>
              Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary js-update-link js-update-link-${matchingProduct.id}" data-product-id="${matchingProduct.id}">
              Update
            </span>
            <input class="quantity-input js-quantity-input-${matchingProduct.id}">
            <span class="save-quantity-link link-primary js-save-link-${matchingProduct.id} js-save-link" data-product-id="${matchingProduct.id}">Save</span>
            <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
              Delete
            </span>
            <p class="warning js-warning-${matchingProduct.id}">please add valid positive number.</p>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>
        ${deliveryOptionsHTML(matchingProduct, cartItem)}
        </div>
      </div>
    </div>
    `;
});

function deliveryOptionsHTML(matchingProduct,cartItem){
  let html = '';
  deliveryOptions.forEach((deliveryOption)=>{

    const today = dayjs();
    const deliveryDate = today.add(
      deliveryOption.deliveryDays,'days'
    );
    const dateString = deliveryDate.format('dddd, MMMM D');

    const priceString = deliveryOption.priceCents === 0
    ? 'FREE'
    : `$${formatCurrency(deliveryOption.priceCents)} -`;

    const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

    html += `
      <div class="delivery-option js-delivery-option"
        data-product-id = ${matchingProduct.id}
        data-delivery-option-id = ${deliveryOption.id}>
        <input type="radio"
          ${isChecked ? 'checked' : ''}
          class="delivery-option-input"
          name="delivery-option-${matchingProduct.id}">
        <div>
          <div class="delivery-option-date">
            ${dateString}
          </div>
          <div class="delivery-option-price">
            ${priceString} Shipping
          </div>
        </div>
      </div>
    `
  });

  return html;
}


document.querySelector('.order-summary').innerHTML = cartSummaryHTML;

document.querySelectorAll('.js-delete-link')
  .forEach((link) => {
    link.addEventListener('click',()=>{
      // console.log("delete button clicked.");
      const productId = link.dataset.productId;
      
      removeFromCart(productId);

      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      container.remove();
    });
  });

document.querySelectorAll('.js-update-link')
  .forEach((updateLink)=>{
    updateLink.addEventListener('click',()=>{
      const productId = updateLink.dataset.productId;
      // console.log(productId);
      const inputElement = document.querySelector(`.js-quantity-input-${productId}`);
      const saveElement = document.querySelector(`.js-save-link-${productId}`);
      inputElement.classList.add('is-editing-quantity');
      saveElement.classList.add('is-editing-quantity');
      updateLink.classList.add('hide-update-link');
    });
  });

document.querySelectorAll('.js-save-link')
  .forEach((saveLink)=>{
    saveLink.addEventListener('click',()=>{
      const {productId} = saveLink.dataset;
      const inputElement = document.querySelector(`.js-quantity-input-${productId}`);
      const updateElement = document.querySelector(`.js-update-link-${productId}`);
      
      const updatedQuantity = inputElement.value;

      // inputElement.addEventListener('keydown', (event) => {
      //   console.log(event.key);
      //   if(event.key === 'Enter'){
          // if(updatedQuantity >= 0 && updatedQuantity < 1000){
          //   updateCartQuantity(productId,Number(updatedQuantity));
          //   document.querySelector(`.js-warning-${productId}`).classList.remove('show-warning');
          // }else{
          //   document.querySelector(`.js-warning-${productId}`).classList.add('show-warning');
          // }

          // const quantityLabel = document.querySelector(`.js-quantity-label-${productId}`);
          // quantityLabel.innerHTML = Number(updatedQuantity);

          // inputElement.classList.remove('is-editing-quantity');
          // saveLink.classList.remove('is-editing-quantity');
          // updateElement.classList.remove('hide-update-link');
      //   }
      // });

      if(updatedQuantity >= 0 && updatedQuantity < 1000){
        updateCartQuantity(productId,Number(updatedQuantity));
        document.querySelector(`.js-warning-${productId}`).classList.remove('show-warning');
      }else{
        document.querySelector(`.js-warning-${productId}`).classList.add('show-warning');
      }

      const quantityLabel = document.querySelector(`.js-quantity-label-${productId}`);
      quantityLabel.innerHTML = Number(updatedQuantity);

      inputElement.classList.remove('is-editing-quantity');
      saveLink.classList.remove('is-editing-quantity');
      updateElement.classList.remove('hide-update-link');
    });
  });

document.querySelectorAll('.js-delivery-option')
  .forEach((element)=>{
    element.addEventListener('click',()=>{
      // const productId = element.dataset.productId;
      // const deliveryOptionId = element.dataset.deliveryOptionId;
      const{productId, deliveryOptionId} = element.dataset;
      // console.log(productId,deliveryOptionId);
      
      updateDeliveryOption(productId, deliveryOptionId);
    });
  });