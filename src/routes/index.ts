import KoaRouter from '@koa/router'
import { Context } from 'koa'
import { generateNewDiaryPage } from '../generateNewDiaryPage'
import { newBlockDiaryPage } from '../newBlockDiaryPage'

import { logger } from '../middlewares/logger'

const router = new KoaRouter()

router.get('/', logger, (ctx: Context): void => {
  ctx.body = { message: 'Hello World' }
})

router.post('/newDiaryPage', logger, async (ctx: Context): Promise<void> => {
  const generateNewDiaryPageReponse = await generateNewDiaryPage()
  ctx.body = generateNewDiaryPageReponse;
})

router.post('/newBlock', logger, async (ctx: Context): Promise<void> => {
  const { message } = ctx.request.body

  const newBlockDiaryPageResponse = await newBlockDiaryPage(message);
  ctx.body = newBlockDiaryPageResponse;
})

export default router