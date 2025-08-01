import { formatCurrency } from "../scripts/utils/money.js";

console.log('test suite: formateCurrency');

console.log('converts cents to dollers');

if(formatCurrency(2095) === '20.95'){
  console.log('passed');
}else{
  console.log('failed');
}

console.log('works with 0');

if(formatCurrency(0) === '0.00'){
  console.log('passed');
}else{
  console.log('failed');
}

console.log('rounds up to neareast cent.');

if(formatCurrency(2000.5) === '20.01'){
  console.log('passed');
}else{
  console.log('failed');
}

if(formatCurrency(2000.4) === '20.00'){
  console.log('passed');
}else{
  console.log('failed');
}