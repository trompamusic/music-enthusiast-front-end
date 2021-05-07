import React from 'react';
import { useTranslation } from 'react-i18next';

export default function FreeMoodInput({ placeholder, updateAnnotation, field }) {
  const { t } = useTranslation();
  return <input className="freemood-input" placeholder={t(placeholder)} onChange={(e) => updateAnnotation(field, e.currentTarget.value)} />;
}