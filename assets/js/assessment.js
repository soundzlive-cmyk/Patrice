/*
 * Free self & team assessments (Resources page).
 * Runs entirely in the browser — answers are never sent anywhere.
 * To edit questions or result copy, change QUIZZES below.
 */
(function () {
  var FREQ = ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'];
  var AGREE = ['Strongly disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly agree'];

  var QUIZZES = {
    individual: {
      title: "What’s Really Holding You Back?",
      kicker: 'Free Self-Assessment',
      prompt: 'How often is this true for you?',
      scale: FREQ,
      // Higher score = the pattern shows up more = bigger barrier.
      higherIsBarrier: true,
      areas: [
        {
          key: 'peace', name: 'My Peace',
          questions: [
            'My mind keeps racing, even when I try to rest.',
            'I replay conversations and decisions long after they’re over.',
            'I feel anxious when I can’t control how things will turn out.',
            'When the pressure rises, I feel scattered instead of clear.'
          ],
          headline: 'Fear may be costing you your peace.',
          body: 'Your answers suggest an always-on mind that rarely gets to rest. When fear keeps you on alert, clarity is the first thing to go. The work begins with My Peace: cultivating inner stability, emotional resilience, and clarity under pressure.',
          step: 'This week, notice one moment when your mind starts racing. Pause, name the fear behind it, and ask yourself: what do I actually know to be true right now?'
        },
        {
          key: 'power', name: 'My Power',
          questions: [
            'I second-guess decisions, even ones I’ve thought through carefully.',
            'I hold back my ideas or opinions in case I’m wrong.',
            'I feel like an impostor, despite what I’ve accomplished.',
            'I put other people’s comfort and approval ahead of my own needs.'
          ],
          headline: 'Self-doubt may be muting your voice.',
          body: 'Your answers suggest that fear may be quietly shaping how much of yourself you show. Overthinking, people-pleasing, and impostor feelings drain the confidence you’ve earned. The work begins with My Power: overcoming self-doubt, owning your voice, and leading with confidence and conviction.',
          step: 'This week, make one decision without seeking anyone’s approval first — and share one idea you would normally keep to yourself.'
        },
        {
          key: 'purpose', name: 'My Purpose',
          questions: [
            'I keep putting off a leap I know I’m meant to take.',
            'My days feel busy, but not meaningful.',
            'My decisions are driven more by what feels safe than by what I value.',
            'I’ve stopped believing the bigger vision for my life is possible.'
          ],
          headline: 'Fear may be keeping you safe instead of fulfilled.',
          body: 'Your answers suggest you may be existing instead of truly living — achieving, but not fully aligned with what matters most. The work begins with My Purpose: aligning your decisions with your values, elevating your impact, and building a meaningful legacy.',
          step: 'Write down the leap you keep postponing. Then name the smallest step toward it you could take in the next seven days — and put it on your calendar.'
        }
      ],
      steady: {
        headline: 'You’re leading from a steady place.',
        body: 'Your answers suggest fear isn’t running the show right now. That’s worth protecting. Peace, Power, and Purpose are how you sustain the success you’ve built — and how you grow into what’s next.'
      },
      levels: ['Low', 'Moderate', 'Strong'],
      levelLabel: 'Pattern strength',
      disclaimer: 'This assessment is a reflection tool, not a psychological or clinical evaluation.'
    },

    team: {
      title: "What’s Really Holding Your Team Back?",
      kicker: 'Leadership Assessment',
      prompt: 'How much do you agree with this statement about your team?',
      scale: AGREE,
      // Higher score = stronger area; the lowest area is the focus.
      higherIsBarrier: false,
      areas: [
        {
          key: 'clarity', name: 'Clarity & Resilience',
          questions: [
            'Our team stays focused and level-headed when the pressure rises.',
            'We adapt quickly when plans change or the path is uncertain.',
            'Setbacks lead to learning on our team, not blame.',
            'We sustain strong performance without running on exhaustion.'
          ],
          headline: 'Pressure may be pulling your team off course.',
          body: 'Your answers suggest that when stakes rise or plans shift, your team may lose focus, energy, or composure. Resilient teams aren’t the ones without pressure — they’re the ones who stay grounded and clear-headed in it.',
          step: 'In your next team meeting, debrief a recent high-pressure moment: what helped people stay clear, and what pulled them off course? Agree on one practice to keep.'
        },
        {
          key: 'confidence', name: 'Confidence & Communication',
          questions: [
            'People speak up in meetings, even when they disagree with leadership.',
            'Team members make decisions within their role without waiting for permission.',
            'Mistakes are raised early rather than hidden or explained away.',
            'People take ownership of outcomes, not just tasks.'
          ],
          headline: 'Hesitation may be silencing your team.',
          body: 'Your answers suggest people may be holding back — waiting for permission, avoiding disagreement, or staying quiet about problems. When fear shapes communication, good ideas and early warnings never reach the table.',
          step: 'At your next meeting, ask “What am I missing?” and wait. Thank the first person who disagrees with you — publicly.'
        },
        {
          key: 'alignment', name: 'Alignment & Purpose',
          questions: [
            'Everyone on the team could name our top three priorities.',
            'We understand how our daily work connects to the bigger mission.',
            'When priorities conflict, we know how to decide what comes first.',
            'Our actions consistently reflect the values we say we hold.'
          ],
          headline: 'Your team may be busy, but not aligned.',
          body: 'Your answers suggest your team may be working hard without a shared, clear picture of what matters most. Without alignment, effort scatters and confidence erodes.',
          step: 'Ask each team member to write down the team’s top three priorities, without conferring. Compare the lists together — the gaps are your starting point.'
        }
      ],
      steady: {
        headline: 'Your team has a strong foundation.',
        body: 'Your answers suggest your team handles pressure, communicates with confidence, and knows where it’s going. The next step is sustaining it — and developing the leaders who will carry it forward.'
      },
      levels: ['Needs attention', 'Developing', 'Strong'],
      levelLabel: 'Team strength',
      disclaimer: 'Designed as a conversation starter for leadership development, not a validated measure of team performance.'
    }
  };

  var body, overlay, state;

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function flatQuestions(quiz) {
    var out = [];
    quiz.areas.forEach(function (a, ai) {
      a.questions.forEach(function (q) { out.push({ text: q, area: ai }); });
    });
    return out;
  }

  function start(id) {
    var quiz = QUIZZES[id];
    state = { id: id, quiz: quiz, qs: flatQuestions(quiz), answers: [], i: 0 };
    renderQuestion();
    overlay.classList.add('open');
    document.body.classList.add('no-scroll');
  }

  function renderQuestion() {
    var q = state.qs[state.i], quiz = state.quiz, total = state.qs.length;
    var pct = Math.round((state.i / total) * 100);
    var opts = quiz.scale.map(function (label, v) {
      var sel = state.answers[state.i] === v ? ' selected' : '';
      return '<button type="button" class="quiz-opt' + sel + '" data-v="' + v + '">' + esc(label) + '</button>';
    }).join('');
    body.innerHTML =
      '<span class="eyebrow">' + esc(quiz.kicker) + '</span>' +
      '<h2 id="quiz-title" class="quiz-title">' + esc(quiz.title) + '</h2>' +
      '<div class="quiz-progress" role="progressbar" aria-valuemin="0" aria-valuemax="' + total + '" aria-valuenow="' + state.i + '"><span style="width:' + pct + '%"></span></div>' +
      '<p class="quiz-count">Question ' + (state.i + 1) + ' of ' + total + '</p>' +
      '<p class="quiz-prompt">' + esc(quiz.prompt) + '</p>' +
      '<p class="quiz-q">' + esc(q.text) + '</p>' +
      '<div class="quiz-opts">' + opts + '</div>' +
      '<div class="quiz-nav">' + (state.i > 0 ? '<button type="button" class="quiz-back">&larr; Back</button>' : '<span></span>') + '</div>';
    body.querySelectorAll('.quiz-opt').forEach(function (b) {
      b.addEventListener('click', function () {
        state.answers[state.i] = +b.getAttribute('data-v');
        state.i++;
        if (state.i >= state.qs.length) renderResults(); else renderQuestion();
      });
    });
    var back = body.querySelector('.quiz-back');
    if (back) back.addEventListener('click', function () { state.i--; renderQuestion(); });
    var first = body.querySelector('.quiz-opt'); if (first) first.focus({ preventScroll: true });
  }

  function level(pct, quiz) {
    // Bands: 0–37% / 38–68% / 69–100%
    var idx = pct < 38 ? 0 : pct < 69 ? 1 : 2;
    return quiz.levels[idx];
  }

  function renderResults() {
    var quiz = state.quiz;
    var scores = quiz.areas.map(function (a, ai) {
      var sum = 0, n = 0;
      state.qs.forEach(function (q, qi) { if (q.area === ai) { sum += state.answers[qi]; n++; } });
      return Math.round((sum / (n * 4)) * 100);
    });
    // Focus area: biggest barrier (individual) or weakest strength (team).
    var focus = 0;
    scores.forEach(function (s, i) {
      if (quiz.higherIsBarrier ? s > scores[focus] : s < scores[focus]) focus = i;
    });
    var isSteady = quiz.higherIsBarrier ? scores[focus] < 38 : scores[focus] >= 69;
    var a = quiz.areas[focus];

    var bars = quiz.areas.map(function (ar, i) {
      return '<div class="quiz-bar' + (i === focus && !isSteady ? ' focus' : '') + '">' +
        '<div class="quiz-bar-head"><span>' + esc(ar.name) + '</span><span>' + esc(level(scores[i], quiz)) + '</span></div>' +
        '<div class="quiz-bar-track"><span style="width:' + Math.max(scores[i], 3) + '%"></span></div></div>';
    }).join('');

    var main = isSteady
      ? '<h3 class="quiz-headline">' + esc(quiz.steady.headline) + '</h3><p>' + esc(quiz.steady.body) + '</p>'
      : '<p class="quiz-focus">Your focus area: <strong>' + esc(a.name) + '</strong></p>' +
        '<h3 class="quiz-headline">' + esc(a.headline) + '</h3><p>' + esc(a.body) + '</p>' +
        '<div class="quiz-step"><span class="eyebrow">Your Next Step</span><p>' + esc(a.step) + '</p></div>';

    var cta = state.id === 'team'
      ? '<a class="btn btn-orange" href="contact.html">Talk With Patrice About Your Team</a>'
      : '<a class="btn btn-orange" href="contact.html">Schedule a Discovery Call</a>';

    body.innerHTML =
      '<span class="eyebrow">Your Results</span>' +
      '<h2 id="quiz-title" class="quiz-title">' + esc(quiz.title) + '</h2>' +
      '<p class="quiz-count">' + esc(quiz.levelLabel) + ' by area</p>' +
      '<div class="quiz-bars">' + bars + '</div>' +
      main +
      '<div class="quiz-actions">' + cta +
      '<a class="btn btn-outline" href="#guide" data-close-quiz>Get the Free Guide</a></div>' +
      '<button type="button" class="quiz-back quiz-retake">Retake the assessment</button>' +
      '<p class="fine">' + esc(quiz.disclaimer) + ' Your answers stay in your browser and aren’t sent anywhere.</p>';

    body.querySelector('.quiz-retake').addEventListener('click', function () { start(state.id); });
    body.querySelector('[data-close-quiz]').addEventListener('click', close);
    body.scrollTop = 0; overlay.querySelector('.modal').scrollTop = 0;
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
