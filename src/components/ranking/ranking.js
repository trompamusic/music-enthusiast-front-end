import React, { useEffect, useState } from 'react';
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useTranslation } from 'react-i18next';
import { enUS, es } from 'date-fns/locale';
import { servercall } from '../../utils/services';
import Loading from "../shared/loading";

registerLocale("es", es);
registerLocale("en", enUS);

/*
  rankingPromise: promise that loads ranking data from server according to filter dates.
 */
const rankingPromise = (startD, endD) => {
  let end = null;
  if (endD) {
    end = new Date(endD);
    end.setDate(end.getDate()+1);
  }
  const filter = {
    start: startD && startD.toLocaleDateString('en'),
    end: end && end.toLocaleDateString('en'),
  };
  return new Promise((resolve, reject)=> {
    servercall('POST', 'getRanking', filter, (data, err) => {
      if (err) reject();
      else resolve(data.ranking);
    });
  });
};

/*
  Ranking: React Hook that renders ranking information. It allows filtering specific dates.
*/
export default function Ranking() {
  const { t, i18n } = useTranslation();
  const [ list, setList ] = useState([]);
  const [ loading, load] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(new Date());

  useEffect(()=> {
    async function fetchData() {
      const result = await rankingPromise(startDate, endDate);
      setList(result);
      load(false);
    }
    load(true);
    fetchData();
  }, [startDate, endDate]);

  return <div className="homepage-div">
    <div className="songDiv">
      <p className="page-title">{t('Select_dates_title')}</p>
      <p className="page-subtitle">{t('Select_dates_subtitle')}</p>
      <div className="date-selectors">
        <div className="date-section">
          <div className="title page-subtitle">{t('start_date')}</div>
          <div className="input">
            <DatePicker
              selected={startDate}
              onChange={date => setStartDate(date)}
              dateFormat="yyyy-MM-dd"
              locale={i18n.language.split('-')[0]}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              maxDate={endDate}
            />
          </div>
        </div>
        <div className="date-section">
          <div className="title page-subtitle">{t('end_date')}</div>
          <div className="input">
            <DatePicker
              selected={endDate}
              onChange={date => setEndDate(date)}
              dateFormat="yyyy-MM-dd"
              locale={i18n.language.split('-')[0]}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              maxDate={new Date()}
            />
          </div>
        </div>
      </div>
    </div>
    <div className="songDiv">
      {loading ? <Loading /> :
        <div className="ranking-list">
          <div className="ranking-user title">
            <div className="user-position">#</div>
            <div className="user-name">{t('username')}</div>
            <div className="user-annotations">{t('annotations')}</div>
            <div className="user-score">{t('score')}</div>
          </div>
          {list.map((user, i) => <div key={user.username} className="ranking-user">
            <div className="user-position">{i+1}</div>
            <div className="user-name">{user.username}</div>
            <div className="user-annotations">{user.annotations}</div>
            <div className="user-score">{user.score}</div>
          </div>)}
        </div>
      }
    </div>
  </div>;
}