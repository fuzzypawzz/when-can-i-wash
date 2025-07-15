import React from 'react'

/**
 * A Higher-Order Component (HOC) that implements the presenter pattern for React components.
 *
 * This HOC separates UI logic from presentation logic by taking a presenter function
 * that handles all business logic, state management, and data fetching, then passes
 * the result to a UI component.
 *
 *
 * @template TProps - The props type that the presenter function receives
 * @template TPresenterReturn - The return type of the presenter function (usually contains viewModel and actions)
 *
 * @param Inner - A pure React functional component that receives the presenter's return value as props
 * @param presenter - A function that takes the original props and returns data/actions for the UI component
 *
 * @returns A new React component that wraps the Inner component with presenter logic
 *
 * @example
 * // Basic usage with a simple presenter
 * const MyComponent = withPresenter(
 *   function MyComponent(presenter) {
 *     return (
 *       <div>
 *         <h1>{presenter.viewModel.title}</h1>
 *         <button onClick={presenter.onSave}>Save</button>
 *       </div>
 *     )
 *   },
 *   useMyComponentPresenter
 * )
 *
 * @example
 * // Presenter hook example
 * function useMyComponentPresenter() {
 *   const [count, setCount] = useState(0)
 *
 *   return {
 *     viewModel: {
 *       title: `Count: ${count}`,
 *       isEven: count % 2 === 0
 *     },
 *     onSave: () => setCount(prev => prev + 1)
 *   }
 * }
 *
 * @example
 * // More complex example with props
 * const MyPage = withPresenter(
 *   function MyPage(presenter) {
 *     const vm = presenter.viewModel
 *
 *     if (vm.isLoading) {
 *       return <div>Loading...</div>
 *     }
 *
 *     return (
 *       <div>
 *         <h1>Welcome {vm.userName}!</h1>
 *         <p>Email: {vm.userEmail}</p>
 *         <button onClick={presenter.onRefresh}>Refresh</button>
 *       </div>
 *     )
 *   },
 *   useMyPagePresenter
 * )
 *
 * function useMyPagePresenter(props: { userId: string }) {
 *   const { data: user, isLoading, refetch } = useUserLogic(props.userId)
 *
 *   return {
 *     viewModel: {
 *       isSkeletonLoaderShown: isLoading,
 *       userName: user?.name ?? 'Unknown',
 *       userEmail: user?.email ?? 'No email'
 *     },
 *     onRefresh: () => refetch()
 *   }
 * }
 *
 * @example
 * // Usage in your app
 * function App() {
 *   return <MyPage userId="123" />
 * }
 */
export function withPresenter<TProps, TPresenterReturn>(
  Inner: React.FC<TPresenterReturn>,
  presenter: (props: TProps) => TPresenterReturn
) {
  const PresenterHoc = (props: TProps) => {
    const presenterResult = presenter(props)
    return <Inner {...(presenterResult as TPresenterReturn & React.Attributes)} />
  }

  Inner.displayName = getNameWithoutTrailing2(Inner.name)

  PresenterHoc.displayName = showWithPresenterBadgeForReactDevTools(
    getNameWithoutTrailing2(Inner.displayName || Inner.name || 'Component')
  )

  return PresenterHoc
}

/**
 * Formats the component name for React DevTools to show a clear "Presenter" badge.
 * This helps developers identify which components use the presenter pattern when debugging.
 *
 * @param name - The component name to wrap
 * @returns A formatted name that will appear as "Presenter(ComponentName)" in React DevTools
 *
 * @internal This is an internal helper function used by withPresenter
 */
function showWithPresenterBadgeForReactDevTools(name: string) {
  return `Presenter(${name})`
}

/**
 * Cosmetic helper that removes trailing "2" from function names.
 *
 * This addresses a common pattern where developers export a const with the same name
 * as the function, which causes TypeScript to append "2" to the function name.
 *
 * @param name - The function name that might have a trailing "2"
 * @returns The name without the trailing "2"
 *
 * @example
 * // Without this helper, React DevTools would show "WelcomePage2"
 * export const WelcomePage = withPresenter(function WelcomePage(presenter) {
 *   // component implementation
 * }, useWelcomePagePresenter)
 *
 * @internal This is an internal helper function used by withPresenter
 */
function getNameWithoutTrailing2(name: string) {
  return name.endsWith('2') ? name.slice(0, -1) : name
}
