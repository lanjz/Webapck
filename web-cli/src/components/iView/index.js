
import {
  Layout,
  Header,
  Sider,
  Content,
  Footer,
  Breadcrumb,
  BreadcrumbItem,
  Icon,
  Menu,
  MenuItem,
  Submenu,
  Split
} from 'iview'

const useIView = {
  install(Vue) {
    Vue.component('Layout', Layout);
    Vue.component('Header', Header);
    Vue.component('Content', Content);
    Vue.component('Footer', Footer);
    Vue.component('Breadcrumb', Breadcrumb);
    Vue.component('BreadcrumbItem', BreadcrumbItem);
    Vue.component('Icon', Icon);
    Vue.component('MenuItem', MenuItem);
    Vue.component('Sider', Sider);
    Vue.component('Menu', Menu);
    Vue.component('Submenu', Submenu);
    Vue.component('Split', Split);
  }
}

export default useIView
