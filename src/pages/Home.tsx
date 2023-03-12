import { Box, Card, CircularProgress } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { useTrafficData } from "../api"
import { Article, Chart } from "../components"
import { For, Show } from "../components/utils"

export default function Home() {
  const navigate = useNavigate()
  const {data, isLoading} = useTrafficData();

  return (
    <Box>
      <Show
        when={data && !isLoading}
        fallback={<CircularProgress sx={{display: 'block', mx: "auto"}} />}
      >
        <Card sx={{margin: '1rem 0', padding: '1rem'}}>
          <Chart
            title="Traffic"
            data={[]}
            labels={[...Array(24)].map((x, i) => i.toString())}
          />
        </Card>
        <For each={data}>
          {(article =>
            <div key={article.id} onClick={() => navigate('/article/'+article.id)}>
              <Article
                author={article.author}
                url={article.url}
                image={article.image_url}
                traffic={(article as any).total}
              />
            </div>
          )}
        </For>
      </Show>
    </Box>
  )
}
