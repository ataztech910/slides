import { createRoot } from 'react-dom/client'
import './index.css'
import { PresentationApp } from './engine/PresentationApp'
import { EXAMPLE_SLIDES, EXAMPLE_CUE_POINTS_SEC } from './slides/exampleSlides'

createRoot(document.getElementById('root')!).render(
  <PresentationApp
    slides={EXAMPLE_SLIDES}
    cuePointsSec={EXAMPLE_CUE_POINTS_SEC}
    durationSec={165 * 60}
  />,
)
