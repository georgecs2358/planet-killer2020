import { DeathStar } from './DeathStar.mjs';

/***
 * Properties: planets is an array which contains all planets in the alliance
 * Methods: makePlanetsClickable is self explanatory: adds listeners to images
 * removePlanet removes a planet from the array
 * setup will initialise the HTML/CSS as required
 * Getters: size gives the number of planets in the planets array
***/
export class Alliance {

  constructor(planets) {
    this.planets = planets;
  }

  get size() {
    return this.planets.length;
  }

  makePlanetsSelectable() {
    for (let i=0; i<this.size; i++) {
      this.planets[i].makeHoverable();
      this.planets[i].makeClickable(this);
    }
  }

  removePlanet(planet) {
    this.planets.splice(this.planets.indexOf(planet),1);
  }

  setup(isRebel) {
    let n, str;
    if (isRebel) {
      n=1;
      str='rebel';
      document.getElementById('fleet-counter').textContent = 
      "Rebel fleets per turn: " + this.totalFleetsPerTurn;
    } else {
      n=10;
      str='empire';
      this.deathStar.makeHoverable();
    }
    for (let i=0; i<this.size; i++) {
      const _box = document.getElementById(`box${i+n}`);
      _box.innerHTML = `
      <img class="${str}-planet-img" id="${this.planets[i].name}"
      src="${this.planets[i].imagePathName}"
      alt="${this.planets[i].name} image">
      <p>${this.planets[i].name}</p>
      `;
    }
    this.makePlanetsSelectable();

  }

}

/***
 * Properties: attackingPlanet is the current planet selected to launch invasion
 * totalFleets are used to invade Empire planets
 * Getters: totalGoldPerTurn and totalFoodPerTurn gives the total scores across
 * the alliance which is later used to generate fleets
 * setup will initialise the HTML/CSS as required
***/
export class RebelAlliance extends Alliance {

  constructor(planets) {
    super(planets);
    this.totalFleetsPerTurn = 8;
    this.attackingPlanet = null;
  }

  get totalGoldPerTurn() {
    let totalGold = 0;
    for (let i=0; i<this.size; i++) {
      totalGold += this.planets[i].goldPerTurn;
    }
    return totalGold;
  }

  get totalFoodPerTurn() {
    let totalFood = -10;
    for (let i=0; i<this.size; i++) {
      totalFood += this.planets[i].foodPerTurn;
    }
    return totalFood;
  }

}

/***
 * Getters: numberPlans found is used by the Game to check for victory
***/
export class Empire extends Alliance {

  constructor(planets, enemy) {
    super(planets);
    this.enemy = enemy;
    this.deathStar = new DeathStar("DeathStar", this.enemy);
  }

  get numberPlansFound() {
    let plansFound = 3;
    for (let i=0; i<this.size; i++) {
      if (this.planets[i].hasPlans) {
        plansFound--;
      }
    }
    return plansFound;
  }

}