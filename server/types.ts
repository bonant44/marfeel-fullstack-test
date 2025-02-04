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

export type APIArticle = Omit<ArticleData, 'daily_traffic'> & {total_traffic: number}

export type APIError = {
  error: string
}
