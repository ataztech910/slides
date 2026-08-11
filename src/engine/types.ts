export type SlideProps = {
  /** Ask the shell to show a full-screen overlay instead of the slide deck (live demo, terminal, browser, etc). */
  onDemo: (mode: string) => void
  slideNumber: number
  total: number
}

export type SlideDef = {
  Component: React.FC<SlideProps>
}
