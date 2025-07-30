import {cart,addToCart,calculateCartItem} from '../data/cart.js';
import {products, loadProducts, getProduct} from '../data/products.js';
import { formatCurrency } from './utils/money.js';

loadProducts(renderProductsGrid);

function renderProductsGrid(){
  updateCartQuantity();
  const url = new URL(window.location.href);
  
  if(url.searchParams.get('searchedItem')){
    renderSearchedProducts(url.searchParams.get('searchedItem'));
  }else{
    products.forEach((product)=>{
      showProduct(product);
    });

  }

  function updateCartQuantity(){
    let cartQuantity = calculateCartItem();

    document.querySelector('.js-cart-quantity').innerHTML = cartQuantity; 
  }

  document.querySelectorAll('.js-add-to-cart')
    .forEach((button)=>{
      button.addEventListener('click',()=>{
        // console.log(button.dataset.productName);
        const productId = button.dataset.productId;

        const quantity = document.querySelector(`.js-quantity-container-${productId}`).value;        

        addToCart(productId,Number(quantity));
        updateCartQuantity();
      });
    });

  document.querySelector('.js-search-button')
   .addEventListener('click',()=>{
      const searchedValue = document.querySelector('.js-search-bar').value;

      const baseURL = 'http://127.0.0.1:5500/amazon.html';
      const params = new URLSearchParams();
      params.set('searchedItem',searchedValue);
      
      window.location.href = `${baseURL}?${params.toString()}`;
    });
  document.querySelector('.js-search-bar')
    .addEventListener('keydown',(event)=>{
      if(event.key === 'Enter'){
        const searchedValue = document.querySelector('.js-search-bar').value;

        const baseURL = 'http://127.0.0.1:5500/amazon.html';
        const params = new URLSearchParams();
        params.set('searchedItem',searchedValue);
        
        window.location.href = `${baseURL}?${params.toString()}`;
      }
    });
    // const url = new URL(window.location.href);
    // const searchedProduct = url.searchParams.get('searchedItem');
    // renderSearchedProducts(searchedProduct);
  
}

function showProduct(product){
  let productsHTML = '';
  productsHTML += `
    <div class="product-container">
      <div class="product-image-container">
          <img class="product-image"
            src="${product.image}">
        </div>

        <div class="product-name limit-text-to-2-lines">
          ${product.name}
        </div>

        <div class="product-rating-container">
          <img class="product-rating-stars"
            src="images/ratings/rating-${product.rating.stars * 10}.png">
          <div class="product-rating-count link-primary">
            ${product.rating.count}
          </div>
        </div>

        <div class="product-price">
          $${formatCurrency(product.priceCents)}
        </div>

        <div class="product-quantity-container">
          <select class='js-quantity-container-${product.id}'>
            <option selected value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </div>

        <div class="product-spacer"></div>

        <div class="added-to-cart js-added-to-cart-${product.id}">
          <img src="images/icons/checkmark.png">
          Added
        </div>

        <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}">
          Add to Cart
        </button>
      </div>
    `;
  document.querySelector('.js-product-grid').innerHTML += productsHTML;
}

function renderSearchedProducts(productName){

  products.forEach((product)=>{

    if(product.name.toLowerCase().includes(productName.toLowerCase())){
      showProduct(product);
    }
  });
}