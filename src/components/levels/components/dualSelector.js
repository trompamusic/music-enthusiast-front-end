import React, { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';

const zones = [
  {
    name: 'negative',
    color: '#ff2904',
    start: 0.4363323129985824,
    end: 1.57,
    x: -12,
    y: 3,
    value: -1,
    anchor: 'end'
  },
  {
    name: 'positive',
    color: '#20a516',
    start: 1.57,
    end: 2.705260340591211,
    x: 12,
    y: 3,
    value: 1,
    anchor: 'start'
  }
];

const assignRotation = (pointer, value) => {
  let v = 180;
  if (value > 0) v += 60;
  else if (value < 0) v -= 60;
  pointer.attr("transform", "rotate(" + v + ")");
};


const gaugePointer = (parent) => {
  parent.append("g")
    .attr("id", "pointer-container")
    .append("path")
    .attr("id", "pointer")
    .attr("d", "M -1.7 0 L 0 17 L 1.7 0")
    .attr("transform", "rotate(180)");
};

const gaugeSection = (parent, id, item, onClick) => {
  const gauge = parent.append("g")
    .attr("id", id);
  gauge.append("rect")
    .attr("class", "gauge-section")
    .style("fill", "transparent")
    .attr("x", -23 + item.zoneWidth * item.i)
    .attr("y", -22)
    .attr("width", item.zoneWidth)
    .attr("height", 28)
    .on("click", () => {
      onClick(item.value);
      d3.event.stopPropagation();
    });

  gauge.append("path")
    .attr("class", "gauge-section")
    .style("fill", item.color)
    .attr("d", d3.arc()
      .startAngle(item.start)
      .endAngle(item.end)
      .innerRadius(13)
      .outerRadius(20))
    .attr("transform", "rotate(270)")
    .on("click", () => {
      onClick(item.value);
      d3.event.stopPropagation();
    });

  if (item.label) {
    gauge.append("text")
      .attr("class", "gauge-text")
      .style("text-anchor", item.anchor)
      .attr("x", item.x)
      .attr("y", item.y)
      .text(item.label)
      .on("click", () => {
        onClick(item.value);
        d3.event.stopPropagation();
      });
  }
};

const appendSections = (parent, labels, onClick) => {
  const zoneWidth = 46 / zones.length;
  zones.forEach((zone, i) => {
    parent.select("#" + zone.name + "-gauge").remove();
    gaugeSection(parent, zone.name + "-gauge", { ...zone, label: labels[zone.name], zoneWidth, i }, onClick);
  });
};

const gauge = (parent) => {
  // parent.append("rect")
  //   .attr("class", "gauge-board")
  //   .attr("rx", 6)
  //   .attr("ry", 6)
  //   .attr("x", -23)
  //   .attr("y", -22)
  //   .attr("width", 46)
  //   .attr("height", 28);

  parent.append("g")
    .attr("class","section-containers");

  parent.append("circle")
    .style("fill", "black")
    .attr("r", 2)
    .attr("cx", 0)
    .attr("cy", 0);

  gaugePointer(parent);
};

export default function DualSelector({field, updateAnnotation, labels}) {
  const d3Container = useRef(null);
  const [ value, setValue ] = useState(null);

  useEffect(() => {
    if (d3Container.current) {
      const svg = d3.select(d3Container.current);
      svg.select("g").remove();
      const update = svg.append("g");
      gauge(update);
    }
  }, []);

  useEffect(() => {
    const svg = d3.select(d3Container.current);
    const sections = svg.select("g.section-containers");
    appendSections(sections, labels, setValue);
  }, [labels]);

  useEffect(() => {
    const svg = d3.select(d3Container.current);
    const pointer = svg.select("#pointer");
    assignRotation(pointer, value);
    updateAnnotation(field, value);
  }, [field, value]);

  return (<svg
    className="d3-component"
    width={200}
    height={100}
    viewBox="-23 -23 46 30"
    ref={d3Container}
  />);
}