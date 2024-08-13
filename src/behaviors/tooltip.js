import { select, pointer } from 'd3-selection'
import 'd3-transition'

export function registerTooltip(track, instance, element, trackParams) {
  track.dispatch.on('mouseover', (event) => {
    const datum = d3.select(event.target).data()[0];
    instance.tip
      .html(trackParams.tooltipContent(datum))
      .transition()
      .style('opacity', 0.9)
      .style('left', (pointer(event, element)[0]) + 'px')
      .style('top', (pointer(event, element)[1] - 28) + 'px')
      .style('position', 'absolute')
      .style('text-align', 'center')
      .style('padding', '5px 10px')
      .style('background', '#111')
      .style('color', 'white')
      .style('border', '0px')
      .style('pointer-events', 'none')
      .style('z-index', 1000)
  });

  track.dispatch.on('mouseout', (event) => {
    instance.tip
      .transition()
      .duration(500)
      .style('opacity', 0);
  });
}
