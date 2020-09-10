/***
 * Properties: type specifies which text to display, planet describes which
 * planet the message relates to. Victory is a boolean which helps differentiate
 * between messages
 * Getters: text which is sent to HTML. image also sent to HTML
 * Methods: render displays the correct message
***/
export class Message {

  constructor(type, planet=null, rebelVictory=1) {
    this.type = type;
    this.planet = planet;
    this.rebelVictory = rebelVictory;

    this.render();
  }

  get text() {
    let msgText;
    switch(this.type) {
      case "welcome":
        msgText = "Welcome! First allocate fleets using the gold buttons.";
        break;
      case "initial":
        msgText = "Now we must prepare amd launch an invasion. First click a" +
        " friendly planet, then select a planet to invade.";
        break;
      case "destroy":
        if (this.rebelVictory === 0) {
          msgText = "The Death Star dealt with " + this.planet.name +
          ". The Empire also captured other unguarded planets.";
        } else {
          msgText = this.planet.name + " has experienced the full power of the "
          + "Empire.";
        }
        break;
      case "prepare":
        msgText = "Fleets on " + this.planet.name + " have been prepared " +
        "for launch. May the force be with you, always.";
        break;
      case "prompt":
        msgText = "You must first select a friendly planet to attack from.";
        break;
      case "capture":
        if (this.rebelVictory === 1) {
          msgText = "You are a part of the Rebel Alliance and a traitor! " +
          "You will be punished for capturing " + this.planet.name + ". We have"
          + "left rubble for you to rebuild.";
        } else if (this.rebelVictory === 2) {
          msgText = "We uncovered secret plans when freeing " + this.planet.name
          + ". If all 3 plans are found, we can attack the Death Star"
          + " and destroy that ship!";
        } else if (!(this.rebelVictory)) {
          msgText = "Our ships failed to capture " + this.planet.name +
          ". We must regroup.";
        }
        break;
      case "success":
        msgText = "We have all the plans! We can now attack the " +
        "Death Star directly to defeat the Empire!";
        break;
    }
    return msgText;
  }

  get image() {
    if (this.type === "welcome") {
      return "luke";
    } else if (this.type === "initial") {
      return "leia";
    } else if (this.type === "success") {
      return "luke";
    } else if (this.type === "capture" && this.rebelVictory === 1) {
      return "vader";
    } else if (this.type === "capture" && this.rebelVictory === 2) {
      return "plans";
    } else if (this.type === "destroy") {
      return "tarkin";
    } else {
      const pictureNumber = Math.floor(Math.random() * 3);
      switch (pictureNumber) {
        case 1:
          return "mon";
        case 2:
          return "ackbar";
        default:
          return "mon";
      }
    }
  }

  render() {
    const messageBox = document.getElementById('message-box');
    messageBox.innerHTML = `
    <img class="message-character" src="images/messages/${this.image}.png"
    class="" alt="Game message text">
    <p>${this.text}</p>
    `;
  }

}
