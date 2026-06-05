import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { HowItWorks } from '../components/HowItWorks';
import { InfoAndTramites } from '../components/InfoAndTramites';
import { Footer } from '../components/Footer';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Navbar onIniciar={() => navigate('/solicitud')} />
      <Hero onIniciar={() => navigate('/solicitud')} />
      <HowItWorks />
      <InfoAndTramites />
      <Footer />
    </div>
  );
}
