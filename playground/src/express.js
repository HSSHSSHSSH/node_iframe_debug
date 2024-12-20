const express = require('../../express');
const app = express();
// const router1 = express.Router();
// const router2 = express.Router();

// router1.get('/wawa', (req, res,next) => {
//     console.log('router1');
//     res.send('router1');
// });

// router2.get('/wawa', (req, res, next) => {
//     console.log('router2');
//     res.send('router2');
// });
// app.use('/router1', router1);
// app.use('/router2', router2);

// 中间件设置
// app.use(express.json()); // 用于解析 JSON 请求体
// app.use(express.urlencoded({ extended: true })); // 用于解析 URL-encoded 请求体

// // CORS 中间件
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Headers', 'content-type');
//     res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
//     next();
// });

app.use((req, res, next) => {
    console.log('中间件1');
    next();
    console.log('中间件1结束');
}, (req, res, next) => {
    console.log('中间件1.1');
    next();
    console.log('中间件1.1结束');
});

// 同步洋葱
// app.use((req, res, next) => {
//     console.log('中间件2');
//     next();
//     console.log('中间件2结束');
// });
// 异步洋葱
app.use(async (req, res, next) => {
    console.log('中间件2');
    await new Promise(resolve => {
        setTimeout(() => {
            console.log('中间件2异步回调');
            resolve();
        }, 5000);
    })
    next()
    console.log('中间件2结束');
});

app.use((req, res, next) => {
    console.log('中间件3');
    next();
    console.log('中间件3结束');
});


// 路由处理
// app.get('/aa', (req, res, next) => {
//     console.log('111')
//     // 将处理结果存储在 res.locals 中
//     res.locals.title = 'My First Page';
//     res.locals.content = 'test1';
//     next();
//     console.log('111结束')
// }, (req, res) => {
//     console.log('222')
//     // 获取前一个中间件的处理结果
//     const { title, content } = res.locals;
//     res.send(`
//         <html>
//             <head><title>${title}</title></head>
//             <body>
//                 <h1>${content}</h1>
//                 <h2>继续处理后的内容</h2>
//             </body>
//         </html>
//     `);
// });

// app.get('/users', (req, res, next) => {
//     console.log('第一个路由')
//     next()
// });

// app.get('/users', (req, res) => {
//     console.log('第二个路由')
//     res.send(`
//         <html>
//             <head><title>Users</title></head>
//             <body><h1>Users22</h1></body>
//         </html>
//     `);
// });

// app.route('/users')
//     .get((req, res) => {
//         console.log('第三个路由')
//         res.send('第三个路由')
//     })



// app.post('/createUser', (req, res) => {
//     // 在 express 中，req.body 可通过 express.json() 获取，不需要手动解析
//     console.log('请求体:', req.body);
//     // const body = []
//     // req.on('data', (chunk) => {
//     //     body.push(chunk)
//     //     console.log('接收到的数据:', chunk.toString());
//     // });
//     // req.on('end', () => {
//     //     const parsedBody = Buffer.concat(body).toString();
//     //     console.log('解析后的数据:', parsedBody);
//     //     res.send({ message: '用户创建成功' });
//     // });
// });

// 处理其他路由
// app.use((req, res) => {
//     res.send(`
//         <html>
//             <head><title>My First Page</title></head>
//             <body><h1>无对应路由</h1></body>
//         </html>
//     `);
// });


// 启动服务器
const PORT = 3333;
app.listen(PORT, () => {
    console.log(`服务器运行在端口 ${PORT}`);
});
