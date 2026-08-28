import React, { useState } from "react";
import "./explore.css";

function Explore({
  bounties = [],
  onViewBounty,
  onBack,
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] =
    useState("All");

  const [severity, setSeverity] =
    useState("All");

  const [sort, setSort] =
    useState("Newest");

  /* =========================
     SAMPLE BOUNTIES
     These are only for initial
     website appearance.
  ========================= */

  const sampleBounties = [
    {
      id: "sample-1",

      title:
        "Fix the Broken Login Function",

      company:
        "Bug Bounty Arena",

      description:
        "A JavaScript login validation function contains a logical bug. Find and fix it.",

      reward:
        500,

      category:
        "Web Development",

      difficulty:
        "Easy",

      severity:
        "Low",

      status:
        "Open",

      deadline:
        "New",

      createdAt:
        "2026-08-20T10:00:00",

      tags: [
        "JavaScript",
        "Login",
      ],

      buggyCode: `function login(username, password) {
  if (username === "admin" &&
      password !== "1234") {
    return "Login successful";
  }

  return "Invalid credentials";
}`,

      testCases: [
        {
          input: `"admin", "1234"`,

          expectedOutput:
            "Login successful",
        },
      ],

      hint:
        "Check the password comparison operator.",
    },

    {
      id: "sample-2",

      title:
        "Fix the Binary Search",

      company:
        "Bug Bounty Arena",

      description:
        "The binary search algorithm is not returning the correct index for some values.",

      reward:
        750,

      category:
        "DSA",

      difficulty:
        "Medium",

      severity:
        "Medium",

      status:
        "Open",

      deadline:
        "New",

      createdAt:
        "2026-08-19T10:00:00",

      tags: [
        "JavaScript",
        "Algorithms",
      ],

      buggyCode: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    const mid =
      Math.floor((left + right) / 2);

    if (arr[mid] === target) {
      return mid;
    }

    if (arr[mid] < target) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }

  return -1;
}`,

      testCases: [
        {
          input:
            `[1, 2, 3, 4, 5], 4`,

          expectedOutput:
            "3",
        },
      ],

      hint:
        "Check how the left and right boundaries move.",
    },

    {
      id: "sample-3",

      title:
        "Repair Array Sum Function",

      company:
        "Bug Bounty Arena",

      description:
        "Fix the JavaScript function so it correctly calculates the sum of all array elements.",

      reward:
        300,

      category:
        "DSA",

      difficulty:
        "Easy",

      severity:
        "Low",

      status:
        "Open",

      deadline:
        "New",

      createdAt:
        "2026-08-18T10:00:00",

      tags: [
        "Arrays",
        "JavaScript",
      ],

      buggyCode: `function arraySum(arr) {
  let sum = 0;

  for (
    let i = 0;
    i <= arr.length;
    i++
  ) {
    sum += arr[i];
  }

  return sum;
}`,

      testCases: [
        {
          input:
            `[1, 2, 3]`,

          expectedOutput:
            "6",
        },
      ],

      hint:
        "Check the loop condition.",
    },

    {
      id: "sample-4",

      title:
        "Fix the String Reversal",

      company:
        "Bug Bounty Arena",

      description:
        "This function is supposed to reverse a string but contains a bug.",

      reward:
        600,

      category:
        "Web Development",

      difficulty:
        "Medium",

      severity:
        "Medium",

      status:
        "Open",

      deadline:
        "New",

      createdAt:
        "2026-08-17T10:00:00",

      tags: [
        "Strings",
        "JavaScript",
      ],

      buggyCode: `function reverseString(str) {
  let result = "";

  for (
    let i = 0;
    i < str.length;
    i++
  ) {
    result += str[i];
  }

  return result;
}`,

      testCases: [
        {
          input:
            `"hello"`,

          expectedOutput:
            "olleh",
        },
      ],

      hint:
        "Think about the direction of the loop.",
    },
  ];

  /* =========================
     COMBINE SAMPLE + SUPABASE
  ========================= */

  const bountyMap = new Map();

  [
    ...sampleBounties,
    ...bounties,
  ].forEach((bounty) => {
    if (!bounty) {
      return;
    }

    const id =
      bounty.id ||
      bounty.title;

    bountyMap.set(
      String(id),
      bounty
    );
  });

  const allBounties =
    Array.from(
      bountyMap.values()
    );

  /* =========================
     FILTER
  ========================= */

  let filteredBounties =
    allBounties.filter(
      (bounty) => {
        const title =
          String(
            bounty.title || ""
          ).toLowerCase();

        const description =
          String(
            bounty.description || ""
          ).toLowerCase();

        const company =
          String(
            bounty.company || ""
          ).toLowerCase();

        const searchText =
          search
            .toLowerCase()
            .trim();

        const matchesSearch =
          title.includes(
            searchText
          ) ||
          description.includes(
            searchText
          ) ||
          company.includes(
            searchText
          );

        const matchesCategory =
          category === "All" ||
          bounty.category ===
            category;

        const matchesSeverity =
          severity === "All" ||
          bounty.severity ===
            severity;

        return (
          matchesSearch &&
          matchesCategory &&
          matchesSeverity
        );
      }
    );

  /* =========================
     SORT
  ========================= */

  filteredBounties = [
    ...filteredBounties,
  ].sort((a, b) => {
    if (sort === "Newest") {
      return (
        new Date(
          b.createdAt || 0
        ) -
        new Date(
          a.createdAt || 0
        )
      );
    }

    if (sort === "Oldest") {
      return (
        new Date(
          a.createdAt || 0
        ) -
        new Date(
          b.createdAt || 0
        )
      );
    }

    if (
      sort ===
      "Highest Reward"
    ) {
      return (
        Number(
          b.reward || 0
        ) -
        Number(
          a.reward || 0
        )
      );
    }

    if (
      sort ===
      "Lowest Reward"
    ) {
      return (
        Number(
          a.reward || 0
        ) -
        Number(
          b.reward || 0
        )
      );
    }

    return 0;
  });

  /* =========================
     VIEW BOUNTY
  ========================= */

  const handleViewBounty =
    (bounty) => {
      if (
        typeof onViewBounty ===
        "function"
      ) {
        onViewBounty(
          bounty
        );
      }
    };

  /* =========================
     HOME
  ========================= */

  const handleHome =
    (event) => {
      event.preventDefault();

      if (
        typeof onBack ===
        "function"
      ) {
        onBack();
      }
    };

  /* =========================
     UI
  ========================= */

  return (
    <div className="explore-page">

      <header className="explore-header">

        <div className="explore-logo">
          BUG<span>BOUNTY</span>
        </div>

        <nav>

          <a
            href="#explore"
            className="active"
            onClick={(event) => {
              event.preventDefault();

              window.scrollTo({
                top: 0,
                behavior:
                  "smooth",
              });
            }}
          >
            Explore
          </a>

          <a
            href="#home"
            onClick={
              handleHome
            }
          >
            Home
          </a>

        </nav>

        <button
          className="login-btn"
          onClick={() => {
            alert(
              "Login feature coming soon."
            );
          }}
        >
          Login
        </button>

      </header>

      <section
        className="explore-hero"
        id="explore"
      >

        <div className="hero-label">
          CODE CHALLENGES
        </div>

        <h1>
          Explore{" "}
          <span>
            Bug Bounties
          </span>
        </h1>

        <p>
          Find bugs. Fix code.
          Earn rewards.
          <br />
          Choose a challenge and
          start coding.
        </p>

        <div className="search-box">

          <span>
            ⌕
          </span>

          <input
            type="text"
            placeholder="Search challenges..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
          />

        </div>

      </section>

      <main className="explore-content">

        <aside className="filters">

          <h3>
            FILTERS
          </h3>

          <div className="filter-group">

            <h4>
              CATEGORY
            </h4>

            {[
              "All",
              "Web Development",
              "DSA",
            ].map(
              (item) => (
                <button
                  key={item}
                  className={
                    category === item
                      ? "active-filter"
                      : ""
                  }
                  onClick={() =>
                    setCategory(
                      item
                    )
                  }
                >
                  {item === "All"
                    ? "All Challenges"
                    : item}
                </button>
              )
            )}

          </div>

          <div className="filter-group">

            <h4>
              DIFFICULTY
            </h4>

            {[
              "All",
              "Low",
              "Medium",
              "High",
            ].map(
              (item) => (
                <button
                  key={item}
                  className={
                    severity === item
                      ? "active-filter"
                      : ""
                  }
                  onClick={() =>
                    setSeverity(
                      item
                    )
                  }
                >
                  {item === "All"
                    ? "All Difficulties"
                    : item}
                </button>
              )
            )}

          </div>

        </aside>

        <section className="bounty-section">

          <div className="bounty-top">

            <div>

              <h2>
                Available Challenges
              </h2>

              <p>
                {
                  filteredBounties.length
                }{" "}
                {filteredBounties.length ===
                1
                  ? "challenge"
                  : "challenges"}{" "}
                available
              </p>

            </div>

            <div className="sort-box">

              <label>
                SORT BY
              </label>

              <select
                value={sort}
                onChange={(event) =>
                  setSort(
                    event.target.value
                  )
                }
              >

                <option value="Newest">
                  Newest
                </option>

                <option value="Oldest">
                  Oldest
                </option>

                <option value="Highest Reward">
                  Highest Reward
                </option>

                <option value="Lowest Reward">
                  Lowest Reward
                </option>

              </select>

            </div>

          </div>

          {filteredBounties.length >
          0 ? (

            <div className="bounty-grid">

              {filteredBounties.map(
                (bounty) => (

                  <div
                    className="bounty-card"
                    key={
                      bounty.id
                    }
                  >

                    <div className="card-top">

                      <span className="bounty-tag">
                        {
                          bounty.category
                        }
                      </span>

                      <span className="deadline">
                        {bounty.deadline ||
                          "Open"}
                      </span>

                    </div>

                    <h3>
                      {bounty.title}
                    </h3>

                    <div className="company">
                      {bounty.company ||
                        "Community"}
                    </div>

                    <p>
                      {
                        bounty.description
                      }
                    </p>

                    <div className="card-tags">

                      <span>
                        {bounty.difficulty ||
                          bounty.severity ||
                          "Easy"}
                      </span>

                      <span>
                        {
                          bounty.category
                        }
                      </span>

                    </div>

                    <div className="card-status">

                      <span>
                        STATUS
                      </span>

                      <strong
                        className={`status-${String(
                          bounty.status ||
                            "Open"
                        )
                          .toLowerCase()
                          .replace(
                            /\s+/g,
                            "-"
                          )}`}
                      >
                        {bounty.status ||
                          "Open"}
                      </strong>

                    </div>

                    <div className="card-bottom">

                      <div>

                        <small>
                          BOUNTY REWARD
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

                      <button
                        onClick={() =>
                          handleViewBounty(
                            bounty
                          )
                        }
                      >
                        View Bounty →
                      </button>

                    </div>

                  </div>

                )
              )}

            </div>

          ) : (

            <div className="no-results">

              <h3>
                No challenges found
              </h3>

              <p>
                Try changing your
                search or filters.
              </p>

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default Explore;