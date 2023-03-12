import useSWR, { SWRResponse } from 'swr';
import {APIArticle, APIError} from '../server/types'

export function useArticles([from, to]: [number, number]): SWRResponse<APIArticle[], APIError> {
  return useSWR(`/api/articles?from=${from}&to=${to}`);
}

export function useArticleData(id: string, [from, to]: [number, number]): SWRResponse<APIArticle, APIError> {
  return useSWR(`/api/article/${id}?from=${from}&to=${to}`);
}

export function useHourlyTraffic(query: TrafficQuery): SWRResponse<number[], APIError> {
  const {articleId, dateRange} = query;
  const [from, to] = dateRange

  return useSWR(
    `/api/traffic${
      articleId ? '/' + articleId : ''
    }?from=${
      from
    }&to=${
      to
    }`);
}


type TrafficQuery = {
  articleId?: string,
  dateRange: [number, number]
}
