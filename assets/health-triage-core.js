(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.DairyHealthTriage = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const symptoms = [
    { id: 'breathing', label: 'Breathing difficulty, gasping, or open-mouth breathing', level: 3, action: 'Call a veterinarian or emergency animal service now. Keep the animal calm, reduce handling, and do not force fluids or medicines.' },
    { id: 'collapse', label: 'Collapse, cannot stand, or suddenly unable to rise', level: 3, action: 'Call a veterinarian now. Keep the area safe and the animal as comfortable as possible; do not drag it or attempt injections.' },
    { id: 'bloat', label: 'Suddenly swollen or distended abdomen (possible bloat)', level: 3, action: 'Call a veterinarian now, especially with distress or breathing change. Do not drench, insert a tube, cut, puncture, or delay for a home remedy.' },
    { id: 'calving', label: 'Difficult or abnormal calving, or heavy bleeding', level: 3, action: 'Call a veterinarian now. Do not pull the calf or insert a hand or instrument unless the veterinarian directs a trained person.' },
    { id: 'poison', label: 'Possible poison, chemical, or toxic plant exposure', level: 3, action: 'Call a veterinarian now. Keep people and other animals away from the suspected source; retain a label or photo if safe. Do not induce vomiting or give a remedy.' },
    { id: 'mouth-feet', label: 'Mouth/foot blisters or sores, especially in more than one animal', level: 3, action: 'Treat this as a possible contagious disease: call the government veterinarian promptly, stop animal movements, separate affected animals if safe, and follow official instructions.' },
    { id: 'abortion', label: 'Abortion or expelled birth material', level: 2, action: 'Call a veterinarian promptly. Keep people, children, and other animals away; use gloves and avoid touching fluids or tissues. Ask the veterinarian about safe disposal and testing.' },
    { id: 'heat', label: 'Severe heat signs, weakness, or rapid breathing', level: 2, action: 'Move to shade with airflow if safe and offer access to clean water only if alert and able to drink. Breathing distress, collapse, or inability to rise means call now.' },
    { id: 'udder', label: 'Swollen, hot, painful udder or clots/changed milk', level: 2, action: 'Arrange same-day veterinary assessment. Keep abnormal milk separate and do not sell or mix it; follow the veterinarian’s milk-withholding advice.' },
    { id: 'fever', label: 'Fever or animal feels unusually hot', level: 2, action: 'Contact a veterinarian promptly and record how the temperature was measured if safely trained. Do not give human or leftover medicines.' },
    { id: 'diarrhea', label: 'Diarrhea, especially in a calf', level: 2, action: 'Contact a veterinarian promptly, keep the animal clean and observe drinking and behavior. Weakness, inability to suck/drink, blood, or collapse needs urgent care; do not force fluids.' },
    { id: 'not-eating', label: 'Not eating or marked appetite decrease', level: 2, action: 'Contact a veterinarian the same day, especially if the change is sudden or paired with another symptom. Note when it began and recent feed changes.' },
    { id: 'not-drinking', label: 'Not drinking or much less water intake', level: 2, action: 'Contact a veterinarian promptly. Check that clean water is reachable; do not force water into a weak, recumbent, or breathing-distressed animal.' },
    { id: 'milk-drop', label: 'Sudden or unexplained drop in milk', level: 2, action: 'Check and record the animal, date, feed/water changes, and other signs; contact a veterinarian promptly. Do not use milk price or yield changes to rule illness out.' },
    { id: 'lameness', label: 'Limping, hoof injury, or reluctance to bear weight', level: 2, action: 'Provide safe, dry footing and avoid forced walking. Contact a veterinarian promptly; inability to stand, severe pain, or major injury needs urgent care.' },
    { id: 'behavior', label: 'Sudden behavior change, dullness, or unusual weakness', level: 2, action: 'Observe from a safe distance, note when it began and any other signs, and call a veterinarian promptly. Collapse, seizures, breathing distress, or inability to rise means call now.' },
    { id: 'other', label: 'Another new, persistent, or worsening problem', level: 2, action: 'Contact a veterinarian for guidance and describe what changed, when, and whether it is worsening. Do not diagnose or medicate based on an online checklist.' }
  ];

  function assess(selectedIds) {
    const chosen = symptoms.filter(item => selectedIds.includes(item.id));
    if (!chosen.length) return { level: 0, urgency: 'Select at least one sign', actions: [], symptoms: [] };
    const level = Math.max(...chosen.map(item => item.level));
    return {
      level,
      urgency: level === 3 ? 'Call a veterinarian or emergency animal service now' : 'Contact a veterinarian promptly; same day is appropriate for these signs',
      actions: chosen.map(item => item.action),
      symptoms: chosen.map(item => item.id),
      contagious: chosen.some(item => item.id === 'mouth-feet')
    };
  }

  return { symptoms, assess };
});
