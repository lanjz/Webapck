module.exports = function (css) {
  console.log('AAAAAAAAAAAAAAAAAA')
  console.log('css', css)
  // Here we can change the original css
  const transformed = css.replace('.classNameA', '.classNameB')

  return transformed
}
