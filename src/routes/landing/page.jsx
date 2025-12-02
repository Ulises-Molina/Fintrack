import Header from "../../components/header"
import Footer from "../../components/footer"
import Hero from "../../components/hero"
import LandingBadges from "../../components/landing-badges"
import Features from "../../components/features"
import { AuthRedirect } from "../../components/authRedirect"

function Landing() {
  return (
    <>
      <AuthRedirect />
      <Header/>
      <Hero/>
      <LandingBadges />
      <Features/>
      <Footer/>
    </>
  )
}

export default Landing
