(function () {
  const S = ExamStore;
  S.mountSidebar("planner");
  const $ = (id) => document.getElementById(id);
  function render() {
    const s = S.get(),
      tasks = s.tasks,
      done = tasks.filter((t) => t.done).length,
      pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
    $("hoursSummary").textContent =
      s.profile.hours + " " + (s.profile.hours === 1 ? "hr" : "hrs");
    $("taskSummary").textContent = tasks.length;
    $("completedSummary").textContent = done;
    $("completionSummary").textContent = pct + "%";
    $("planDescription").textContent = s.planGenerated
      ? `Plan tailored for ${s.profile.hours} hours/day, prioritizing ${S.weakTopic()} and lower-mastery topics.`
      : "Generate a plan to begin.";
    if (!tasks.length) {
      $("planTasks").innerHTML =
        `<div class="empty-state"><div class="empty-icon">☷</div><b>Your personalized plan is ready to generate</b><p>We'll prioritize lower-mastery topics and fit tasks into your available study time.</p><button class="btn btn-primary" id="emptyGenerate">Generate my plan →</button></div>`;
      $("emptyGenerate").addEventListener("click", generate);
      return;
    }
    $("planTasks").innerHTML = tasks
      .map(
        (t, i) =>
          `<label class="plan-task ${t.done ? "task-done" : ""}"><input type="checkbox" data-task="${t.id}" ${t.done ? "checked" : ""}><span class="plan-task-number">${String(i + 1).padStart(2, "0")}</span><span class="plan-task-copy"><b>${S.escapeHTML(t.title)}</b><small>${S.escapeHTML(t.topic)} · ${t.minutes} minutes</small></span><span class="task-status">${t.done ? "Completed" : "To do"}</span></label>`,
      )
      .join("");
    document.querySelectorAll("[data-task]").forEach((cb) =>
      cb.addEventListener("change", () =>
        S.update((st) => {
          const t = st.tasks.find((x) => x.id === cb.dataset.task);
          if (t) t.done = cb.checked;
        }),
      ),
    );
  }
  function generate() {
    S.update((s) => {
      const sorted = Object.entries(s.mastery).sort((a, b) => a[1] - b[1]);
      const hours = Number(s.profile.hours) || 2;
      const pool = [
        { title: "Review core concepts", minutes: 15 },
        { title: "Solve focused practice questions", minutes: 25 },
        { title: "Analyze mistakes and revise", minutes: 15 },
        { title: "Solve one timed challenge", minutes: 25 },
        { title: "Summarize key patterns", minutes: 10 },
      ];
      s.tasks = [];
      let idx = 0;
      for (let h = 0; h < hours; h++) {
        const topic = sorted[h % sorted.length][0];
        for (let j = 0; j < 2; j++) {
          const item = pool[idx % pool.length];
          s.tasks.push({
            id: "task-" + Date.now() + "-" + idx,
            title: item.title,
            topic,
            minutes: item.minutes,
            done: false,
          });
          idx++;
        }
      }
      s.planGenerated = true;
    });
    render();
  }
  $("generatePlan").addEventListener("click", generate);
  render();
  window.addEventListener("examstatechange", render);
})();
