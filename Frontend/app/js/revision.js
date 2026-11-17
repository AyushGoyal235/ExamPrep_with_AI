(function () {
  const S = ExamStore;
  S.mountSidebar("revision");
  const $ = (id) => document.getElementById(id);
  function render() {
    const s = S.get();
    $("revisionTotal").textContent = s.revision.length;
    if (!s.revision.length) {
      $("revisionList").innerHTML =
        `<div class="empty-state"><div class="empty-icon">✓</div><b>Your revision queue is clear</b><p>When an answer is incorrect, the question appears here automatically.</p><a class="btn btn-outline" href="practice.html">Practice DSA →</a></div>`;
      return;
    }
    $("revisionList").innerHTML = s.revision
      .map(
        (r) =>
          `<article class="revision-item"><div class="revision-item-icon">↻</div><div class="revision-item-copy"><div class="question-card-top"><span class="topic-tag">${S.escapeHTML(r.topic)}</span><span class="difficulty difficulty-${r.difficulty.toLowerCase()}">${r.difficulty}</span></div><h3>${S.escapeHTML(r.title)}</h3><p>Review this concept and try the question again to reinforce your understanding.</p></div><div class="revision-actions"><a class="btn btn-outline btn-small" href="practice.html" data-practice="${r.id}">Try again</a><button class="btn btn-primary btn-small" data-reviewed="${r.id}">Mark reviewed ✓</button></div></article>`,
      )
      .join("");
    document.querySelectorAll("[data-reviewed]").forEach((b) =>
      b.addEventListener("click", () => {
        S.update((st) => {
          st.revision = st.revision.filter((r) => r.id !== b.dataset.reviewed);
        });
        render();
      }),
    );
  }
  render();
  window.addEventListener("examstatechange", render);
})();
