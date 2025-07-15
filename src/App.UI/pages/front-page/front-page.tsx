import SlBadge from '@shoelace-style/shoelace/dist/react/badge/index.js'
import SlCard from '@shoelace-style/shoelace/dist/react/card/index.js'
import SlDivider from '@shoelace-style/shoelace/dist/react/divider/index.js'
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
          <SlIcon name="lightning-charge" className="front-page__icon" />

          <h1 className="front-page__title">{vm.optimalTimeText}</h1>

          <SlDivider />

          <div className="front-page__cards">
            <SlCard>
              <div className="front-page__time-range">{vm.timeRange}</div>
              <div>Den billigste tidsramme</div>
            </SlCard>

            <SlCard>
              <div className="front-page__average-price">Gennemsnitlig kwh pris</div>
              <SlBadge variant="success" className="front-page__average-price-badge">
                {vm.badgeText}
              </SlBadge>
              <div>
                {vm.averagePrice} {vm.priceUnit}
              </div>
            </SlCard>
          </div>
        </div>
      </SlCard>
    </div>
  )
}, useFrontPagePresenter)
