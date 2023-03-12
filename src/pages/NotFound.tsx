import { Box } from "@mui/system"

export default function NotFound() {
  return (
    <Box sx={{position: 'fixed', inset: 0, display: 'flex'}}>
      <Box component='h1' m='auto'>404 - Not Found</Box>
    </Box>
  )
}
