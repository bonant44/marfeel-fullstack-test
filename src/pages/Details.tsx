import { Alert, Box, Card, CircularProgress } from "@mui/material"
import { useParams } from "react-router-dom"
import { useArticleData } from "../api"
import { Chart } from "../components"

type Props = {}

export default function Details(props: Props) {
  const { id } = useParams()
  const {data, isLoading, error} = useArticleData(id!);

  if (isLoading) {
    return <CircularProgress />
  }

  if (!data || error) {
    <Alert severity="error">{error!.error}</Alert>
  }

  return (
    <Box>
      <Card sx={{padding: '1rem', marginTop: '1rem'}}>
        <details>
          <summary>Article {id} data</summary>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </details>
      </Card>
      <Card sx={{margin: "1rem 0"}}>
        <Chart title="Article Traffic" data={[]} labels={[]} />
      </Card>
    </Box>
  )
}
