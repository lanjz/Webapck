import hello from '../utils/hello'
import ModalNoteCategory from '../model/noteCategory'

const curModel = new ModalNoteCategory()

/**
 * @POST: '/noteCategory' 添加分类
 * */
async function add(ctx, next) {
  try{
    const { curUser } = ctx.state
    const params = ctx.request.body
    params.userId = curUser._id
    const { errMsg, filterData } = hello.filterParams(params, curModel.getSchema())
    if(errMsg) {
      ctx.send(2, ctx.request.body, errMsg)
    } else {
      const result = await curModel.save(filterData)
      ctx.send(1, result, '')
    }
  } catch (e) {
    ctx.send(2, '', hello.dealError(e))
  } finally {
    next()
  }
}

/**
 * @GET: '/noteCategory' 获取分类
 * */
async function find(ctx, next) {
  const { parentId = 'root' } = ctx.request.query
  console.log('parentId', parentId)
  const { curUser } = ctx.state
  try{
    const result = await curModel.list(curUser._id, parentId)
    ctx.send(1, result, '')
  } catch (e) {
    ctx.send(2, '', hello.dealError(e))
  } finally {
    next()
  }
}


/**
 * @DELETE: '/noteCategory' 删除分类
 * */
async function deleteById(ctx, next) {
  const { id } = ctx.request.body
  if(!id) {
    ctx.send(2, '', 'id不能为空')
  }
  try{
    const result = await curModel.del(id)
    if(result.n) {
      ctx.send(1, '', '删除成功')
    }else{
      ctx.send(1, '', '没有要删除的对象')
    }
  } catch (e) {
    ctx.send(2, '', hello.dealError(e, id))
  } finally {
    await next()
  }
}

/**
 * @PUT: '/noteCategory' 修改分类
 * */
async function modify(ctx, next) {
  const { id } = ctx.request.body
  if(!id) {
    ctx.send(2, '', 'id不能为空')
  }
  try{
    const result = await curModel.findOneAndUpdate(id, ctx.request.body)
    if (!result) {
      ctx.send(2, '', '没有要修改的对象')
    } else {
      ctx.send(1, result, '')
    }
  } catch (e) {
    ctx.send(2, '', hello.dealError(e, id))
  } finally {
    await next()
  }
}

export default {
  add,
  find,
  modify,
  deleteById
}
