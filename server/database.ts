import { APIArticle, ArticleData } from "./types";
import { sum } from "./utils";

export async function createDatabase(source: string) {
  const articles: ArticleData[] = (await import(source)).default.traffic_data

  return {
    getById(id: string): ArticleData|undefined {
      return articles.find(it => it.id === id);
    },

    getOverview(query: TrafficQuery): Array<APIArticle> {
      const {articlesIds, dateRange } = query

      const ids = new Set(articlesIds)

      return articles
        .filter(it => {
          if (ids.size === 0) return true
          return ids.has(it.id)
        })
        .map(a => {
          const total_traffic = sum(a.daily_traffic
            .filter(x => {
              if (!dateRange) return true

              return dateRange.from <= x.day && x.day <= dateRange.to
            })
            .flatMap(x => x.hourly_traffic.flatMap(h => h.traffic))
          )

          return {
            ...a,
            daily_traffic: undefined,
            total_traffic
          }
        })
    },

    /**
     * NOTE: THIS IS TERRIBLY INEFFICIENT, in the real world
     * this would become a query to a database engine
     * */
    aggregatedHourlyTraffic(query: TrafficQuery): number[] {

      const {articlesIds, dateRange, timeRange = {from: 0, to: 23}} = query

      const values = new Array(timeRange.to - timeRange.from + 1).fill(0)

      const ids = new Set(articlesIds)

      articles.forEach(article => {
        if (ids.size > 0 && !ids.has(article.id)) return

        article.daily_traffic.forEach(daily => {
          if (dateRange && (daily.day < dateRange.from || daily.day > dateRange.to)) return

          daily.hourly_traffic.forEach(hourly => {
            if (hourly.hour < timeRange.from || hourly.hour > timeRange.to) return

            values[hourly.hour] += hourly.traffic
          })
        })
      })

      return values
    }
  }
}

type Range<T = number> = {from: T, to: T}

type TrafficQuery = {
  articlesIds?: string[],
  // 1 - 31
  dateRange?: Range,
  // 0 - 23
  timeRange?: Range
}
