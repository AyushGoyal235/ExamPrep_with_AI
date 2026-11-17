(function () {
  const S = ExamStore,
    st = S.get();
  S.mountSidebar("index");
  const $ = (id) => document.getElementById(id);
  function render() {
    const s = S.get(),
      p = s.profile,
      acc = S.accuracy(),
      done = s.tasks.filter((t) => t.done).length;
    $("greeting").textContent = `Welcome back, ${p.name || "Student"} 👋`;
    $("sidebarName") && ($("sidebarName").textContent = p.name || "Student");
    $("heroText").textContent =
      `You're preparing for ${p.goal.toLowerCase()}. Focus on ${S.weakTopic()} and keep today's goal realistic.`;
    $("heroReadiness").innerHTML = `${S.readiness()}<span>%</span>`;
    $("heroProgress").style.width = S.readiness() + "%";
    $("attemptedStat").textContent = s.attempts.length;
    $("accuracyStat").textContent = acc === null ? "—" : acc + "%";
    $("weakTopicStat").textContent = S.weakTopic();
    $("planStat").textContent =
      (s.tasks.length ? Math.round((done / s.tasks.length) * 100) : 0) + "%";
    $("revisionCount").textContent = s.revision.length;
    const colors = [
      "#7567e8",
      "#8d7ff0",
      "#a99ef5",
      "#bcb4f8",
      "#d0cbfb",
      "#dedbfc",
    ];
    $("masteryBars").innerHTML = Object.entries(s.mastery)
      .sort((a, b) => b[1] - a[1])
      .map(
        ([k, v], i) =>
          `<div class="mastery-row"><div class="bar-label"><span>${S.escapeHTML(k)}</span><b>${v}%</b></div><div class="bar-track"><i style="width:${v}%;background:${colors[i % colors.length]}"></i></div></div>`,
      )
      .join("");
    const tasks = s.tasks.length
      ? s.tasks.slice(0, 3)
      : [
          {
            title: "Practice 2 DSA questions",
            topic: S.weakTopic(),
            minutes: 25,
          },
          { title: "Review one concept", topic: S.weakTopic(), minutes: 15 },
          { title: "Revisit a mistake", topic: "Smart Revision", minutes: 10 },
        ];
    $("todayTasks").innerHTML = tasks
      .map(
        (t, i) =>
          `<div class="today-task"><span class="task-check ${t.done ? "checked" : ""}">${t.done ? "✓" : String(i + 1).padStart(2, "0")}</span><div><b>${S.escapeHTML(t.title)}</b><small>${S.escapeHTML(t.topic)} · ${t.minutes} min</small></div></div>`,
      )
      .join("");
    const recent = s.attempts.slice(-4).reverse();
    $("recentAttempts").innerHTML = recent.length
      ? recent
          .map(
            (a) =>
              `<div class="recent-item"><span class="recent-icon ${a.correct ? "success" : "failure"}">${a.correct ? "✓" : "×"}</span><div class="recent-info"><b>${S.escapeHTML(a.title)}</b><small>${S.escapeHTML(a.topic)} · ${S.escapeHTML(a.difficulty)}</small></div><span class="result-pill ${a.correct ? "result-good" : "result-bad"}">${a.correct ? "Correct" : "Review"}</span></div>`,
          )
          .join("")
      : `<div class="empty-state"><div class="empty-icon">⌘</div><b>Your practice journey starts here</b><p>Attempt a sample question to see your progress appear here.</p><a class="text-link" href="practice.html">Explore DSA questions →</a></div>`;
  }
  render();
  window.addEventListener("examstatechange", render);
})();
