import React from "react";
import "../styles/Landingpage.css";

import HeroSection from "../components/landing_page/Herosection";
import FeatureGrid from "../components/landing_page/FeatureGrid";
import PricingPlans from "../components/landing_page/PricingPlans";
import FAQ from "../components/landing_page/FAQ";
import CallToAction from "../components/landing_page/CallToAction";
import SuccessStories from "../components/landing_page/SuccessStories";

const Landingpage = () => {
    return (
        <div className="landing-page">
            <main>
                <HeroSection />
                <FeatureGrid />
                <SuccessStories />
                <PricingPlans />
                <FAQ />
                <CallToAction />
            </main>
        </div>
    );
};

export default Landingpage;
