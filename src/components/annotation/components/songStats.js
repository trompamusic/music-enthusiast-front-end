import React from 'react';
import Levels from '../../levels';

/*
  SongStats: Module that renders song stats module according to the annotation level.
  props:
    annotationLvl: annotation level. (default: 3)
*/
export default function SongStats(props) {
  const { annotationLvl } = props;
  const Stats = Levels['Level'.concat(annotationLvl)].Stats;
  return <Stats { ...props } />;
}