import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import React, { createContext, useContext } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { withPresenter } from './with-presenter'

describe('withPresenter', () => {
  describe('props forwarding and TypeScript inference', () => {
    it('should forward props correctly to presenter function', () => {
      const mockPresenter = vi.fn().mockReturnValue({ message: 'Hello from presenter' })

      function TestComponent(presenterResult: { message: string }) {
        return <div>{presenterResult.message}</div>
      }

      const WrappedComponent = withPresenter(TestComponent, mockPresenter)

      const testProps = { userId: 123, name: 'Test User' }
      render(<WrappedComponent {...testProps} />)

      expect(mockPresenter).toHaveBeenCalledWith(testProps)
      expect(screen.getByText('Hello from presenter')).toBeInTheDocument()
    })

    it('should infer props types correctly', () => {
      // This test validates TypeScript inference at compile time
      function presenter(props: { count: number; label: string }) {
        return { displayText: `${props.label}: ${props.count}` }
      }

      function TestComponent(presenterResult: { displayText: string }) {
        return <div>{presenterResult.displayText}</div>
      }

      const WrappedComponent = withPresenter(TestComponent, presenter)

      // TypeScript should enforce these prop types
      render(<WrappedComponent count={42} label="Counter" />)

      expect(screen.getByText('Counter: 42')).toBeInTheDocument()
    })

    it('should handle complex presenter return types', () => {
      interface ComplexPresenterReturn {
        user: { name: string; age: number }
        actions: {
          handleClick: () => void
        }
        status: 'loading' | 'ready'
      }

      function presenter(): ComplexPresenterReturn {
        return {
          user: { name: 'John', age: 30 },
          actions: {
            handleClick: vi.fn()
          },
          status: 'ready'
        }
      }

      function TestComponent(presenterResult: ComplexPresenterReturn) {
        return (
          <div>
            <span>{presenterResult.user.name}</span>
            <span>{presenterResult.status}</span>
          </div>
        )
      }

      const WrappedComponent = withPresenter(
        TestComponent as React.FC<ComplexPresenterReturn>,
        presenter
      )

      render(<WrappedComponent />)

      expect(screen.getByText('John')).toBeInTheDocument()
      expect(screen.getByText('ready')).toBeInTheDocument()
    })
  })

  describe('React context forwarding', () => {
    it('should properly forward React context to wrapped component', () => {
      const TestContext = createContext<{ theme: string }>({ theme: 'light' })

      function presenter(props: { message: string }) {
        return { text: props.message }
      }

      function TestComponent(presenterResult: { text: string }) {
        const context = useContext(TestContext)
        return (
          <div>
            {presenterResult.text} - {context.theme}
          </div>
        )
      }

      const WrappedComponent = withPresenter(TestComponent, presenter)

      render(
        <TestContext.Provider value={{ theme: 'dark' }}>
          <WrappedComponent message="Test" />
        </TestContext.Provider>
      )

      expect(screen.getByText('Test - dark')).toBeInTheDocument()
    })
  })

  describe('displayName functionality', () => {
    it('should set displayName for both Inner component and HOC', () => {
      const TestComponent: React.FC = () => {
        return <div>Test</div>
      }

      function testPresenter() {
        return {}
      }

      const WrappedComponent = withPresenter(TestComponent, testPresenter)

      expect(TestComponent.displayName).toBe('TestComponent')
      expect(WrappedComponent.displayName).toBe('Presenter(TestComponent)')
    })

    it('should handle components with existing displayName', () => {
      function TestComponent() {
        return <div>Test</div>
      }
      TestComponent.displayName = 'CustomDisplayName'

      function testPresenter() {
        return {}
      }

      const WrappedComponent = withPresenter(TestComponent, testPresenter)

      // The HOC uses the original displayName but overwrites the Inner component's displayName
      expect(TestComponent.displayName).toBe('TestComponent')
      expect(WrappedComponent.displayName).toBe('Presenter(TestComponent)')
    })

    it('should handle anonymous components gracefully', () => {
      const TestComponent = () => <div>Test</div>

      function testPresenter() {
        return {}
      }

      const WrappedComponent = withPresenter(TestComponent, testPresenter)

      // The const name becomes the function name in this case
      expect(WrappedComponent.displayName).toBe('Presenter(TestComponent)')
    })

    it('should handle truly anonymous components', () => {
      function testPresenter() {
        return {}
      }

      // Create a truly anonymous component by not assigning to a const
      const WrappedComponent = withPresenter(() => <div>Test</div>, testPresenter)

      // Anonymous function components fall back to 'Component'
      expect(WrappedComponent.displayName).toBe('Presenter(Component)')
    })
  })

  describe('edge cases', () => {
    it('should handle presenter functions that return empty objects', () => {
      function presenter() {
        return {}
      }

      function TestComponent() {
        return <div>Empty presenter</div>
      }

      const WrappedComponent = withPresenter(TestComponent, presenter)

      render(<WrappedComponent />)

      expect(screen.getByText('Empty presenter')).toBeInTheDocument()
    })

    it('should handle presenter functions with undefined props', () => {
      function presenter() {
        return { message: 'No props' }
      }

      function TestComponent(presenterResult: { message: string }) {
        return <div>{presenterResult.message}</div>
      }

      const WrappedComponent = withPresenter(
        TestComponent as React.FC<{ message: string }>,
        presenter
      )

      render(<WrappedComponent />)

      expect(screen.getByText('No props')).toBeInTheDocument()
    })
  })

  describe('TypeScript type safety', () => {
    it('should enforce presenter return type matches component props', () => {
      // This test validates TypeScript compilation - if types don't match, it won't compile

      interface PresenterProps {
        input: string
      }

      interface PresenterReturn {
        output: string
        count: number
      }

      function presenter(props: PresenterProps): PresenterReturn {
        return {
          output: props.input.toUpperCase(),
          count: props.input.length
        }
      }

      function TestComponent(presenterResult: PresenterReturn) {
        return (
          <div>
            <span>{presenterResult.output}</span>
            <span>{presenterResult.count}</span>
          </div>
        )
      }

      const WrappedComponent = withPresenter(TestComponent as React.FC<PresenterReturn>, presenter)

      render(<WrappedComponent input="hello" />)

      expect(screen.getByText('HELLO')).toBeInTheDocument()
      expect(screen.getByText('5')).toBeInTheDocument()
    })
  })
})
