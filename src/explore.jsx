import React, { useEffect, useState } from "react";
import "./explore.css";

function Explore({
  bounties = [],
  onViewBounty,
  onBack,
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [severity, setSeverity] = useState("All");
  const [sort, setSort] = useState("Newest");

  const [storedBounties, setStoredBounties] =
    useState([]);

  /* =========================
     LOAD BOUNTIES FROM STORAGE
  ========================= */

  const loadStoredBounties = () => {
    try {
      const saved =
        localStorage.getItem("bounties");

      if (!saved) {
        setStoredBounties([]);
        return;
      }

      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        setStoredBounties(parsed);
      } else {
        setStoredBounties([]);
      }
    } catch (error) {
      console.error(
        "Error loading bounties in Explore:",
        error
      );

      setStoredBounties([]);
    }
  };

  /* =========================
     INITIAL LOAD
  ========================= */

  useEffect(() => {
    loadStoredBounties();

    const handleStorageChange = () => {
      loadStoredBounties();
    };

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    /*
      Custom event for updates made
      inside the same browser tab.
    */

    const handleBountyUpdate = () => {
      loadStoredBounties();
    };

    window.addEventListener(
      "bountiesUpdated",
      handleBountyUpdate
    );

    /*
      Small refresh interval ensures
      newly-created bounties appear
      even if another component
      updates localStorage.
    */

    const interval = setInterval(
      loadStoredBounties,
      1000
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange
      );

      window.removeEventListener(
        "bountiesUpdated",
        handleBountyUpdate
      );

      clearInterval(interval);
    };
  }, []);

  /* =========================
     SAMPLE BOUNTIES
  ========================= */

  const sampleBounties = [
    {
      id: "sample-1",
      title:
        "Authentication Bypass in Login System",
      company: "SecureCore",
      description:
        "Find vulnerabilities that allow users to bypass the authentication mechanism.",
      reward: 500,
      category: "Web Security",
      severity: "High",
      status: "Open",
      deadline: "7 days left",
      createdAt:
        "2026-08-20T10:00:00",
      tags: [
        "Authentication",
        "Web",
      ],
    },

    {
      id: "sample-2",
      title:
        "XSS Vulnerability Detection",
      company: "CyberLabs",
      description:
        "Identify potential stored or reflected XSS vulnerabilities in the application.",
      reward: 300,
      category: "Web Security",
      severity: "Medium",
      status: "Open",
      deadline: "12 days left",
      createdAt:
        "2026-08-19T10:00:00",
      tags: [
        "XSS",
        "Web",
      ],
    },

    {
      id: "sample-3",
      title:
        "API Authorization Bug",
      company: "DataShield",
      description:
        "Find an authorization vulnerability that allows unauthorized access to API resources.",
      reward: 750,
      category: "API Security",
      severity: "Critical",
      status: "Open",
      deadline: "5 days left",
      createdAt:
        "2026-08-18T10:00:00",
      tags: [
        "API",
        "Authorization",
      ],
    },

    {
      id: "sample-4",
      title:
        "Mobile Authentication Weakness",
      company: "AppSecure",
      description:
        "Analyze the mobile application and identify weaknesses in its authentication system.",
      reward: 600,
      category: "Mobile Security",
      severity: "High",
      status: "Open",
      deadline: "15 days left",
      createdAt:
        "2026-08-17T10:00:00",
      tags: [
        "Mobile",
        "Authentication",
      ],
    },
  ];

  /* =========================
     COMBINE BOUNTIES
  ========================= */

  /*
    App.jsx bounties and localStorage
    bounties may contain the same items.

    Use a Map so duplicates don't
    appear in Explore.
  */

  const bountyMap = new Map();

  [...sampleBounties, ...storedBounties, ...bounties]
    .forEach((bounty) => {
      if (!bounty) return;

      const id =
        bounty.id ??
        bounty.title;

      bountyMap.set(String(id), bounty);
    });

  const allBounties =
    Array.from(bountyMap.values());

  /* =========================
     FILTER
  ========================= */

  let filteredBounties =
    allBounties.filter((bounty) => {
      const title = String(
        bounty.title || ""
      ).toLowerCase();

      const description = String(
        bounty.description || ""
      ).toLowerCase();

      const company = String(
        bounty.company || ""
      ).toLowerCase();

      const searchText =
        search.toLowerCase().trim();

      const matchesSearch =
        title.includes(searchText) ||
        description.includes(searchText) ||
        company.includes(searchText);

      const matchesCategory =
        category === "All" ||
        bounty.category === category;

      const matchesSeverity =
        severity === "All" ||
        bounty.severity === severity;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesSeverity
      );
    });

  /* =========================
     SORT
  ========================= */

  filteredBounties = [
    ...filteredBounties,
  ].sort((a, b) => {
    if (sort === "Newest") {
      return (
        new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
      );
    }

    if (sort === "Oldest") {
      return (
        new Date(a.createdAt || 0) -
        new Date(b.createdAt || 0)
      );
    }

    if (sort === "Highest Reward") {
      return (
        Number(b.reward || 0) -
        Number(a.reward || 0)
      );
    }

    if (sort === "Lowest Reward") {
      return (
        Number(a.reward || 0) -
        Number(b.reward || 0)
      );
    }

    return 0;
  });

  /* =========================
     VIEW BOUNTY
  ========================= */

  const handleViewBounty = (bounty) => {
    if (typeof onViewBounty === "function") {
      onViewBounty(bounty);
    }
  };

  /* =========================
     HOME
  ========================= */

  const handleHome = (event) => {
    event.preventDefault();

    if (typeof onBack === "function") {
      onBack();
    }
  };

  /* =========================
     EXPLORE
  ========================= */

  const handleExplore = (event) => {
    event.preventDefault();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================
     UI
  ========================= */

  return (
    <div className="explore-page">

      {/* =========================
          NAVBAR
      ========================= */}

      <header className="explore-header">

        <div className="explore-logo">
          BUG<span>BOUNTY</span>
        </div>

        <nav>

          <a
            href="#explore"
            className="active"
            onClick={handleExplore}
          >
            Explore
          </a>

          <a
            href="#home"
            onClick={handleHome}
          >
            Home
          </a>

          <a
            href="#how-it-works"
            onClick={(e) =>
              e.preventDefault()
            }
          >
            How It Works
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

      {/* =========================
          HERO
      ========================= */}

      <section
        className="explore-hero"
        id="explore"
      >

        <div className="hero-label">
          SECURITY RESEARCH
        </div>

        <h1>
          Explore{" "}
          <span>Bug Bounties</span>
        </h1>

        <p>
          Find vulnerabilities. Help secure
          products. Earn rewards.
          <br />
          Choose a bounty and start hunting.
        </p>

        {/* SEARCH */}

        <div className="search-box">

          <span>⌕</span>

          <input
            type="text"
            placeholder="Search bounties, companies, vulnerabilities..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

      </section>

      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main className="explore-content">

        {/* =========================
            FILTER SIDEBAR
        ========================= */}

        <aside className="filters">

          <h3>
            FILTERS
          </h3>

          {/* CATEGORY */}

          <div className="filter-group">

            <h4>
              CATEGORY
            </h4>

            <button
              className={
                category === "All"
                  ? "active-filter"
                  : ""
              }
              onClick={() =>
                setCategory("All")
              }
            >
              All Bounties
            </button>

            <button
              className={
                category === "Web Security"
                  ? "active-filter"
                  : ""
              }
              onClick={() =>
                setCategory(
                  "Web Security"
                )
              }
            >
              Web Security
            </button>

            <button
              className={
                category === "API Security"
                  ? "active-filter"
                  : ""
              }
              onClick={() =>
                setCategory(
                  "API Security"
                )
              }
            >
              API Security
            </button>

            <button
              className={
                category === "Mobile Security"
                  ? "active-filter"
                  : ""
              }
              onClick={() =>
                setCategory(
                  "Mobile Security"
                )
              }
            >
              Mobile Security
            </button>

            <button
              className={
                category ===
                "Network Security"
                  ? "active-filter"
                  : ""
              }
              onClick={() =>
                setCategory(
                  "Network Security"
                )
              }
            >
              Network Security
            </button>

          </div>

          {/* SEVERITY */}

          <div className="filter-group">

            <h4>
              SEVERITY
            </h4>

            <button
              className={
                severity === "All"
                  ? "active-filter"
                  : ""
              }
              onClick={() =>
                setSeverity("All")
              }
            >
              All Severities
            </button>

            <button
              className={
                severity === "Critical"
                  ? "active-filter"
                  : ""
              }
              onClick={() =>
                setSeverity("Critical")
              }
            >
              Critical
            </button>

            <button
              className={
                severity === "High"
                  ? "active-filter"
                  : ""
              }
              onClick={() =>
                setSeverity("High")
              }
            >
              High
            </button>

            <button
              className={
                severity === "Medium"
                  ? "active-filter"
                  : ""
              }
              onClick={() =>
                setSeverity("Medium")
              }
            >
              Medium
            </button>

            <button
              className={
                severity === "Low"
                  ? "active-filter"
                  : ""
              }
              onClick={() =>
                setSeverity("Low")
              }
            >
              Low
            </button>

          </div>

        </aside>

        {/* =========================
            BOUNTY SECTION
        ========================= */}

        <section className="bounty-section">

          {/* TOP BAR */}

          <div className="bounty-top">

            <div>

              <h2>
                Available Bounties
              </h2>

              <p>
                {filteredBounties.length}{" "}
                {filteredBounties.length === 1
                  ? "bounty"
                  : "bounties"}{" "}
                available
              </p>

            </div>

            {/* SORT */}

            <div className="sort-box">

              <label>
                SORT BY
              </label>

              <select
                value={sort}
                onChange={(e) =>
                  setSort(e.target.value)
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

          {/* =========================
              BOUNTY GRID
          ========================= */}

          {filteredBounties.length > 0 ? (

            <div className="bounty-grid">

              {filteredBounties.map(
                (bounty) => (

                  <div
                    className="bounty-card"
                    key={bounty.id}
                  >

                    {/* CARD TOP */}

                    <div className="card-top">

                      <span className="bounty-tag">
                        {bounty.category ||
                          "Security"}
                      </span>

                      <span className="deadline">
                        {bounty.deadline ||
                          "Open"}
                      </span>

                    </div>

                    {/* TITLE */}

                    <h3>
                      {bounty.title ||
                        "Untitled Bounty"}
                    </h3>

                    {/* COMPANY */}

                    <div className="company">
                      {bounty.company ||
                        "Independent Researcher"}
                    </div>

                    {/* DESCRIPTION */}

                    <p>
                      {bounty.description ||
                        "No description provided."}
                    </p>

                    {/* TAGS */}

                    <div className="card-tags">

                      <span>
                        {bounty.severity ||
                          "Medium"}
                      </span>

                      <span>
                        {bounty.category ||
                          "Security"}
                      </span>

                      {Array.isArray(
                        bounty.tags
                      ) &&
                        bounty.tags
                          .slice(0, 2)
                          .map(
                            (
                              tag,
                              index
                            ) => (
                              <span
                                key={`${tag}-${index}`}
                              >
                                {tag}
                              </span>
                            )
                          )}

                    </div>

                    {/* STATUS */}

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

                    {/* BOTTOM */}

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
                No bounties found
              </h3>

              <p>
                Try changing your search
                or filters.
              </p>

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default Explore;
