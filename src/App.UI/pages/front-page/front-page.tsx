import { withPresenter } from '@/App.UI/infrastructure/helpers/with-presenter'
import { useFrontPagePresenter } from '@/App.UI/pages/front-page/front-page.presenter'

export const FrontPage = withPresenter(function FrontPage(presenter) {
  const vm = presenter.viewModel

  return <p>{vm.welcomeText}</p>
}, useFrontPagePresenter)
