import Hero from '../components/Hero';
import Stats from '../components/HomeComponents/Stats';
import './../styles/pages/Hero.scss';

const NewHome = () => {
  return (
    <div style={{ minHeight: '100vh' }}>
      <Hero />
      <div style={{ marginTop: 'calc(100vh - 72px)' }}>
        <Stats />
      </div>
    </div>
  )
}

export default NewHome