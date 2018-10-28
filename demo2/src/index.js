import './style.css';
import _ from 'lodash'
import printMe from "./print";

function component() {
    var element = document.createElement('div');

    element.innerHTML = _.join(['Hello', 'webpack1'], ' ');
    element.classList.add('hello');
    element.onclick = printMe
    return element;
}

document.body.appendChild(component());