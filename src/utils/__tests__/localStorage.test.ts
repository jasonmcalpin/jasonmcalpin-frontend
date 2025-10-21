import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
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
    // Default to having consent before each test
    mockConsent.mockReturnValue(true)
  })

  afterEach(() => {
    // Restore all mocks and clear localStorage after each test
    vi.restoreAllMocks()
    localStorage.clear()
  })

  describe('saveToLocalStorage', () => {
    it('should save data to localStorage when user has consent', () => {
      const setItemSpy = vi.spyOn(localStorage, 'setItem')
      const testData = { name: 'John', age: 30 }
      
      saveToLocalStorage('user', testData)
      
      expect(setItemSpy).toHaveBeenCalledWith('user', JSON.stringify(testData))
    })

    it('should not save data when user lacks consent', () => {
      mockConsent.mockReturnValue(false)
      const setItemSpy = vi.spyOn(localStorage, 'setItem')
      const testData = { name: 'John', age: 30 }
      
      saveToLocalStorage('user', testData)
      
      expect(setItemSpy).not.toHaveBeenCalled()
    })

    it('should save cookieconsent_status even without consent', () => {
      mockConsent.mockReturnValue(false)
      const setItemSpy = vi.spyOn(localStorage, 'setItem')
      
      saveToLocalStorage('cookieconsent_status', 'accepted')
      
      expect(setItemSpy).toHaveBeenCalledWith('cookieconsent_status', JSON.stringify('accepted'))
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
      const setItemSpy = vi.spyOn(localStorage, 'setItem')
      
      // Test string
      saveToLocalStorage('string', 'hello')
      expect(setItemSpy).toHaveBeenCalledWith('string', JSON.stringify('hello'))
      
      // Test number
      saveToLocalStorage('number', 42)
      expect(setItemSpy).toHaveBeenCalledWith('number', JSON.stringify(42))
      
      // Test boolean
      saveToLocalStorage('boolean', true)
      expect(setItemSpy).toHaveBeenCalledWith('boolean', JSON.stringify(true))
      
      // Test array
      saveToLocalStorage('array', [1, 2, 3])
      expect(setItemSpy).toHaveBeenCalledWith('array', JSON.stringify([1, 2, 3]))
    })
  })

  describe('loadFromLocalStorage', () => {
    it('should load data from localStorage when user has consent', () => {
      const testData = { name: 'John', age: 30 }
      vi.spyOn(localStorage, 'getItem').mockReturnValue(JSON.stringify(testData))
      
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
      vi.spyOn(localStorage, 'getItem').mockReturnValue(JSON.stringify('accepted'))
      
      const result = loadFromLocalStorage('cookieconsent_status', 'denied')
      
      expect(result).toBe('accepted')
    })

    it('should return default value when key does not exist', () => {
      vi.spyOn(localStorage, 'getItem').mockReturnValue(null)
      const defaultValue = 'default'
      
      const result = loadFromLocalStorage('nonexistent', defaultValue)
      
      expect(result).toBe(defaultValue)
    })

    it('should handle JSON parsing errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      vi.spyOn(localStorage, 'getItem').mockReturnValue('invalid json{')
      const defaultValue = 'default'
      
      const result = loadFromLocalStorage('invalid', defaultValue)
      
      expect(result).toBe(defaultValue)
      expect(consoleSpy).toHaveBeenCalledWith('Error loading from localStorage:', expect.any(Error))
    })

    it('should handle different data types correctly', () => {
      const getItemSpy = vi.spyOn(localStorage, 'getItem')
      
      // Test string
      getItemSpy.mockReturnValueOnce(JSON.stringify('hello'))
      expect(loadFromLocalStorage('string', '')).toBe('hello')
      
      // Test number
      getItemSpy.mockReturnValueOnce(JSON.stringify(42))
      expect(loadFromLocalStorage('number', 0)).toBe(42)
      
      // Test boolean
      getItemSpy.mockReturnValueOnce(JSON.stringify(true))
      expect(loadFromLocalStorage('boolean', false)).toBe(true)
      
      // Test array
      getItemSpy.mockReturnValueOnce(JSON.stringify([1, 2, 3]))
      expect(loadFromLocalStorage('array', [])).toEqual([1, 2, 3])
    })
  })

  describe('removeFromLocalStorage', () => {
    it('should remove data from localStorage when user has consent', () => {
      const removeItemSpy = vi.spyOn(localStorage, 'removeItem')
      
      removeFromLocalStorage('user')
      
      expect(removeItemSpy).toHaveBeenCalledWith('user')
    })

    it('should not remove data when user lacks consent', () => {
      mockConsent.mockReturnValue(false)
      const removeItemSpy = vi.spyOn(localStorage, 'removeItem')
      
      removeFromLocalStorage('user')
      
      expect(removeItemSpy).not.toHaveBeenCalled()
    })

    it('should remove cookieconsent_status even without consent', () => {
      mockConsent.mockReturnValue(false)
      const removeItemSpy = vi.spyOn(localStorage, 'removeItem')
      
      removeFromLocalStorage('cookieconsent_status')
      
      expect(removeItemSpy).toHaveBeenCalledWith('cookieconsent_status')
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
      const clearSpy = vi.spyOn(localStorage, 'clear')
      
      clearLocalStorage()
      
      expect(clearSpy).toHaveBeenCalled()
    })

    it('should not clear localStorage when user lacks consent', () => {
      mockConsent.mockReturnValue(false)
      const clearSpy = vi.spyOn(localStorage, 'clear')
      
      clearLocalStorage()
      
      expect(clearSpy).not.toHaveBeenCalled()
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
