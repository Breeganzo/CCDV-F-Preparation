/* CCDV-F exam prep engine. No dependencies, no build, runs from file://. */
(function () {
  "use strict";

  var BP = window.CCDV_BLUEPRINT;
  var BANK = window.CCDV_QUESTIONS || [];
  var LS = "ccdvf:";
  var LETTERS = "ABCDEF";

  // ---------- state ----------
  var S = null; // {mode, qs:[q], ans:{id:[idx]}, flags:{id:1}, i, endsAt, revealed:{id:1}, started}

  // ---------- helpers ----------
  function $(id) { return document.getElementById(id); }
  function el(tag, cls, txt) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt != null) e.textContent = txt;
    return e;
  }
  function show(id) { $(id).classList.remove("hidden"); }
  function hide(id) { $(id).classList.add("hidden"); }
  function domName(d) {
    for (var i = 0; i < BP.domains.length; i++) if (BP.domains[i].id === d) return BP.domains[i].name;
    return "Domain " + d;
  }
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function sameSet(a, b) {
    if (!a || !b || a.length !== b.length) return false;
    var x = a.slice().sort(), y = b.slice().sort();
    for (var i = 0; i < x.length; i++) if (x[i] !== y[i]) return false;
    return true;
  }
  function pct(n) { return Math.round(n * 100); }
  function barColor(p) { return p >= 75 ? "var(--ok)" : p >= 60 ? "var(--warn)" : "var(--bad)"; }

  // scaled score estimate: linear map of raw onto 100-1000
  function toScaled(raw) { return Math.round(BP.scaleMin + raw * (BP.scaleMax - BP.scaleMin)); }

  // ---------- sampling ----------
  function sampleExam() {
    var out = [];
    BP.domains.forEach(function (d) {
      var pool = shuffle(BANK.filter(function (q) { return q.d === d.id; }));
      out = out.concat(pool.slice(0, d.exam));
    });
    // top up / trim if some domains are short on questions
    if (out.length < BP.examQuestions) {
      var used = {};
      out.forEach(function (q) { used[q.id] = 1; });
      var rest = shuffle(BANK.filter(function (q) { return !used[q.id]; }));
      out = out.concat(rest.slice(0, BP.examQuestions - out.length));
    }
    return shuffle(out).slice(0, BP.examQuestions);
  }

  // ---------- session ----------
  function start(mode, opts) {
    opts = opts || {};
    var qs;
    if (mode === "exam") qs = sampleExam();
    else if (mode === "drill") qs = shuffle(BANK.filter(function (q) { return q.d === opts.domain; }));
    else if (mode === "redrill") qs = shuffle(opts.qs || []);
    else qs = shuffle(BANK);

    if (!qs.length) { alert("No questions available for that selection yet."); return; }

    S = {
      mode: mode, ids: qs.map(function (q) { return q.id; }),
      ans: {}, flags: {}, revealed: {}, i: 0,
      started: Date.now(),
      endsAt: mode === "exam" ? Date.now() + BP.examMinutes * 60000 : null,
      fb: fbPref(),
      label: opts.label || null
    };
    save();
    enterQuiz();
  }

  function qsOf(s) {
    var byId = {};
    BANK.forEach(function (q) { byId[q.id] = q; });
    return s.ids.map(function (id) { return byId[id]; }).filter(Boolean);
  }

  // Instant feedback is a user setting, honoured in every mode including the timed
  // exam. Default on. Review mode always reveals.
  function fbPref() {
    try { return localStorage.getItem(LS + "feedback") !== "0"; } catch (e) { return true; }
  }
  function instant() { return S.mode === "review" || S.fb !== false; }

  function save() {
    try { localStorage.setItem(LS + "session", JSON.stringify(S)); } catch (e) {}
  }
  function clearSession() {
    try { localStorage.removeItem(LS + "session"); } catch (e) {}
  }

  function enterQuiz() {
    hide("home"); hide("results"); show("quiz");
    show("quitBtn");
    if (S.mode === "exam") { show("timer"); tick(); }
    else hide("timer");
    render();
  }

  // ---------- timer ----------
  var timerH = null;
  function tick() {
    if (timerH) clearInterval(timerH);
    timerH = setInterval(function () {
      if (!S || !S.endsAt) { clearInterval(timerH); return; }
      var ms = S.endsAt - Date.now();
      if (ms <= 0) {
        clearInterval(timerH);
        $("timer").textContent = "00:00";
        finish(true);
        return;
      }
      var m = Math.floor(ms / 60000), s = Math.floor((ms % 60000) / 1000);
      $("timer").textContent = (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
      $("timer").classList.toggle("low", ms < 10 * 60000);
    }, 500);
  }

  // ---------- render ----------
  function render() {
    var qs = qsOf(S);
    var q = qs[S.i];
    if (!q) return;
    var picked = S.ans[q.id] || [];
    var revealed = instant() && S.revealed[q.id];

    // meta
    var meta = $("qmeta"); meta.innerHTML = "";
    meta.appendChild(el("span", "tag", "Q" + (S.i + 1) + " / " + qs.length));
    meta.appendChild(el("span", "tag dom", "D" + q.d + " \u00b7 " + domName(q.d)));
    meta.appendChild(el("span", "tag", q.s));
    meta.appendChild(el("span", "tag", ["", "recall", "applied", "hard"][q.diff] || "applied"));
    if (S.flags[q.id]) meta.appendChild(el("span", "tag", "\u2691 flagged"));

    $("stem").textContent = q.stem;
    $("selnote").textContent = q.type === "multi"
      ? "Select " + q.n + " answers."
      : "Select 1 answer.";

    // options
    var box = $("opts"); box.innerHTML = "";
    q.opts.forEach(function (text, idx) {
      var b = el("button", "opt");
      var k = el("span", "k", LETTERS[idx]);
      var t = el("span", null, text);
      b.appendChild(k); b.appendChild(t);
      if (picked.indexOf(idx) !== -1) b.classList.add("sel");
      if (revealed) {
        b.disabled = true;
        if (q.correct.indexOf(idx) !== -1) b.classList.add("correct");
        else if (picked.indexOf(idx) !== -1) b.classList.add("wrong");
      } else {
        b.onclick = function () { pick(q, idx); };
      }
      box.appendChild(b);
    });

    // explanation
    if (revealed) renderExp(q, picked); else hide("exp");

    $("prevBtn").disabled = S.i === 0;
    $("nextBtn").textContent = S.i === qs.length - 1 ? "Finish \u2192" : "Next \u2192";
    $("flagBtn").textContent = S.flags[q.id] ? "Unflag" : "Flag";
    renderGrid(qs);
    save();
  }

  function renderExp(q, picked) {
    var right = sameSet(picked, q.correct);
    var e = $("exp"); e.innerHTML = ""; e.classList.remove("hidden");

    var v = el("div", "verdict " + (right ? "ok" : "bad"),
      right ? "\u2713 Correct" : "\u2717 Incorrect \u2014 answer: " +
        q.correct.map(function (i) { return LETTERS[i]; }).join(", "));
    e.appendChild(v);

    e.appendChild(el("h4", null, "Why that is right"));
    e.appendChild(el("div", null, q.why));

    var wrongKeys = Object.keys(q.wrong || {});
    if (wrongKeys.length) {
      e.appendChild(el("h4", null, "Why the others fail"));
      var ul = el("ul");
      wrongKeys.forEach(function (k) {
        var li = el("li");
        var b = el("b", null, LETTERS[+k] + ". ");
        li.appendChild(b);
        li.appendChild(document.createTextNode(q.wrong[k]));
        ul.appendChild(li);
      });
      e.appendChild(ul);
    }

    if (q.doc) {
      e.appendChild(el("h4", null, "Reference"));
      var a = el("a", null, q.doc.t);
      a.href = q.doc.u; a.target = "_blank"; a.rel = "noopener noreferrer";
      e.appendChild(a);
    }
  }

  function pick(q, idx) {
    var cur = (S.ans[q.id] || []).slice();
    if (q.type === "multi") {
      var at = cur.indexOf(idx);
      if (at !== -1) cur.splice(at, 1);
      else {
        if (cur.length >= q.n) cur.shift(); // keep newest n
        cur.push(idx);
      }
    } else {
      cur = [idx];
    }
    S.ans[q.id] = cur;

    // instant feedback once a complete answer is given
    if (instant() && cur.length === q.n) S.revealed[q.id] = 1;
    render();
  }

  function renderGrid(qs) {
    var g = $("grid"); g.innerHTML = "";
    qs.forEach(function (q, idx) {
      var b = el("button", "gbtn", String(idx + 1));
      var done = (S.ans[q.id] || []).length === q.n;
      if (done) b.classList.add("done");
      if (S.flags[q.id]) b.classList.add("flag");
      if (instant() && S.revealed[q.id]) {
        b.classList.add(sameSet(S.ans[q.id], q.correct) ? "gok" : "gbad");
      }
      if (idx === S.i) b.classList.add("cur");
      b.onclick = function () { S.i = idx; render(); };
      g.appendChild(b);
    });
  }

  // ---------- navigation ----------
  function go(delta) {
    var qs = qsOf(S);
    var n = S.i + delta;
    if (n < 0) return;
    if (n >= qs.length) { finish(false); return; }
    S.i = n; render();
  }

  // ---------- scoring ----------
  function finish(auto) {
    var qs = qsOf(S);
    var unanswered = qs.filter(function (q) { return (S.ans[q.id] || []).length !== q.n; }).length;
    if (!auto && unanswered > 0) {
      if (!confirm(unanswered + " question(s) are incomplete. They will be marked wrong. Submit anyway?")) return;
    }
    if (timerH) clearInterval(timerH);

    var correct = 0, byDom = {};
    qs.forEach(function (q) {
      var ok = sameSet(S.ans[q.id], q.correct);
      if (ok) correct++;
      if (!byDom[q.d]) byDom[q.d] = { c: 0, t: 0 };
      byDom[q.d].t++;
      if (ok) byDom[q.d].c++;
    });

    var raw = qs.length ? correct / qs.length : 0;
    var scaled = toScaled(raw);
    var pass = scaled >= BP.passScaled;

    // results view
    hide("quiz"); hide("home"); show("results"); hide("timer"); hide("quitBtn");

    $("scaledBig").textContent = scaled;
    $("scaledBig").className = "big " + (pass ? "pass" : "fail");
    $("scoreLbl").innerHTML = "estimated scaled score &middot; pass mark " + BP.passScaled +
      "<br>" + correct + " / " + qs.length + " correct (" + pct(raw) + "% raw)" +
      (auto ? "<br><b>Time expired \u2014 auto-submitted.</b>" : "");

    // verdict
    var weak = [];
    Object.keys(byDom).forEach(function (d) {
      if (byDom[d].c / byDom[d].t < 0.6) weak.push(domName(+d));
    });
    var vb = $("verdictBox"); vb.innerHTML = "";
    var msg;
    if (pass && !weak.length) msg = "\u2713 Exam ready. You clear the line with no domain below 60%.";
    else if (pass) msg = "\u26a0 Above the pass line, but these domains are below 60% and could sink you on a bad draw: " + weak.join(", ") + ".";
    else msg = "\u2717 Below the pass line. Focus first on: " + (weak.length ? weak.join(", ") : "your lowest-scoring domains below") + ".";
    var wb = el("div", "warnbox", msg);
    if (pass && !weak.length) { wb.style.background = "#12240f"; wb.style.borderColor = "var(--ok)"; wb.style.color = "#a6e8a1"; }
    vb.appendChild(wb);

    // domain table
    var t = $("domTable");
    t.innerHTML = "<tr><th>Domain</th><th>Exam weight</th><th class='num'>Score</th><th style='width:130px'></th></tr>";
    BP.domains.slice().sort(function (a, b) { return b.weight - a.weight; }).forEach(function (d) {
      var r = byDom[d.id];
      var tr = el("tr");
      tr.appendChild(el("td", null, "D" + d.id + " \u00b7 " + d.name));
      tr.appendChild(el("td", null, d.weight + "%"));
      if (!r) {
        var td = el("td", "num", "\u2014"); td.colSpan = 2; tr.appendChild(td);
      } else {
        var p = pct(r.c / r.t);
        tr.appendChild(el("td", "num", r.c + "/" + r.t + "  " + p + "%"));
        var cell = el("td");
        var bar = el("div", "bar");
        var fill = el("i");
        fill.style.width = p + "%"; fill.style.background = barColor(p);
        bar.appendChild(fill); cell.appendChild(bar); tr.appendChild(cell);
      }
      t.appendChild(tr);
    });

    // history
    try {
      var h = JSON.parse(localStorage.getItem(LS + "history") || "[]");
      h.unshift({ mode: S.mode, when: Date.now(), correct: correct, total: qs.length, scaled: scaled, pass: pass });
      localStorage.setItem(LS + "history", JSON.stringify(h.slice(0, 25)));
    } catch (e) {}

    S.finished = true;
    S.missed = qs.filter(function (q) { return !sameSet(S.ans[q.id], q.correct); }).map(function (q) { return q.id; });
    clearSession();
  }

  // ---------- review ----------
  function review() {
    S.mode = "review";
    S.i = 0;
    qsOf(S).forEach(function (q) { S.revealed[q.id] = 1; });
    hide("results"); show("quiz"); show("quitBtn");
    $("submitBtn").classList.add("hidden");
    render();
  }

  // ---------- home ----------
  function home() {
    if (timerH) clearInterval(timerH);
    S = null;
    hide("quiz"); hide("results"); show("home"); hide("timer"); hide("quitBtn");
    $("submitBtn").classList.remove("hidden");
    renderHome();
  }

  function renderHome() {
    $("bankCount").textContent = BANK.length + " questions loaded";

    // coverage table
    var t = $("coverage");
    t.innerHTML = "<tr><th>Domain</th><th class='num'>Weight</th><th class='num'>In bank</th><th class='num'>Per exam</th></tr>";
    var total = 0;
    BP.domains.slice().sort(function (a, b) { return b.weight - a.weight; }).forEach(function (d) {
      var have = BANK.filter(function (q) { return q.d === d.id; }).length;
      total += have;
      var tr = el("tr");
      tr.appendChild(el("td", null, "D" + d.id + " \u00b7 " + d.name));
      tr.appendChild(el("td", "num", d.weight + "%"));
      var c = el("td", "num", have + " / " + d.bank);
      if (have < d.bank) c.style.color = "var(--warn)";
      tr.appendChild(c);
      tr.appendChild(el("td", "num", String(d.exam)));
      t.appendChild(tr);
    });
    var tr2 = el("tr");
    tr2.appendChild(el("td", null, "Total"));
    tr2.appendChild(el("td", "num", "100%"));
    tr2.appendChild(el("td", "num", total + " / 150"));
    tr2.appendChild(el("td", "num", String(BP.examQuestions)));
    tr2.style.fontWeight = "700";
    t.appendChild(tr2);

    // drill picker
    var sel = $("drillPick");
    sel.innerHTML = "";
    BP.domains.slice().sort(function (a, b) { return b.weight - a.weight; }).forEach(function (d) {
      var have = BANK.filter(function (q) { return q.d === d.id; }).length;
      var o = document.createElement("option");
      o.value = d.id;
      o.textContent = "D" + d.id + " \u00b7 " + d.name + " (" + d.weight + "%, " + have + "q)";
      sel.appendChild(o);
    });

    // resume
    try {
      var raw = localStorage.getItem(LS + "session");
      if (raw) {
        var s = JSON.parse(raw);
        if (s && s.ids && s.ids.length && !s.finished) {
          $("resumeCard").style.display = "";
          var done = Object.keys(s.ans || {}).length;
          $("resumeInfo").textContent = s.mode + " \u00b7 " + done + " of " + s.ids.length +
            " answered" + (s.endsAt && s.endsAt > Date.now()
              ? " \u00b7 " + Math.round((s.endsAt - Date.now()) / 60000) + " min left" : "");
          $("resumeBtn").onclick = function () {
            S = s;
            if (S.endsAt && S.endsAt <= Date.now()) S.endsAt = null;
            enterQuiz();
          };
        } else { $("resumeCard").style.display = "none"; }
      } else { $("resumeCard").style.display = "none"; }
    } catch (e) { $("resumeCard").style.display = "none"; }

    // history
    try {
      var h = JSON.parse(localStorage.getItem(LS + "history") || "[]");
      if (h.length) {
        $("historyCard").style.display = "";
        var ht = $("history");
        ht.innerHTML = "<tr><th>When</th><th>Mode</th><th class='num'>Score</th><th class='num'>Scaled</th></tr>";
        h.forEach(function (r) {
          var tr = el("tr");
          tr.appendChild(el("td", null, new Date(r.when).toLocaleString()));
          tr.appendChild(el("td", null, r.mode));
          tr.appendChild(el("td", "num", r.correct + "/" + r.total));
          var sc = el("td", "num", String(r.scaled));
          sc.style.color = r.pass ? "var(--ok)" : "var(--bad)";
          sc.style.fontWeight = "700";
          tr.appendChild(sc);
          ht.appendChild(tr);
        });
      } else { $("historyCard").style.display = "none"; }
    } catch (e) {}
  }

  // ---------- wiring ----------
  (function () {
    var chk = $("fbChk"), note = $("fbNote");
    function paint() {
      note.innerHTML = chk.checked
        ? "On &mdash; correct/wrong plus the full explanation reveals as soon as you answer, in <u>all</u> modes including the timed exam."
        : "Off &mdash; nothing is revealed until you submit. Use this for a realistic Pearson VUE dry run.";
    }
    chk.checked = fbPref();
    paint();
    chk.onchange = function () {
      try { localStorage.setItem(LS + "feedback", chk.checked ? "1" : "0"); } catch (e) {}
      paint();
    };
  })();

  document.querySelectorAll(".mode").forEach(function (b) {
    b.onclick = function () {
      var m = b.getAttribute("data-mode");
      if (m === "drill") start("drill", { domain: +$("drillPick").value });
      else start(m);
    };
  });
  $("prevBtn").onclick = function () { go(-1); };
  $("nextBtn").onclick = function () { go(1); };
  $("flagBtn").onclick = function () {
    var q = qsOf(S)[S.i];
    if (S.flags[q.id]) delete S.flags[q.id]; else S.flags[q.id] = 1;
    render();
  };
  $("submitBtn").onclick = function () { finish(false); };
  $("quitBtn").onclick = function () {
    if (S && !S.finished && !confirm("Leave this session? Progress is saved and you can resume.")) return;
    home();
  };
  $("homeBtn").onclick = home;
  $("reviewBtn").onclick = review;
  $("redrillBtn").onclick = function () {
    var byId = {}; BANK.forEach(function (q) { byId[q.id] = q; });
    var missed = (S.missed || []).map(function (id) { return byId[id]; }).filter(Boolean);
    if (!missed.length) { alert("Nothing missed. Clean sweep."); return; }
    start("redrill", { qs: missed });
  };

  document.addEventListener("keydown", function (ev) {
    if ($("quiz").classList.contains("hidden")) return;
    if (/^[1-6]$/.test(ev.key)) {
      var q = qsOf(S)[S.i];
      var idx = +ev.key - 1;
      if (idx < q.opts.length && !(instant() && S.revealed[q.id])) { pick(q, idx); ev.preventDefault(); }
    } else if (ev.key === "ArrowRight" || ev.key === "Enter") { go(1); ev.preventDefault(); }
    else if (ev.key === "ArrowLeft") { go(-1); ev.preventDefault(); }
    else if (ev.key.toLowerCase() === "f") { $("flagBtn").click(); }
  });

  // ---------- boot ----------
  if (!BANK.length) {
    $("bankCount").textContent = "0 questions \u2014 check the data/ files loaded";
  }
  renderHome();
})();
