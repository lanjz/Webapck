<template>
<div class="login-bg">
  <div class="flex flex-1 form-bg bg-fff login-layout">
    <div class="form-layout">
      <div class="login-title">{{isLogin?'登录':'注册'}}</div>
      <div class="form-group flex">
        <div class="form-label-layout">
          用户名：
        </div>
        <div class="flex flex-1 align-items-center">
          <input class="form-input" v-model.trim="username"/>
        </div>
      </div>
      <div class="form-group flex">
        <div class="form-label-layout">
          密码：
        </div>
        <div class="flex flex-1 align-items-center">
          <input class="form-input" type="password" v-model.trim="password"/>
        </div>
      </div>
      <div class="register-layout" v-if="!isLogin">
        <div class="form-group flex">
          <div class="form-label-layout">
            确认密码：
          </div>
          <div class="flex flex-1 align-items-center">
            <input class="form-input" type="password" v-model.trim="rePassword"/>
          </div>
        </div>
        <div class="form-group flex">
          <div class="form-label-layout">
            昵称：
          </div>
          <div class="flex flex-1 align-items-center">
            <input class="form-input" v-model.trim="nickname"/>
          </div>
        </div>
        <div class="form-group flex">
          <div class="form-label-layout">
            邮箱：
          </div>
          <div class="flex flex-1 align-items-center">
            <input class="form-input" v-model.trim="email"/>
          </div>
        </div>
        <!--radios默认值-->
        <div class="form-group flex">
          <div class="form-label-layout">
            性别：
          </div>
          <div class="flex flex-1 align-items-center">
            <div
              class="add-options-item radio-style"
              :class="{'act':sex === 1}"
            >
              <input type="radio" class="form-radio" :value=1 v-model="sex">男
            </div>
            <div
              class="add-options-item radio-style"
              :class="{'act':sex === 2}"
            >
              <input type="radio" class="form-radio" :value=2  v-model="sex">女
            </div>
          </div>
        </div>
        <div class="form-group flex" >
          <div class="form-label-layout"></div>
          <div class="flex flex-1 align-items-center other-label" @click="toggleTag(true)">前往登录</div>
        </div>
        <div class="form-group submit-layout">
          <div class="btn" @click="todoRegister">保存</div>
          <div class="btn second-btn" @click="doReset">重置</div>
        </div>
      </div>
      <div v-else>
        <div class="form-group flex" >
          <div class="form-label-layout"></div>
          <div class="flex flex-1 align-items-center other-label" @click="toggleTag(false)">注册</div>
        </div>
        <div class="form-group" >
          <div class="login-btn" @click="todoLogin">登录</div>
        </div>
      </div>

      <div class="show-err" v-if="errMsg">{{errMsg}}</div>
    </div>
  </div>
</div>
</template>

<script>
  import { mapState, mapGetter, mapMutations, mapActions } from 'vuex'
  import * as MUTATIONS from '../store/const/mutaions'
  import * as ACTIONS from '../store/const/actions'
  const defaultData = {
    nickname: '',
    email: '',
    username: '',
    password: '',
    rePassword: '',
    sex: 1,
    avatar: '',
    isLogin: true,
  }
  export default {
    data() {
      return {
        ...defaultData,
        errMsg: ''
      }
    },
    methods: {
      ...mapActions([
        ACTIONS.LOGIN_POST,
        ACTIONS.USER_POST
      ]),
      todoRegister() {
        if(!this.username){
         this.errMsg = '用户名不能为空'
          return
        }
        if(!this.nickname){
          this.errMsg ='昵称不能为空'
          return
        }
        if(!this.password){
          this.errMsg = '密码不能为空'
          return
        }
        if(this.password !== this.rePassword){
          this.errMsg = '再次密码输入不一致'
          return
        }
        this.doRegister()
      },
      async doRegister() {
        const data = {}
        Object.keys(defaultData).forEach(item => {
          data[item] = this[item]
        })
        this.$showLoading()
        const result = await this[ACTIONS.USER_POST](data)
        this.$hideLoading()
        if(!result.err){
          this.$router.push('/article')
        }
      },
      async todoLogin(data) {
        if(!this.username){
          this.errMsg = '用户名不能为空'
          return
        }
        if(!this.password){
          this.errMsg = '密码不能为空'
          return
        }
        this.$showLoading()
        const result = await this[ACTIONS.LOGIN_POST](data)
        this.$hideLoading()
        if(!result.err){
          this.$router.push('/article')
        }
      },
      doReset() {
        Object.keys(defaultData).forEach(item => {
          this[item] = ''
        })
      },
      toggleTag(bol) {
        this.isLogin = bol
      }
    }
  }
</script>

<style lang="less" scoped="">
  .login-title{
    text-align: center;
    padding: 0 0 10px 0;
    font-size: 18px;
  }
  .login-layout{
    background: #fff;
    padding: 40px;
    display: inline-block;
    text-align: left;
    border:solid 1px @border-color;
    margin: 60px auto 0 auto;
  }
  .login-bg{
    text-align: center;
    .submit-layout{
      text-align: right;
    }
  }
  .register-layout{
    padding-top: 20px;
  }
  .login-btn{
    width: 200px;
    line-height: 40px;
    color: #fff;
    background: @highlight-color;
    text-align: center;
    font-size: 18px;
    margin: 20px auto;
    cursor: pointer;
    border-radius: 4px;
  }
  .show-err{
    color: @warn-color;
    text-align: right;
  }
  .other-label{
    margin-top: 20px;
    color: @highlight-color;
    cursor: pointer;
  }
</style>
