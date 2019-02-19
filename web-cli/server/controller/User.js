import hello from '../utils/hello'
import BaseCtl from './BaseCtl'
import UserModel from '../model/User'


class UserCtl extends BaseCtl {
  constructor(){
    super()
    this.userAuth = this.userAuth.bind(this)
    this.login = this.login.bind(this)
  }
  /**
   * @POST：'/login' 登录验证
   * */
  getModel() {
    return new UserModel()
  }
  dbQuery() {
    return {}
  }
  userAuth(id) {
    return this.Model.findById(id)
  }
  setUserCookie(ctx, result) {
    const userTokenInfo = { clientUser: result._id, }
    ctx.cookies.set(
      'helloToken',
      hello.encodeLoginTypeJwt(userTokenInfo),
      {
        path: '/'
      }
    )
  }
  async login(ctx, next) {
    const { username, password } = ctx.request.body
    if(!username) {
      ctx.send(2, '', '用户名不能为空')
      return
    }
    if(!password) {
      ctx.send(2, '', '密码不能为空')
      return
    }
    try {
      const result = await this.Model.findOne({ username, password })
      if(!result) {
        ctx.send(3, '', '登录失败：账号或密码错误')
      } else {
        this.setUserCookie(ctx, result)
        ctx.send(1, '', '登录成功')
      }
    } catch (e) {
      ctx.send(2, '', hello.dealError(e))
    } finally {
      next()
    }
  }
  async doAfterAdd(ctx, next, result) {
    const infoResult = await this.Model.findById(result._id)
    this.setUserCookie(ctx, infoResult)
    ctx.send(1, infoResult, '')
  }
}

const userCtl = new UserCtl()

export default userCtl
