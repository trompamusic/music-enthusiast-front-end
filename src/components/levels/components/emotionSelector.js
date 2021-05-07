import React, { useState } from 'react';
import emotionList from '../helpers/emotion-list';
import { useTranslation } from 'react-i18next';

export default function EmotionSelector({field, annotation, updateAnnotation, filter}) {
  const { t } = useTranslation();
  const [ value, setValue ] = useState(annotation[field]);
  const moodList = emotionList.filter(e => filter(e, annotation));
  return <div className="mood-container">
    <div>
      {moodList.map((e) => <div key={'mood'.concat(e.label)} className="mood-element" title={e.tooltip.map(i => t(i)).filter(i => i !== '').join('\n')}>
        <input
          id={field.concat('neg')}
          type="button"
          className={'selection'.concat(value === e.label? ' selected': '')}
          onClick={() => {setValue(e.label); updateAnnotation(field, e.label); }}
          value={t(e.label)}
        />
      </div>)}
    </div>
  </div>;
}