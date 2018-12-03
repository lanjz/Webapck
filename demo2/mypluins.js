var postcss = require('postcss');

module.exports = postcss.plugin('postcss-checkcolor', function(options) {
  return function(root, result) {
    root.walk(node => {
      // console.log('node', node)
      if(node.value === '1.875rem') {
        console.log('抓到啦')
      }
    })
  };
})
