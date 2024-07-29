import defaultsDeep from 'lodash-es/defaultsDeep.js';
import forEach from 'lodash-es/forEach.js';
import isArray from 'lodash-es/isArray.js';
import map from 'lodash-es/map.js';
import {selection as select} from 'd3';
import Layout from './layout/index.js'
import render from './render.js'
import Text from './tracks/Text.js'
import Highlight from './tracks/Highlight.js'
import Histogram from './tracks/Histogram.js'
import Chords from './tracks/Chords.js'
import Heatmap from './tracks/Heatmap.js'
import Line from './tracks/Line.js'
import Scatter from './tracks/Scatter.js'
import Stack from './tracks/Stack.js'
import {initClipboard} from './clipboard.js'

const defaultConf = {
  width: 700,
  height: 700,
  container: 'circos',
  defaultTrackWidth: 10
}

class Core {
  constructor (conf) {
    this.tracks = {}
    this._layout = null
    this.conf = defaultsDeep(conf, defaultConf)
    const container = select(this.conf.container).append('div')
      .style('position', 'relative')
    this.svg = container.append('svg')
    if (select('body').select('.circos-tooltip').empty()) {
      this.tip = select('body').append('div')
      .attr('class', 'circos-tooltip')
      .style('opacity', 0)
    } else {
      this.tip = select('body').select('.circos-tooltip')
    }

    this.clipboard = initClipboard(this.conf.container)
  }

  removeTracks (trackIds) {
    if (typeof (trackIds) === 'undefined') {
      map(this.tracks, (track, id) => {
        this.svg.select('.' + id).remove()
      })
      this.tracks = {}
    } else if (typeof (trackIds) === 'string') {
      this.svg.select('.' + trackIds).remove()
      delete this.tracks[trackIds]
    } else if (isArray(trackIds)) {
      forEach(trackIds, function (trackId) {
        this.svg.select('.' + trackId).remove()
        delete this.tracks[trackId]
      })
    } else {
      console.warn('removeTracks received an unhandled attribute type')
    }

    return this
  }

  layout (data, conf) {
    this._layout = new Layout(conf, data)
    return this
  }

  chords (id, data, conf) {
    this.tracks[id] = new Chords(this, conf, data)
    return this
  }
  heatmap (id, data, conf) {
    this.tracks[id] = new Heatmap(this, conf, data)
    return this
  }
  highlight (id, data, conf) {
    this.tracks[id] = new Highlight(this, conf, data)
    return this
  }
  histogram (id, data, conf) {
    this.tracks[id] = new Histogram(this, conf, data)
    return this
  }
  line (id, data, conf) {
    this.tracks[id] = new Line(this, conf, data)
    return this
  }
  scatter (id, data, conf) {
    this.tracks[id] = new Scatter(this, conf, data)
    return this
  }
  stack (id, data, conf) {
    this.tracks[id] = new Stack(this, conf, data)
    return this
  }
  text (id, data, conf) {
    this.tracks[id] = new Text(this, conf, data)
    return this
  }
  render (ids, removeTracks) {
    render(ids, removeTracks, this)
  }
}

export default Core
