import vue from 'vue'

// 这里就是我们刚刚创建的那个静态组件
import toastComponent from './MessageBox.vue'

let instance, tempPro;

const MessageBoxConstructor = vue.extend(toastComponent)
const defaultCallback = action => {
  console.log('action', action)
  tempPro(action)
}

const initInstance = () => {
  instance = new MessageBoxConstructor({
    el: document.createElement('div')
  })
  console.log('instance.callback', instance.callback)
  instance.callback = defaultCallback
}


// 返回一个 扩展实例构造器
const ToastConstructor = vue.extend(toastComponent)

// 定义弹出组件的函数 接收2个参数, 要显示的文本 和 显示时间
function benfen(text, duration = 2000){
  // 实例化一个 toast.vue
  const toastDom = new ToastConstructor({
    el: document.createElement('div'),
    data() {
      return {
        text,
        show: true
      }
    }
  })
  toastDom.callback = defaultCallback
  console.log('toastDom', toastDom.callback)
  // 把 实例化的 toast.vue 添加到 body 里
  document.body.appendChild(toastDom.$el)

  // 过了 duration 时间后隐藏
  setTimeout(() => { toastDom.show = false }, duration)
}
function showNextMsg(options) {
  if(!instance){
    initInstance()
  }
  for(let item in options) {
    instance[item] = options[item]
  }
  document.body.appendChild(instance.$el);
  vue.nextTick(() => {
    instance.visible = false;
  });
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
  type: 'alert', // 'alert',  'confirm'
  confirmText: '确定',
  cancelText: '取消'
}
function showToast(options){
  if( Object.prototype.toString.call(options) !== '[object Object]') {
    options = {}
  }
  return MessageBox({ ...options, ...defaultOptions })
}

// 注册为全局组件的函数
function registryToast() {
  // 将组件注册到 vue 的 原型链里去,
  // 这样就可以在所有 vue 的实例里面使用 this.$toast()
  vue.prototype.$toast = showToast
}

export default registryToast
