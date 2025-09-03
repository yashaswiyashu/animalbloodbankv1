// import AboutSection from './pages/homePage/AboutSection';
// import FeaturesSection from './pages/homePage/FeatureSection';
// import Footer from './pages/homePage/Footer';
// import HeroSection from './pages/homePage/HeroSection';
// import Navbar from './pages/homePage/Navbar';
// import NewsletterSection from './pages/homePage/NewsLetterSection';
// // import RadialMenu from './homePage/RadialMenu';
// import ServicesSection from './pages/homePage/ServicesSection';
// import TestimonialsSection from './pages/homePage/TestimonialsSection';
// import TopBar from './pages/homePage/TopBar';

// const HomePage: React.FC = () => {
//   return (
//     <>
//     <TopBar />
//     <Navbar />
//     <HeroSection />
//     <AboutSection />
//     {/* <RadialMenu /> */}
//     <FeaturesSection />
//     <ServicesSection />
//     <TestimonialsSection />
//     <NewsletterSection />
//     <Footer />
    
//     </>
//   )
// }

// export default HomePage



import AnimalBloodBankSection from './pages/homePage/AnimalBloodBankSection';
import CommunityHeroes from './pages/homePage/CommunityHeroes';
import FeaturesSection from './pages/homePage/FeatureSection';
import Footer from './pages/homePage/Footer';
import FooterSection from './pages/homePage/FooterSection';
import GallerySection from './pages/homePage/GallerySection';
import HeroSection from './pages/homePage/HeroSection';
import HowItWorks from './pages/homePage/HowItWorks';
import ImpactSection from './pages/homePage/ImpactSection';
import JoinMovement from './pages/homePage/JoinMovement';
import Navbar from './pages/homePage/Navbar';
import Newsletter from './pages/homePage/NewsLetter';
import NewsletterSection from './pages/homePage/NewsLetterSection';
// import RadialMenu from './homePage/RadialMenu';
import TestimonialsSection from './pages/homePage/TestimonialsSection';
import TopBar from './pages/homePage/TopBar';
import TrustedOrganizations from './pages/homePage/TrustedOrganization';

const HomePage: React.FC = () => {
  return (
    <>
    {/* <TopBar /> */}
    <Navbar />
    <HeroSection />
    <HowItWorks/>
    <AnimalBloodBankSection/>
    <TrustedOrganizations/>
    <ImpactSection/>
    <CommunityHeroes />
    <TestimonialsSection />
    <JoinMovement />
    <GallerySection/>
    <Newsletter/>
    <FooterSection/>
    {/* <AboutSection /> */}
    {/* <RadialMenu /> */}
    {/* <FeaturesSection />
    <ServicesSection />
    <TestimonialsSection />
    <NewsletterSection />
    <Footer /> */}
    
    </>
  )
}

export default HomePage