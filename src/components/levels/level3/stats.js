import React  from 'react';
import { useTranslation } from 'react-i18next';
import ContentSlider from '../components/contentSlider';
import QuadrantChart from '../components/quadrantChart';
import MoodList from '../components/moodList';
import PersonalStats from '../components/personalStats';

/*
  calculateStats: function for converting data received from server to printable data (quadrants heatmap and tags list).
*/
const calculateStats = ({q, mood}) => {
  let newQ = [[0, 0], [0, 0]];
  let N = 1;
  if (q) {
    const q1 = q.find(q => q.valenceValue === 1 && q.arousalValue === 1);
    const q2 = q.find(q => q.valenceValue === -1 && q.arousalValue === 1);
    const q3 = q.find(q => q.valenceValue === -1 && q.arousalValue === -1);
    const q4 = q.find(q => q.valenceValue === 1 && q.arousalValue === -1);
    newQ = [[(q2 && q2.v_count) || 0, (q1 && q1.v_count) || 0], [(q3 && q3.v_count) || 0, (q4 && q4.v_count) || 0]];
    N = newQ[0][0] + newQ[0][1] + newQ[1][0] + newQ[1][1];
  }
  const data = {
    q: newQ,
    N,
    moods: mood ? mood.map( m => ({
      lbl: m.moodValue,
      count: m.v_count,
    })) : [],
  };
  data.moods.sort((a , b) => {
    if(a.count < b.count) return 1;
    if (b.count < a.count) return -1;
    return 0;
  });
  return data;
};

/*
  StatsClass: React component that renders the silders with stats info about the currently finished annotation.
*/
class StatsClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: null };
  }
  render() {
    const { annotations, myAnnotation, t } = this.props;
    const myQ = {
      a: myAnnotation.arousalValue === 1? 0 : 1,
      v: myAnnotation.valenceValue === 1? 1 : 0,
    };
    const data = calculateStats(annotations);
    const children = [
      <PersonalStats key="personalstats" t={t} annotations={annotations} />,
      <QuadrantChart key="quadrantChart" data={data} myQ={myQ} t={t} />
    ];
    if (data.moods.length > 0) children.push(<MoodList key="moodlist" data={data} myAnnotation={myAnnotation} t={t} />);
    return <ContentSlider title={t('Use_arrows_to_explore')}>
      {children}
    </ContentSlider>;
  }
}

export default function Stats({ annotations={ score: 0, q: [], mood: []}, myAnnotation = {} }) {
  const { t } = useTranslation();
  return <StatsClass t={t} annotations={annotations} myAnnotation={myAnnotation} />;
}