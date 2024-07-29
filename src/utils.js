import sortBy from 'lodash-es/sortBy.js'
import flow from 'lodash-es/flow.js'
import concat from 'lodash-es/concat.js'
import filter from 'lodash-es/filter.js'
import first from 'lodash-es/first.js'
import reverse from 'lodash-es/reverse.js'
import {scaleLog, scaleLinear} from 'd3-scale'

export function smartBorders (conf, layout, tracks) {
  const width = conf.defaultTrackWidth || 30

  const externalTrack = flow(
    filter('conf.outerRadius'),
    sortBy('conf.outerRadius'),
    reverse,
    first
  )(concat(tracks, layout))

  return ({
    in: externalTrack.conf.outerRadius,
    out: externalTrack.conf.outerRadius + width
  })
}

export function computeMinMax (conf, meta) {
  conf.cmin = conf.min === null ? meta.min : conf.min
  conf.cmax = conf.max === null ? meta.max : conf.max
  return conf
}

export function buildScale (
  min, max, height, logScale = false, logScaleBase = Math.E
) {
  if (logScale && min * max <= 0) {
    console.warn(`As log(0) = -∞, a log scale domain must be
      strictly-positive or strictly-negative. logscale ignored`
    )
  }
  const scale = (logScale && min * max > 0)
    ? scaleLog().base(logScaleBase) : scaleLinear()

  return scale
    .domain([min, max])
    .range([0, height])
    .clamp(true)
}
