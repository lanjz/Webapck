import vue from 'vue'

import loadingCom from './Loading.vue'

const LoadingConstructor = vue.extend(loadingCom)

let instance

const initInstance = () => {
  instance = new LoadingConstructor({
    el: document.createElement('div'),
    data() {
      return {
        visible: false,
        text: ''
      }
    }
  })
}

function controllerLoading(arg, text = '') {
  if(!instance) {
    initInstance()
    document.body.appendChild(instance.$el)
  }
  instance.text = text
  instance.visible = arg
}

function showLoading(text) {
  controllerLoading(true, text)
}

function hideLoading() {
  controllerLoading(false)
}

export default {
  show: showLoading,
  hide: hideLoading
}
