var gieStainColor = {
  gpos100: 'rgb(0,0,0)',
  gpos: 'rgb(0,0,0)',
  gpos75: 'rgb(130,130,130)',
  gpos66: 'rgb(160,160,160)',
  gpos50: 'rgb(200,200,200)',
  gpos33: 'rgb(210,210,210)',
  gpos25: 'rgb(200,200,200)',
  gvar: 'rgb(220,220,220)',
  gneg: 'rgb(255,255,255)',
  acen: 'rgb(217,47,39)',
  stalk: 'rgb(100,127,164)',
  select: 'rgb(135,177,255)'
}

var buildData = function (rawData1, rawData2, karyotype) {
  var binLength = 10000000
  var data = []
  var rawDataByChr1 = d3.group(rawData1, d => { return d.chr});
  var rawDataByChr2 = d3.group(rawData2, d => d['chr']);
  karyotype.forEach(function (chr) {
    var raw1 = rawDataByChr1.get(chr.id)
    var raw2 = rawDataByChr2.get(chr.id)
    d3.range(0, chr.len, binLength).forEach(function (position) {
      var counter = 0
      raw1.forEach(function (datum) {
        var start = parseInt(datum.start)
        var end = parseInt(datum.end)
        if ((start < position && end > position) || (start > position && start < position + binLength)) {
          counter++
        }
      })
      raw2.forEach(function (datum) {
        var start = parseInt(datum.start)
        var end = parseInt(datum.end)
        if ((start < position && end > position) || (start > position && start < position + binLength)) {
          counter++
        }
      })
      data.push({
        block_id: chr.id,
        start: position,
        end: Math.min(position + binLength - 1, chr.len),
        value: counter
      })
    })
  })
  return data
}

var drawHistogram = function (error, GRCh37, cytobands, es, ips) {
  var width = document.getElementsByClassName('mdl-card__supporting-text')[0].offsetWidth
  var circos = new Circos({
    container: '#histogramChart',
    width: width,
    height: width
  })

  cytobands = cytobands.map(function (d) {
    return {
      block_id: d.chrom,
      start: parseInt(d.chromStart),
      end: parseInt(d.chromEnd),
      gieStain: d.gieStain,
      name: d.name
    }
  })

  circos
    .layout(
      GRCh37,
    {
      innerRadius: width / 2 - 150,
      outerRadius: width / 2 - 120,
      labels: {
        display: false
      },
      ticks: {
        display: false,
        labelDenominator: 1000000
      }
    }
    )
    .highlight('cytobands', cytobands, {
      innerRadius: width / 2 - 150,
      outerRadius: width / 2 - 120,
      opacity: 0.6,
      color: function (d) {
        return gieStainColor[d.gieStain]
      },
      tooltipContent: function (d) {
        return d.name
      }
    })
    .histogram('es', buildData(es, ips, GRCh37), {
      innerRadius: 1.01,
      outerRadius: 1.4,
      color: 'OrRd'
    })
    .render()
}

Promise.all([
  d3.json('./data/grch37.json'),
  d3.csv('./data/cytobands.csv'),
  d3.csv('./data/es.csv'),
  d3.csv('./data/ips.csv')
])
.then(([GRCh37, cytobands, es, ips]) => {
  drawHistogram(null, GRCh37, cytobands, es, ips)
})
.catch(error => {
  console.error('Error fetching data:', error);
});
