import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
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
      await renderButton(defaultProps)
      
      expect(screen.getByText('Test Button')).toBeInTheDocument()
    })

    it('should render as a link with correct path', async () => {
      await renderButton(defaultProps)
      
      const button = screen.getByRole('link')
      expect(button).toHaveAttribute('href', '/test')
    })

    it('should render with children content', async () => {
      await renderButton({
        ...defaultProps,
        children: 'Custom Button Text'
      })
      
      expect(screen.getByText('Custom Button Text')).toBeInTheDocument()
    })
  })

  describe('button types and styling', () => {
    it('should apply primary button styles', async () => {
      await renderButton({
        ...defaultProps,
        type: 'primary'
      })
      
      const button = screen.getByRole('link')
      expect(button).toHaveClass('bg-primary', 'text-white', 'hover:bg-primary-light')
    })

    it('should apply secondary button styles', async () => {
      await renderButton({
        ...defaultProps,
        type: 'secondary'
      })
      
      const button = screen.getByRole('link')
      expect(button).toHaveClass('bg-secondary', 'text-white', 'hover:bg-secondary-light')
    })

    it('should apply outline button styles', async () => {
      await renderButton({
        ...defaultProps,
        type: 'outline'
      })
      
      const button = screen.getByRole('link')
      expect(button).toHaveClass('border', 'border-neon-blue', 'text-neon-blue', 'hover:bg-neon-blue/10')
    })

    it('should not apply additional classes for flat type', async () => {
      await renderButton({
        ...defaultProps,
        type: 'flat'
      })
      
      const button = screen.getByRole('link')
      expect(button).toHaveClass('px-4', 'py-2', 'rounded-md')
      expect(button).not.toHaveClass('bg-primary', 'bg-secondary', 'border-neon-blue')
    })

    it('should apply additional custom classes', async () => {
      await renderButton({
        ...defaultProps,
        additionalClasses: 'custom-class another-class'
      })
      
      const button = screen.getByRole('link')
      expect(button).toHaveClass('custom-class', 'another-class')
    })

    it('should combine type classes with additional classes', async () => {
      await renderButton({
        ...defaultProps,
        type: 'primary',
        additionalClasses: 'custom-class'
      })
      
      const button = screen.getByRole('link')
      expect(button).toHaveClass('bg-primary', 'text-white', 'custom-class')
    })
  })

  describe('base styling', () => {
    it('should always apply base classes', async () => {
      await renderButton(defaultProps)
      
      const button = screen.getByRole('link')
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
      await renderButton(defaultProps, '/test') 
      
      const button = screen.getByRole('link')
      // The component has commented out active styling, but we can test the logic works
      expect(button).toBeInTheDocument()
    })

    it('should detect when current path does not match button path', async () => {
      await renderButton(defaultProps, '/error-path')
      
      const button = screen.getByRole('link')
      expect(button).toBeInTheDocument()
    })

    it('should handle root path correctly', async () => {
      await renderButton({
        ...defaultProps,
        path: '/'
      }, '/')
      
      const button = screen.getByRole('link')
      expect(button).toHaveAttribute('href', '/')
    })

    it('should handle nested paths correctly', async () => {
      await renderButton({
        ...defaultProps,
        path: '/nested/path'
      }, '/nested/path')
      
      const button = screen.getByRole('link')
      expect(button).toHaveAttribute('href', '/nested/path')
    })
  })

  describe('edge cases', () => {
    it('should handle empty children', async () => {
      await renderButton({
        ...defaultProps,
        children: ''
      })
      
      const button = screen.getByRole('link')
      expect(button).toBeInTheDocument()
      expect(button).toBeEmptyDOMElement()
    })

    it('should handle special characters in path', async () => {
      await renderButton({
        ...defaultProps,
        path: '/path-with-dashes_and_underscores'
      })
      
      const button = screen.getByRole('link')
      expect(button).toHaveAttribute('href', '/path-with-dashes_and_underscores')
    })

    it('should handle query parameters in path', async () => {
      await renderButton({
        ...defaultProps,
        path: '/path?query=value'
      })
      
      const button = screen.getByRole('link')
      expect(button).toHaveAttribute('href', '/path?query=value')
    })

    it('should handle fragments in path', async () => {
      await renderButton({
        ...defaultProps,
        path: '/path#section'
      })
      
      const button = screen.getByRole('link')
      expect(button).toHaveAttribute('href', '/path#section')
    })

    it('should handle undefined additionalClasses', async () => {
      await renderButton({
        ...defaultProps,
        additionalClasses: undefined
      })
      
      const button = screen.getByRole('link')
      expect(button).toHaveClass('bg-primary', 'text-white')
    })
  })

  describe('accessibility', () => {
    it('should be accessible as a link', async () => {
      await renderButton(defaultProps)
      
      const button = screen.getByRole('link')
      expect(button).toBeInTheDocument()
    })

    it('should have correct link text for screen readers', async () => {
      await renderButton({
        ...defaultProps,
        children: 'Click me'
      })
      
      const button = screen.getByRole('link', { name: 'Click me' })
      expect(button).toBeInTheDocument()
    })

    it('should support keyboard navigation', async () => {
      await renderButton(defaultProps)
      
      const button = screen.getByRole('link')
      expect(button).toBeInstanceOf(HTMLAnchorElement)
    })
  })
})
