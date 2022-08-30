// @/src/main.ts
import Koa from 'koa'
import koaBody from 'koa-body'

import KoaRouter from '@routes/index'

const app = new Koa()

app.use(koaBody())
app.use(KoaRouter.routes())

app.listen(3000, () => {
  console.log("listening on port 3000");
});
module.exports = app;

