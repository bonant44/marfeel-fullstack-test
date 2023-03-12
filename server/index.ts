import express, { Application, NextFunction, Request, Response } from 'express'
import morgan from 'morgan'
import * as validate from 'express-validator'
import sortBy from 'sort-by';
import type {APIArticle} from './types'
import { createLogger } from './logger';
import { createDatabase } from './database';

async function main() {
  const isDev = process.env.NODE_ENV === 'development'

  const log = createLogger({
    level: isDev ? 'DEBUG' : 'WARNING'
  });

  const db = await createDatabase('./dataset.json');

  const app: Application = express();

  const port = process.env.PORT ?? 3001;

  app.disable('x-powered-by');
  app.set("query parser", "simple");

  // setup API logger
  app.use(morgan(isDev ? 'dev' : 'common'))

  // trivial healthckeck endpoint
  app.get('/_health', (req, res) => {
    res.json({status: 'ok'})
  })

  // the data endpoints
  app.get(
    '/articles',
    validate.query('from').isInt({min: 1, max: 31}),
    validate.query('to').isInt({min: 1, max: 31}),
    (req:
      Request<
        {},
        Array<APIArticle>,
        {},
        {from: number, to: number}
      >,
      res: Response
    ) => {
      const {from, to} = req.query

      const data = db.getOverview({
        dateRange: {from, to}
      })

      res.json(data.sort(sortBy('-total_traffic')))
    }
  );

  app.get(
    '/article/:id',
    validate.query('from').isInt({min: 1, max: 31}),
    validate.query('to').isInt({min: 1, max: 31}),
    (req:
      Request<
        {id: string},
        APIArticle,
        {},
        {from: number, to: number}
      >,
      res: Response
    ) => {
      const {from, to} = req.query;

      const articles = db.getOverview({
        articlesIds: [req.params.id],
        dateRange: { from, to }
      })

      if (articles.length === 0) {
        return res.status(404).json({error: "Article Not Found"})
      }

      res.json(articles[0])
    }
  )

  app.get(
    '/traffic',
    validate.query('from').isInt({min: 1, max: 31}),
    validate.query('to').isInt({min: 1, max: 31}),
    (req:
      Request<
        {},
        Array<number>,
        {},
        {from: number, to: number}
      >,
      res: Response
    ) => {
      const {from, to} = req.query

      res.json(
        db.aggregatedHourlyTraffic({
          dateRange: {from, to}
        })
      )
    }
  );

  app.get(
    '/traffic/:id',
    validate.query('from').isInt({min: 1, max: 31}),
    validate.query('to').isInt({min: 1, max: 31}),
    (req:
      Request<
        {id: string},
        number[],
        {},
        {from: number, to: number}
      >,
      res: Response
    ) => {
      const article = db.getById(req.params.id)

      if (!article) {
        return res.status(404).json({error: "Article Not Found"})
      }

      const {from, to} = req.query

      res.json(
        db.aggregatedHourlyTraffic({
          articlesIds: [article.id],
          dateRange: {from, to}
        })
      )
    }
  )

  // not found route handler
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(400).json({error: 'Not Found'})
  })

  // error handler
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    log.error(err)
    res.status(500).json({error: 'Internal Server Error'})
  })

  // start server and configure graceful shutdown
  const server = app.listen(port, () => {
    log.info(`App is listening on port ${port} !`)

    function shutdown() {
      log.info('graceful shutdown...')
      server.close()
      log.info('shutdown done')
    }

    app.on('SIGINT', shutdown);
    app.on('SIGTERM', shutdown);
  });
}

main()

