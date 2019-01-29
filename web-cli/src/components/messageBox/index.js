import vue from 'vue'

// 这里就是我们刚刚创建的那个静态组件
import toastComponent from './MessageBox.vue'

let instance, tempPro;

const MessageBoxConstructor = vue.extend(toastComponent)
const defaultCallback = action => {
  instance.visible = false;
  tempPro(action)
}

const initInstance = () => {
  instance = new MessageBoxConstructor({
    el: document.createElement('div')
  })
  instance.callback = defaultCallback
}


function showNextMsg(options) {
  if(!instance){
    initInstance()
  }
  for(let item in options) {
    instance[item] = options[item]
  }
  if(instance){
    document.body.appendChild(instance.$el);
  }
  instance.visible = true;
}
function MessageBox(options){
  return new Promise((resolve, reject) => {
    tempPro =  resolve
    showNextMsg(options)
  })
}
const defaultOptions = {
  title: document.title,
  content: '',
  theme: 'confirm', // 'confirm',  'warn'
  confirmText: '确定',
  cancelText: '取消'
}
function helloAlert(options){
  if( Object.prototype.toString.call(options) !== '[object Object]') {
    options = {}
  }
  return MessageBox({ ...defaultOptions, ...options })
}

export default helloAlert
