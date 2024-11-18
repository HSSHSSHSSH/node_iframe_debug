const Koa = require('../../koa');
const app = new Koa();

app.use(async (ctx, next) => {
    console.log('中间件1');
    await next();
    console.log('中间件1结束');
});

// 同步洋葱
// app.use((ctx, next) => {
//     console.log('中间件2');
//     next();
//     console.log('中间件2结束');
// });

// 异步洋葱
app.use(async (ctx, next) => {
    console.log('中间件2');
    await new Promise(resolve => {
        setTimeout(() => {
            console.log('中间件2异步回调');
            resolve();
        }, 5000);
    });
    next()
    console.log('中间件2结束');
});

app.use(async (ctx, next) => {
    console.log('中间件3');
    next();
    console.log('中间件3结束');
});

app.listen(3000);