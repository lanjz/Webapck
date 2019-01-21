import hello from '../utils/hello'

function mkdirsSync( dirname ) {
  if (fs.existsSync( dirname )) {
    return true
  } else {
    if (mkdirsSync( path.dirname(dirname)) ) {
      fs.mkdirSync( dirname )
      return true
    }
  }
}

class BaseCtl {
  constructor() {
    this.alias = this.getAlias()
    this.Model = this.getModel()
    this.add = this.add.bind(this)
    this.findById = this.findById.bind(this)
    this.find = this.find.bind(this)
    this.deleteById = this.deleteById.bind(this)
    this.modify = this.modify.bind(this)
    this.deleteByIds = this.deleteByIds.bind(this)
    this.findOneByQuery = this.findOneByQuery.bind(this)
    this.uploadImg = this.uploadImg.bind(this)
  }
  getAlias() {
    return '数据'
  }
  getModel() {
    console.log('Model need', 'error')
  }
  dbQuery(ctx) {
    if(ctx.state.curUser) {
      return { userId: ctx.state.curUser._id }
    }
    return {}
  }
  todoPreAdd(params) {
    const res = { err: null, data: params }
    return res
  }
  todoPreModify(params) {
    const res = { err: null, data: params }
    return res
  }
  async add(ctx, next) {
    try{
      const merge = { ...ctx.request.body, ...this.dbQuery(ctx) }
      const { err, data: getParams } = await this.todoPreAdd(merge, ctx)
      if(err) {
        ctx.send(2, ctx.request.body, err.message)
        return
      }
      const helloRes = await hello.filterParams(getParams, this.Model.getSchema())
      if(helloRes.err) {
        ctx.send(2, ctx.request.body, helloRes.err.message)
      } else {
        const result = await this.Model.save(helloRes.data)
        ctx.send(1, { id: result._id }, '')
      }
    } catch (e) {
      ctx.send(2, '', hello.dealError(e, ctx.request.body.username))
    }finally {
      await next()
    }
  }
  async find(ctx, next) {
    const { start = 0, limit = 0 } = ctx.request.query
    const dbQuery = this.dbQuery(ctx)
    // 如果没有提供start和limit则查找全部
    const findFn = this.Model.listWithPaging(start, limit, dbQuery)
    try{
      const result = await Promise.all([findFn, this.Model.listCount(dbQuery)])
      ctx.send(1, {
        data: result[0],
        count: result[1]
      }, '')
    } catch (e) {
      ctx.send(2, '', hello.dealError(e))
    }finally {
      await next()
    }
  }
  async findById(ctx, next) {
    const { id } = ctx.params
    if(!id) {
      ctx.send(2, '', 'id不能为空')
      return
    }
    try{
      const dbQuery = this.dbQuery(ctx)
      const result = await this.Model.findById(id, dbQuery)
      ctx.send(1, result, '')
    } catch (e) {
      ctx.send(2, '', hello.dealError(e, id))
    } finally {
      await next()
    }
  }
  async deleteById(ctx, next) {
    const { id } = ctx.request.body
    const dbQuery = this.dbQuery(ctx)
    if(!id) {
      ctx.send(2, '', 'id不能为空')
      return
    }
    try{
      const result = await this.Model.del(id, dbQuery)
      if(result.n){
        ctx.send(1, '', '删除成功')
      } else {
        ctx.send(2, '', `没有要删除的${this.alias}`)
      }
    } catch (e) {
      ctx.send(2, '', hello.dealError(e, id))
    } finally {
      await next()
    }
  }
  async deleteByIds(ctx, next) {
    const { ids } = ctx.request.body
    const idsArr = ids.split(',')
    const dbQuery = this.dbQuery(ctx)
    try{
      const result = await this.Model.delMany(idsArr, dbQuery)
      if(result.n) {
        ctx.send(1, '', `成功删除${result.n}条数据`)
      } else {
        ctx.send(2, '', `没有要删除的${this.alias}`)
      }
    } catch (e) {
      ctx.send(2, '', hello.dealError(e, ids))
    } finally {
      await next()
    }
  }
  async modify(ctx, next) {
    const { id } = ctx.request.body
    if(!id){
      ctx.send(2, '', 'id不能为空')
      return
    }
    try {
      const merge = { ...ctx.request.body, ...this.dbQuery(ctx) }
      const { err, data } = await this.todoPreModify(merge, ctx)
      if(err) {
        ctx.send(2, ctx.request.body, err.message)
        return
      }
      const getParams = data
      const dbQuery = this.dbQuery(ctx)
      const result = await this.Model.findOneAndUpdate(id, getParams, dbQuery)
      if (!result) {
        ctx.send(2, '', `没有要修改的${this.alias}`)
      } else {
        ctx.send(1, result, '')
      }
    } catch (e) {
      ctx.send(2, '', hello.dealError(e, id))
    } finally {
      await next()
    }
  }
  async findOneByQuery(query) {
    return this.Model.findOne(query)
  }
  async uploadImg(ctx, next){
    const serverFilePath = path.join( __dirname, 'static/image' )
    console.log('ctx', ctx)
    const busboy = new Busboy({ headers: ctx.req.headers })
    const fileType = 'album' || 'common'
    const filePath = path.join(serverFilePath, fileType)
    const mkdirResult = mkdirsSync( filePath )
    console.log('文件上传中...')
    const result = {
      success: false,
      formData: {}
    }
    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
      let fileName = Math.random().toString(16).substr(2) + '.' + getSuffixName(filename)
      let _uploadFilePath = path.join( filePath, fileName )
      let saveTo = path.join(_uploadFilePath)
  
      // 文件保存到制定路径
      file.pipe(fs.createWriteStream(saveTo))
      // 文件写入事件结束
      file.on('end', function() {
        result.success = true
        result.message = '文件上传成功'
    
        console.log('文件上传成功！')
        resolve(result)
      })
    })
    busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
      console.log('表单字段数据 [' + fieldname + ']: value: ' + inspect(val));
      result.formData[fieldname] = inspect(val);
    });
  
    // 解析结束事件
    busboy.on('finish', function( ) {
      console.log('文件上结束')
      ctx.send(1, '文件上结束', '')
    })
  
    // 解析错误事件
    busboy.on('error', function(err) {
      console.log('文件上出错')
      ctx.send(1, '文件上出错', '')
    })
  
    ctx.req.pipe(busboy)
    
  }
}

export default BaseCtl
