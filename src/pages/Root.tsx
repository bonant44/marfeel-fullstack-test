import { CircularProgress } from "@mui/material";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { BaseLayout } from "../components";

export default function Root() {
  return (
    <BaseLayout>
      <Suspense fallback={<CircularProgress sx={{display: 'block', mx: 'auto'}} />}>
        <Outlet />
      </Suspense>
    </BaseLayout>
  )
}
