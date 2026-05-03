import { Link, Navigate } from "react-router-dom";
import { Search, Zap, Handshake } from 'lucide-react'


function About() {
    return (
        <>
            {/* Hero — same as home */}
            <section className="about-hero">
                <div className="about-hero-content">
                    <p className="about-eyebrow">Who we are</p>
                    <h1>Helping Australians<br />find home</h1>
                    <p className="about-sub">We make finding your next rental simple, transparent, and stress-free.</p>
                </div>
            </section>

            {/* Mission */}
            <section className="about-section">
                <div className="about-container">
                    <div className="about-text-block">
                        <p className="section-eyebrow">Our mission</p>
                        <h2>Built for renters, not landlords</h2>
                        <p>We started this platform because finding a rental in Australia felt unnecessarily hard. Too many listings, too little information, and no easy way to compare. We built something better — a clean, fast search tool with honest reviews from real tenants.</p>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="about-stats-section">
                <div className="about-container">
                    <div className="about-stats">
                        <div className="about-stat">
                            <span className="about-stat-number">6700+</span>
                            <span className="about-stat-label">Listings</span>
                        </div>
                        <div className="about-stat">
                            <span className="about-stat-number">8</span>
                            <span className="about-stat-label">States covered</span>
                        </div>
                        <div className="about-stat">
                            <span className="about-stat-number">?</span>
                            <span className="about-stat-label">Reviews</span>
                        </div>
                        <div className="about-stat">
                            <span className="about-stat-number">5★</span>
                            <span className="about-stat-label">Max platform rating</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="about-section">
                <div className="about-container">
                    <p className="section-eyebrow">What we stand for</p>
                    <h2 className="about-section-title">Our values</h2>
                    <div className="about-cards">
                        <div className="about-card">
                            <span className="about-card-icon"><Search size={28} strokeWidth={1.5}/></span>
                            <h3>Transparency</h3>
                            <p>Every listing shows real ratings from verified tenants. No paid placements, no hidden fees.</p>
                        </div>
                        <div className="about-card">
                            <span className="about-card-icon"><Zap size={28} strokeWidth={1.5} /></span>
                            <h3>Simplicity</h3>
                            <p>Powerful filters, fast results. Find what you need without wading through irrelevant listings.</p>
                        </div>
                        <div className="about-card">
                            <span className="about-card-icon"><Handshake size={28} strokeWidth={1.5} /></span>
                            <h3>Trust</h3>
                            <p>We only show listings we can verify. Your data stays private and is never sold.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="about-cta">
                <div className="about-container about-cta-inner">
                    <h2>Ready to find your next home?</h2>
                    <p>Browse thousands of rentals across Australia — for free.</p>
                    <Link to="/rentalSearch" className="about-cta-btn">Start searching</Link>
                </div>
            </section>
        </>
    );
}

export default About;