(function () {
  'use strict';
  const core = window.DairyHealthTriage;
  const form = document.getElementById('symptom-triage');
  const result = document.getElementById('triage-result');
  if (!core || !form || !result) return;

  const list = document.getElementById('triage-symptoms');
  for (const symptom of core.symptoms) {
    const label = document.createElement('label');
    label.className = 'triage-option';
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.name = 'symptom';
    input.value = symptom.id;
    label.append(input, document.createTextNode(symptom.label));
    list.append(label);
  }

  form.addEventListener('reset', () => {
    result.replaceChildren();
    result.classList.add('hide');
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    const assessment = core.assess([...form.querySelectorAll('input[name="symptom"]:checked')].map(input => input.value));
    result.replaceChildren();
    result.classList.remove('hide');

    const heading = document.createElement('h3');
    heading.textContent = assessment.urgency;
    result.append(heading);
    if (assessment.level === 0) {
      result.setAttribute('role', 'status');
      result.append(document.createTextNode('No diagnosis is made. If an animal appears unwell or worsens, call a veterinarian.'));
      result.focus();
      return;
    }

    result.classList.toggle('triage-emergency', assessment.level === 3);
    result.setAttribute('role', assessment.level === 3 ? 'alert' : 'status');
    const intro = document.createElement('p');
    intro.textContent = 'This is a safety-oriented routing aid, not a diagnosis or treatment plan. Do not wait for an online result if the animal is deteriorating.';
    result.append(intro);
    const actions = document.createElement('ul');
    for (const action of assessment.actions) {
      const item = document.createElement('li');
      item.textContent = action;
      actions.append(item);
    }
    result.append(actions);

    const call = document.createElement('a');
    call.href = (window.APP_ROOT || '../') + 'pages/emergency.html';
    call.textContent = 'Open emergency contacts and what to report';
    call.className = 'button';
    result.append(call);
    result.focus();
  });
})();
