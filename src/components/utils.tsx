import { Alert } from "@mui/material"
import { Component, PropsWithChildren, useEffect } from "react"
import { useAppState } from "../state"

export class ErrorBoundary extends Component<PropsWithChildren, { error: Error | null }> {
  constructor(props: PropsWithChildren) {
    super(props)
    this.state = { error: null }
  }

  componentDidCatch(error: Error) {
    this.setState({ error })
  }

  render() {
    return (
      <>
        {this.state.error
          ? <Alert severity="error">{ this.state.error.toString() }</Alert>
          : this.props.children
        }
      </>
    )
  }
}

export function PageTitle({value}: {value: string}) {
  const {setTitle} = useAppState()

  useEffect(() => {
    console.log('title', value)
    setTitle(value)
  }, [])

  return null
}
