/***
 * Properties: rebelPlanets and totalRebelFleets, from rebels, will be
 * modified.
 * Methods: display adds an allocation bar to the game window and provides 
 * functionality for allocating troops
 * buttonClickHandler adjusts the fleets variable for the input planet and the
 * totalRebelFleets. The DOM is also updates
 * hide restores the Game Window to its original appearance and deletes nodes
 * already created by this class
***/
export class AllocationBar {

  constructor(rebels) {
    this.rebelPlanets = rebels.planets;
    this.totalRebelFleets = rebels.totalFleetsPerTurn;

    this.display();
  }

  display() {
    document.getElementById('trp-counter').textContent = 
    "Fleets to allocate: " + this.totalRebelFleets; 
    document.getElementById('trp-counter').style.textDecoration = 'underline';
    document.getElementById('game-window').style.gridTemplateAreas = `
      "galaxy-stats current-stats current-stats"
      "galaxy galaxy galaxy"
      "allocation allocation allocation"
    `;
    document.getElementById('turn-btn').style.display = 'none';
    document.getElementById('allocation').style.display = 'flex';
    let _planetBtn = null;
    for (let i=0; i<this.rebelPlanets.length; i++) {
      _planetBtn = document.createElement('button');
      _planetBtn.id = `${this.rebelPlanets[i].name}-btn`;
      _planetBtn.className = 'planet-btn';
      _planetBtn.textContent = 
        `${this.rebelPlanets[i].name}: ${this.rebelPlanets[i].fleets}`;
      document.getElementById('planet-btns').appendChild(_planetBtn);
      _planetBtn.addEventListener(
        'click', 
        this.buttonClickHandler.bind(this, this.rebelPlanets[i], _planetBtn)
      );
    }
  }

  buttonClickHandler(planet, planetButton) {
    this.totalRebelFleets--;
    planet.fleets++;
    document.getElementById('trp-counter').textContent = 
      "Fleets to allocate: " + this.totalRebelFleets
    ;
    planetButton.textContent = `${planet.name}: ${planet.fleets}`;
    if (this.totalRebelFleets === 0) {
      this.hide();
    }
  }

  hide() {
    document.getElementById('game-window').style.gridTemplateAreas = `
      "galaxy-stats current-stats current-stats"
      "galaxy galaxy galaxy"
      "message message end"
    `;
    document.getElementById('turn-btn').style.display = 'initial';
    document.getElementById('allocation').style.display = 'none';
    let buttonDiv = document.getElementById('planet-btns');
    while (buttonDiv.firstChild) {
      buttonDiv.removeChild(buttonDiv.firstChild);
    }
  }

}