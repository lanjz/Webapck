import hello from '../utils/hello'

class BaseCtl {
  constructor() {
    this.Model = this.getModel()
  }
  getModel() {
    console.log('Model need', 'error')
  }
  async add(ctx, next) {
    try{
      const { errMsg, filterData } = hello.filterParams(ctx.request.body, this.Model.getSchema())
      if(errMsg) {
        ctx.send(2, ctx.request.body, errMsg,)
      } else {
        const result = await this.Model.save(filterData)
        ctx.send(1, { id: result._id }, '')
      }
    } catch (e) {
      ctx.send(2, '', hello.dealError(e, ctx.request.body.userName))
    } finally {
      next()
    }
  }
  async find(ctx, next) {
    const { start = 0, limit = 0 } = ctx.request.query
    // 如果没有提供start和limit则查找全部
    console.log('this.Model', this.Model)
    const findFn = this.Model.listWithPaging(start, limit)
    try{
      const result = await Promise.all([findFn, this.Model.listCount()])
      ctx.send(1,  {
        data: result[0],
        count: result[1]
      }, '')
    } catch (e) {
      ctx.send(2, '', hello.dealError(e))
    } finally {
      next()
    }
  }
  async findById(ctx, next) {
    const { id } = ctx.params
    if(!id) {
      ctx.send(2, '', 'id不能为空')
    }
    try{
      const result = await this.Model.findById(id)
      ctx.send(1, result, '')
    } catch (e) {
      ctx.send(2, '', hello.dealError(e, id))
    } finally {
      await next()
    }
  }

  async deleteById(ctx, next) {
    const { id } = ctx.request.body
    if(!id) {
      ctx.send(2, '', 'id不能为空')
    }
    try{
      const result = await this.Model.del(id)
      if(result.n){
        ctx.send(1, '', '删除成功')
      } else {
        ctx.send(1, '', '没有要删除的用户')
      }
    } catch (e) {
      ctx.send(2, '', hello.dealError(e, id))
    } finally {
      await next()
    }
  }
  async modify(ctx, next) {
    const { id } = ctx.request.body
    if(!id){
      ctx.send(2, '', 'id不能为空')
    }
    try {
      const result = await this.Model.findOneAndUpdate(id, ctx.request.body)
      if (!result) {
        ctx.send(2, '', '没有要修改的用户')
      } else {
        ctx.send(1, result, '')
      }
    } catch (e) {
      ctx.send(2, '', hello.dealError(e, id))
    } finally {
      await next()
    }
  }

}


export default BaseCtl
