import { Alert } from "@mui/material"
import { Component, PropsWithChildren, ReactNode } from "react"

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

type ShowProps = {
  when: any,
  fallback?: ReactNode,
  children?: ReactNode
}

export function Show({when = false, children = null, fallback}: ShowProps) {
  return (
    <>{!!when ? children : fallback}</>
  )
}

type ForProps<T> = {
  each: T[] | null | undefined,
  fallback?: JSX.Element,
  children: (x: T, i: number, c: T[]) => ReactNode
}

export function For<T>({each, fallback, children}: ForProps<T>) {
  return (
    <>{each ? each.map(children) : fallback}</>
  )
}
