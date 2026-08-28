import { useEffect, useState } from "react";
import { supabase } from "./supabase";

import Loading from "./loading";
import Landing from "./landing";
import Explore from "./explore";
import Bounty from "./bounty";
import Arena from "./arena";
import Submit from "./submit";
import Post from "./post";
import Dashboard from "./Dashboard";
import Leaderboard from "./leaderboard";

function App() {

  /* =========================
     APP STATE
  ========================= */

  const [loading, setLoading] =
    useState(true);

  const [page, setPage] =
    useState("landing");

  const [selectedBounty, setSelectedBounty] =
    useState(null);

  const [bounties, setBounties] =
    useState([]);


  /* =========================
     LOAD BOUNTIES FROM SUPABASE
  ========================= */

  useEffect(() => {

    const loadBounties = async () => {

      try {

        const {
          data,
          error,
        } = await supabase
          .from("bounties")
          .select("*")
          .order("created_at", {
            ascending: false,
          });

        if (error) {

          console.error(
            "Error loading bounties from Supabase:",
            error
          );

          return;
        }


        /*
          Convert Supabase database
          format into the format
          your existing app uses.
        */

        const formattedBounties =
          (data || []).map((bounty) => ({

            id:
              bounty.id,

            title:
              bounty.title,

            description:
              bounty.description,

            category:
              bounty.category,

            difficulty:
              bounty.difficulty,

            timeLimit:
              bounty.time_limit,

            reward:
              bounty.reward,

            buggyCode:
              bounty.buggy_code,

            testCases:
              bounty.test_cases || [],

            hint:
              bounty.hint || "",

            severity:
              bounty.difficulty === "Hard"
                ? "High"
                : bounty.difficulty === "Medium"
                ? "Medium"
                : "Low",

            company:
              "Community",

            status:
              "Open",

            deadline:
              "New",

            time:
              `${bounty.time_limit} min`,

            tag:
              "CODE CHALLENGE",

            createdAt:
              bounty.created_at,

            tags: [
              bounty.category,
              bounty.difficulty,
            ],

          }));


        setBounties(
          formattedBounties
        );

        console.log(
          "Global bounties loaded:",
          formattedBounties
        );

      } catch (error) {

        console.error(
          "Unexpected error loading bounties:",
          error
        );

      }

    };


    loadBounties();

  }, []);


  /* =========================
     LOADING SCREEN
  ========================= */

  useEffect(() => {

    const timer =
      setTimeout(() => {

        setLoading(false);

      }, 1000);


    return () => {

      clearTimeout(timer);

    };

  }, []);


  /* =========================
     NAVIGATION
  ========================= */

  const goHome = () => {

    setSelectedBounty(null);

    setPage("landing");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };


  const goExplore = () => {

    setSelectedBounty(null);

    setPage("explore");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };


  const goDashboard = () => {

    setSelectedBounty(null);

    setPage("dashboard");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };


  const goLeaderboard = () => {

    setSelectedBounty(null);

    setPage("leaderboard");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };


  const goPost = () => {

    setSelectedBounty(null);

    setPage("post");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };


  /* =========================
     SELECT BOUNTY
  ========================= */

  const handleViewBounty = (
    bounty
  ) => {

    if (!bounty) {
      return;
    }

    setSelectedBounty(bounty);

    setPage("bounty");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };


  /* =========================
     ENTER ARENA
  ========================= */

  const handleEnterArena = (
    bounty
  ) => {

    if (!bounty) {
      return;
    }

    setSelectedBounty(bounty);

    setPage("arena");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };


  /* =========================
     OPEN SUBMIT PAGE
  ========================= */

  const handleOpenSubmit = (
    bounty
  ) => {

    if (!bounty) {
      return;
    }

    setSelectedBounty(bounty);

    setPage("submit");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };


  /* =========================
     CREATE BOUNTY
  ========================= */

  const handleCreateBounty = (
    newBounty
  ) => {

    if (!newBounty) {
      return;
    }


    const bounty = {

      ...newBounty,

      id:
        newBounty.id ||
        `bounty-${Date.now()}`,

      status:
        newBounty.status ||
        "Open",

      createdAt:
        newBounty.createdAt ||
        new Date().toISOString(),

    };


    /*
      Supabase already contains
      this bounty because Post.jsx
      inserted it.

      We only update the local
      React state here so the
      challenge appears immediately
      without refreshing.
    */

    setBounties(
      (previousBounties) => {

        const updated = [

          bounty,

          ...previousBounties.filter(
            (item) =>
              String(item.id) !==
              String(bounty.id)
          ),

        ];


        return updated;

      }
    );


    setSelectedBounty(null);

    setPage("explore");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };


  /* =========================
     UPDATE BOUNTY STATUS
  ========================= */

  const handleStatusUpdate = (
    bountyId,
    newStatus
  ) => {

    /*
      For now this keeps the existing
      local app behavior.

      We are not changing the database
      schema for status yet because
      your current Supabase table does
      not have a status column.
    */

    setBounties(
      (previousBounties) => {

        return previousBounties.map(
          (bounty) => {

            if (
              String(bounty.id) ===
              String(bountyId)
            ) {

              return {

                ...bounty,

                status: newStatus,

              };

            }

            return bounty;

          }
        );

      }
    );


    setSelectedBounty(
      (previous) => {

        if (
          !previous ||
          String(previous.id) !==
          String(bountyId)
        ) {

          return previous;

        }

        return {

          ...previous,

          status: newStatus,

        };

      }
    );

  };


  /* =========================
     DELETE BOUNTY
  ========================= */

  const handleDeleteBounty = async (
    bountyId
  ) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this challenge? This action cannot be undone."
      );

    if (!confirmed) {
      return;
    }


    try {

      /*
        Delete from Supabase so
        the challenge disappears
        globally.
      */

      const {
        error,
      } = await supabase
        .from("bounties")
        .delete()
        .eq("id", bountyId);


      if (error) {

        console.error(
          "Error deleting bounty from Supabase:",
          error
        );

        alert(
          `Failed to delete challenge.\n\n${error.message}`
        );

        return;
      }


      /*
        Update React state.
      */

      setBounties(
        (previousBounties) =>
          previousBounties.filter(
            (bounty) =>
              String(bounty.id) !==
              String(bountyId)
          )
      );


      setSelectedBounty(null);

      setPage("explore");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });


    } catch (error) {

      console.error(
        "Unexpected delete error:",
        error
      );

    }

  };


  /* =========================
     SUBMISSION HANDLER
  ========================= */

  const handleSubmissionComplete = (
    submission
  ) => {

    try {

      const saved =
        localStorage.getItem(
          "bugBountySubmissions"
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


      const finalSubmission = {

        ...submission,

        id:
          submission?.id ||
          Date.now(),

        bountyId:
          submission?.bountyId ??
          selectedBounty?.id,

        bountyTitle:
          submission?.bountyTitle ??
          selectedBounty?.title,

        submittedAt:
          submission?.submittedAt ||
          new Date().toISOString(),

      };


      const updated = [

        finalSubmission,

        ...existing,

      ];


      localStorage.setItem(
        "bugBountySubmissions",
        JSON.stringify(updated)
      );


      localStorage.setItem(
        "submissions",
        JSON.stringify(updated)
      );


      window.dispatchEvent(
        new Event(
          "bugBountyDataUpdated"
        )
      );


      if (selectedBounty) {

        handleStatusUpdate(
          selectedBounty.id,
          "Submissions Received"
        );

      }


      setSelectedBounty(null);

      setPage("dashboard");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

    } catch (error) {

      console.error(
        "Error saving submission:",
        error
      );

    }

  };


  /* =========================
     LOADING
  ========================= */

  if (loading) {

    return <Loading />;

  }


  /* =========================
     LANDING
  ========================= */

  if (page === "landing") {

    return (

      <Landing
        onExplore={goExplore}
        onPost={goPost}
        onDashboard={goDashboard}
        onLeaderboard={
          goLeaderboard
        }
      />

    );

  }


  /* =========================
     EXPLORE
  ========================= */

  if (page === "explore") {

    return (

      <Explore

        bounties={bounties}

        onViewBounty={
          handleViewBounty
        }

        onBack={goHome}

      />

    );

  }


  /* =========================
     BOUNTY DETAILS
  ========================= */

  if (
    page === "bounty" &&
    selectedBounty
  ) {

    return (

      <Bounty

        bounty={selectedBounty}

        onBack={goExplore}

        onHome={goHome}

        onSubmit={() =>
          handleEnterArena(
            selectedBounty
          )
        }

        onDashboard={
          goDashboard
        }

        onLeaderboard={
          goLeaderboard
        }

        onUpdateStatus={(newStatus) =>
          handleStatusUpdate(
            selectedBounty.id,
            newStatus
          )
        }

        onDeleteBounty={() =>
          handleDeleteBounty(
            selectedBounty.id
          )
        }

      />

    );

  }


  /* =========================
     CODE ARENA
  ========================= */

  if (
    page === "arena" &&
    selectedBounty
  ) {

    return (

      <Arena

        bounty={selectedBounty}

        onBack={() =>
          setPage("bounty")
        }

        onHome={goHome}

        onSubmit={() =>
          handleOpenSubmit(
            selectedBounty
          )
        }

      />

    );

  }


  /* =========================
     SUBMIT
  ========================= */

  if (
    page === "submit" &&
    selectedBounty
  ) {

    return (

      <Submit

        bounty={selectedBounty}

        onBack={() =>
          setPage("arena")
        }

        onHome={goHome}

        onSubmit={
          handleSubmissionComplete
        }

      />

    );

  }


  /* =========================
     POST BOUNTY
  ========================= */

  if (page === "post") {

    return (

      <Post

        onBack={goExplore}

        onHome={goHome}

        onExplore={goExplore}

        onCreateBounty={
          handleCreateBounty
        }

      />

    );

  }


  /* =========================
     DASHBOARD
  ========================= */

  if (page === "dashboard") {

    return (

      <Dashboard

        bounties={bounties}

        onBack={goHome}

        onHome={goHome}

        onExplore={goExplore}

        onLeaderboard={
          goLeaderboard
        }

        onViewBounty={
          handleViewBounty
        }

        onSelectBounty={
          handleViewBounty
        }

      />

    );

  }


  /* =========================
     LEADERBOARD
  ========================= */

  if (page === "leaderboard") {

    return (

      <Leaderboard

        onBack={goHome}

        onHome={goHome}

        onExplore={goExplore}

        onDashboard={
          goDashboard
        }

      />

    );

  }


  /* =========================
     FALLBACK
  ========================= */

  return (

    <Landing
      onExplore={goExplore}
      onPost={goPost}
      onDashboard={goDashboard}
      onLeaderboard={
        goLeaderboard
      }
    />

  );

}

export default App;