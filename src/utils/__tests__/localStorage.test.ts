import { describe, it, expect, vi, beforeEach } from 'vitest'
import { 
  saveToLocalStorage, 
  loadFromLocalStorage, 
  removeFromLocalStorage, 
  clearLocalStorage 
} from '../localStorage'
import * as consentManager from '../consentManager'

// Mock the consent manager
vi.mock('../consentManager', () => ({
  hasUserConsent: vi.fn()
}))

describe('localStorage utilities', () => {
  const mockConsent = vi.mocked(consentManager.hasUserConsent)
  
  beforeEach(() => {
    // Clear all mocks and localStorage before each test
    vi.clearAllMocks()
    localStorage.clear()
    
    // Default to having consent
    mockConsent.mockReturnValue(true)
  })

  describe('saveToLocalStorage', () => {
    it('should save data to localStorage when user has consent', () => {
      mockConsent.mockReturnValue(true)
      const testData = { name: 'John', age: 30 }
      
      saveToLocalStorage('user', testData)
      
      expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(testData))
    })

    it('should not save data when user lacks consent', () => {
      mockConsent.mockReturnValue(false)
      const testData = { name: 'John', age: 30 }
      
      saveToLocalStorage('user', testData)
      
      expect(localStorage.setItem).not.toHaveBeenCalled()
    })

    it('should save cookieconsent_status even without consent', () => {
      mockConsent.mockReturnValue(false)
      
      saveToLocalStorage('cookieconsent_status', 'accepted')
      
      expect(localStorage.setItem).toHaveBeenCalledWith('cookieconsent_status', JSON.stringify('accepted'))
    })

    it('should handle localStorage errors gracefully', () => {
      mockConsent.mockReturnValue(true)
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const mockSetItem = vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
        throw new Error('Storage quota exceeded')
      })
      
      saveToLocalStorage('test', 'data')
      
      expect(consoleSpy).toHaveBeenCalledWith('Error saving to localStorage:', expect.any(Error))
      
      consoleSpy.mockRestore()
      mockSetItem.mockRestore()
    })

    it('should handle different data types', () => {
      mockConsent.mockReturnValue(true)
      
      // Test string
      saveToLocalStorage('string', 'hello')
      expect(localStorage.setItem).toHaveBeenCalledWith('string', '"hello"')
      
      // Test number
      saveToLocalStorage('number', 42)
      expect(localStorage.setItem).toHaveBeenCalledWith('number', '42')
      
      // Test boolean
      saveToLocalStorage('boolean', true)
      expect(localStorage.setItem).toHaveBeenCalledWith('boolean', 'true')
      
      // Test array
      saveToLocalStorage('array', [1, 2, 3])
      expect(localStorage.setItem).toHaveBeenCalledWith('array', '[1,2,3]')
    })
  })

  describe('loadFromLocalStorage', () => {
    it('should load data from localStorage when user has consent', () => {
      mockConsent.mockReturnValue(true)
      const testData = { name: 'John', age: 30 }
      localStorage.setItem('user', JSON.stringify(testData))
      
      const result = loadFromLocalStorage('user', {})
      
      expect(result).toEqual(testData)
    })

    it('should return default value when user lacks consent', () => {
      mockConsent.mockReturnValue(false)
      localStorage.setItem('user', JSON.stringify({ name: 'John' }))
      const defaultValue = { name: 'Default' }
      
      const result = loadFromLocalStorage('user', defaultValue)
      
      expect(result).toEqual(defaultValue)
    })

    it('should load cookieconsent_status even without consent', () => {
      mockConsent.mockReturnValue(false)
      localStorage.setItem('cookieconsent_status', JSON.stringify('accepted'))
      
      const result = loadFromLocalStorage('cookieconsent_status', 'denied')
      
      expect(result).toBe('accepted')
    })

    it('should return default value when key does not exist', () => {
      mockConsent.mockReturnValue(true)
      const defaultValue = 'default'
      
      const result = loadFromLocalStorage('nonexistent', defaultValue)
      
      expect(result).toBe(defaultValue)
    })

    it('should handle JSON parsing errors gracefully', () => {
      mockConsent.mockReturnValue(true)
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      localStorage.setItem('invalid', 'invalid json{')
      const defaultValue = 'default'
      
      const result = loadFromLocalStorage('invalid', defaultValue)
      
      expect(result).toBe(defaultValue)
      expect(consoleSpy).toHaveBeenCalledWith('Error loading from localStorage:', expect.any(Error))
      
      consoleSpy.mockRestore()
    })

    it('should handle different data types correctly', () => {
      mockConsent.mockReturnValue(true)
      
      // Test string
      localStorage.setItem('string', '"hello"')
      expect(loadFromLocalStorage('string', '')).toBe('hello')
      
      // Test number
      localStorage.setItem('number', '42')
      expect(loadFromLocalStorage('number', 0)).toBe(42)
      
      // Test boolean
      localStorage.setItem('boolean', 'true')
      expect(loadFromLocalStorage('boolean', false)).toBe(true)
      
      // Test array
      localStorage.setItem('array', '[1,2,3]')
      expect(loadFromLocalStorage('array', [])).toEqual([1, 2, 3])
    })
  })

  describe('removeFromLocalStorage', () => {
    it('should remove data from localStorage when user has consent', () => {
      mockConsent.mockReturnValue(true)
      
      removeFromLocalStorage('user')
      
      expect(localStorage.removeItem).toHaveBeenCalledWith('user')
    })

    it('should not remove data when user lacks consent', () => {
      mockConsent.mockReturnValue(false)
      
      removeFromLocalStorage('user')
      
      expect(localStorage.removeItem).not.toHaveBeenCalled()
    })

    it('should remove cookieconsent_status even without consent', () => {
      mockConsent.mockReturnValue(false)
      
      removeFromLocalStorage('cookieconsent_status')
      
      expect(localStorage.removeItem).toHaveBeenCalledWith('cookieconsent_status')
    })

    it('should handle localStorage errors gracefully', () => {
      mockConsent.mockReturnValue(true)
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const mockRemoveItem = vi.spyOn(localStorage, 'removeItem').mockImplementation(() => {
        throw new Error('Storage error')
      })
      
      removeFromLocalStorage('test')
      
      expect(consoleSpy).toHaveBeenCalledWith('Error removing from localStorage:', expect.any(Error))
      
      consoleSpy.mockRestore()
      mockRemoveItem.mockRestore()
    })
  })

  describe('clearLocalStorage', () => {
    it('should clear localStorage when user has consent', () => {
      mockConsent.mockReturnValue(true)
      
      clearLocalStorage()
      
      expect(localStorage.clear).toHaveBeenCalled()
    })

    it('should not clear localStorage when user lacks consent', () => {
      mockConsent.mockReturnValue(false)
      
      clearLocalStorage()
      
      expect(localStorage.clear).not.toHaveBeenCalled()
    })

    it('should handle localStorage errors gracefully', () => {
      mockConsent.mockReturnValue(true)
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const mockClear = vi.spyOn(localStorage, 'clear').mockImplementation(() => {
        throw new Error('Storage error')
      })
      
      clearLocalStorage()
      
      expect(consoleSpy).toHaveBeenCalledWith('Error clearing localStorage:', expect.any(Error))
      
      consoleSpy.mockRestore()
      mockClear.mockRestore()
    })
  })
})
