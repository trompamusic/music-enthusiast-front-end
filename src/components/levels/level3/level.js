import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import CreatableSelect from 'react-select/creatable';
import reasonsList from '../helpers/reasons-list';
import DualSelection from '../components/dualSelector';
import EmotionSelection from '../components/emotionSelector';
import Popup from "../../shared/popup";
import FreeMoodInput from "../components/freeMoodInput";

const stepsList = [
  {
    module: FreeMoodInput,
    missingMessage: 'free_mood_missing',
    noComment: true,
    props: {
      title: 'Select_free_mood',
      placeholder: 'write_free_mood',
      name: 'freeMood',
    }
  },
  {
    module: DualSelection,
    props: {
      lbls: {
        negative: 'Low',
        positive: 'High',
      },
      title: 'Select_energy_value',
      name: 'arousal',
    }
  },
  {
    module: DualSelection,
    props: {
      lbls: {
        negative: 'Negative',
        positive: 'Positive',
      },
      title: 'Select_valence_value',
      tooltip: 'Valence_tip',
      name: 'valence',
    }
  },
  {
    module: EmotionSelection,
    hidden: annotation => !(annotation.arousalValue && annotation.valenceValue),
    props: {
      title: 'Select_mood',
      name: 'mood',
      filter: (e, a) => e.arousal === a.arousalValue && e.valence === a.valenceValue,
    }
  }
];

const getStepList = (t) => stepsList.map(stepInfo => ({
  ...stepInfo,
  props: {
    ...stepInfo.props,
    labels: stepInfo.props && stepInfo.props.lbls? {
      negative: t(stepInfo.props.lbls.negative),
      positive: t(stepInfo.props.lbls.positive),
    } : null,
  }
}));

/*
  List with reasons for selecting any of the options (arousal, valence, tag).
 */
const getReasonList = (t) => reasonsList.map(r => ({
  ...r,
  label: t(r.value)
})).sort((a,b) => {
  if(a.label < b.label) return -1;
  if(a.label > b.label) return 1;
  return 0;
});

const colourStyles = {
  control: styles => ({ ...styles, backgroundColor: 'white' }),
  option: (styles, { data }) => {
    return { ...styles,
      color:  data.__isNew__? 'blue' : 'black'
    };
  },
  multiValue: (styles, { data }) => {
    return { ...styles,
      backgroundColor: data.__isNew__? '#BDCFFA' : '#CACACA',
    };
  },
  multiValueLabel: (styles, { data }) => ({
    ...styles,
    color: data.__isNew__? 'blue' : 'black',
  }),
  multiValueRemove: (styles, { data }) => ({
    ...styles,
    color: data.__isNew__? 'blue' : 'black',
    ':hover': {
      backgroundColor: data.__isNew__? 'blue' : 'black',
      color: 'white',
    },
  }),
};

/*
  Level: React hook that renders the different annotation sections for a level 3 annotation: free text, arousal, valence
  and tag (stepsList).
*/
export default function Level({sendAnnotation}) {
  const [t] = useTranslation();
  const [popupVisible, setPopup] = useState(false);
  const [content, setContent] = useState('');
  const [steps, setSteps] = useState(getStepList(t));
  const [reasons, setReasons] = useState(getReasonList(t));
  const [annotation, setAnnotation] = useState({});

  const _popupButtons = useCallback(() => {
    return <div onClick={() => setPopup(false)} className="button close-button">
      {t('Understood')}
    </div>;
  }, [t]);
  const _send = useCallback((ann) => {
    let valid = true;
    let content = null;
    steps.forEach(step => {
      if (!content) {
        const val = ann[step.props.name.concat('Value')];
        const comment = ann[step.props.name.concat('Comment')];
        const comment_condition = step.noComment || (comment && comment.trim().length > 0);
        if (!(val && comment_condition)) {
          valid = false;
          if (step.missingMessage) content = t(step.missingMessage);
          else content = t('Missing_' + (!val? 'value' : 'comment'), { variable: t(step.props.name + '_value') });
          setContent(content);
        }
      }
    });
    if (valid) sendAnnotation(ann);
    else setPopup(true);
  },[t, sendAnnotation, steps]);
  const _changeValue = (field, val) => {
    const newA = { ...annotation };
    if (newA[field] !== val) {
      newA[field] = val;
      if (newA[field] === null || newA[field] === '') delete newA[field];
      setAnnotation(newA);
    }
  };

  useEffect(() => {
    setSteps(getStepList(t));
    setReasons(getReasonList(t));
  }, [t]);

  return <div className="annotationDiv">
    {steps.map(step => step.hidden && step.hidden(annotation)?
    <div key={step.props.name} /> : <div className="annotation-prop" key={step.props.name}>
      <div className="prop-title"><p className="artistLabel"><b className={step.props.tooltip? 'tooltip' : ''} title={t(step.props.tooltip)}>{t(step.props.title)}</b></p></div>
      <div className="prop-container">
        <div className="prop-value">
          <step.module annotation={annotation} field={step.props.name.concat('Value')} updateAnnotation={_changeValue} { ...step.props } />
        </div>
         {step.noComment? '' : <div className="prop-comment"><div className="select-container">
          <CreatableSelect
            isMulti
            placeholder={t('Why_did_you_choose_your_answer', { value: t(step.props.name + '_value'), g: step.props.name === 'mood'? 'a' : 'e' })}
            options={reasons}
            value={annotation[step.props.name.concat('_Comment')]}
            onChange={ val => _changeValue(step.props.name.concat('Comment'), val? val.map(v => v.value).join(',') : null)}
            styles={colourStyles}
            createOptionPosition="first"
            formatCreateLabel={string => t('Other_reason') + ': ' + string}
          />
         </div></div>}
      </div>
    </div>)}
    <div className="level-button-container">
      <div id="sendButton" className="nav-button" onClick={() => _send(annotation)}>{t('Send')}</div>
    </div>
    <Popup visible={popupVisible} title={t('Data_missing')} content={content} buttons={_popupButtons()} />
  </div>;
}
