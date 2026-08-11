import type { SlideDef, SlideProps } from '../engine/types'
import { Code, ContentSlide, SectionSlide, TitleSlide, kw, st, cm } from '../engine/primitives'

const FOOTER = 'slides-app example'

function Title({ slideNumber }: SlideProps) {
  return (
    <TitleSlide
      eyebrow="Example deck"
      title="This is a placeholder title slide"
      subtitle="Replace exampleSlides.tsx with your own deck"
      speakerName="Your Name"
      speakerRole="Your role · Your company"
      speakerLinks="github.com/you"
      slideNumber={slideNumber}
      footerLabel={FOOTER}
    />
  )
}

function Section({ slideNumber }: SlideProps) {
  return (
    <SectionSlide
      eyebrow="ACT 1"
      title="Section divider"
      subtitle="Use SectionSlide between major parts of the talk"
      slideNumber={slideNumber}
      footerLabel={FOOTER}
    />
  )
}

function ContentWithCode({ slideNumber }: SlideProps) {
  return (
    <ContentSlide eyebrow="Primitive" title="ContentSlide + Code" slideNumber={slideNumber} footerLabel={FOOTER}>
      <div className="flex flex-col gap-5">
        <div className="text-[18px] text-white/70 font-light leading-relaxed">
          Body content goes here — text, bullet points, diagrams, whatever the slide needs.
        </div>
        <Code>
          {kw('const')} slide = {st('"just a React component"')}{'\n'}
          {cm('// SlideProps: { onDemo, slideNumber, total }')}
        </Code>
      </div>
    </ContentSlide>
  )
}

export const EXAMPLE_SLIDES: SlideDef[] = [
  { Component: Title },
  { Component: Section },
  { Component: ContentWithCode },
]

// Optional: target timestamp (seconds from talk start) for each slide above,
// same length/order as EXAMPLE_SLIDES. Drives the progress-bar markers and
// the "you're running behind" haptic nudge. Omit cuePointsSec entirely to
// run the timer without per-slide pacing.
export const EXAMPLE_CUE_POINTS_SEC = [0, 60, 180]
