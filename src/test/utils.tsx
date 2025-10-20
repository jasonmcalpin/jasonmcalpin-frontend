import React, { type ReactElement } from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { store } from '@/store'

// Custom render function with providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </Provider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }

// Custom hook for creating a test store
export const createTestStore = () => {
  // You can customize this to create a fresh store for each test
  return store
}

// Mock data generators
export const mockByteData = (overrides = {}) => ({
  id: '1',
  title: 'Test Byte',
  slug: 'test-byte',
  excerpt: 'This is a test byte excerpt',
  date: '2025-01-01',
  imageUrl: '/test-image.jpg',
  author: 'Test Author',
  tags: ['Test', 'TypeScript'],
  readingTime: 5,
  content: '# Test Content\n\nThis is test markdown content.',
  ...overrides,
})

export const mockProjectData = (overrides = {}) => ({
  id: '1',
  slug: 'test-project',
  title: 'Test Project',
  description: 'This is a test project',
  imageUrl: '/test-project.jpg',
  technologies: ['React', 'TypeScript'],
  liveUrl: 'https://test.com',
  githubUrl: 'https://github.com/test/project',
  featured: false,
  ...overrides,
})

// Helper for async testing
export const waitFor = (callback: () => void, timeout = 1000) => {
  return new Promise<void>((resolve, reject) => {
    const startTime = Date.now()
    const check = () => {
      try {
        callback()
        resolve()
      } catch (error) {
        if (Date.now() - startTime >= timeout) {
          reject(error)
        } else {
          setTimeout(check, 10)
        }
      }
    }
    check()
  })
}

// Mock intersection observer entry
export const createMockIntersectionObserverEntry = (isIntersecting = true) => ({
  isIntersecting,
  intersectionRatio: isIntersecting ? 1 : 0,
  target: document.createElement('div'),
  boundingClientRect: {
    bottom: 100,
    height: 100,
    left: 0,
    right: 100,
    top: 0,
    width: 100,
    x: 0,
    y: 0,
    toJSON: () => {},
  } as DOMRectReadOnly,
  intersectionRect: {
    bottom: 100,
    height: 100,
    left: 0,
    right: 100,
    top: 0,
    width: 100,
    x: 0,
    y: 0,
    toJSON: () => {},
  } as DOMRectReadOnly,
  rootBounds: {
    bottom: 1000,
    height: 1000,
    left: 0,
    right: 1000,
    top: 0,
    width: 1000,
    x: 0,
    y: 0,
    toJSON: () => {},
  } as DOMRectReadOnly,
  time: Date.now(),
})
