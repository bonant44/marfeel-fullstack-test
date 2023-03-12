import { Alert, CircularProgress } from "@mui/material"
import { useHourlyTraffic } from "../../api"
import { Chart } from "./Chart"

type Props = {
  articleId?: string
  dateRange: [number, number]
}

export function HourlyTrafficChart({articleId, dateRange}: Props) {
  const {data, isLoading, error} = useHourlyTraffic({articleId, dateRange})

  if (isLoading) {
    return <CircularProgress />
  }

  if (!data || error) {
    return <Alert severity="error">Error loading chart data</Alert>
  }

  return (
    <Chart
      title="Traffic"
      data={data}
      labels={[...Array(24)].map((x, i) => i.toString())}
    />
  )
}
