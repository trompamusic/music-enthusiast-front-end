import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";
import {servercall, analytics} from "../../../utils/services";

/*
  getCommunityStats: method to get community stats from server.
 */
const getCommunityStats = () => (new Promise((resolve, reject)=> {
  servercall('POST', 'getCommunityStats', null, (data, err) => {
    if (err) resolve({});
    resolve(data);
  });
}));


/*
  UserStatsClass: React module that renders user statistics: current ranking position, top 10 ranking,
  annotated songs, completed campaigns.
 */
class UserStatsClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      annotations: [],
      ranking: [],
      user: {},
    };
  }
  async componentDidMount() {
    const stats = await getCommunityStats();
    this.setState({ ...stats });
  }
  render() {
    const { t } = this.props;
    const { annotations, ranking, user, weekly_score } = this.state;
    return <div className="user-stats-container">
      <div className="user-current-score">
        <div className="community-stats-title">{t('Your_current_score')}</div>
        <div className="user-score-value"> { user.score || 0 }</div>
        <br />
        <div className="community-stats-title" >{t('Your_weekly_score')}</div>
        <div className="user-score-value"> { weekly_score || 0 }</div>
      </div>
      <div className="user-annotations-info">
        <div className="community-stats-title">{t('Your_stats')}</div>
        <div className="user-stat-title">{t('Amount_annotated_songs')}: </div>
        <div className="user-stat-value">{annotations.length}</div>
        <div className="user-stat-title">{t('Completed_folders')}: </div>
        <div className="user-stat-value">{ user.annotatedFolders }</div>
      </div>
      <div className="global-ranking">
        <Link to="/trompa/rc/ranking" onClick={() => analytics({ click: 'ranking-list' })}>
          <div title={t('click_to_explore_ranking')} className="community-stats-title link">{t('Top_ten_ranking')}</div>
        </Link>
        {ranking.map(u => <div key={u.username} className="ranking-user">
          <div className="user-name">{u.username}</div>
          <div className="user-score">{u.score}</div>
        </div> )}
      </div>
    </div>;
  }
}

export default function UserStats({ user }) {
  const {t} = useTranslation();
  return <UserStatsClass t={t} user={user} />;
}
