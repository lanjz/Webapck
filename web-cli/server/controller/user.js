import modalUser from '../modal/user'
import validator from '../utils/validator'

const user  = new modalUser()


/**
 * @param { Object } params, { Object } model  根据model过滤参数
 * @return { Object } filterData 返回过滤后的参数
 * */
function filterParams(params, model) {
  const errMsg = []
  const filterData = {}
  Object.keys(model).forEach((item, index) => {
    if(model[item].required&&!params[item]) {
      errMsg.push(`${item}不能为空`)
    } else if(model[item]['validate']&&!validator[item](params[item])) {
      console.log('134')
      errMsg.push(`${item}格式不正确`)
    } else {
      filterData[item] = params[item]
    }
  })
  console.log('errMsg', errMsg)
  return { errMsg: errMsg.join(), filterData }
}

const testUser = {
  userName: 'lanjz2',
  passWord: '1234',
  email: 'lanjz',
  sex: 1
}

/*const result = user.list()
result.then(res =>{
  console.log('res', res)
})*/
/*const result2 = user.save(testUser)
result2.then(res =>{
  console.log('res', res)
})
  .catch(err => {
    console.log('err', err)
  })*/
/**
 * @deal: '/user'
 * */
function add(ctx, next) {
  // ctx.send(0, '测试', ctx.request.query)
  console.log('ctx.request.body', ctx.request.query)
  // ctx.request.body支持获取到x-www.form-urlencoded和application/json格式的参数
  console.log('ctx.request.body', ctx.request.body)

  const { errMsg, filterData } = filterParams(ctx.request.body, user.getSchema())
  if(errMsg) {
    ctx.send(0,  ctx.request.body, errMsg,)
  } else {
      user.save(filterData)
        .then(res =>{
          console.log('ers', res)
          ctx.send(0,  res, '添加成功')
        })
        .catch(err => {
          console.log('err', err)
          ctx.send(0,  '', err)
        })
  }
}


function find(ctx) {
  user.list()
    .then(res =>{
      ctx.send(0,  res, '查房')
    })
    .catch(err => {
      ctx.send(0,  '', err)
    })
}

export default {
  add,
  find
}
