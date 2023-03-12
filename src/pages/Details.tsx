import { Alert, Box, Card, CircularProgress } from "@mui/material"
import { useParams } from "react-router-dom"
import { useArticleData } from "../api"
import { Article } from "../components"
import { HourlyTrafficChart } from "../components/chart/HourlyTrafficChart"
import { useAppState } from "../state"

type Props = {}

export default function Details(props: Props) {
  const { id } = useParams()
  const dateRange = useAppState().getDateRange()
  const {data, isLoading, error} = useArticleData(id!, dateRange);

  if (isLoading) {
    return <CircularProgress />
  }

  if (!data || error) {
    return <Alert severity="error">{error!.error}</Alert>
  }

  return (
    <Box sx={{paddingTop: '1rem'}}>
      <Article
        author={data.author}
        image={data.image_url}
        url={data.url}
        traffic={data.total_traffic}
      />
      <Card sx={{padding: '1rem', marginTop: '1rem'}}>
        <HourlyTrafficChart
          articleId={id}
          dateRange={dateRange}
        />
      </Card>
    </Box>
  )
}
