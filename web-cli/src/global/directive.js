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
  }
}
