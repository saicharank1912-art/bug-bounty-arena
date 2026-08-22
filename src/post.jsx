import { useState } from "react";
import "./post.css";

function Post({
  onBack,
  onExplore,
  onCreateBounty,
}) {
  const getInitialFormData = () => ({
    title: "",
    description: "",
    category: "Web Development",
    difficulty: "Easy",
    timeLimit: "30",
    reward: "",
    buggyCode: "",
    hint: "",

    testCases: [
      {
        input: "",
        expectedOutput: "",
      },
    ],
  });

  const [formData, setFormData] =
    useState(getInitialFormData);

  const [submitted, setSubmitted] =
    useState(false);


  /* =========================
     HANDLE NORMAL INPUT
  ========================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  /* =========================
     HANDLE TEST CASE INPUT
  ========================= */

  const handleTestCaseChange = (
    index,
    field,
    value
  ) => {
    setFormData((previous) => {
      const updatedTestCases =
        previous.testCases.map(
          (testCase, testIndex) => {
            if (testIndex === index) {
              return {
                ...testCase,
                [field]: value,
              };
            }

            return testCase;
          }
        );

      return {
        ...previous,
        testCases: updatedTestCases,
      };
    });
  };


  /* =========================
     ADD TEST CASE
  ========================= */

  const addTestCase = () => {
    setFormData((previous) => ({
      ...previous,

      testCases: [
        ...previous.testCases,

        {
          input: "",
          expectedOutput: "",
        },
      ],
    }));
  };


  /* =========================
     REMOVE TEST CASE
  ========================= */

  const removeTestCase = (index) => {
    setFormData((previous) => {
      if (previous.testCases.length === 1) {
        return previous;
      }

      const updatedTestCases =
        previous.testCases.filter(
          (_, testIndex) =>
            testIndex !== index
        );

      return {
        ...previous,
        testCases: updatedTestCases,
      };
    });
  };


  /* =========================
     CREATE BOUNTY
  ========================= */

  const handleSubmit = (e) => {
    e.preventDefault();

    const validTestCases =
      formData.testCases.filter(
        (testCase) =>
          testCase.input.trim() !== "" &&
          testCase.expectedOutput.trim() !== ""
      );

    if (validTestCases.length === 0) {
      alert(
        "Please add at least one complete test case."
      );

      return;
    }


    const newBounty = {
      id: `bounty-${Date.now()}`,

      title:
        formData.title.trim(),

      description:
        formData.description.trim(),

      category:
        formData.category,

      difficulty:
        formData.difficulty,

      timeLimit:
        Number(formData.timeLimit) || 30,

      reward:
        Number(formData.reward) || 0,

      buggyCode:
        formData.buggyCode,

      testCases:
        validTestCases.map(
          (testCase) => ({
            input:
              testCase.input.trim(),

            expectedOutput:
              testCase.expectedOutput.trim(),
          })
        ),

      hint:
        formData.hint.trim(),

      severity:
        formData.difficulty === "Hard"
          ? "High"
          : formData.difficulty === "Medium"
          ? "Medium"
          : "Low",

      company:
        "Community",

      status:
        "Open",

      deadline:
        "New",

      time:
        `${formData.timeLimit} min`,

      tag:
        "CODE CHALLENGE",

      createdAt:
        new Date().toISOString(),

      tags: [
        formData.category,
        formData.difficulty,
      ],
    };


    /* =========================
       SAVE THROUGH APP
    ========================= */

    if (
      typeof onCreateBounty ===
      "function"
    ) {
      onCreateBounty(newBounty);

    } else {

      try {
        const saved =
          localStorage.getItem(
            "bounties"
          );

        let existing = [];

        if (saved) {
          const parsed =
            JSON.parse(saved);

          if (
            Array.isArray(parsed)
          ) {
            existing = parsed;
          }
        }

        const updated = [
          newBounty,
          ...existing,
        ];

        localStorage.setItem(
          "bounties",
          JSON.stringify(updated)
        );

        window.dispatchEvent(
          new Event(
            "bountiesUpdated"
          )
        );

      } catch (error) {
        console.error(
          "Error saving bounty:",
          error
        );
      }
    }


    console.log(
      "New Challenge Created:",
      newBounty
    );

    setSubmitted(true);
  };


  /* =========================
     CREATE ANOTHER
  ========================= */

  const createAnother = () => {
    setSubmitted(false);

    setFormData(
      getInitialFormData()
    );
  };


  /* =========================
     EXPLORE BUTTON
  ========================= */

  const handleExplore = () => {
    if (
      typeof onExplore ===
      "function"
    ) {
      onExplore();
      return;
    }

    window.dispatchEvent(
      new CustomEvent(
        "navigateToExplore"
      )
    );
  };


  /* =========================
     SUCCESS SCREEN
  ========================= */

  if (submitted) {
    return (
      <div className="post-page">

        <div className="post-success">

          <div className="success-icon">
            ✓
          </div>

          <h1>
            CHALLENGE CREATED
            SUCCESSFULLY!
          </h1>

          <p>
            Your bug-fixing challenge
            is now ready for developers
            to explore and solve.
          </p>

          <div className="success-buttons">

            <button
              type="button"
              className="explore-btn"
              onClick={handleExplore}
            >
              EXPLORE CHALLENGES
            </button>

            <button
              type="button"
              className="create-another-btn"
              onClick={createAnother}
            >
              CREATE ANOTHER
            </button>

          </div>

        </div>

      </div>
    );
  }


  /* =========================
     CREATE CHALLENGE FORM
  ========================= */

  return (
    <div className="post-page">

      <div className="post-container">

        {/* BACK */}

        <button
          type="button"
          className="back-btn"
          onClick={onBack}
        >
          ← BACK TO HOME
        </button>


        {/* HEADER */}

        <div className="post-header">

          <span className="post-tag">
            CREATE A CHALLENGE
          </span>

          <h1>
            CREATE BUG-FIXING
            CHALLENGE
          </h1>

          <p>
            Add buggy JavaScript code,
            define the challenge details,
            and let developers compete
            to fix it.
          </p>

        </div>


        {/* FORM */}

        <form
          className="bounty-form"
          onSubmit={handleSubmit}
        >

          {/* TITLE */}

          <div className="form-group">

            <label>
              CHALLENGE TITLE
            </label>

            <input
              type="text"
              name="title"
              placeholder="Example: Fix the broken binary search"
              value={formData.title}
              onChange={handleChange}
              required
            />

          </div>


          {/* DESCRIPTION */}

          <div className="form-group">

            <label>
              CHALLENGE DESCRIPTION
            </label>

            <textarea
              name="description"
              placeholder="Explain what the code should do and what is currently broken..."
              value={formData.description}
              onChange={handleChange}
              required
            />

          </div>


          {/* CATEGORY + DIFFICULTY */}

          <div className="form-row">

            <div className="form-group">

              <label>
                CATEGORY
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option>
                  Web Development
                </option>

                <option>
                  DSA
                </option>

              </select>

            </div>


            <div className="form-group">

              <label>
                DIFFICULTY
              </label>

              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
              >
                <option>
                  Easy
                </option>

                <option>
                  Medium
                </option>

                <option>
                  Hard
                </option>

              </select>

            </div>

          </div>


          {/* TIME LIMIT */}

          <div className="form-group">

            <label>
              TIME LIMIT (MINUTES)
            </label>

            <input
              type="number"
              name="timeLimit"
              min="1"
              placeholder="Example: 30"
              value={formData.timeLimit}
              onChange={handleChange}
              required
            />

          </div>


          {/* BUGGY CODE */}

          <div className="form-group code-group">

            <label>
              BUGGY JAVASCRIPT CODE
            </label>

            <textarea
              className="code-input"
              name="buggyCode"
              placeholder={`function add(a, b) {
  return a - b;
}`}
              value={formData.buggyCode}
              onChange={handleChange}
              required
              spellCheck="false"
            />

            <small>
              Add the JavaScript code
              containing the bug that
              participants must fix.
            </small>

          </div>


          {/* =========================
              TEST CASES
          ========================= */}

          <div className="test-cases-section">

            <div className="test-cases-header">

              <label>
                TEST CASES
              </label>

              <button
                type="button"
                className="add-test-case-btn"
                onClick={addTestCase}
              >
                + ADD TEST CASE
              </button>

            </div>


            {formData.testCases.map(
              (testCase, index) => (

                <div
                  className="test-case-card"
                  key={index}
                >

                  <div className="test-case-title">

                    <strong>
                      TEST CASE {index + 1}
                    </strong>

                    {formData.testCases.length > 1 && (

                      <button
                        type="button"
                        className="remove-test-case-btn"
                        onClick={() =>
                          removeTestCase(index)
                        }
                      >
                        REMOVE
                      </button>

                    )}

                  </div>


                  <div className="form-row">

                    <div className="form-group">

                      <label>
                        TEST INPUT
                      </label>

                      <input
                        type="text"
                        placeholder="Example: 2, 3"
                        value={testCase.input}
                        onChange={(event) =>
                          handleTestCaseChange(
                            index,
                            "input",
                            event.target.value
                          )
                        }
                        required
                      />

                    </div>


                    <div className="form-group">

                      <label>
                        EXPECTED OUTPUT
                      </label>

                      <input
                        type="text"
                        placeholder="Example: 5"
                        value={
                          testCase.expectedOutput
                        }
                        onChange={(event) =>
                          handleTestCaseChange(
                            index,
                            "expectedOutput",
                            event.target.value
                          )
                        }
                        required
                      />

                    </div>

                  </div>

                </div>

              )
            )}

          </div>


          {/* HINT */}

          <div className="form-group">

            <label>
              HINT (OPTIONAL)
            </label>

            <textarea
              name="hint"
              placeholder="Example: Check the operator used in the return statement."
              value={formData.hint}
              onChange={handleChange}
            />

          </div>


          {/* REWARD */}

          <div className="form-group">

            <label>
              REWARD
            </label>

            <div className="reward-input">

              <span>
                ₹
              </span>

              <input
                type="number"
                name="reward"
                placeholder="Enter challenge reward"
                min="1"
                value={formData.reward}
                onChange={handleChange}
                required
              />

            </div>

          </div>


          {/* SUBMIT */}

          <button
            type="submit"
            className="post-bounty-btn"
          >
            CREATE CHALLENGE →
          </button>

        </form>

      </div>

    </div>
  );
}

export default Post;