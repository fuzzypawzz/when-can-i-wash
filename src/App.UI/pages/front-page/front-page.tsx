import SlCard from '@shoelace-style/shoelace/dist/react/card/index.js'
import SlIcon from '@shoelace-style/shoelace/dist/react/icon/index.js'
import '@shoelace-style/shoelace/dist/themes/light.css'
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js'

import { withPresenter } from '@/App.UI/infrastructure/helpers/with-presenter'
import { useFrontPagePresenter } from '@/App.UI/pages/front-page/front-page.presenter'

setBasePath('https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.20.1/cdn/')

export const FrontPage = withPresenter(function FrontPage(presenter) {
  const vm = presenter.viewModel

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}
    >
      <SlCard
        style={{
          maxWidth: '400px',
          width: '100%',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <div
          style={{
            textAlign: 'center',
            padding: '24px'
          }}
        >
          <SlIcon
            name="grid-3x3-gap"
            style={{
              fontSize: '48px',
              color: '#667eea',
              marginBottom: '16px'
            }}
          />

          <h1
            style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#2d3748',
              marginBottom: '8px',
              lineHeight: '1.2'
            }}
          >
            {vm.optimalTimeText}
          </h1>

          <div
            style={{
              fontSize: '36px',
              fontWeight: '700',
              color: '#667eea',
              marginBottom: '16px',
              fontFamily: 'monospace'
            }}
          >
            {vm.timeRange}
          </div>

          <div
            style={{
              fontSize: '18px',
              color: '#4a5568',
              marginBottom: '8px'
            }}
          >
            Average price
          </div>

          <div
            style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#2d3748'
            }}
          >
            {vm.averagePrice} {vm.priceUnit}
          </div>
        </div>
      </SlCard>
    </div>
  )
}, useFrontPagePresenter)
