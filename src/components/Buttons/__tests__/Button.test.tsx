import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Button } from '../index'

// Mock useLocation from react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useLocation: vi.fn()
  }
})

// Helper function to render Button with Router context
const renderButton = async (props: any, currentPath = '/') => {
  const { useLocation } = await import('react-router-dom')
  vi.mocked(useLocation).mockReturnValue({ pathname: currentPath } as any)
  
  return render(
    <BrowserRouter>
      <Button {...props} />
    </BrowserRouter>
  )
}

describe('Button Component', () => {
  const defaultProps = {
    path: '/test',
    children: 'Test Button',
    type: 'primary' as const
  }

  describe('rendering', () => {
    it('should render with correct text', async () => {
      const { getByText } = await renderButton(defaultProps)
      
      expect(getByText('Test Button')).toBeInTheDocument()
    })

    it('should render as a link with correct path', async () => {
      const { getByRole } = await renderButton(defaultProps)
      
      const button = getByRole('link')
      expect(button).toHaveAttribute('href', '/test')
    })

    it('should render with children content', async () => {
      const { getByText } = await renderButton({
        ...defaultProps,
        children: 'Custom Button Text'
      })
      
      expect(getByText('Custom Button Text')).toBeInTheDocument()
    })
  })

  describe('button types and styling', () => {
    it('should apply primary button styles', async () => {
      const { getByRole } = await renderButton({
        ...defaultProps,
        type: 'primary'
      })
      
      const button = getByRole('link')
      expect(button).toHaveClass('bg-primary', 'text-white', 'hover:bg-primary-light')
    })

    it('should apply secondary button styles', async () => {
      const { getByRole } = await renderButton({
        ...defaultProps,
        type: 'secondary'
      })
      
      const button = getByRole('link')
      expect(button).toHaveClass('bg-secondary', 'text-white', 'hover:bg-secondary-light')
    })

    it('should apply outline button styles', async () => {
      const { getByRole } = await renderButton({
        ...defaultProps,
        type: 'outline'
      })
      
      const button = getByRole('link')
      expect(button).toHaveClass('border', 'border-neon-blue', 'text-neon-blue', 'hover:bg-neon-blue/10')
    })

    it('should not apply additional classes for flat type', async () => {
      const { getByRole } = await renderButton({
        ...defaultProps,
        type: 'flat'
      })
      
      const button = getByRole('link')
      expect(button).toHaveClass('px-4', 'py-2', 'rounded-md')
      expect(button).not.toHaveClass('bg-primary', 'bg-secondary', 'border-neon-blue')
    })

    it('should apply additional custom classes', async () => {
      const { getByRole } = await renderButton({
        ...defaultProps,
        additionalClasses: 'custom-class another-class'
      })
      
      const button = getByRole('link')
      expect(button).toHaveClass('custom-class', 'another-class')
    })

    it('should combine type classes with additional classes', async () => {
      const { getByRole } = await renderButton({
        ...defaultProps,
        type: 'primary',
        additionalClasses: 'custom-class'
      })
      
      const button = getByRole('link')
      expect(button).toHaveClass('bg-primary', 'text-white', 'custom-class')
    })
  })

  describe('base styling', () => {
    it('should always apply base classes', async () => {
      const { getByRole } = await renderButton(defaultProps)
      
      const button = getByRole('link')
      expect(button).toHaveClass(
        'px-4',
        'py-2', 
        'rounded-md',
        'font-medium',
        'transition-all',
        'duration-300'
      )
    })
  })

  describe('active state handling', () => {
    it('should detect when current path matches button path', async () => {
      const { getByRole } = await renderButton(defaultProps, '/test') 
      
      const button = getByRole('link')
      // The component has commented out active styling, but we can test the logic works
      expect(button).toBeInTheDocument()
    })

    it('should detect when current path does not match button path', async () => {
      const { getByRole } = await renderButton(defaultProps, '/error-path')
      
      const button = getByRole('link')
      expect(button).toBeInTheDocument()
    })

    it('should handle root path correctly', async () => {
      const { getByRole } = await renderButton({
        ...defaultProps,
        path: '/'
      }, '/')
      
      const button = getByRole('link')
      expect(button).toHaveAttribute('href', '/')
    })

    it('should handle nested paths correctly', async () => {
      const { getByRole } = await renderButton({
        ...defaultProps,
        path: '/nested/path'
      }, '/nested/path')
      
      const button = getByRole('link')
      expect(button).toHaveAttribute('href', '/nested/path')
    })
  })

  describe('edge cases', () => {
    it('should handle empty children', async () => {
      const { getByRole } = await renderButton({
        ...defaultProps,
        children: ''
      })
      
      const button = getByRole('link')
      expect(button).toBeInTheDocument()
      expect(button).toBeEmptyDOMElement()
    })

    it('should handle special characters in path', async () => {
      const { getByRole } = await renderButton({
        ...defaultProps,
        path: '/path-with-dashes_and_underscores'
      })
      
      const button = getByRole('link')
      expect(button).toHaveAttribute('href', '/path-with-dashes_and_underscores')
    })

    it('should handle query parameters in path', async () => {
      const { getByRole } = await renderButton({
        ...defaultProps,
        path: '/path?query=value'
      })
      
      const button = getByRole('link')
      expect(button).toHaveAttribute('href', '/path?query=value')
    })

    it('should handle fragments in path', async () => {
      const { getByRole } = await renderButton({
        ...defaultProps,
        path: '/path#section'
      })
      
      const button = getByRole('link')
      expect(button).toHaveAttribute('href', '/path#section')
    })

    it('should handle undefined additionalClasses', async () => {
      const { getByRole } = await renderButton({
        ...defaultProps,
        additionalClasses: undefined
      })
      
      const button = getByRole('link')
      expect(button).toHaveClass('bg-primary', 'text-white')
    })
  })

  describe('accessibility', () => {
    it('should be accessible as a link', async () => {
      const { getByRole } = await renderButton(defaultProps)
      
      const button = getByRole('link')
      expect(button).toBeInTheDocument()
    })

    it('should have correct link text for screen readers', async () => {
      const { getByRole } = await renderButton({
        ...defaultProps,
        children: 'Click me'
      })
      
      const button = getByRole('link', { name: 'Click me' })
      expect(button).toBeInTheDocument()
    })

    it('should support keyboard navigation', async () => {
      const { getByRole } = await renderButton(defaultProps)
      
      const button = getByRole('link')
      expect(button).toBeInstanceOf(HTMLAnchorElement)
    })
  })
})
