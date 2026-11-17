(function () {
  const S = ExamStore;
  S.mountSidebar("setup");
  const p = S.get().profile;
  document.getElementById("studentName").value = p.name || "";
  document.getElementById("goal").value = p.goal || "Placement preparation";
  document.getElementById("targetDate").value = p.targetDate || "";
  document.getElementById("hours").value = String(p.hours || 2);
  document.getElementById("level").value = p.level || "Intermediate";
  document.getElementById("setupForm").addEventListener("submit", (e) => {
    e.preventDefault();
    S.update((s) => {
      s.profile = {
        name: document.getElementById("studentName").value.trim() || "Student",
        goal: document.getElementById("goal").value,
        targetDate: document.getElementById("targetDate").value,
        hours: Number(document.getElementById("hours").value),
        level: document.getElementById("level").value,
      };
    });
    document.getElementById("saveMessage").textContent = "Saved successfully ✓";
    setTimeout(
      () => (document.getElementById("saveMessage").textContent = ""),
      2200,
    );
  });
})();
