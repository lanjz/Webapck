class LoadingLine {
  constructor() {
    this.ele = this.getEle()
  }
  setStyle() {
    return {
      width: '0%',
      height: '3px',
      transition: '.1s linear',
      backgroundColor: '#409EFF',
      position: 'fixed',
      top: '0',
      left: '0',
      zIndex: '9999'
    }
  }
  createEle() {
    const ele = document.createElement('div')
    ele.id = 'hello-loading-line'
    const getStyle = this.setStyle()
    Object.keys(getStyle).forEach(item => {
      ele.style[item] = getStyle[item]
    })
    document.body.appendChild(ele)
    return ele
  }
  getEle() {
    const ele = document.getElementById('hello-loading-line')
    if(!ele) {
      return this.createEle()
    }
    return ele
  }
  hideEle() {
    this.ele.style.display = 'none'
    this.setWid(0)
  }
  showEle() {
    this.ele.style.display = 'block'
  }
  setWid(arg) {
    this.showEle()
    this.ele.style.width = `${arg}%`
    if(arg === 100) {
      setTimeout(() => {
        this.hideEle()
      }, 1000)
    }
  }
}

export default LoadingLine
