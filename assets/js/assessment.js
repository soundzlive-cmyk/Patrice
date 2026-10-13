/*
 * Free self & team assessments (Resources page).
 * Questions, scoring, and recommendations follow Patrice's printable PDFs in
 * assets/downloads/. Runs entirely in the browser — answers are never sent anywhere.
 *
 * Scoring (from the PDFs): answers score 1–4 from left to right. Positively
 * worded statements (reverse: true) are flipped (1↔4, 2↔3). Each area's three
 * items are added (range 3–12). Higher = greater opportunity for growth.
 * The highest-scoring area is the suggested starting point.
 */
(function () {
  var QUIZZES = {
    individual: {
      title: "What’s Really Holding You Back?",
      kicker: 'A Free Fear, Confidence & Purpose Assessment',
      intro: 'Reflect on the patterns that may influence your peace, decisions, confidence, and direction.',
      prompt: 'Based on your recent experience, how often is this true for you?',
      scale: ['Rarely', 'Sometimes', 'Often', 'Almost always'],
      areas: {
        peace: {
          name: 'Peace',
          rec: 'Practice a daily five-minute pause. Identify one source of unnecessary pressure and one boundary that could help you respond more intentionally.'
        },
        power: {
          name: 'Power',
          rec: 'Identify one decision you have been postponing. Write down the facts, the fear influencing you, and one reasonable next action.'
        },
        purpose: {
          name: 'Purpose',
          rec: 'Write down your three most important values. Choose one small action this week that brings your schedule into closer alignment with them.'
        }
      },
      questions: [
        { area: 'peace', text: 'I find it difficult to quiet my thoughts when responsibilities or uncertainty increase.' },
        { area: 'peace', text: 'I often feel responsible for keeping everyone else happy.' },
        { area: 'peace', text: 'I struggle to set boundaries without feeling guilty.' },
        { area: 'power', text: 'I delay important decisions because I am afraid of making the wrong choice.' },
        { area: 'power', text: 'I question my abilities even when I have experience or qualifications.' },
        { area: 'power', text: 'I hold back my opinions because I am concerned about others’ reactions.' },
        { area: 'purpose', text: 'My daily choices reflect what matters most to me.', reverse: true },
        { area: 'purpose', text: 'I have a clear sense of what I want my next season of life or leadership to look like.', reverse: true },
        { area: 'purpose', text: 'I make intentional time for goals that are meaningful to me.', reverse: true }
      ],
      recLabel: 'Your Next Step',
      cta: { text: 'Explore Individual Coaching', href: 'coaching.html' },
      guide: true,
      disclaimer: 'This is a self-reflection tool, not a validated psychological assessment or diagnosis.'
    },

    team: {
      title: "What’s Really Holding Your Team Back?",
      kicker: 'A Free Leadership & Team Development Assessment',
      intro: 'Reflect on potential barriers to confident leadership, communication, resilience, and alignment.',
      prompt: 'Based on your recent experience, how often is this true of your team?',
      scale: ['Rarely', 'Sometimes', 'Often', 'Consistently'],
      areas: {
        clarity: {
          name: 'Clarity & Resilience',
          session: 'Leading with Clarity Under Pressure',
          rec: 'Explore pressure points, healthy boundaries, and responses to uncertainty.'
        },
        confidence: {
          name: 'Confidence & Communication',
          session: 'Courageous Conversations & Confident Decisions',
          rec: 'Practice speaking up, making timely decisions, and communicating more clearly.'
        },
        alignment: {
          name: 'Alignment & Purpose',
          session: 'Purpose-Driven Leadership & Team Alignment',
          rec: 'Clarify priorities, accountability, and shared goals.'
        }
      },
      questions: [
        { area: 'clarity', text: 'Our team can stay focused and productive when priorities shift unexpectedly.', reverse: true },
        { area: 'confidence', text: 'Team members feel comfortable raising concerns or admitting mistakes.', reverse: true },
        { area: 'alignment', text: 'People understand how their work contributes to our larger goals.', reverse: true },
        { area: 'confidence', text: 'Our leaders can make timely decisions without getting stuck in overanalysis.', reverse: true },
        { area: 'clarity', text: 'We have healthy boundaries around workload and competing demands.', reverse: true },
        { area: 'confidence', text: 'Team members are willing to respectfully challenge ideas and offer different perspectives.', reverse: true },
        { area: 'alignment', text: 'We have clear priorities and shared expectations.', reverse: true },
        { area: 'clarity', text: 'Our team handles high-pressure situations without consistently becoming reactive.', reverse: true },
        { area: 'alignment', text: 'We consistently follow through on agreed actions and responsibilities.', reverse: true }
      ],
      recLabel: 'Recommended Group Session',
      cta: { text: 'Schedule a Leadership Strategy Conversation', href: 'contact.html' },
      guide: false,
      disclaimer: 'Scores reflect one leader’s observations and are not a validated or comprehensive team-performance evaluation.'
    }
  };

  var body, overlay, state;

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function start(id) {
    state = { id: id, quiz: QUIZZES[id], answers: [], i: 0 };
    renderQuestion();
    overlay.classList.add('open');
    document.body.classList.add('no-scroll');
  }

  function renderQuestion() {
    var quiz = state.quiz, q = quiz.questions[state.i], total = quiz.questions.length;
    var pct = Math.round((state.i / total) * 100);
    var opts = quiz.scale.map(function (label, v) {
      var sel = state.answers[state.i] === v ? ' selected' : '';
      return '<button type="button" class="quiz-opt' + sel + '" data-v="' + v + '">' + esc(label) + '</button>';
    }).join('');
    body.innerHTML =
      '<span class="eyebrow">' + esc(quiz.kicker) + '</span>' +
      '<h2 id="quiz-title" class="quiz-title">' + esc(quiz.title) + '</h2>' +
      (state.i === 0 ? '<p class="quiz-intro">' + esc(quiz.intro) + '</p>' : '') +
      '<div class="quiz-progress" role="progressbar" aria-valuemin="0" aria-valuemax="' + total + '" aria-valuenow="' + state.i + '"><span style="width:' + pct + '%"></span></div>' +
      '<p class="quiz-count">Question ' + (state.i + 1) + ' of ' + total + ' &middot; ' + esc(quiz.areas[q.area].name) + '</p>' +
      '<p class="quiz-prompt">' + esc(quiz.prompt) + '</p>' +
      '<p class="quiz-q">' + esc(q.text) + '</p>' +
      '<div class="quiz-opts">' + opts + '</div>' +
      '<div class="quiz-nav">' + (state.i > 0 ? '<button type="button" class="quiz-back">&larr; Back</button>' : '<span></span>') + '</div>';
    body.querySelectorAll('.quiz-opt').forEach(function (b) {
      b.addEventListener('click', function () {
        state.answers[state.i] = +b.getAttribute('data-v');
        state.i++;
        if (state.i >= total) renderResults(); else renderQuestion();
      });
    });
    var back = body.querySelector('.quiz-back');
    if (back) back.addEventListener('click', function () { state.i--; renderQuestion(); });
    var first = body.querySelector('.quiz-opt'); if (first) first.focus({ preventScroll: true });
  }

  // ['A','B'] -> 'A and B'; ['A','B','C'] -> 'A, B, and C'
  function listJoin(xs) {
    return xs.length < 3 ? xs.join(' and ') : xs.slice(0, -1).join(', ') + ', and ' + xs[xs.length - 1];
  }

  function score() {
    var quiz = state.quiz, totals = {};
    Object.keys(quiz.areas).forEach(function (k) { totals[k] = 0; });
    quiz.questions.forEach(function (q, i) {
      var pts = state.answers[i] + 1;          // 1–4, left to right
      if (q.reverse) pts = 5 - pts;            // 1↔4, 2↔3
      totals[q.area] += pts;
    });
    return totals;                             // each area: 3–12
  }

  function renderResults() {
    var quiz = state.quiz, totals = score(), keys = Object.keys(quiz.areas);
    var max = Math.max.apply(null, keys.map(function (k) { return totals[k]; }));
    var top = keys.filter(function (k) { return totals[k] === max; });

    var bars = keys.map(function (k) {
      var pct = Math.round(((totals[k] - 3) / 9) * 100);
      return '<div class="quiz-bar' + (top.indexOf(k) > -1 ? ' focus' : '') + '">' +
        '<div class="quiz-bar-head"><span>' + esc(quiz.areas[k].name) + '</span><span>' + totals[k] + ' / 12</span></div>' +
        '<div class="quiz-bar-track"><span style="width:' + Math.max(pct, 3) + '%"></span></div></div>';
    }).join('');

    var lead = top.length === 1
      ? '<p class="quiz-focus">Your suggested starting point: <strong>' + esc(quiz.areas[top[0]].name) + '</strong></p>'
      : '<p class="quiz-focus">Your results are tied between <strong>' +
        esc(listJoin(top.map(function (k) { return quiz.areas[k].name; }))) +
        '</strong>. Choose the area most relevant to your goals.</p>';

    var recs = top.map(function (k) {
      var a = quiz.areas[k];
      return '<div class="quiz-step"><span class="eyebrow">' + esc(quiz.recLabel) + (top.length > 1 ? ' &middot; ' + esc(a.name) : '') + '</span>' +
        (a.session ? '<p class="quiz-session">' + esc(a.session) + '</p>' : '') +
        '<p>' + esc(a.rec) + '</p></div>';
    }).join('');

    body.innerHTML =
      '<span class="eyebrow">Your Results</span>' +
      '<h2 id="quiz-title" class="quiz-title">' + esc(quiz.title) + '</h2>' +
      '<p class="quiz-count">Scores range from 3 to 12. Higher scores indicate a greater opportunity for growth.</p>' +
      '<div class="quiz-bars">' + bars + '</div>' +
      lead + recs +
      '<div class="quiz-actions"><a class="btn btn-orange" href="' + quiz.cta.href + '">' + esc(quiz.cta.text) + '</a>' +
      (quiz.guide ? '<a class="btn btn-outline" href="#guide" data-close-quiz>Get the 7-Day Guide</a>' : '') + '</div>' +
      '<button type="button" class="quiz-back quiz-retake">Retake the assessment</button>' +
      '<p class="fine">Your highest-scoring area is a suggested starting point, not a diagnosis or definitive finding. ' +
      esc(quiz.disclaimer) + ' Your answers stay in your browser and aren’t sent anywhere.</p>';

    body.querySelector('.quiz-retake').addEventListener('click', function () { start(state.id); });
    var g = body.querySelector('[data-close-quiz]');
    if (g) g.addEventListener('click', close);
    overlay.querySelector('.modal').scrollTop = 0;
  }

  function close() {
    overlay.classList.remove('open');
    document.body.classList.remove('no-scroll');
  }

  document.addEventListener('DOMContentLoaded', function () {
    overlay = document.getElementById('quiz-modal');
    body = document.getElementById('quiz-body');
    if (!overlay || !body) return;
    document.querySelectorAll('[data-quiz]').forEach(function (btn) {
      btn.addEventListener('click', function () { start(btn.getAttribute('data-quiz')); });
    });
  });
})();
