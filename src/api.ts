import useSWR, { SWRResponse } from 'swr';

export function useTrafficData(): SWRResponse<ArticleData[], APIError> {
  return useSWR('/api/articles');
}

export function useArticleData(id: string): SWRResponse<ArticleData, APIError> {
  return useSWR(`/api/article/${id}`);
}

export type APIError = {
  error: string
}

export interface TrafficData {
  traffic_data: ArticleData[];
}

export interface ArticleData {
  id:            string;
  url:           string;
  author:        string;
  image_url:     string;
  /** locale code: e.g. ES, IT, FR... */
  geo:           string;
  daily_traffic: DailyTraffic[];
}

export interface DailyTraffic {
  /** 0-31 */
  day:            number;
  hourly_traffic: HourlyTraffic[];
}

export interface HourlyTraffic {
  /* 0-24 */
  hour:    number;
  traffic: number;
}
