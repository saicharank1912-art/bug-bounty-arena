import { useState } from "react";
import "./submit.css";

function Submit({ bounty, onBack }) {
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    github: "",
    demo: "",
    description: "",
    agree: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!bounty) {
      alert("Bounty information is missing.");
      return;
    }

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.github.trim() ||
      !formData.description.trim() ||
      !formData.agree
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const savedSubmissions =
        localStorage.getItem("submissions");

      let existingSubmissions = [];

      if (savedSubmissions) {
        const parsed = JSON.parse(savedSubmissions);

        if (Array.isArray(parsed)) {
          existingSubmissions = parsed;
        }
      }

      const newSubmission = {
        id: `submission-${Date.now()}`,

        bountyId: bounty.id,

        bountyTitle: bounty.title || "Untitled Bounty",

        bountyReward: bounty.reward || 0,

        name: formData.name.trim(),

        email: formData.email.trim(),

        github: formData.github.trim(),

        demo: formData.demo.trim(),

        description: formData.description.trim(),

        submittedAt: new Date().toISOString(),

        status: "Pending",
      };

      const updatedSubmissions = [
        newSubmission,
        ...existingSubmissions,
      ];

      localStorage.setItem(
        "submissions",
        JSON.stringify(updatedSubmissions)
      );

      console.log(
        "Solution Submitted:",
        newSubmission
      );

      setSubmitted(true);
    } catch (error) {
      console.error(
        "Error saving submission:",
        error
      );

      alert(
        "Something went wrong while submitting your solution."
      );
    }
  };

  if (!bounty) {
    return (
      <div className="submit-page">
        <div className="success-box">
          <h1>Bounty Not Found</h1>

          <p>
            We couldn't find the bounty you're trying
            to submit a solution for.
          </p>

          <button onClick={onBack}>
            ← Back
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="submit-page">

        <div className="success-box">

          <div className="success-icon">
            ✓
          </div>

          <h1>
            Solution Submitted!
          </h1>

          <p>
            Your solution for{" "}
            <strong>
              {bounty.title}
            </strong>{" "}
            has been submitted successfully.
          </p>

          <p className="success-note">
            The bounty creator will review your
            submission.
          </p>

          <button onClick={onBack}>
            ← Back to Bounty
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="submit-page">

      {/* =========================
          HEADER
      ========================= */}

      <header className="submit-header">

        <div className="submit-logo">
          <span>◈</span> BIG BOUNTY
        </div>

        <button
          className="back-btn"
          onClick={onBack}
        >
          ← Back to Bounty
        </button>

      </header>


      {/* =========================
          MAIN
      ========================= */}

      <main className="submit-content">

        {/* =========================
            LEFT FORM
        ========================= */}

        <section className="submit-form-section">

          <div className="submit-label">
            SUBMIT YOUR SOLUTION
          </div>

          <h1>
            Ready to <span>claim it?</span>
          </h1>

          <p className="submit-intro">
            Tell us about your solution and provide
            the links needed to review your project.
          </p>


          <form onSubmit={handleSubmit}>

            {/* NAME */}

            <div className="form-group">

              <label>
                YOUR NAME *
              </label>

              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
              />

            </div>


            {/* EMAIL */}

            <div className="form-group">

              <label>
                EMAIL ADDRESS *
              </label>

              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />

            </div>


            {/* GITHUB */}

            <div className="form-group">

              <label>
                GITHUB REPOSITORY *
              </label>

              <input
                type="url"
                name="github"
                placeholder="https://github.com/username/project"
                value={formData.github}
                onChange={handleChange}
              />

            </div>


            {/* DEMO */}

            <div className="form-group">

              <label>
                LIVE DEMO URL
              </label>

              <input
                type="url"
                name="demo"
                placeholder="https://your-project.com"
                value={formData.demo}
                onChange={handleChange}
              />

            </div>


            {/* DESCRIPTION */}

            <div className="form-group">

              <label>
                DESCRIBE YOUR SOLUTION *
              </label>

              <textarea
                name="description"
                placeholder="Explain your approach, features and how your solution solves the problem..."
                rows="7"
                value={formData.description}
                onChange={handleChange}
              />

            </div>


            {/* AGREEMENT */}

            <label className="checkbox-group">

              <input
                type="checkbox"
                name="agree"
                checked={formData.agree}
                onChange={handleChange}
              />

              <span>
                I confirm that this is my original work
                and I agree to the submission terms.
              </span>

            </label>


            {/* SUBMIT BUTTON */}

            <button
              type="submit"
              className="final-submit-btn"
            >
              SUBMIT SOLUTION →
            </button>

          </form>

        </section>


        {/* =========================
            RIGHT SIDEBAR
        ========================= */}

        <aside className="submit-sidebar">

          {/* BOUNTY INFO */}

          <div className="submitting-for">

            <small>
              SUBMITTING FOR
            </small>

            <h2>
              {bounty.title ||
                "Untitled Bounty"}
            </h2>

            <p>
              {bounty.company ||
                "Bounty Creator"}
            </p>

            <div className="submit-reward">
              ₹
              {Number(
                bounty.reward || 0
              ).toLocaleString("en-IN")}
            </div>

          </div>


          {/* TIPS */}

          <div className="submission-tips">

            <h3>
              BEFORE YOU SUBMIT
            </h3>

            <ul>

              <li>
                Make sure your GitHub repository
                is accessible.
              </li>

              <li>
                Include clear instructions to run
                your project.
              </li>

              <li>
                Explain the key features of your
                solution.
              </li>

              <li>
                Double-check your submitted links.
              </li>

            </ul>

          </div>

        </aside>

      </main>

    </div>
  );
}

export default Submit;