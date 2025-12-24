let currentAbilityBoost = null;
let currentStartingTalent = null;
let currentSubtypeAbilityBoost = null;
let currentSubtypeTalent = null;

function applyPhenotype(key) {
  const phenotype = phenotypes[key];
  if (!phenotype) return;

  hero.phenotype = key;
  hero.baseSpeed = phenotype.baseSpeed;
  hero.size = phenotype.size;
  hero.bonuses.phenotype = {
    abilityBoosts: phenotype.abilityBoosts,
    startingTalents: phenotype.startingTalents
  };

  currentAbilityBoost = null;
  currentStartingTalent = null;

  hero.abilities = { might: 0, agility: 0, endurance: 0, wits: 0, charm: 0 };
  hero.talents = [];

  document.getElementById("abilityBoostSection").style.display = "block";
  document.getElementById("startingTalentSection").style.display = "block";

  document.getElementById("subtypeSection").style.display = "none";

  populateStartingTalents();
  updateHeroPreview();
}

function applyAbilityBoost(ability, isSubtype = false) {
  const boostAmount = phenotypes[hero.phenotype]?.abilityBoosts || 1;

  if (isSubtype) {
    if (currentSubtypeAbilityBoost) hero.abilities[currentSubtypeAbilityBoost] -= boostAmount;
    hero.abilities[ability] += boostAmount;
    currentSubtypeAbilityBoost = ability;
  } else {
    if (currentAbilityBoost) hero.abilities[currentAbilityBoost] -= boostAmount;
    hero.abilities[ability] += boostAmount;
    currentAbilityBoost = ability;

    tryShowSubtypeSection();
  }

  updateHeroPreview();
}

function applyStartingTalent(talent, isSubtype = false) {
  if (isSubtype) {
    if (currentSubtypeTalent) {
      const index = hero.talents.indexOf(currentSubtypeTalent);
      if (index > -1) hero.talents.splice(index, 1);
    }
    hero.talents.push(talent);
    currentSubtypeTalent = talent;
  } else {
    if (currentStartingTalent) {
      const index = hero.talents.indexOf(currentStartingTalent);
      if (index > -1) hero.talents.splice(index, 1);
    }
    hero.talents.push(talent);
    currentStartingTalent = talent;

    tryShowSubtypeSection();
  }

  updateHeroPreview();
}

function tryShowSubtypeSection() {
  if (hero.phenotype === "human" && currentAbilityBoost && currentStartingTalent) {
    document.getElementById("subtypeSection").style.display = "block";
  }
}

function applySubtype(subtype) {
  hero.subtype = subtype;

  document.getElementById("subtypeAbilityBoostSection").style.display = "block";
  document.getElementById("subtypeTalentSection").style.display = "block";

  populateSubtypeStartingTalents();
  updateHeroPreview();
}

function populateStartingTalents() {
  const select = document.getElementById("startingTalentSelect");
  select.innerHTML = "";

  level1Talents.forEach(talent => {
    const option = document.createElement("option");
    option.value = talent;
    option.textContent = talent;
    select.appendChild(option);
  });

  select.onchange = function() {
    applyStartingTalent(this.value, false);
  };
}

function populateSubtypeStartingTalents() {
  const select = document.getElementById("subtypeTalentSelect");
  select.innerHTML = "";

  level1Talents.forEach(talent => {
    const option = document.createElement("option");
    option.value = talent;
    option.textContent = talent;
    select.appendChild(option);
  });

  select.onchange = function() {
    applyStartingTalent(this.value, true);
  };
}

function updateHeroPreview() {
  document.getElementById("heroPreview").textContent = JSON.stringify(hero, null, 2);
}

function setupListeners() {
  document.querySelectorAll('input[name="phenotype"]').forEach(r => {
    r.addEventListener("change", () => applyPhenotype(r.value));
  });

  document.querySelectorAll('input[name="abilityBoost"]').forEach(r => {
    r.addEventListener("change", () => applyAbilityBoost(r.value, false));
  });

  document.querySelectorAll('input[name="subtypeAbilityBoost"]').forEach(r => {
    r.addEventListener("change", () => applyAbilityBoost(r.value, true));
  });

  document.querySelectorAll('input[name="subtype"]').forEach(r => {
    r.addEventListener("change", () => applySubtype(r.value));
  });
}

window.setupListeners = setupListeners;
window.updateHeroPreview = updateHeroPreview;
