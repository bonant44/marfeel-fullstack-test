import { Alert, Box, Card, CircularProgress } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { ArticleData, useArticles, useHourlyTraffic } from "../api"
import { Article, Chart } from "../components"
import { useAppState } from "../state"

export default function Home() {
  const navigate = useNavigate()
  const dateRange = useAppState().getDateRange()

  const onArticleClick = (article: ArticleData) => {
    navigate('/article/'+article.id)
  }

  return (
    <>
      <Card sx={{margin: '1rem 0', padding: '1rem'}}>
        <HourlyTrafficChart
          dateRange={dateRange}
        />
      </Card>
      <ArticlesList
        dateRange={dateRange}
        onArticleClick={onArticleClick}
      />
    </>
  )
}

type HourlyTrafficChartProps = {
  dateRange: [number, number]
}

function HourlyTrafficChart({dateRange}: HourlyTrafficChartProps) {
  const {data, isLoading, error} = useHourlyTraffic(dateRange)

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

type ArticlesListProps = {
  dateRange: [number, number],
  onArticleClick: (article: ArticleData) => void
}

function ArticlesList({dateRange, onArticleClick}: ArticlesListProps) {

  const {data, error, isLoading} = useArticles(dateRange);

  if (isLoading) {
    return <CircularProgress sx={{display: 'block', mx: "auto"}} />
  }

  if (!data || error) {
    return <Alert severity="error">Error fetching data</Alert>
  }

  return (
    <>
      {data.map(article =>
        <Box
          key={article.id}
          onClick={() => onArticleClick(article)}
          sx={{cursor: 'pointer'}}
        >
          <Article
            author={article.author}
            url={article.url}
            image={article.image_url}
            traffic={(article as any).total}
          />
        </Box>
      )}
    </>
  )
}
