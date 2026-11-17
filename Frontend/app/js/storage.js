
(function () {
  function defaultState() {
    return {
      profile: {
        name: "",
        goal: "Placement preparation",
        targetDate: "",
        hours: 2,
        level: "Beginner",
        language: "Java"
      },
      mastery: {
        Arrays: 0,
        Strings: 0,
        "Binary Search": 0,
        "Linked List": 0,
        "Dynamic Programming": 0,
        Graphs: 0
      },
      attempts: [],
      revision: [],
      tasks: [],
      planGenerated: false
    };
  }

  let state = defaultState();
  let isReady = false;
  let saveQueue = Promise.resolve();

  function normalizeState(data) {
    const defaults = defaultState();

    return {
      ...defaults,
      ...data,
      profile: {
        ...defaults.profile,
        ...(data.profile || {})
      },
      mastery: {
        ...defaults.mastery,
        ...(data.mastery || {})
      },
      attempts: Array.isArray(data.attempts) ? data.attempts : [],
      revision: Array.isArray(data.revision) ? data.revision : [],
      tasks: Array.isArray(data.tasks) ? data.tasks : []
    };
  }

  function notify() {
    window.dispatchEvent(
      new CustomEvent("examstatechange", {
        detail: state
      })
    );
  }

  // Load logged-in user's data from MongoDB
  const ready = fetch("/api/user-data", {
    method: "GET",
    credentials: "same-origin"
  })
    .then(async (response) => {
      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          window.location.replace("/");
          return false;
        }

        throw new Error(result.message || "Unable to load student data.");
      }

      if (!result.success || !result.data) {
        throw new Error("Invalid student data received.");
      }

      state = normalizeState(result.data);
      isReady = true;

      notify();
      return true;
    })
    .catch((error) => {
      console.error("Student data loading failed:", error);
      return false;
    });

  function get() {
    return state;
  }

  // Save requests are serialized to prevent older saves
  // from overwriting newer student data.
  function save() {
    if (!isReady) {
      return Promise.reject(
        new Error("Student data is not loaded yet.")
      );
    }

    const snapshot = JSON.stringify(state);

    saveQueue = saveQueue
      .catch(() => {})
      .then(async () => {
        const response = await fetch("/api/user-data", {
          method: "PUT",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            state: JSON.parse(snapshot)
          })
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Unable to save student data."
          );
        }

        return result;
      });

    return saveQueue;
  }

  function update(fn) {
    if (!isReady) {
      throw new Error("Wait for student data to load first.");
    }

    fn(state);
    notify();

    save().catch((error) => {
      console.error("Student data save failed:", error);
    });

    return state;
  }

  function reset() {
    if (!isReady) return;

    const currentName = state.profile.name;
    state = defaultState();
    state.profile.name = currentName;

    notify();

    save().catch((error) => {
      console.error("Student data reset failed:", error);
    });
  }

  function masteryAverage() {
    const values = Object.values(state.mastery);

    return values.length
      ? Math.round(
          values.reduce((a, b) => a + b, 0) / values.length
        )
      : 0;
  }

  function accuracy() {
    if (!state.attempts.length) return null;

    return Math.round(
      (state.attempts.filter((a) => a.correct).length /
        state.attempts.length) * 100
    );
  }

  function readiness() {
    const mastery = masteryAverage();
    const acc = accuracy();
    const practice = Math.min(state.attempts.length * 3, 15);

    return Math.max(
      5,
      Math.min(
        100,
        Math.round(
          mastery * 0.65 +
          (acc === null ? 20 : acc) * 0.25 +
          practice
        )
      )
    );
  }

  function weakTopic() {
    return (
      Object.keys(state.mastery).sort(
        (a, b) => state.mastery[a] - state.mastery[b]
      )[0] || "Arrays"
    );
  }

  function escapeHTML(s) {
    return String(s ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;"
        })[c]
    );
  }

  function mountSidebar(active) {
    const el = document.getElementById("sidebarMount");
    if (!el) return;

    el.innerHTML = `
      <a class="brand" href="index.html">
        <span class="brand-mark">E</span>
        <span>
          ExamPrep<span class="ai">AI</span>
          <small>PERSONALIZED DSA PREP</small>
        </span>
      </a>
      <div class="nav-label">WORKSPACE</div>
      <nav class="nav">
        <a class="nav-link ${active === "index" ? "active" : ""}" href="index.html">▦ Overview</a>
        <a class="nav-link ${active === "setup" ? "active" : ""}" href="setup.html">◉ My Goals</a>
        <a class="nav-link ${active === "practice" ? "active" : ""}" href="practice.html">⌘ Practice DSA</a>
        <a class="nav-link ${active === "planner" ? "active" : ""}" href="planner.html">☷ Study Planner</a>
        <a class="nav-link ${active === "revision" ? "active" : ""}" href="revision.html">↻ Smart Revision <em>${state.revision.length}</em></a>
        <a class="nav-link ${active === "progress" ? "active" : ""}" href="progress.html">▥ Progress & Readiness</a>
      </nav>
      <div class="sidebar-bottom">
        <div class="avatar">
          ${escapeHTML(
            (state.profile.name || "Student")
              .split(/\s+/)
              .map((x) => x[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()
          )}
        </div>
        <div>
          <b>${escapeHTML(state.profile.name || "Student")}</b>
          <small>Student workspace</small>
        </div>
        <span class="online-dot"></span>
      </div>
    `;
  }

  window.ExamStore = {
    ready,
    get,
    update,
    save,
    reset,
    masteryAverage,
    accuracy,
    readiness,
    weakTopic,
    escapeHTML,
    mountSidebar
  };
})();
