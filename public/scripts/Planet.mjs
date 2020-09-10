import { Message } from './Message.mjs';

/***
 * Properties: A name to identify, credits and food per turn which contribute to
 * Rebel resources. A getter returns the image path name.
 * Methods: makeClickable adds an event listener to the DOM.
***/
export class Planet {

  constructor(name) {
    this.name= name;
  }

  get imagePathName() {
    return `images/planets/${this.name.toLowerCase()}.png`;
  }

  get imageSurfacePathName() {
    return `images/surfaces/${this.name.toLowerCase()}.png`;
  }

  makeHoverable() {
    const _image = document.getElementById(`${this.name}`);
    _image.addEventListener('mouseover', this.hoverHandler.bind(this));
  }

  makeClickable(alliance) {
    const _image = document.getElementById(`${this.name}`);
    _image.addEventListener('click', this.clickHandler.bind(this, alliance));
  }

}

/***
 * Properties: Properties from parent constructor, fleets which will be
 * manually assigned, isRebelAttackPlanet used when invading a planet
 * Methods: clickHandler will mark this planet as the RebelAttackPlanet.
***/
export class RebelPlanet extends Planet {

  constructor(name, goldPerTurn, foodPerTurn) {
    super(name);
    this.goldPerTurn = goldPerTurn;
    this.foodPerTurn = foodPerTurn;
    this.fleets = 0;
  }

  removeHoverable() {
    const _image = document.getElementById(`${this.name}`);
    _image.removeEventListener('mouseover', this.hoverHandler.bind(this));
  }

  clickHandler(rebelAlliance) {
    if (rebelAlliance.planets.includes(this)) {
      rebelAlliance.attackingPlanet = this;
      new Message("prepare", this);
    } else {
      new Message("prompt");
    }
  }

  hoverHandler() {
    document.getElementById('current-stats').innerHTML = `
    <img class="surface-img" src="${this.imageSurfacePathName}"
    alt="${this.name} image">
    <div class="planet-stats">
    <p><u>${this.name}</u></p>
    <p>Credits per turn: ${this.goldPerTurn} million</p>
    <p>Food per turn: ${this.foodPerTurn}</p>
    <p>Fleets: ${this.fleets}</p>
    </div>
    `;
  }

}

/***
 * Properties: Properties from parent constructor, fleets which will be
 * manually assigned, hasPlans which states whether part of victory condition
 * Methods: clickHandler will call defend with the rebelAttackPlanet as the
 * invading planet. defend might remove planet from Empire's control.
***/
export class EmpirePlanet extends Planet {

  constructor(name, fleets) {
    super(name);
    this.fleets = fleets;
    this.hasPlans = false;
  }

  clickHandler(empire) {
    this.defend(empire, empire.enemy.attackingPlanet);
    empire.enemy.attackingPlanet = null;
  }

  hoverHandler() {
    document.getElementById('current-stats').innerHTML = `
    <img class="surface-img" src="${this.imageSurfacePathName}"
    alt="${this.name} image">
    <div class="planet-stats">
    <p><u>${this.name}</u></p>
    <p>Fleets: ${this.fleets}</p>
    </div>
    `;
  }

  defend(empire, attackingPlanet) {
    // If needed for balance, have 'successProbability' which determines victory
    if (attackingPlanet === null) {
      new Message("prompt");
      return;
    }
    if (attackingPlanet.fleets > this.fleets) {
      empire.removePlanet(this);
      document.getElementById(`${this.name}`).className = "captured-planet-img";
      if (this.hasPlans) {
        new Message("capture", this, 2);
        document.getElementById('plans-counter').innerHTML = `
        Death Star plans captured: ${empire.numberPlansFound}/3`;
      } else {
        new Message("capture", this, 1);
      }
    } else {
      new Message("capture", this, 0);
    }
    if (attackingPlanet.fleets - this.fleets >= 0) {
      attackingPlanet.fleets -= this.fleets;
    } else {
      attackingPlanet.fleets = 0;
    }
    this.fleets = 0;
  }

}
