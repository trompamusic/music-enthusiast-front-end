import React from 'react';
import Select from 'react-select';

export default function MoodSelector({ list, selection, filterMood, t }) {
  const selectList = list.map(m=>({ label: t(m.label), value: m.label }));
  const selected = selectList.find(m => m.value === selection) || null;
  return <div className="filter-field">
    <Select
      options={selectList}
      value={selected}
      onChange={filterMood}
    />
  </div>;
}