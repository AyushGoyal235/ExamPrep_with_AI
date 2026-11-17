(function () {
  const S = ExamStore;
  S.mountSidebar("practice");
  const $ = (id) => document.getElementById(id);
  let activeQuestion = null;
  function renderList() {
    const topic = $("topicFilter").value,
      diff = $("difficultyFilter").value;
    const qs = window.EXAMPREPAI_QUESTIONS.filter(
      (q) =>
        (topic === "All topics" || q.topic === topic) &&
        (diff === "All levels" || q.difficulty === diff),
    );
    $("questionCount").textContent = qs.length + " questions";
    $("questionList").innerHTML =
      qs
        .map(
          (q) =>
            `<button class="question-card" data-id="${q.id}"><div class="question-card-top"><span class="topic-tag">${S.escapeHTML(q.topic)}</span><span class="difficulty difficulty-${q.difficulty.toLowerCase()}">${q.difficulty}</span></div><h3>${S.escapeHTML(q.title)}</h3><p>${S.escapeHTML(q.prompt)}</p><span class="question-open">Attempt question <b>→</b></span></button>`,
        )
        .join("") ||
      `<div class="empty-state">No questions match these filters.</div>`;
    document
      .querySelectorAll(".question-card")
      .forEach((el) =>
        el.addEventListener("click", () => openQuestion(el.dataset.id)),
      );
  }
  function openQuestion(id) {
    activeQuestion = window.EXAMPREPAI_QUESTIONS.find((q) => q.id === id);
    if (!activeQuestion) return;
    $("questionDetail").innerHTML =
      `<div class="question-card-top"><span class="topic-tag">${S.escapeHTML(activeQuestion.topic)}</span><span class="difficulty difficulty-${activeQuestion.difficulty.toLowerCase()}">${activeQuestion.difficulty}</span></div><h2>${S.escapeHTML(activeQuestion.title)}</h2><p class="question-prompt">${S.escapeHTML(activeQuestion.prompt)}</p><form id="answerForm"><div class="answer-options">${activeQuestion.options.map((o, i) => `<label class="answer-option"><input type="radio" name="answer" value="${i}" required><span class="option-letter">${String.fromCharCode(65 + i)}</span><span>${S.escapeHTML(o)}</span></label>`).join("")}</div><button class="btn btn-primary btn-full" type="submit">Submit answer →</button></form><div id="answerFeedback"></div>`;
    $("questionModal").classList.remove("hidden");
    $("answerForm").addEventListener("submit", submitAnswer);
  }
  function submitAnswer(e) {
    e.preventDefault();
    const picked = Number(new FormData(e.target).get("answer"));
    const q = activeQuestion,
      correct = picked === q.answer;
    const already = $("answerFeedback").dataset.submitted === "true";
    if (already) return;
    S.update((s) => {
      s.attempts.push({
        id: q.id,
        title: q.title,
        topic: q.topic,
        difficulty: q.difficulty,
        correct,
        at: new Date().toISOString(),
      });
      const current = s.mastery[q.topic] || 10;
      s.mastery[q.topic] = Math.max(
        0,
        Math.min(100, Math.round(current + (correct ? 7 : -4))),
      );
      if (!correct && !s.revision.some((r) => r.id === q.id))
        s.revision.push({
          id: q.id,
          title: q.title,
          topic: q.topic,
          difficulty: q.difficulty,
          addedAt: new Date().toISOString(),
        });
      if (correct) s.revision = s.revision.filter((r) => r.id !== q.id);
    });
    $("answerFeedback").dataset.submitted = "true";
    $("answerFeedback").innerHTML =
      `<div class="feedback-box ${correct ? "feedback-correct" : "feedback-incorrect"}"><h3>${correct ? "Correct answer! ✓" : "Not quite — added to revision ↻"}</h3><p>${S.escapeHTML(q.explanation)}</p><div class="feedback-actions"><button id="continueQuestion" class="btn ${correct ? "btn-primary" : "btn-outline"}">${correct ? "Continue practicing" : "Got it, continue"} →</button><a class="text-link" href="revision.html">Open revision queue</a></div></div>`;
    $("continueQuestion").addEventListener("click", () => {
      $("questionModal").classList.add("hidden");
      renderList();
    });
  }
  $("topicFilter").addEventListener("change", renderList);
  $("difficultyFilter").addEventListener("change", renderList);
  $("closeModal").addEventListener("click", () =>
    $("questionModal").classList.add("hidden"),
  );
  $("questionModal").addEventListener("click", (e) => {
    if (e.target.dataset.close) $("questionModal").classList.add("hidden");
  });
  renderList();
})();
