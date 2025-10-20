import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useScrollAnimation, fadeInUp, fadeIn, staggerContainer } from '../useScrollAnimation'
import { useAnimationControls } from 'framer-motion'
import { useInView } from 'react-intersection-observer'


vi.mock('framer-motion', () => ({
  useAnimationControls: vi.fn()
}))

vi.mock('react-intersection-observer', () => ({
  useInView: vi.fn()
}))

describe('useScrollAnimation', () => {
  const mockControls = {
    start: vi.fn(),
    stop: vi.fn(),
    set: vi.fn(),
    subscribe: vi.fn(),
    mount: vi.fn(),
  }
  
  const mockUseAnimationControls = vi.mocked(useAnimationControls)
  const mockUseInView = vi.mocked(useInView)
  
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    
    mockUseAnimationControls.mockReturnValue(mockControls)
    mockUseInView.mockReturnValue([
      vi.fn(),
      false,
      undefined 
    ] as any)
  })
  
  afterEach(() => {
    vi.useRealTimers()
  })

  describe('hook initialization', () => {
    it('should initialize with default options', () => {
      renderHook(() => useScrollAnimation())
      
      expect(mockUseInView).toHaveBeenCalledWith({
        threshold: 0.1,
        triggerOnce: true
      })
      expect(mockUseAnimationControls).toHaveBeenCalled()
    })

    it('should accept custom options', () => {
      const options = {
        threshold: 0.5,
        triggerOnce: false,
        delay: 500
      }
      
      renderHook(() => useScrollAnimation(options))
      
      expect(mockUseInView).toHaveBeenCalledWith({
        threshold: 0.5,
        triggerOnce: false
      })
    })

    it('should return ref and controls', () => {
      const { result } = renderHook(() => useScrollAnimation())
      
      const [ref, controls] = result.current
      
      expect(ref).toBeDefined()
      expect(controls).toBe(mockControls)
    })
  })

  describe('animation triggering', () => {
    it('should start animation when element comes into view', async () => {
      mockUseInView.mockReturnValue([
        vi.fn(),
        true, 
        undefined 
      ] as any)
      
      renderHook(() => useScrollAnimation())
      
      vi.runAllTimers()
      
      expect(mockControls.start).toHaveBeenCalledWith('visible')
    })

    it('should not start animation when element is not in view', () => {
      mockUseInView.mockReturnValue([
        vi.fn(),
        false,
        undefined 
      ] as any)
      
      renderHook(() => useScrollAnimation())
      
      vi.runAllTimers()
      
      expect(mockControls.start).not.toHaveBeenCalled()
    })

    it('should respect delay option', async () => {
      mockUseInView.mockReturnValue([
        vi.fn(),
        true, 
        undefined 
      ] as any)
      
      renderHook(() => useScrollAnimation({ delay: 1000 }))
      
      expect(mockControls.start).not.toHaveBeenCalled()
      
      vi.advanceTimersByTime(1000)
      
      expect(mockControls.start).toHaveBeenCalledWith('visible')
    })

    it('should clear timeout when component unmounts', () => {
      mockUseInView.mockReturnValue([
        vi.fn(),
        true, 
        undefined 
      ] as any)
      
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout')
      
      const { unmount } = renderHook(() => useScrollAnimation({ delay: 1000 }))
      
      unmount()
      
      expect(clearTimeoutSpy).toHaveBeenCalled()
    })

    it('should handle inView state changes', () => {
      let inViewValue = false
      mockUseInView.mockImplementation(() => [
        vi.fn(),
        inViewValue,
        undefined 
      ] as any)
      
      const { rerender } = renderHook(() => useScrollAnimation())
      
      vi.runAllTimers()
      expect(mockControls.start).not.toHaveBeenCalled()
      
      inViewValue = true
      rerender()
      vi.runAllTimers()
      
      expect(mockControls.start).toHaveBeenCalledWith('visible')
    })
  })

  describe('animation variants', () => {
    it('should export fadeInUp variant with correct properties', () => {
      expect(fadeInUp).toEqual({
        hidden: { opacity: 0, y: 60 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: {
            duration: 0.6,
            ease: [0.6, 0.05, -0.01, 0.9]
          }
        }
      })
    })

    it('should export fadeIn variant with correct properties', () => {
      expect(fadeIn).toEqual({
        hidden: { opacity: 0 },
        visible: { 
          opacity: 1,
          transition: {
            duration: 0.6
          }
        }
      })
    })

    it('should export staggerContainer variant with correct properties', () => {
      expect(staggerContainer).toEqual({
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      })
    })
  })

  describe('edge cases', () => {
    it('should handle multiple quick inView changes', () => {
      mockUseInView.mockReturnValue([
        vi.fn(),
        true,
        undefined 
      ] as any)
      
      const { rerender } = renderHook(() => useScrollAnimation({ delay: 100 }))
      
      rerender()
      rerender()
      rerender()
      
      vi.runAllTimers()
      expect(mockControls.start).toHaveBeenCalledTimes(1)
    })

    it('should work with zero delay', () => {
      mockUseInView.mockReturnValue([
        vi.fn(),
        true,
        undefined 
      ] as any)
      
      renderHook(() => useScrollAnimation({ delay: 0 }))
      
      vi.runAllTimers()
      
      expect(mockControls.start).toHaveBeenCalledWith('visible')
    })

    it('should handle undefined options', () => {
      renderHook(() => useScrollAnimation(undefined))
      
      expect(mockUseInView).toHaveBeenCalledWith({
        threshold: 0.1,
        triggerOnce: true
      })
    })
  })
})
