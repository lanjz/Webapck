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
 * @POST: '/user'
 * */
async function add(ctx, next) {
  try{
    const { errMsg, filterData } = filterParams(ctx.request.body, user.getSchema())
    if(errMsg) {
      ctx.send(2,  ctx.request.body, errMsg,)
    } else {
      const result = await user.save(filterData)
      ctx.send(1,  { id: result._id}, '')
    }
  } catch (e) {
    ctx.send(2,  '', e)
  }
}

/**
 * @GET: '/user'
 * */
async function find(ctx) {
  const { start, limit } = ctx.request.query
  // 如果没有提供start和limit则查找全部
  const findFn = (!start && !limit) ? user.list() : user.listWithPaging(start, limit)
  try{
    const result = await Promise.all([findFn, user.listCount()])
    ctx.send(1,  {
      data: result[0],
      count: result[1]
    }, '')
  } catch (e) {
    ctx.send(2,  '', e)
  }
}


/**
 * @GET: '/user:id'
 * */
async function findById(ctx) {
  const { id } = ctx.params
  if(!id) {
    ctx.send(2,  '', 'id不能为空')
  }
  try{
    const result = await user.findById(id)
    ctx.send(1,  result, '')
  } catch (e) {
    const errMsg = e.name === 'CastError' ? `id为${id}的用户不存在` : e.message
    ctx.send(2,  '', errMsg)
  }
}

/**
 * @DELETE: '/user'
 * */
async function deleteById(ctx) {
  const { id } = ctx.request.body
  if(!id) {
    ctx.send(2,  '', 'id不能为空')
  }
  try{
    await user.del(id)
    ctx.send(1,  '删除成功', '')
  } catch (e) {
    const errMsg = e.name === 'CastError' ? `id为${id}的用户不存在` : e.message
    ctx.send(2,  '', errMsg)
  }
}

/**
 * @PUT: '/user'
 * */
async function modify(ctx) {
  const { id } = ctx.request.body
  if(!id) {
    ctx.send(2,  '', 'id不能为空')
  }
  try{
    const result = await user.findOneAndUpdate(id, ctx.request.body)
    ctx.send(1,  result, '')
  } catch (e) {
    const errMsg = e.name === 'CastError' ? `id为${id}的用户不存在` : e.message
    ctx.send(2,  '', errMsg)
  }
}


export default {
  add,
  find,
  findById,
  modify,
  deleteById
}
