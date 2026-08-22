import "./bounty.css";

function Bounty({
  bounty,
  onBack,
  onSubmit,
  onUpdateStatus,
  onDeleteBounty,
}) {

  /* =========================
     CHALLENGE NOT FOUND
  ========================= */

  if (!bounty) {
    return (
      <div className="bounty-page">

        <div className="bounty-not-found">

          <h1>
            Challenge Not Found
          </h1>

          <button onClick={onBack}>
            ← Back to Explore
          </button>

        </div>

      </div>
    );
  }


  /* =========================
     STATUS
  ========================= */

  const status =
    bounty.status || "Open";


  const handleStatusChange = (
    newStatus
  ) => {

    if (onUpdateStatus) {

      onUpdateStatus(
        newStatus
      );

    }

  };


  /* =========================
     DELETE CHALLENGE
  ========================= */

  const handleDelete = () => {

    if (
      typeof onDeleteBounty ===
      "function"
    ) {

      onDeleteBounty();

    }

  };


  return (

    <div className="bounty-page">


      {/* =========================
          NAVBAR
      ========================= */}

      <header className="bounty-header">

        <div className="bounty-logo">

          <span>
            ◈
          </span>

          BIG BOUNTY

        </div>


        <button
          className="back-btn"
          onClick={onBack}
        >

          ← Back to Explore

        </button>

      </header>


      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main className="bounty-details">


        {/* =========================
            LEFT SIDE
        ========================= */}

        <section className="bounty-main">


          {/* TAG + STATUS */}

          <div className="bounty-top-row">

            <div className="bounty-label">

              {bounty.tag ||
                "CODE CHALLENGE"}

            </div>


            <div
              className={`bounty-status status-${status
                .toLowerCase()
                .replace(/\s+/g, "-")}`}
            >

              {status}

            </div>

          </div>


          {/* TITLE */}

          <h1>

            {bounty.title}

          </h1>


          {/* COMPANY */}

          <div className="bounty-company">

            Created by{" "}

            <strong>

              {bounty.company ||
                "Community"}

            </strong>

          </div>


          {/* TAGS */}

          <div className="bounty-tags">

            <span>

              {bounty.category}

            </span>

            <span>

              {bounty.difficulty}

            </span>

            <span>

              {bounty.timeLimit ||
                30} min

            </span>

          </div>


          {/* ABOUT */}

          <div className="details-section">

            <h2>
              About this Challenge
            </h2>

            <p>

              {bounty.description}

            </p>

            <p>

              Your goal is to inspect the
              provided JavaScript code,
              identify the bug, and fix it
              before the challenge timer
              runs out.

            </p>

          </div>


          {/* REQUIREMENTS */}

          <div className="details-section">

            <h2>
              Challenge Requirements
            </h2>

            <ul>

              <li>
                Identify the bug in the
                provided code.
              </li>

              <li>
                Fix the code without
                changing the intended
                functionality.
              </li>

              <li>
                Make sure your solution
                handles the required
                test cases.
              </li>

              <li>
                Complete the challenge
                before the timer reaches
                zero.
              </li>

              <li>
                Submit your solution
                for validation.
              </li>

            </ul>

          </div>


          {/* SKILLS */}

          <div className="details-section">

            <h2>
              Recommended Skills
            </h2>

            <div className="skills">

              <span>
                Problem Solving
              </span>

              <span>
                JavaScript
              </span>

              <span>
                Debugging
              </span>

              <span>

                {bounty.category}

              </span>


              {bounty.category ===
                "DSA" && (

                <span>
                  Algorithms
                </span>

              )}


              {bounty.category ===
                "Web Development" && (

                <span>
                  Web Development
                </span>

              )}

            </div>

          </div>


          {/* STATUS MANAGEMENT */}

          <div className="details-section status-management">

            <h2>
              Challenge Status
            </h2>

            <p>

              Current status:{" "}

              <strong>

                {status}

              </strong>

            </p>


            <div className="status-buttons">

              <button
                className={
                  status === "Open"
                    ? "active-status"
                    : ""
                }
                onClick={() =>
                  handleStatusChange(
                    "Open"
                  )
                }
              >
                Open
              </button>


              <button
                className={
                  status ===
                  "Under Review"
                    ? "active-status"
                    : ""
                }
                onClick={() =>
                  handleStatusChange(
                    "Under Review"
                  )
                }
              >
                Under Review
              </button>


              <button
                className={
                  status === "Awarded"
                    ? "active-status"
                    : ""
                }
                onClick={() =>
                  handleStatusChange(
                    "Awarded"
                  )
                }
              >
                Awarded
              </button>


              <button
                className={
                  status === "Closed"
                    ? "active-status"
                    : ""
                }
                onClick={() =>
                  handleStatusChange(
                    "Closed"
                  )
                }
              >
                Closed
              </button>

            </div>

          </div>


          {/* =========================
              DELETE CHALLENGE
          ========================= */}

          <div className="details-section delete-section">

            <h2>
              Delete Challenge
            </h2>

            <p>
              Permanently remove this
              challenge from the platform.
              This action cannot be undone.
            </p>

            <button
              type="button"
              className="delete-challenge-btn"
              onClick={handleDelete}
            >
              🗑 DELETE CHALLENGE
            </button>

          </div>

        </section>


        {/* =========================
            RIGHT SIDEBAR
        ========================= */}

        <aside className="bounty-sidebar">


          {/* REWARD */}

          <div className="reward-box">

            <small>
              CHALLENGE REWARD
            </small>

            <strong>

              ₹

              {Number(
                bounty.reward || 0
              ).toLocaleString(
                "en-IN"
              )}

            </strong>

            <p>
              Reward for completing the
              challenge
            </p>

          </div>


          {/* STATUS CARD */}

          <div className="status-card">

            <span>
              CURRENT STATUS
            </span>

            <strong>
              {status}
            </strong>

          </div>


          {/* INFO */}

          <div className="info-box">

            <div>

              <span>
                Category
              </span>

              <strong>
                {bounty.category}
              </strong>

            </div>


            <div>

              <span>
                Difficulty
              </span>

              <strong>
                {bounty.difficulty}
              </strong>

            </div>


            <div>

              <span>
                Time Limit
              </span>

              <strong>

                {bounty.timeLimit ||
                  30} min

              </strong>

            </div>

          </div>


          {/* START CHALLENGE */}

          <button
            className="submit-btn"
            onClick={onSubmit}
            disabled={
              status === "Closed"
            }
          >

            {status === "Closed"
              ? "CHALLENGE CLOSED"
              : "START CHALLENGE →"}

          </button>


          <p className="submit-note">

            {status === "Closed"
              ? "This challenge is no longer available."
              : `You will have ${
                  bounty.timeLimit || 30
                } minutes to complete this challenge.`}

          </p>

        </aside>

      </main>

    </div>

  );

}

export default Bounty;