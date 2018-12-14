import hello from '../utils/hello'
import BaseCtl from './BaseCtl'
import ModalUser from '../model/user'


class UserCtl extends BaseCtl {
  constructor() {
    super()
    console.log('___this', this)
  }
  /**
   * @POST：'/login' 登录验证
   * */
  getModel() {
    return new ModalUser()
  }
  userAuth({userName, passWord}) {
    return this.Model.findOne({userName, passWord})
  }
  async login(ctx, next) {
    const { userName, passWord } = ctx.request.body
    if(!userName) {
      ctx.send(2, '', '用户名不能为空')
      return
    }
    if(!passWord) {
      ctx.send(2, '', '密码不能为空')
      return
    }
    try {
      const result = await this.userAuth({userName, passWord })
      if(!result) {
        ctx.send(3, '', '登录失败：账号或密码错误')
      } else {
        const userTokenInfo = {
          clientUser: result.userName,
          clientPass: result.passWord
        }
        ctx.cookies.set(
          'helloToken',
          hello.encodeLoginTypeJwt(userTokenInfo),
          {
            path: '/'
          }
        )
        ctx.send(1, '', '登录成功')
      }
    } catch (e) {
      ctx.send(2, '', hello.dealError(e))
    } finally {
      next()
    }
  }
  find(ctx, next) {
    // const { start = 0, limit = 0 } = ctx.request.query
    // 如果没有提供start和limit则查找全部
    console.log('this.Model222',this)
    return
    // const findFn = this.Model.listWithPaging(start, limit)
    try{
/*      const result = await Promise.all([findFn, this.Model.listCount()])
      ctx.send(1,  {
        data: result[0],
        count: result[1]
      }, '')*/
    } catch (e) {
      ctx.send(2, '', hello.dealError(e))
    } finally {
      next()
    }
  }
}

const userCtl = new UserCtl()
console.log('userCtl1', userCtl)
console.log('userCtl2', userCtl.find())
export default userCtl
