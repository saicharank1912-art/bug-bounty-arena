import "./landing.css";

function Landing({
  onExplore,
  onPost,
  onLeaderboard,
  onDashboard
}) {
  return (
    <div className="landing">

      {/* NAVBAR */}
      <nav className="landing-nav">

        <div className="landing-logo">
          <span>◈</span> BIG BOUNTY
        </div>

        <div className="landing-links">

          <a
            href="#bounties"
            onClick={onExplore}
          >
            Explore
          </a>

          <a href="#categories">
            Categories
          </a>

          <a href="#how">
            How It Works
          </a>

          <a
            href="#leaderboard"
            onClick={(event) => {
              event.preventDefault();

              if (onLeaderboard) {
                onLeaderboard();
              }
            }}
          >
            Leaderboard
          </a>

          <a
            href="#dashboard"
            onClick={(event) => {
              event.preventDefault();

              if (onDashboard) {
                onDashboard();
              }
            }}
          >
            Dashboard
          </a>

        </div>


        <div className="landing-actions">

          <button className="login-btn">
            Login
          </button>

          <button className="signup-btn">
            Create Account
          </button>

        </div>

      </nav>


      {/* HERO */}
      <section className="landing-hero">

        <div className="hero-badge">
          <span></span>
          2,481 BOUNTIES ACTIVE
        </div>

        <h1>
          TURN YOUR
          <br />
          <span>SKILLS</span> INTO
          <br />
          <span>BOUNTIES.</span>
        </h1>

        <p>
          Discover real-world challenges, build powerful solutions,
          and earn rewards for solving problems that matter.
        </p>

        <div className="hero-buttons">

          <button
            className="explore-btn"
            onClick={onExplore}
          >
            EXPLORE BOUNTIES →
          </button>

          <button
            className="post-btn"
            onClick={onPost}
          >
            POST A BOUNTY
          </button>

        </div>


        {/* FLOATING BOUNTY - LEFT */}
        <div className="floating-bounty bounty-left">

          <div className="bounty-status">
            🔥 HOT BOUNTY
          </div>

          <h3>
            AI Elder Care
          </h3>

          <p>
            Build an intelligent assistant for senior citizens.
          </p>

          <div className="floating-bottom">

            <span>
              AI · ML
            </span>

            <strong>
              ₹25,000
            </strong>

          </div>

        </div>


        {/* FLOATING BOUNTY - RIGHT */}
        <div className="floating-bounty bounty-right">

          <div className="bounty-status">
            ⚡ NEW
          </div>

          <h3>
            Smart Campus
          </h3>

          <div className="floating-bottom">

            <span>
              WEB
            </span>

            <strong>
              ₹40K
            </strong>

          </div>

        </div>

      </section>


      {/* STATS */}
      <section className="stats-section">

        <div>
          <h2>₹18L+</h2>
          <p>Total Rewards</p>
        </div>

        <div>
          <h2>2,481</h2>
          <p>Active Bounties</p>
        </div>

        <div>
          <h2>8,920+</h2>
          <p>Active Solvers</p>
        </div>

        <div>
          <h2>₹6.4L+</h2>
          <p>Paid Out</p>
        </div>

      </section>


      {/* TRENDING BOUNTIES */}
      <section
        className="bounties-section"
        id="bounties"
      >

        <div className="section-header">

          <div>

            <span>
              THE HUNT IS ON
            </span>

            <h2>
              Trending <strong>Bounties</strong>
            </h2>

            <p>
              Challenges builders are hunting right now.
            </p>

          </div>

          <button onClick={onExplore}>
            VIEW ALL →
          </button>

        </div>


        <div className="bounty-grid">

          <BountyCard
            tag="🔥 TRENDING"
            title="AI Elder Care Assistant"
            description="Create an intelligent assistant designed to help senior citizens."
            category="AI"
            difficulty="Medium"
            reward="₹25,000"
            time="12 days left"
          />

          <BountyCard
            tag="⚡ NEW"
            title="Smart Campus Navigation"
            description="Build a smart navigation system for large educational campuses."
            category="WEB"
            difficulty="Hard"
            reward="₹40,000"
            time="8 days left"
          />

          <BountyCard
            tag="💎 HIGH REWARD"
            title="Waste Detection AI"
            description="Use computer vision to automatically detect waste categories."
            category="ML"
            difficulty="Hard"
            reward="₹75,000"
            time="18 days left"
          />

        </div>

      </section>


      {/* HOW IT WORKS */}
      <section
        className="how-section"
        id="how"
      >

        <div className="center-heading">

          <span>
            THE BOUNTY CYCLE
          </span>

          <h2>
            How the <strong>hunt</strong> works.
          </h2>

          <p>
            Four steps between you and your next reward.
          </p>

        </div>


        <div className="steps">

          <Step
            number="01"
            title="DISCOVER"
            text="Find a bounty that matches your skills."
          />

          <Step
            number="02"
            title="BUILD"
            text="Create your solution and bring your idea to life."
          />

          <Step
            number="03"
            title="SUBMIT"
            text="Submit your solution before the deadline."
          />

          <Step
            number="04"
            title="EARN"
            text="Win the bounty and claim your reward."
          />

        </div>

      </section>


      {/* FINAL CTA */}
      <section className="final-cta">

        <span>
          HAVE A PROBLEM?
        </span>

        <h2>
          PUT A <strong>BOUNTY</strong> ON IT.
        </h2>

        <p>
          Turn your challenge into an opportunity for talented builders.
        </p>

        <button onClick={onPost}>
          CREATE A BOUNTY →
        </button>

      </section>


      {/* FOOTER */}
      <footer className="landing-footer">

        <div>

          <strong>
            ◈ BIG BOUNTY
          </strong>

          <p>
            Find. Build. Solve. Earn.
          </p>

        </div>


        <div className="footer-links">

          <a href="#">
            About
          </a>

          <a href="#">
            Contact
          </a>

          <a href="#">
            Terms
          </a>

          <a href="#">
            Privacy
          </a>

        </div>

      </footer>

    </div>
  );
}


/* =========================
   BOUNTY CARD
========================= */

function BountyCard({
  tag,
  title,
  description,
  category,
  difficulty,
  reward,
  time
}) {

  return (

    <div className="bounty-card">

      <div className="card-top">

        <span>
          {tag}
        </span>

        <small>
          {time}
        </small>

      </div>


      <h3>
        {title}
      </h3>


      <p>
        {description}
      </p>


      <div className="card-tags">

        <span>
          {category}
        </span>

        <span>
          {difficulty}
        </span>

      </div>


      <div className="card-bottom">

        <div>

          <small>
            REWARD
          </small>

          <strong>
            {reward}
          </strong>

        </div>


        <button>
          →
        </button>

      </div>

    </div>
  );
}


/* =========================
   STEP
========================= */

function Step({
  number,
  title,
  text
}) {

  return (

    <div className="step">

      <span>
        {number}
      </span>

      <h3>
        {title}
      </h3>

      <p>
        {text}
      </p>

    </div>
  );
}


export default Landing;