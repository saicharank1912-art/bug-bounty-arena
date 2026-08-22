import { useEffect, useState } from "react";
import "./leaderboard.css";

function Leaderboard({ onBack, onHome }) {
  const [leaderboard, setLeaderboard] = useState([]);

  /* =========================
     NAVIGATION
  ========================= */

  const goBack = onBack || onHome || (() => {});

  /* =========================
     SCORE HELPER
  ========================= */

  const getSubmissionScore = (submission) => {
    const possibleScore =
      submission.score ??
      submission.points ??
      submission.earnedScore ??
      submission.rewardEarned ??
      0;

    const score = Number(possibleScore);

    return Number.isFinite(score) ? score : 0;
  };

  /* =========================
     CORRECT CHECK
  ========================= */

  const isSubmissionCorrect = (submission) => {
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
      status === "success" ||
      getSubmissionScore(submission) === 100
    );
  };

  /* =========================
     LOAD LEADERBOARD DATA
  ========================= */

  const loadLeaderboard = () => {
    try {
      /*
        PRIMARY:
        Same source used by Dashboard
        and Code Arena.
      */

      let savedSubmissions =
        localStorage.getItem(
          "bugBountySubmissions"
        );

      /*
        BACKWARD COMPATIBILITY:
        Use old submissions key if
        the new key doesn't exist.
      */

      if (!savedSubmissions) {
        savedSubmissions =
          localStorage.getItem(
            "submissions"
          );
      }

      if (!savedSubmissions) {
        setLeaderboard([]);
        return;
      }

      const submissions =
        JSON.parse(savedSubmissions);

      if (!Array.isArray(submissions)) {
        setLeaderboard([]);
        return;
      }

      /* =========================
         GROUP BY HACKER
      ========================= */

      const hackerMap = {};

      submissions.forEach((submission) => {
        const hacker =
          submission.hacker ||
          submission.name ||
          submission.username ||
          "Anonymous Hacker";

        /*
          Identify the challenge.

          bountyId is preferred.
        */

        const bountyId =
          submission.bountyId ??
          submission.bountyTitle ??
          submission.title ??
          "unknown";

        const score =
          getSubmissionScore(
            submission
          );

        const isCorrect =
          isSubmissionCorrect(
            submission
          );

        /* =========================
           CREATE HACKER
        ========================= */

        if (!hackerMap[hacker]) {
          hackerMap[hacker] = {
            hacker,
            totalScore: 0,
            solved: 0,
            attempted: 0,
            successRate: 0,
            challenges: {},
          };
        }

        /*
          Only the BEST result for
          each bounty counts.
        */

        const previousChallenge =
          hackerMap[hacker]
            .challenges[bountyId];

        if (
          previousChallenge ===
          undefined
        ) {
          hackerMap[hacker]
            .challenges[bountyId] = {
              score,
              correct: isCorrect,
            };
        } else {
          /*
            Replace only when:
            1. Score is higher
            OR
            2. Same score but new attempt
               is correct.
          */

          if (
            score >
              previousChallenge.score ||
            (
              score ===
                previousChallenge.score &&
              isCorrect &&
              !previousChallenge.correct
            )
          ) {
            hackerMap[hacker]
              .challenges[bountyId] = {
                score,
                correct: isCorrect,
              };
          }
        }
      });

      /* =========================
         CALCULATE TOTALS
      ========================= */

      Object.values(
        hackerMap
      ).forEach((hacker) => {
        const challenges =
          Object.values(
            hacker.challenges
          );

        hacker.totalScore =
          challenges.reduce(
            (total, challenge) =>
              total +
              Number(
                challenge.score
              ),
            0
          );

        hacker.attempted =
          challenges.length;

        hacker.solved =
          challenges.filter(
            (challenge) =>
              challenge.correct ===
              true
          ).length;

        hacker.successRate =
          hacker.attempted > 0
            ? Math.round(
                (
                  hacker.solved /
                  hacker.attempted
                ) *
                  100
              )
            : 0;
      });

      /* =========================
         SORT
      ========================= */

      const sorted =
        Object.values(
          hackerMap
        ).sort((a, b) => {
          /*
            1. Highest score
          */

          if (
            b.totalScore !==
            a.totalScore
          ) {
            return (
              b.totalScore -
              a.totalScore
            );
          }

          /*
            2. Most solved
          */

          if (
            b.solved !==
            a.solved
          ) {
            return (
              b.solved -
              a.solved
            );
          }

          /*
            3. Highest success rate
          */

          if (
            b.successRate !==
            a.successRate
          ) {
            return (
              b.successRate -
              a.successRate
            );
          }

          /*
            4. Most attempts as
               final tie breaker
          */

          return (
            b.attempted -
            a.attempted
          );
        });

      /* =========================
         ADD RANK
      ========================= */

      const ranked =
        sorted.map(
          (hacker, index) => ({
            ...hacker,
            rank: index + 1,
          })
        );

      setLeaderboard(ranked);
    } catch (error) {
      console.error(
        "Error loading leaderboard:",
        error
      );

      setLeaderboard([]);
    }
  };

  /* =========================
     INITIAL LOAD
  ========================= */

  useEffect(() => {
    loadLeaderboard();

    /*
      Cross-tab localStorage updates.
    */

    const handleStorageChange = () => {
      loadLeaderboard();
    };

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    /*
      Same-tab updates.
    */

    window.addEventListener(
      "bugBountyDataUpdated",
      handleStorageChange
    );

    /*
      Small refresh interval keeps
      the leaderboard synchronized
      while navigating around the app.
    */

    const refreshInterval =
      setInterval(
        loadLeaderboard,
        1000
      );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange
      );

      window.removeEventListener(
        "bugBountyDataUpdated",
        handleStorageChange
      );

      clearInterval(
        refreshInterval
      );
    };
  }, []);

  /* =========================
     RANK ICON
  ========================= */

  const getRankIcon = (rank) => {
    if (rank === 1) {
      return "🥇";
    }

    if (rank === 2) {
      return "🥈";
    }

    if (rank === 3) {
      return "🥉";
    }

    return `#${rank}`;
  };

  /* =========================
     MAIN UI
  ========================= */

  return (
    <div className="leaderboard-page">

      {/* HEADER */}

      <header className="leaderboard-header">

        <div className="leaderboard-logo">

          <span>
            ◈
          </span>

          BIG BOUNTY

        </div>

        <button
          className="leaderboard-back-btn"
          onClick={goBack}
        >
          ← Back
        </button>

      </header>

      {/* CONTENT */}

      <main className="leaderboard-content">

        {/* HERO */}

        <div className="leaderboard-hero">

          <span className="leaderboard-kicker">
            COMPETE • SOLVE • RANK
          </span>

          <h1>
            🏆 Leaderboard
          </h1>

          <p>
            The best hackers in the
            Big Bounty Arena.
          </p>

        </div>

        {/* EMPTY */}

        {leaderboard.length === 0 ? (

          <div className="leaderboard-empty">

            <div className="empty-icon">
              🏆
            </div>

            <h2>
              No Rankings Yet
            </h2>

            <p>
              Complete a challenge
              to appear on the
              leaderboard.
            </p>

          </div>

        ) : (

          <div className="leaderboard-card">

            {/* TABLE HEADER */}

            <div className="leaderboard-row leaderboard-table-header">

              <span>
                RANK
              </span>

              <span>
                HACKER
              </span>

              <span>
                SCORE
              </span>

              <span>
                SOLVED
              </span>

              <span>
                SUCCESS
              </span>

            </div>

            {/* ROWS */}

            {leaderboard.map(
              (hacker) => (

                <div
                  className={`leaderboard-row ${
                    hacker.rank <= 3
                      ? "top-ranker"
                      : ""
                  }`}
                  key={
                    hacker.hacker
                  }
                >

                  {/* RANK */}

                  <div className="rank-cell">

                    <span className="rank-icon">

                      {getRankIcon(
                        hacker.rank
                      )}

                    </span>

                  </div>

                  {/* HACKER */}

                  <div className="hacker-cell">

                    <div className="hacker-avatar">

                      {hacker.hacker
                        .charAt(0)
                        .toUpperCase()}

                    </div>

                    <div>

                      <strong>
                        {hacker.hacker}
                      </strong>

                      {hacker.rank ===
                        1 && (
                        <span className="champion-label">
                          TOP HACKER
                        </span>
                      )}

                    </div>

                  </div>

                  {/* SCORE */}

                  <div className="score-cell">

                    <strong>
                      {hacker.totalScore}
                    </strong>

                    <span>
                      points
                    </span>

                  </div>

                  {/* SOLVED */}

                  <div className="solved-cell">

                    <strong>
                      {hacker.solved}
                    </strong>

                    <span>
                      / {hacker.attempted}
                    </span>

                  </div>

                  {/* SUCCESS */}

                  <div className="success-cell">

                    <strong>
                      {hacker.successRate}%
                    </strong>

                  </div>

                </div>
              )
            )}

          </div>
        )}

        {/* SCORING INFO */}

        <div className="leaderboard-info">

          <div>

            <strong>
              100
            </strong>

            <span>
              Points for a
              perfect solution
            </span>

          </div>

          <div>

            <strong>
              BEST
            </strong>

            <span>
              Score per bounty
              counts
            </span>

          </div>

          <div>

            <strong>
              ∞
            </strong>

            <span>
              Challenges to
              compete in
            </span>

          </div>

        </div>

      </main>

    </div>
  );
}

export default Leaderboard;