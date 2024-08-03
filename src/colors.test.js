import { buildColorValue } from './colors'
import forEach from 'lodash/forEach'

describe('colors', () => {
  describe('buildColorValue', () => {
    const greens0to10 = {
      0: 'rgb(247, 252, 245)',
      5: 'rgb(115, 195, 120)',
      10: 'rgb(0, 68, 27)',
      11: 'rgb(0, 68, 27)'
    }

    test('should return the color code if it\'s not a palette', () => {
      expect(buildColorValue('red')).toBe('red')
      expect(buildColorValue('#d3d3d3')).toBe('#d3d3d3')
    })

    test('should return the input if input is a function', () => {
      const colorValue = (d) => '#d3d3d3'
      expect(buildColorValue(colorValue)).toBe(colorValue)
    })

    test('should return the expected scale if input is a palette', () => {
      const colorValue = buildColorValue('Greens', 0, 10)
      expect(colorValue).toBeInstanceOf(Function)
      forEach(greens0to10, (value, key) => {
        expect(colorValue({ value: key })).toBe(value)
      })
    })

    test('should reverse the palette if palette is prefixed by "-"', () => {
      const colorValue = buildColorValue('-Greens', 0, 10)
      expect(colorValue).toBeInstanceOf(Function)
      forEach(greens0to10, (value, key) => {
        expect(colorValue({ value: 10 - key })).toBe(value)
      })
    })
  })
})
