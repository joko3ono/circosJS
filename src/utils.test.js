import { smartBorders, computeMinMax, buildScale } from './utils';

describe('utils', () => {
  describe('smartBorders', () => {
    const cases = [
      {
        trackEdges: [[10, 20], [31, 40]],
        layout: [41, 50],
        trackWidth: 10,
        expected: { in: 50, out: 60 }
      },
      {
        trackEdges: [[undefined, undefined], [31, 40]],
        layout: [20, 25],
        trackWidth: 15,
        expected: { in: 40, out: 55 }
      }
    ];

    cases.forEach((dataset) => {
      test('should return the expected borders', () => {
        const conf = { defaultTrackWidth: dataset.trackWidth };
        const layout = {
          conf: {
            innerRadius: dataset.layout[0],
            outerRadius: dataset.layout[1]
          }
        };
        const tracks = dataset.trackEdges.map((track) => {
          return {
            conf: {
              innerRadius: track[0],
              outerRadius: track[1]
            }
          };
        });
        expect(smartBorders(conf, layout, tracks)).toEqual(dataset.expected);
      });
    });
  });

  describe('computeMinMax', () => {
    [
      {
        conf: { min: 3, max: 10 },
        meta: { min: 1, max: 13 },
        expected: { cmin: 3, cmax: 10 }
      },
      {
        conf: { min: null, max: null },
        meta: { min: 1, max: 13 },
        expected: { cmin: 1, cmax: 13 }
      }
    ].forEach((dataset) => {
      test('should handle the null value in conf', () => {
        const conf = computeMinMax(dataset.conf, dataset.meta);
        Object.keys(dataset.expected).forEach((key) => {
          expect(conf[key]).toBe(dataset.expected[key]);
        });
      });
    });
  });

  describe('buildScale', () => {
    [
      {
        value: 0,
        domain: [0, 0],
        height: 0,
        logScale: false,
        expected: 0
      },
      {
        value: 5,
        domain: [0, 0],
        height: 0,
        logScale: false,
        expected: 0
      },
      {
        value: 5,
        domain: [0, 10],
        height: 0,
        logScale: false,
        expected: 0
      },
      {
        value: 5,
        domain: [0, 10],
        height: 10,
        logScale: false,
        expected: 5
      },
      {
        value: 5,
        domain: [0, 10],
        height: 2,
        logScale: false,
        expected: 1
      },
      {
        value: 2,
        domain: [0, 8],
        height: 4,
        logScale: false,
        expected: 1
      },
      {
        value: 10,
        domain: [0, 8],
        height: 4,
        logScale: false,
        expected: 4
      },
      {
        value: 2,
        domain: [0, 8],
        height: 4,
        logScale: true,
        expected: 1,
        warn: true
      },
      {
        value: Math.exp(6),
        domain: [Math.exp(0), Math.exp(8)],
        height: 4,
        logScale: true,
        expected: 3
      },
      {
        value: 1000,
        domain: [1, 10000],
        height: 4,
        logScale: true,
        logScaleBase: 10,
        expected: 3
      }
    ].forEach((d) => {
      test('should build a well designed scale', () => {
        const result = buildScale(
          d.domain[0],
          d.domain[1],
          d.height,
          d.logScale,
          d.logScaleBase
        )(d.value);
        expect(Math.round(result * 100)).toBe(d.expected * 100);
      });
    });
  });
});
