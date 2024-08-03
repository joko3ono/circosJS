import { describe, it, beforeEach } from '@jest/globals';
import { jest } from '@jest/globals';
import { _buildAxesData } from './axes';
import { select, selectAll } from 'd3-selection';
import Circos from './circos';
import { JSDOM } from 'jsdom'
import forEach from 'lodash/forEach';

describe('Axes', () => {
  describe('_buildAxesData', () => {
    it('should log a warning if no position and spacing are defined', () => {
      console.warn = jest.fn();
      const axes = _buildAxesData({
        axes: [{ color: 'red' }]
      });
      expect(console.warn).toHaveBeenCalledTimes(1);
      expect(axes.length).toBe(0);
    });

    it('should return the axe group if position attribute is defined', () => {
      const axes = _buildAxesData({
        axes: [
          {
            position: 12
          }
        ],
        opacity: 1
      });
      expect(axes.length).toBe(1);
      expect(axes[0].value).toBe(12);
      expect(axes[0].opacity).toBe(1);
      expect(axes[0].color).toBe('#d3d3d3');
      expect(axes[0].thickness).toBe(1);
    });

    forEach([
      {
        spacing: 2,
        min: 10,
        max: 20,
        expected: [10, 12, 14, 16, 18]
      },
      {
        spacing: 2,
        start: 14,
        min: 10,
        max: 20,
        expected: [14, 16, 18]
      },
      {
        spacing: 2,
        end: 14,
        min: 10,
        max: 20,
        expected: [10, 12]
      }
    ], (dataset) => {
      it('should return a range of axes according to spacing, start and end attributes', () => {
        const axes = _buildAxesData({
          axes: [
            {
              spacing: dataset.spacing,
              start: dataset.start,
              end: dataset.end
            }
          ],
          cmin: dataset.min,
          cmax: dataset.max
        });
        expect(axes.length).toBe(dataset.expected.length);
        forEach(axes, (axis, i) => {
          expect(axis.value).toBe(dataset.expected[i]);
        });
      });
    });

    it('should use axe group color, opacity and thickness if defined', () => {
      const axes = _buildAxesData({
        axes: [
          {
            position: 12,
            opacity: 0.5,
            color: 'red',
            thickness: 3
          }
        ],
        opacity: 1
      });
      expect(axes.length).toBe(1);
      expect(axes[0].value).toBe(12);
      expect(axes[0].opacity).toBe(0.5);
      expect(axes[0].color).toBe('red');
      expect(axes[0].thickness).toBe(3);
    });

    it('should create range axes and simple axis', () => {
      const axes = _buildAxesData({
        axes: [
          {
            position: 12
          },
          {
            spacing: 2
          }
        ],
        opacity: 1,
        cmin: 10,
        cmax: 20
      });
      expect(axes.length).toBe(6);
    });
  });

  describe('renderAxes', function () {
    const configuration = {
      min: 10,
      max: 20,
      axes: [
        {
          position: 2,
          opacity: 0.5,
          thickness: 2,
          color: 'grey'
        }
      ]
    };
    beforeEach(function () {
      const { window } = new JSDOM('<!doctype html><html><body></body></html>');
      global.document = window.document;
      global.window = window;

      document.body.innerHTML = '<div id="chart"></div>';
      this.instance = new Circos({ container: '#chart', width: 350, height: 350 })
        .layout([{ id: 'january', len: 31 }, { id: 'february', len: 28 }]);
    });

    forEach([
      {
        track: 'line',
        data: [
          { block_id: 'january', position: 1, value: 1 },
          { block_id: 'february', position: 2, value: 4 }
        ]
      },
      {
        track: 'scatter',
        data: [
          { block_id: 'january', position: 1, value: 1 },
          { block_id: 'february', position: 2, value: 4 }
        ]
      },
      {
        track: 'histogram',
        data: [
          { block_id: 'january', start: 1, end: 2, value: 1 },
          { block_id: 'february', start: 1, end: 2, value: 4 }
        ]
      }
    ], (dataset) => {
      it(`should render the axes for track ${dataset.track}`, function () {
        this.instance[dataset.track]('track1', dataset.data, configuration).render();
        const axes = selectAll('.axis');
        expect(axes.size()).toBe(2);
        forEach(axes.nodes(), (axisNode, i) => {
          const axis = select(axisNode);
          expect(axis.attr('stroke')).toBe('grey');
          expect(axis.attr('stroke-width')).toBe('2');
          expect(axis.attr('opacity')).toBe('0.5');
        });
      });
    });
  });
});
