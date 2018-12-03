// require('babel-polyfill')
import './style.css';
import printMe from "./print";
import mdjson from '../../README.md'
console.log('mdjson', mdjson)
window.myApi = "myApi"
// require("expose-loader?$!jquery");
import img  from './bg.jpg'
function component() {
    const element = document.createElement('div');
    element.classList.add('tt')
  element.innerHTML="element"
    element.classList.add('hello');
    element.onclick = printMe
  const newImg = new Image()
  newImg.src = img
  document.body.appendChild(newImg)
    return element;
}
// console.log('Array.from', Array.from([1, 2, 3, 4, 5], (n) => n + 1))
const setTime = ()=> {
  return new Promise((resolve, reject) => {
    resolve('this is a test')
  })
}
setTime()
  .then(res => console.log('res', res))

document.body.appendChild(component());
