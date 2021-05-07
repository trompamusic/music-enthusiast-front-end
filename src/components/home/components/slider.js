import React from 'react';

const slides = [
  {
    src: process.env.PUBLIC_URL + '/img/banner2.png',
    txt: 'Slider1_txt',
  },
  {
    src: process.env.PUBLIC_URL + '/img/banner1.png',
    txt: 'Slider2_txt',
  },
  {
    src: process.env.PUBLIC_URL + '/img/banner3.png',
    txt: 'Slider3_txt',
  }
];

export default class Slider extends React.Component {
  constructor(props) {
    super(props);
    this.timer = null;
    this.state = { slide: 0 };
  }
  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState({ slide: (this.state.slide + 1) % 3 })
    }, 4000);
  }
  componentWillUnmount() {
    clearInterval(this.timer);
    this.timer = null;
  }
  render(){
    const { t } = this.props;
    const slide = slides[this.state.slide];
    return <div className="slideshow-container">
      <div className="mySlides fade" style={{ display: 'block' }}>
        <img alt={'banner'.concat(this.state.slide)} src={slide.src} style={{ width: '100%' }} />
        <div className="CarouselText">{t(slide.txt)}</div>
      </div>
    </div>;
  }
}