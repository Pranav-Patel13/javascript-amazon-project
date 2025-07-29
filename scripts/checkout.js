import { renderOrderSummary } from "./checkout/orderSummary.js";
import {renderPaymentSummary} from "./checkout/paymentSummary.js";
// import "../data/backend-practice.js";
import { loadProducts, loadProductsFetch } from "../data/products.js";
import { loadCart } from "../data/cart.js";

// Promise.all([
//   new Promise((resolve)=>{
//     loadProducts(()=>{
//       resolve('value1');
//       // it lets us control when to go to next step
//     });
//   }),
//   new Promise((resolve)=>{
//       loadCart(()=>{
//         resolve();
//       });
//     })
// ]).then((values)=>{
//   console.log(values);
  
//   renderOrderSummary();
//   renderPaymentSummary();  
// });

async function loadPage(){
  console.log('load page');

  await loadProductsFetch();
  await new Promise((resolve)=>{
    loadCart(()=>{
      resolve();
    });
  });
  
  renderOrderSummary();
  renderPaymentSummary();
}
loadPage();
/*
Promise.all([
  loadProductsFetch(),
  new Promise((resolve)=>{
      loadCart(()=>{
        resolve();
      });
    })
]).then((values)=>{
  console.log(values);
  
  renderOrderSummary();
  renderPaymentSummary();  
});
*/

/*
new Promise((resolve)=>{
  loadProducts(()=>{
    resolve('value1');
    // it lets us control when to go to next step
  });

}).then((value)=>{
  console.log(value);
  
  return new Promise((resolve)=>{
    loadCart(()=>{
      resolve();
    });
  });

}).then(()=>{
  renderOrderSummary();
  renderPaymentSummary();
});
*/
// loadProducts(()=>{
//   renderOrderSummary();
//   renderPaymentSummary();
// });