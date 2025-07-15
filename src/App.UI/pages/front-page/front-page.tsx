import SlCard from '@shoelace-style/shoelace/dist/react/card/index.js'
import SlIcon from '@shoelace-style/shoelace/dist/react/icon/index.js'
import '@shoelace-style/shoelace/dist/themes/light.css'
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js'

import { withPresenter } from '@/App.UI/infrastructure/helpers/with-presenter'
import { useFrontPagePresenter } from '@/App.UI/pages/front-page/front-page.presenter'

import './front-page.scss'

setBasePath('https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.20.1/cdn/')

export const FrontPage = withPresenter(function FrontPage(presenter) {
  const vm = presenter.viewModel

  return (
    <div className="front-page">
      <SlCard className="front-page__card">
        <div className="front-page__content">
          <SlIcon name="grid-3x3-gap" className="front-page__icon" />

          <h1 className="front-page__title">{vm.optimalTimeText}</h1>

          <div className="front-page__time-range">{vm.timeRange}</div>

          <div className="front-page__price-label">Average price</div>

          <div className="front-page__price-value">
            {vm.averagePrice} {vm.priceUnit}
          </div>
        </div>
      </SlCard>
    </div>
  )
}, useFrontPagePresenter)
