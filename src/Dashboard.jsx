import { useEffect, useState } from "react";
import "./Dashboard.css";

function Dashboard({
  onBack,
  onViewBounty,
  onHome,
  onExplore,
  onSelectBounty,
  onLeaderboard,
}) {
  const [bounties, setBounties] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [selectedBounty, setSelectedBounty] = useState(null);

  /* =========================
     NAVIGATION FALLBACKS
  ========================= */

  const goHome =
    onBack || onHome || (() => {});

  const viewBounty =
    onViewBounty ||
    onSelectBounty ||
    (() => {});

  /* =========================
     LOAD DASHBOARD DATA
  ========================= */

  const loadDashboardData = () => {
    try {
      /* =========================
         LOAD BOUNTIES
      ========================= */

      const savedBounties =
        localStorage.getItem("bounties");

      if (savedBounties) {
        const parsedBounties =
          JSON.parse(savedBounties);

        setBounties(
          Array.isArray(parsedBounties)
            ? parsedBounties
            : []
        );
      } else {
        setBounties([]);
      }

      /* =========================
         LOAD SUBMISSIONS
      ========================= */

      const savedSubmissions =
        localStorage.getItem(
          "bugBountySubmissions"
        );

      if (savedSubmissions) {
        const parsedSubmissions =
          JSON.parse(savedSubmissions);

        setSubmissions(
          Array.isArray(parsedSubmissions)
            ? parsedSubmissions
            : []
        );
      } else {
        /*
          Backward compatibility
          with the old submissions key.
        */

        const oldSubmissions =
          localStorage.getItem(
            "submissions"
          );

        if (oldSubmissions) {
          const parsedOld =
            JSON.parse(oldSubmissions);

          setSubmissions(
            Array.isArray(parsedOld)
              ? parsedOld
              : []
          );
        } else {
          setSubmissions([]);
        }
      }
    } catch (error) {
      console.error(
        "Error loading dashboard data:",
        error
      );

      setBounties([]);
      setSubmissions([]);
    }
  };

  /* =========================
     LISTEN FOR DATA UPDATES
  ========================= */

  useEffect(() => {
    loadDashboardData();

    const handleStorageChange = () => {
      loadDashboardData();
    };

    /*
      Updates from another tab.
    */

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    /*
      Updates from the same tab.
    */

    window.addEventListener(
      "submissionsUpdated",
      handleStorageChange
    );

    window.addEventListener(
      "bountiesUpdated",
      handleStorageChange
    );

    /*
      Backward compatibility
      with previous versions.
    */

    window.addEventListener(
      "bugBountyDataUpdated",
      handleStorageChange
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange
      );

      window.removeEventListener(
        "submissionsUpdated",
        handleStorageChange
      );

      window.removeEventListener(
        "bountiesUpdated",
        handleStorageChange
      );

      window.removeEventListener(
        "bugBountyDataUpdated",
        handleStorageChange
      );
    };
  }, []);

  /* =========================
     SUBMISSION HELPERS
  ========================= */

  const getSubmissionCount = (bountyId) => {
    return submissions.filter(
      (submission) =>
        String(submission.bountyId) ===
        String(bountyId)
    ).length;
  };

  const getBountySubmissions = (
    bountyId
  ) => {
    return submissions.filter(
      (submission) =>
        String(submission.bountyId) ===
        String(bountyId)
    );
  };

  const getSubmissionScore = (
    submission
  ) => {
    const possibleScore =
      submission.score ??
      submission.points ??
      submission.rewardEarned ??
      submission.earnedScore ??
      0;

    const score =
      Number(possibleScore);

    return Number.isFinite(score)
      ? score
      : 0;
  };

  /* =========================
     CORRECT CHECK
  ========================= */

  const isSubmissionCorrect = (
    submission
  ) => {
    const status = String(
      submission.status || ""
    ).toLowerCase();

    return (
      submission.correct === true ||
      submission.solved === true ||
      submission.isCorrect === true ||
      status === "correct" ||
      status === "solved" ||
      status === "passed" ||
      status === "success"
    );
  };

  /* =========================
     BEST SCORE PER BOUNTY
  ========================= */

  const getBestSubmissions = () => {
    const bestByBounty = {};

    submissions.forEach(
      (submission) => {
        const bountyId =
          submission.bountyId ||
          submission.bountyTitle ||
          "unknown";

        const score =
          getSubmissionScore(
            submission
          );

        const existing =
          bestByBounty[bountyId];

        if (
          !existing ||
          score >
            getSubmissionScore(
              existing
            )
        ) {
          bestByBounty[bountyId] =
            submission;
        }
      }
    );

    return Object.values(
      bestByBounty
    );
  };

  const bestSubmissions =
    getBestSubmissions();

  /* =========================
     HACKER STATISTICS
  ========================= */

  const totalScore =
    bestSubmissions.reduce(
      (total, submission) =>
        total +
        getSubmissionScore(
          submission
        ),
      0
    );

  const challengesAttempted =
    bestSubmissions.length;

  const challengesSolved =
    bestSubmissions.filter(
      (submission) =>
        isSubmissionCorrect(
          submission
        ) ||
        getSubmissionScore(
          submission
        ) === 100
    ).length;

  const successRate =
    challengesAttempted > 0
      ? Math.round(
          (challengesSolved /
            challengesAttempted) *
            100
        )
      : 0;

  /* =========================
     RECENT SUBMISSIONS
  ========================= */

  const recentSubmissions = [
    ...submissions,
  ]
    .sort(
      (a, b) =>
        new Date(
          b.submittedAt ||
            b.createdAt ||
            0
        ) -
        new Date(
          a.submittedAt ||
            a.createdAt ||
            0
        )
    )
    .slice(0, 5);

  /* =========================
     UI HELPERS
  ========================= */

  const openSubmissions = (
    bounty
  ) => {
    setSelectedBounty(bounty);
  };

  const closeSubmissions = () => {
    setSelectedBounty(null);
  };

  const formatDate = (date) => {
    if (!date) {
      return "Unknown date";
    }

    try {
      const parsedDate =
        new Date(date);

      if (
        isNaN(
          parsedDate.getTime()
        )
      ) {
        return "Unknown date";
      }

      return parsedDate.toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return "Unknown date";
    }
  };

  const getSubmissionStatus = (
    submission
  ) => {
    if (
      isSubmissionCorrect(
        submission
      ) ||
      getSubmissionScore(
        submission
      ) === 100
    ) {
      return "Correct";
    }

    if (submission.status) {
      return submission.status;
    }

    return "Incorrect";
  };

  /* =========================
     SUBMISSION VIEW
  ========================= */

  if (selectedBounty) {
    const bountySubmissions =
      getBountySubmissions(
        selectedBounty.id
      );

    return (
      <div className="dashboard-page">

        <header className="dashboard-header">

          <div className="dashboard-logo">
            <span>◈</span>
            BIG BOUNTY
          </div>

          <button
            className="dashboard-back-btn"
            onClick={closeSubmissions}
          >
            ← Back to Dashboard
          </button>

        </header>

        <main className="submission-view">

          <div className="submission-view-header">

            <div>

              <div className="dashboard-label">
                BOUNTY SUBMISSIONS
              </div>

              <h1>
                {selectedBounty.title}
              </h1>

              <p>
                Review solutions submitted
                for this bounty.
              </p>

            </div>

            <div className="submission-count-large">

              <span>
                SUBMISSIONS
              </span>

              <strong>
                {bountySubmissions.length}
              </strong>

            </div>

          </div>

          {bountySubmissions.length > 0 ? (

            <div className="submission-list">

              {bountySubmissions.map(
                (submission, index) => {

                  const correct =
                    isSubmissionCorrect(
                      submission
                    ) ||
                    getSubmissionScore(
                      submission
                    ) === 100;

                  return (
                    <div
                      className="submission-card"
                      key={
                        submission.id ||
                        `${submission.bountyId}-${index}`
                      }
                    >

                      <div className="submission-card-top">

                        <div>

                          <small>
                            SUBMITTED BY
                          </small>

                          <h2>
                            {submission.hacker ||
                              submission.name ||
                              "Anonymous Hacker"}
                          </h2>

                        </div>

                        <span
                          className={`submission-status ${
                            correct
                              ? "correct"
                              : "incorrect"
                          }`}
                        >
                          {getSubmissionStatus(
                            submission
                          )}
                        </span>

                      </div>

                      <div className="submission-date">
                        Submitted on{" "}
                        {formatDate(
                          submission.submittedAt ||
                            submission.createdAt
                        )}
                      </div>

                      <div className="submission-score-display">

                        <small>
                          SCORE EARNED
                        </small>

                        <strong>
                          +
                          {getSubmissionScore(
                            submission
                          )} XP
                        </strong>

                      </div>

                      <div className="submission-info-grid">

                        <div>

                          <small>
                            TESTS PASSED
                          </small>

                          <p>
                            {submission.passedTests ?? 0}
                            /
                            {submission.totalTests ?? 0}
                          </p>

                        </div>

                        <div>

                          <small>
                            RESULT
                          </small>

                          <p>
                            {getSubmissionStatus(
                              submission
                            )}
                          </p>

                        </div>

                        <div>

                          <small>
                            SUBMISSION ID
                          </small>

                          <p>
                            {submission.id || "N/A"}
                          </p>

                        </div>

                      </div>

                      <div className="submission-description">

                        <small>
                          BOUNTY
                        </small>

                        <p>
                          {submission.bountyTitle ||
                            selectedBounty.title}
                        </p>

                      </div>

                      <div className="submission-actions">

                        <button
                          className="submission-review-btn"
                          onClick={() =>
                            alert(
                              "Submission review feature coming next."
                            )
                          }
                        >
                          REVIEW SUBMISSION
                        </button>

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          ) : (

            <div className="submission-empty">

              <div>◈</div>

              <h2>
                No Submissions Yet
              </h2>

              <p>
                Developers haven't submitted
                solutions for this bounty yet.
              </p>

            </div>

          )}

        </main>

      </div>
    );
  }

  /* =========================
     MAIN DASHBOARD
  ========================= */

  return (
    <div className="dashboard-page">

      {/* HEADER */}

      <header className="dashboard-header">

        <div className="dashboard-logo">
          <span>◈</span>
          BIG BOUNTY
        </div>

        <button
          className="dashboard-back-btn"
          onClick={goHome}
        >
          ← Back to Home
        </button>

      </header>

      {/* =========================
         HACKER PERFORMANCE
      ========================= */}

      <section className="hacker-dashboard">

        <div className="dashboard-label">
          HACKER PERFORMANCE
        </div>

        <h1>
          Your <span>Progress</span>
        </h1>

        <p>
          Track your challenge performance,
          score, and recent submissions.
        </p>

        {/* STATS */}

        <div className="hacker-stats">

          <div className="hacker-stat">

            <small>
              TOTAL SCORE
            </small>

            <strong>
              {totalScore}
            </strong>

            <span>
              XP
            </span>

          </div>

          <div className="hacker-stat">

            <small>
              CHALLENGES ATTEMPTED
            </small>

            <strong>
              {challengesAttempted}
            </strong>

          </div>

          <div className="hacker-stat">

            <small>
              CHALLENGES SOLVED
            </small>

            <strong>
              {challengesSolved}
            </strong>

          </div>

          <div className="hacker-stat">

            <small>
              SUCCESS RATE
            </small>

            <strong>
              {successRate}%
            </strong>

          </div>

        </div>

        {/* RECENT SUBMISSIONS */}

        <div className="recent-submissions">

          <div className="recent-submissions-header">

            <div>

              <h2>
                Recent Submissions
              </h2>

              <p>
                Your latest challenge attempts
              </p>

            </div>

          </div>

          {recentSubmissions.length > 0 ? (

            <div className="recent-submission-list">

              {recentSubmissions.map(
                (submission, index) => {

                  const correct =
                    isSubmissionCorrect(
                      submission
                    ) ||
                    getSubmissionScore(
                      submission
                    ) === 100;

                  const bounty =
                    bounties.find(
                      (item) =>
                        String(
                          item.id
                        ) ===
                        String(
                          submission.bountyId
                        )
                    );

                  return (
                    <div
                      className="recent-submission-card"
                      key={
                        submission.id ||
                        `${submission.bountyId}-${index}`
                      }
                    >

                      <div className="recent-submission-icon">
                        {correct
                          ? "✓"
                          : "×"}
                      </div>

                      <div className="recent-submission-main">

                        <h3>
                          {submission.bountyTitle ||
                            bounty?.title ||
                            "Untitled Challenge"}
                        </h3>

                        <p>
                          Submitted on{" "}
                          {formatDate(
                            submission.submittedAt ||
                              submission.createdAt
                          )}
                        </p>

                      </div>

                      <div
                        className={`recent-submission-status ${
                          correct
                            ? "correct"
                            : "incorrect"
                        }`}
                      >
                        {correct
                          ? "CORRECT"
                          : getSubmissionStatus(
                              submission
                            ).toUpperCase()}
                      </div>

                      <div className="recent-submission-score">

                        <small>
                          SCORE
                        </small>

                        <strong>
                          +
                          {getSubmissionScore(
                            submission
                          )} XP
                        </strong>

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          ) : (

            <div className="recent-submissions-empty">

              <div>◈</div>

              <h3>
                No Submissions Yet
              </h3>

              <p>
                Solve a bounty challenge
                to start building your score.
              </p>

            </div>

          )}

        </div>

      </section>

      {/* =========================
         CREATOR DASHBOARD
      ========================= */}

      <section className="dashboard-hero">

        <div className="dashboard-label">
          CREATOR DASHBOARD
        </div>

        <h1>
          My <span>Bounties</span>
        </h1>

        <p>
          Manage the challenges you've posted
          and review developer submissions.
        </p>

      </section>

      {/* CREATOR STATS */}

      <section className="dashboard-stats">

        <div className="dashboard-stat">

          <small>
            TOTAL BOUNTIES
          </small>

          <strong>
            {bounties.length}
          </strong>

        </div>

        <div className="dashboard-stat">

          <small>
            TOTAL SUBMISSIONS
          </small>

          <strong>
            {submissions.length}
          </strong>

        </div>

        <div className="dashboard-stat">

          <small>
            OPEN BOUNTIES
          </small>

          <strong>
            {
              bounties.filter(
                (bounty) =>
                  String(
                    bounty.status || "Open"
                  ).toLowerCase() !==
                  "closed"
              ).length
            }
          </strong>

        </div>

      </section>

      {/* BOUNTIES */}

      <main className="dashboard-content">

        <div className="dashboard-title-row">

          <div>

            <h2>
              Your Bounties
            </h2>

            <p>
              Challenges you've posted
            </p>

          </div>

          <button
            className="dashboard-explore-btn"
            onClick={
              onExplore || goHome
            }
          >
            EXPLORE →
          </button>

        </div>

        {bounties.length > 0 ? (

          <div className="dashboard-grid">

            {bounties.map(
              (bounty) => {

                const submissionCount =
                  getSubmissionCount(
                    bounty.id
                  );

                return (
                  <div
                    className="dashboard-card"
                    key={
                      bounty.id
                    }
                  >

                    <div className="dashboard-card-top">

                      <span>
                        {bounty.category ||
                          "Security"}
                      </span>

                      <small>
                        {bounty.status ||
                          "Open"}
                      </small>

                    </div>

                    <h3>
                      {bounty.title ||
                        "Untitled Bounty"}
                    </h3>

                    <p>
                      {bounty.description ||
                        "No description provided."}
                    </p>

                    <div className="dashboard-card-details">

                      <div>

                        <small>
                          REWARD
                        </small>

                        <strong>
                          ₹
                          {Number(
                            bounty.reward ||
                            0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </strong>

                      </div>

                      <div>

                        <small>
                          DIFFICULTY
                        </small>

                        <strong>
                          {bounty.difficulty ||
                            "Medium"}
                        </strong>

                      </div>

                      <div>

                        <small>
                          SUBMISSIONS
                        </small>

                        <strong>
                          {submissionCount}
                        </strong>

                      </div>

                    </div>

                    <div className="dashboard-card-buttons">

                      <button
                        className="dashboard-view-btn"
                        onClick={() =>
                          viewBounty(
                            bounty
                          )
                        }
                      >
                        VIEW BOUNTY →
                      </button>

                      <button
                        className="dashboard-submissions-btn"
                        onClick={() =>
                          openSubmissions(
                            bounty
                          )
                        }
                      >
                        VIEW SUBMISSIONS (
                        {submissionCount}
                        )
                      </button>

                    </div>

                  </div>
                );
              }
            )}

          </div>

        ) : (

          <div className="dashboard-empty">

            <div>
              ◈
            </div>

            <h3>
              No Bounties Yet
            </h3>

            <p>
              You haven't posted any bounties yet.
              Create your first challenge and let
              developers compete to solve it.
            </p>

            <button
              onClick={
                onExplore || goHome
              }
            >
              EXPLORE BOUNTIES
            </button>

          </div>

        )}

      </main>

    </div>
  );
}

export default Dashboard;