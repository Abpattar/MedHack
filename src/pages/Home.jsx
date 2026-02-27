import './Home.css'
import BlurText from '../components/BlurText'

function Home() {
    return (
        <div className="home-hero">
            <div className="home-hero-heading">
                <BlurText
                    text="Welcome to"
                    delay={150}
                    animateBy="words"
                    direction="top"
                    className="home-blur-heading"
                />
                <BlurText
                    text="Medrox"
                    delay={150}
                    animateBy="characters"
                    direction="top"
                    className="home-blur-heading home-blur-accent"
                />
            </div>
            <BlurText
                text="Your trusted companion for healthcare management. Find doctors, track symptoms, and take control of your health — all in one place."
                delay={80}
                animateBy="words"
                direction="top"
                className="home-blur-subtext"
            />
        </div>
    )
}

export default Home
