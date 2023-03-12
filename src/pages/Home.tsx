import { Alert, Box, Card, CircularProgress } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { useArticles } from "../api"
import { Article, PageTitle } from "../components"
import { HourlyTrafficChart } from "../components/chart/HourlyTrafficChart"
import { useAppState } from "../state"

export default function Home() {
  const navigate = useNavigate()
  const dateRange = useAppState().getDateRange()

  const onArticleClick = (articleId: string) => {
    navigate('/article/' + articleId)
  }

  return (
    <Box sx={{paddingTop: '1rem'}}>
      <PageTitle value="Traffic" />
      <Card sx={{margin: '1rem 0', padding: '1rem'}}>
        <HourlyTrafficChart
          dateRange={dateRange}
        />
      </Card>
      <ArticlesList
        dateRange={dateRange}
        onArticleClick={onArticleClick}
      />
    </Box>
  )
}

type ArticlesListProps = {
  dateRange: [number, number],
  onArticleClick: (articleId: string) => void
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
          onClick={() => onArticleClick(article.id)}
          sx={{cursor: 'pointer'}}
        >
          <Article
            author={article.author}
            url={article.url}
            image={article.image_url}
            traffic={article.total_traffic}
          />
        </Box>
      )}
    </>
  )
}
