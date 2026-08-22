import { useEffect, useState } from "react";

import "./arena.css";

function Arena({ bounty, onBack }) {
  const [code, setCode] = useState(
    bounty?.buggyCode || ""
  );

  const [timeLeft, setTimeLeft] = useState(
    (Number(bounty?.timeLimit) || 30) * 60
  );

  const [output, setOutput] = useState("");

  const [testResults, setTestResults] = useState([]);

  const [showHint, setShowHint] = useState(false);

  const [challengeEnded, setChallengeEnded] =
    useState(false);

  const [submitted, setSubmitted] =
    useState(false);

  const [score, setScore] = useState(null);

  const [submissionStatus, setSubmissionStatus] =
    useState("");

  /* =========================
     HACKER NAME
  ========================= */

  const [hackerName, setHackerName] = useState(
    localStorage.getItem("bugBountyUsername") || ""
  );

  /* =========================
     TIMER
  ========================= */

  useEffect(() => {
    if (timeLeft <= 0) {
      setChallengeEnded(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((previousTime) => {
        if (previousTime <= 1) {
          clearInterval(timer);

          setChallengeEnded(true);

          return 0;
        }

        return previousTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  /* =========================
     FORMAT TIME
  ========================= */

  const formatTime = (seconds) => {
    const minutes =
      Math.floor(seconds / 60);

    const remainingSeconds =
      seconds % 60;

    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(remainingSeconds).padStart(
      2,
      "0"
    )}`;
  };

  /* =========================
     NORMALIZE VALUE
  ========================= */

  const normalizeValue = (value) => {
    if (
      typeof value !== "string"
    ) {
      return value;
    }

    const trimmed =
      value.trim();

    if (trimmed === "true") {
      return true;
    }

    if (trimmed === "false") {
      return false;
    }

    if (
      trimmed !== "" &&
      !isNaN(trimmed)
    ) {
      return Number(trimmed);
    }

    return trimmed;
  };

  /* =========================
     PARSE INPUT
  ========================= */

  const parseInput = (input) => {
    if (Array.isArray(input)) {
      return input;
    }

    if (
      typeof input !== "string"
    ) {
      return [input];
    }

    const trimmed =
      input.trim();

    if (!trimmed) {
      return [];
    }

    return trimmed
      .split(",")
      .map((value) =>
        normalizeValue(value)
      );
  };

  /* =========================
     EXECUTE FUNCTION
  ========================= */

  const executeFunction = () => {
    try {
      const functionMatch =
        code.match(
          /function\s+([a-zA-Z_$][\w$]*)\s*\(/
        );

      if (!functionMatch) {
        throw new Error(
          "No JavaScript function found."
        );
      }

      const functionName =
        functionMatch[1];

      const runner =
        new Function(
          `
            ${code}

            return ${functionName};
          `
        );

      const fn = runner();

      if (
        typeof fn !== "function"
      ) {
        throw new Error(
          "Could not find a valid function."
        );
      }

      return fn;

    } catch (error) {
      throw new Error(
        error.message
      );
    }
  };

  /* =========================
     RUN CODE
  ========================= */

  const runCode = () => {
    if (challengeEnded) {
      setOutput(
        "Challenge time has ended."
      );

      return;
    }

    try {
      const fn =
        executeFunction();

      const firstTest =
        bounty?.testCases?.[0];

      if (!firstTest) {
        setOutput(
          "Code executed successfully."
        );

        return;
      }

      const input =
        parseInput(
          firstTest.input
        );

      const result =
        fn(...input);

      setOutput(
        `Output: ${JSON.stringify(
          result
        )}`
      );

    } catch (error) {
      setOutput(
        `Error: ${error.message}`
      );
    }
  };

  /* =========================
     SAVE SUBMISSION
  ========================= */

  const saveSubmission = ({
    passedCount,
    totalTests,
    finalScore,
    status,
  }) => {
    try {
      const existingSubmissions =
        JSON.parse(
          localStorage.getItem(
            "bugBountySubmissions"
          ) || "[]"
        );

      const finalHackerName =
        hackerName.trim() ||
        "Anonymous Hacker";

      /*
        A submission is solved only
        when all test cases pass.
      */

      const solved =
        finalScore === 100;

      const submission = {
        id:
          `submission-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 8)}`,

        bountyId:
          bounty?.id ||
          bounty?.title ||
          "unknown",

        bountyTitle:
          bounty?.title ||
          "Untitled Challenge",

        hacker:
          finalHackerName,

        score:
          finalScore,

        passedTests:
          passedCount,

        totalTests:
          totalTests,

        attempted:
          true,

        solved:
          solved,

        correct:
          solved,

        status:
          status,

        submittedAt:
          new Date().toISOString(),
      };

      const updatedSubmissions = [
        ...existingSubmissions,
        submission,
      ];

      /* =========================
         SAVE SUBMISSIONS
      ========================= */

      localStorage.setItem(
        "bugBountySubmissions",
        JSON.stringify(
          updatedSubmissions
        )
      );

      /*
        Also save under the generic
        submissions key for
        Dashboard compatibility.
      */

      localStorage.setItem(
        "submissions",
        JSON.stringify(
          updatedSubmissions
        )
      );

      /* =========================
         NOTIFY APP
      ========================= */

      window.dispatchEvent(
        new Event(
          "submissionsUpdated"
        )
      );

    } catch (error) {
      console.error(
        "Could not save submission:",
        error
      );
    }
  };

  /* =========================
     SUBMIT SOLUTION
  ========================= */

  const submitSolution = () => {
    if (challengeEnded) {
      setOutput(
        "Challenge time has ended."
      );

      return;
    }

    if (submitted) {
      return;
    }

    /* =========================
       CHECK HACKER NAME
    ========================= */

    if (!hackerName.trim()) {
      setOutput(
        "Please enter your hacker name before submitting."
      );

      return;
    }

    /*
      Save the name so it can
      automatically appear in
      future challenges.
    */

    localStorage.setItem(
      "bugBountyUsername",
      hackerName.trim()
    );

    try {
      const fn =
        executeFunction();

      const cases =
        bounty?.testCases || [];

      if (cases.length === 0) {
        setOutput(
          "No test cases have been configured for this challenge."
        );

        return;
      }

      const results = [];

      let passedCount = 0;

      /* =========================
         RUN ALL TEST CASES
      ========================= */

      cases.forEach(
        (testCase, index) => {
          try {
            const input =
              parseInput(
                testCase.input
              );

            const expected =
              normalizeValue(
                testCase.expectedOutput
              );

            const actual =
              fn(...input);

            const passed =
              JSON.stringify(actual) ===
              JSON.stringify(expected);

            if (passed) {
              passedCount++;
            }

            results.push({
              testNumber:
                index + 1,

              input:
                testCase.input,

              expected:
                expected,

              actual:
                actual,

              passed:
                passed,
            });

          } catch (error) {
            results.push({
              testNumber:
                index + 1,

              input:
                testCase.input,

              expected:
                testCase.expectedOutput,

              actual:
                `Error: ${error.message}`,

              passed:
                false,
            });
          }
        }
      );

      /* =========================
         CALCULATE SCORE
      ========================= */

      const totalTests =
        cases.length;

      const finalScore =
        Math.round(
          (passedCount /
            totalTests) *
            100
        );

      /* =========================
         DETERMINE STATUS
      ========================= */

      let status;

      if (
        passedCount === totalTests
      ) {
        status =
          "Correct";

      } else if (
        passedCount > 0
      ) {
        status =
          "Partially Correct";

      } else {
        status =
          "Incorrect";
      }

      /* =========================
         SAVE UI RESULTS
      ========================= */

      setTestResults(
        results
      );

      setScore(
        finalScore
      );

      setSubmissionStatus(
        status
      );

      setSubmitted(
        true
      );

      /* =========================
         SAVE SUBMISSION
      ========================= */

      saveSubmission({
        passedCount,
        totalTests,
        finalScore,
        status,
      });

      /* =========================
         OUTPUT MESSAGE
      ========================= */

      if (
        passedCount === totalTests
      ) {
        setOutput(
          `All ${totalTests} test cases passed!`
        );

      } else {
        setOutput(
          `${passedCount}/${totalTests} test cases passed.`
        );
      }

    } catch (error) {
      setOutput(
        `Submission Error: ${error.message}`
      );
    }
  };

  /* =========================
     RENDER
  ========================= */

  return (
    <div className="arena-page">

      {/* =========================
          HEADER
      ========================= */}

      <header className="arena-header">

        <div className="arena-brand">
          <span>◈</span>
          BIG BOUNTY
        </div>

        <div className="arena-header-center">
          <span className="arena-title">
            {bounty?.title}
          </span>
        </div>

        <div
          className={`arena-timer ${
            timeLeft <= 60
              ? "timer-danger"
              : ""
          }`}
        >
          ⏱ {formatTime(timeLeft)}
        </div>

      </header>

      {/* =========================
          MAIN
      ========================= */}

      <main className="arena-content">

        {/* =========================
            CHALLENGE PANEL
        ========================= */}

        <aside className="challenge-panel">

          <button
            className="arena-back-btn"
            onClick={onBack}
          >
            ← Challenge Details
          </button>

          <div className="challenge-meta">

            <span>
              {bounty?.category}
            </span>

            <span>
              {bounty?.difficulty}
            </span>

          </div>

          <h1>
            {bounty?.title}
          </h1>

          <p>
            {bounty?.description}
          </p>

          {/* HINT */}

          {bounty?.hint && (
            <div className="hint-section">

              <button
                className="hint-btn"
                onClick={() =>
                  setShowHint(
                    !showHint
                  )
                }
              >
                💡{" "}

                {showHint
                  ? "Hide Hint"
                  : "Show Hint"}

              </button>

              {showHint && (
                <div className="hint-box">
                  {bounty.hint}
                </div>
              )}

            </div>
          )}

          {/* INFO */}

          <div className="arena-info">

            <div>

              <span>
                CATEGORY
              </span>

              <strong>
                {bounty?.category}
              </strong>

            </div>

            <div>

              <span>
                DIFFICULTY
              </span>

              <strong>
                {bounty?.difficulty}
              </strong>

            </div>

            <div>

              <span>
                TIME LIMIT
              </span>

              <strong>
                {bounty?.timeLimit || 30} min
              </strong>

            </div>

          </div>

        </aside>

        {/* =========================
            EDITOR
        ========================= */}

        <section className="editor-panel">

          <div className="editor-header">

            <div>

              <span className="editor-dot red" />

              <span className="editor-dot yellow" />

              <span className="editor-dot green" />

            </div>

            <span>
              solution.js
            </span>

          </div>

          <textarea
            className="arena-editor"
            value={code}
            onChange={(event) =>
              setCode(
                event.target.value
              )
            }
            spellCheck="false"
            disabled={
              challengeEnded ||
              submitted
            }
          />

          {/* =========================
              HACKER NAME
          ========================= */}

          <div className="hacker-name-section">

            <label>
              HACKER NAME
            </label>

            <input
              type="text"
              className="hacker-name-input"
              placeholder="Enter your name"
              value={hackerName}
              onChange={(event) =>
                setHackerName(
                  event.target.value
                )
              }
              disabled={
                challengeEnded ||
                submitted
              }
            />

          </div>

          {/* ACTIONS */}

          <div className="arena-actions">

            <button
              className="run-btn"
              onClick={runCode}
              disabled={
                challengeEnded ||
                submitted
              }
            >
              ▶ RUN CODE
            </button>

            <button
              className="submit-solution-btn"
              onClick={
                submitSolution
              }
              disabled={
                challengeEnded ||
                submitted
              }
            >
              SUBMIT SOLUTION →
            </button>

          </div>

          {/* OUTPUT */}

          <div className="output-section">

            <div className="output-header">
              OUTPUT
            </div>

            <pre className="output-box">

              {output ||
                "Run your code to see the output."}

            </pre>

          </div>

          {/* TEST RESULTS */}

          {testResults.length > 0 && (

            <div className="test-results">

              <div className="test-results-header">

                <span>
                  TEST RESULTS
                </span>

                <strong>

                  {
                    testResults.filter(
                      (test) =>
                        test.passed
                    ).length
                  }

                  /

                  {testResults.length}

                </strong>

              </div>

              {testResults.map(
                (test) => (

                  <div
                    className={`test-result ${
                      test.passed
                        ? "test-passed"
                        : "test-failed"
                    }`}
                    key={
                      test.testNumber
                    }
                  >

                    <div>

                      <strong>

                        Test{" "}

                        {test.testNumber}

                      </strong>

                      <span>

                        {test.passed
                          ? "✓ Passed"
                          : "✗ Failed"}

                      </span>

                    </div>

                    <div className="test-values">

                      <p>

                        <span>
                          Input:
                        </span>

                        {JSON.stringify(
                          test.input
                        )}

                      </p>

                      <p>

                        <span>
                          Expected:
                        </span>

                        {JSON.stringify(
                          test.expected
                        )}

                      </p>

                      <p>

                        <span>
                          Actual:
                        </span>

                        {JSON.stringify(
                          test.actual
                        )}

                      </p>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

          {/* SCORE CARD */}

          {submitted &&
            score !== null && (

              <div className="score-card">

                <span>
                  CHALLENGE SCORE
                </span>

                <strong>

                  {score}

                  <small>
                    /100
                  </small>

                </strong>

                <p>

                  {
                    testResults.filter(
                      (test) =>
                        test.passed
                    ).length
                  }

                  /

                  {testResults.length}

                  {" "}

                  test cases passed

                </p>

                <div className="score-status">

                  {submissionStatus ===
                    "Correct" && (

                    <span>
                      ✓ CORRECT
                    </span>

                  )}

                  {submissionStatus ===
                    "Partially Correct" && (

                    <span>
                      ◐ PARTIALLY CORRECT
                    </span>

                  )}

                  {submissionStatus ===
                    "Incorrect" && (

                    <span>
                      ✗ INCORRECT
                    </span>

                  )}

                </div>

              </div>

            )}

        </section>

      </main>

      {/* =========================
          TIME ENDED
      ========================= */}

      {challengeEnded &&
        !submitted && (

          <div className="time-ended">

            <div className="time-ended-box">

              <h2>
                TIME'S UP!
              </h2>

              <p>
                The challenge timer has ended.
              </p>

              <button
                onClick={onBack}
              >
                BACK TO CHALLENGE
              </button>

            </div>

          </div>

        )}

    </div>
  );
}

export default Arena;