在启动服务时：

- 为 route 添加请求方法

- 为 app 添加请求方法

在定义 路由时触发以上添加的方法

- app 请求方法收集
  - 特殊处理 get 方法中特殊情况，即获取配置项如 app.get('env')
  
  - 按照 path 创建的路由 route（ 在创建 route 的过程中也为 router 添加了一些配置），  route 进行请求方法的收集
  
    - 在创建 route 时，每一个定义的路由路径都会创建一个新的路由，即使两个路径相同
  
      ```js
      app.get('/users', (req, res, next) => {
          console.log('第一个路由')
          next()
      });
      
      app.get('/users', (req, res) => {
          console.log('第二个路由')
          res.send(`
              <html>
                  <head><title>Users</title></head>
                  <body><h1>Users22</h1></body>
              </html>
          `);
      });
      ```
  
      以上代码会按照 /user 创建两个 route
  
- route 请求方法收集
  - 循环 app 路由中定义的处理函数，将其初始化为 layer 依赖收集在当前 route 的 stack 中

在接受到请求时：

- 通过 app 定义的路由
  - app.handle
  - this.router.handle
    - 从 req 对象中解析出 path，在 router.stack 中找到与 path 匹配的 layer, 判断所匹配的layer 中的 route 是否有与 req 对应的 verb 方法
    - 整理 layer 的参数，调用 layer.handleRequest 方法 -> 调用 layer 上的 handle 方法 -> 调用  layer.route.dispatch 方法，(目前上下文中的 next 方法为 Router.prototype.handle 中定义的 next 方法)
    - 在 route.stack 中寻找匹配的 layer,通过 layer 与 req 上的 verb 方法进行匹配, 调用 route.layer.handleRequest 方法 （此时上下文中的 next 为 Route.prototype.dispatch 中定义的 next 方法）
    - 此时调用的是 app.get('/', (req, res, next) => {}) 中注册的方法，即我们开发的业务代码，其中 next 函数为 Route.prototype.dispatch 中定义的 next 方法





```js
router: {
    stack: [
        layer: {
        	route: [layer,....]
        },
        layer: {
            route: [layer, ...]
        }
    ]
}
```





router 中的 layer 与 route 中的 layer 的区别:

1. **创建方式不同**：

```javascript:router/index.js
// Router 中的 layer 创建
const layer = new Layer(path, {
  sensitive: this.caseSensitive,
  strict: false,
  end: false
}, fn)
```

```javascript:router/lib/route.js
// Route 中的 layer 创建
const layer = Layer('/', {}, fn)
```

2. **功能定位不同**：

- **Router 中的 layer**:
  - 负责路由级别的匹配和处理
  - 可以包含完整的路径匹配规则
  - 可以是中间件(.use)或路由处理器
  - layer.route 属性可能为 undefined(中间件)或 Route 实例(路由)

- **Route 中的 layer**:
  - 负责具体 HTTP 方法的处理函数
  - 路径固定为 '/'，因为路径匹配已经在 Router 层完成
  - 只处理具体的请求处理函数
  - layer.method 属性标识具体的 HTTP 方法

3. **参数配置不同**：

```javascript
// Router layer 的配置选项
{
  sensitive: this.caseSensitive, // 路径大小写敏感
  strict: false,                 // 严格模式
  end: false                     // 路径结束匹配
}

// Route layer 的配置选项
{} // 空配置，因为不需要路径匹配相关的配置
```

4. **使用场景示例**：

```javascript
// Router 层面的 layer
app.use('/users', userMiddleware)     // 中间件 layer
app.get('/users/:id', handler)        // 路由 layer

// Route 层面的 layer
router.get('/users/:id', 
  validateUser,                       // 处理函数 layer
  checkPermission,                    // 处理函数 layer
  getUser                            // 处理函数 layer
)
```

总的来说，Router 的 layer 负责整体的路由匹配和分发，而 Route 的 layer 则专注于具体路由的处理函数执行。这是一个分层设计，使得路由系统更加清晰和模块化。 



Router.prototype.handle 中的 next 函数与 Route.prototype.dispatch 中的 next 函数有何区别

让我详细对比这两个 `next` 函数的区别：

### 1. 匹配逻辑不同

**Router.prototype.handle 中的 next**:
```javascript
// find next matching layer
while (match !== true && idx < stack.length) {
  layer = stack[idx++]
  match = matchLayer(layer, path)  // 匹配路径
  route = layer.route

  // ... 其他匹配逻辑
  const method = req.method
  const hasMethod = route._handlesMethod(method)  // 匹配 HTTP 方法
}
```

**Route.prototype.dispatch 中的 next**:
```javascript
// find next matching layer
while (match !== true && idx < stack.length) {
  layer = stack[idx++]
  match = !layer.method || layer.method === method  // 只匹配 HTTP 方法
}
```

### 2. 处理范围不同

**Router.prototype.handle**:
- 处理整个路由系统的中间件和路由
- 需要处理路径匹配
- 处理参数解析
- 处理子路由

**Route.prototype.dispatch**:
- 只处理单个路由内的中间件
- 只需要匹配 HTTP 方法
- 不需要处理路径匹配（因为路径已经在 Router 层匹配过）

### 3. 错误处理方式

**Router.prototype.handle**:
```javascript
let layerError = err === 'route'
  ? null
  : err

// signal to exit router
if (layerError === 'router') {
  setImmediate(done, null)
  return
}
```

**Route.prototype.dispatch**:
```javascript
// signal to exit route
if (err && err === 'route') {
  return done()
}

// signal to exit router
if (err && err === 'router') {
  return done(err)
}
```

### 4. 状态维护不同

**Router.prototype.handle**:
```javascript
// 需要维护更多状态
const parentParams = req.params
const parentUrl = req.baseUrl || ''
let removed = ''
let slashAdded = false
```

**Route.prototype.dispatch**:
```javascript
// 状态较简单
let idx = 0
let sync = 0
```

### 总结

1. **职责范围**：
   - Router 的 next 负责整个路由系统的调度
   - Route 的 next 只负责单个路由内部的中间件调度

2. **匹配机制**：
   - Router 需要匹配路径和方法
   - Route 只需要匹配 HTTP 方法

3. **复杂度**：
   - Router 的 next 更复杂，需要处理路径、参数等
   - Route 的 next 相对简单，主要处理中间件流程

4. **状态管理**：
   - Router 需要维护更多的状态（URL、参数等）
   - Route 只需要维护基本的执行状态

这种设计体现了职责分离的原则，Router 负责整体路由系统的调度，而 Route 专注于单个路由内部的处理流程。



app.route 



express.router
