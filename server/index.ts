import express, { Application, NextFunction, Request, Response } from 'express'
import morgan from 'morgan'
import * as validate from 'express-validator'
import sortBy from 'sort-by';
import type {ArticleData} from '../src/api'
import { createLogger } from './logger';

function sum(items: number[]): number {
  return items.reduce((a, b) => a + b, 0)
}

function aggregatedHourlyTraffic(articles: ArticleData[], dateRange: [number, number]): number[] {
  const values = new Array(24).fill(0)
  const [from, to] = dateRange

  console.log(dateRange)

  articles.forEach(article => {
    article.daily_traffic.forEach(daily => {
      if (daily.day < from || daily.day > to) return

      daily.hourly_traffic.forEach(hourly => {
        values[hourly.hour] += hourly.traffic
      })
    })
  })

  return values
}

async function main() {
  const isDev = process.env.NODE_ENV === 'development'

  const log = createLogger({
    level: isDev ? 'DEBUG' : 'WARNING'
  });

  const db = (await import('./dataset.json')).default;

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
    (req: Request<
        any,
        Array<Omit<ArticleData, 'daily_traffic'> & {total: number}>,
        any,
        {from: number, to: number}
      >,
      res: Response
    ) => {
      const {from, to} = req.query

      const data = db.traffic_data.map(a => {
        const total = sum(a.daily_traffic
          .filter(x => from <= x.day && x.day <= to)
          .flatMap(x => x.hourly_traffic.flatMap(h => h.traffic))
        )

        return {
          ...a,
          daily_traffic: undefined,
          total
        }
      })

      res.json(data.sort(sortBy('-total')))
    }
  );

  app.get(
    '/traffic/hourly',
    validate.query('from').isInt({min: 1, max: 31}),
    validate.query('to').isInt({min: 1, max: 31}),
    (req: Request<
        any,
        Array<number>,
        any,
        {from: number, to: number}
      >,
      res: Response
    ) => {
      const {from, to} = req.query

      res.json(aggregatedHourlyTraffic(db.traffic_data, [from, to]))
    }
  );

  app.get(
    '/article/:id',
    (req: Request<{id: string}, any, any, any>, res) => {
      const article = db.traffic_data.find(a => a.id === req.params.id)

      if (!article) {
        return res.status(404).json({error: "Article Not Found"})
      }

      return res.json(article)
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

