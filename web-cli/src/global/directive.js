export default {
  install(Vue, options) {
    Vue.directive('click-outside', {
      bind: function(el, binding, vnode) {
        el.event = function(event) {
          if (!(el == event.target || el.contains(event.target))) {
            if(typeof vnode.context[binding.expression] == 'function'){
              vnode.context[binding.expression](event);
            }
          }
        };
        document.body.addEventListener("mousedown", el.event, true);
      },
      unbind: function(el) {
        document.body.removeEventListener("mousedown", el.event, true);
      }
    })
    /**
     * < v-focus >: 显示input时自动获取焦点
     * < v-focus:select > :显示input时自动获取焦点并全选文本
     * */
    Vue.directive('focus', {
      bind: function (el, binding) {
        setTimeout(() => {
          if(binding.arg === 'select') {
            el.select()
          } else {
            el.focus()
          }
        })
      }
    })
  }
}
