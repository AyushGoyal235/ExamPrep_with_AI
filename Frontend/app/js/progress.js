(function () {
  const S = ExamStore;
  S.mountSidebar("progress");
  const $ = (id) => document.getElementById(id);
  function render() {
    const s = S.get(),
      score = S.readiness(),
      acc = S.accuracy(),
      avg = S.masteryAverage();
    $("readinessScore").textContent = score;
    $("gaugeRing").style.background =
      `conic-gradient(#7668e8 ${score * 3.6}deg,#eeecf8 0deg)`;
    $("masteryMetric").textContent = avg + "%";
    $("accuracyMetric").textContent = acc === null ? "—" : acc + "%";
    $("attemptMetric").textContent = s.attempts.length;
    $("readinessLabel").textContent =
      score < 30
        ? "Building foundations"
        : score < 60
          ? "Making progress"
          : score < 80
            ? "Growing confidence"
            : "Strong practice base";
    $("readinessDescription").textContent =
      score < 30
        ? "Start practicing regularly and strengthen your lowest-mastery topics."
        : score < 60
          ? "Keep improving topic mastery and revisit mistakes consistently."
          : "Maintain your practice routine and challenge yourself with harder questions.";
    const colors = [
      "#7567e8",
      "#8d7ff0",
      "#a99ef5",
      "#bcb4f8",
      "#d0cbfb",
      "#dedbfc",
    ];
    $("progressTopicBars").innerHTML = Object.entries(s.mastery)
      .sort((a, b) => a[1] - b[1])
      .map(
        ([k, v], i) =>
          `<div class="progress-topic-row"><div class="progress-topic-head"><span>${S.escapeHTML(k)}</span><b>${v}%</b></div><div class="bar-track"><i style="width:${v}%;background:${colors[i % colors.length]}"></i></div><small>${v < 25 ? "Priority topic" : v < 50 ? "Developing" : "Good momentum"}</small></div>`,
      )
      .join("");
    const weak = S.weakTopic();
    const insights = [
      {
        icon: "↗",
        title: `Prioritize ${weak}`,
        text: "Your lowest current mastery topic is a good place to focus next.",
        href: "planner.html",
        cta: "Build a plan",
      },
      {
        icon: "↻",
        title: `${s.revision.length} questions to revisit`,
        text: s.revision.length
          ? "Review incorrect answers to reinforce concepts."
          : "Practice questions and mistakes will appear in your revision queue.",
        href: "revision.html",
        cta: "Open revision",
      },
      {
        icon: "⌘",
        title: "Keep practice consistent",
        text: "Small, regular sessions help you measure progress over time.",
        href: "practice.html",
        cta: "Practice now",
      },
    ];
    $("insightsList").innerHTML = insights
      .map(
        (i) =>
          `<div class="insight-item"><span class="insight-icon">${i.icon}</span><div><b>${i.title}</b><p>${i.text}</p><a href="${i.href}" class="text-link">${i.cta} →</a></div></div>`,
      )
      .join("");
    const recent = s.attempts.slice().reverse();
    $("attemptHistory").innerHTML = recent.length
      ? recent
          .map(
            (a) =>
              `<div class="recent-item"><span class="recent-icon ${a.correct ? "success" : "failure"}">${a.correct ? "✓" : "×"}</span><div class="recent-info"><b>${S.escapeHTML(a.title)}</b><small>${S.escapeHTML(a.topic)} · ${new Date(a.at).toLocaleString()}</small></div><span class="result-pill ${a.correct ? "result-good" : "result-bad"}">${a.correct ? "Correct" : "Review"}</span></div>`,
          )
          .join("")
      : `<div class="empty-state compact-empty">No attempts yet. Start with a sample question in Practice DSA.</div>`;
  }
  $("resetDemo").addEventListener("click", () => {
    if (confirm("Reset all demo progress, goals, tasks and revision data?")) {
      S.reset();
      render();
    }
  });
  render();
  window.addEventListener("examstatechange", render);
})();
