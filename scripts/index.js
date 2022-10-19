"use strict";
const deck = [
  "./images/bobrossparrot.gif",
  "./images/explodyparrot.gif",
  "./images/fiestaparrot.gif",
  "./images/metalparrot.gif",
  "./images/revertitparrot.gif",
  "./images/tripletsparrot.gif",
  "./images/unicornparrot.gif"
];
const backFaceImg = "./images/back.png";
const altMsg = "parrot variation";

if (typeof Element.prototype.clearElementChildren === "undefined") {
  Object.defineProperty(Element.prototype, "clearElementChildren", {
    configurable: true,
    enumerable: false,
    value: function() {
      while(this.firstElementChild)
        this.removeChild(this.lastElementChild);
    }
  });
}

function delay(miliseconds) {
  return new Promise(resolve => {
    setTimeout(resolve, miliseconds);
  });
}

class ParrotsGame {
  constructor() {
    this.tempi = 0;
    this.foundPairs = 0;
    this.clockID = 0;
    this.selected = undefined;
    this.startTime = undefined;
    let numCards = parseInt(prompt("Quantas cartas devem ser usadas? (número par entre 3 e 15)"));
    while ((numCards !== numCards) || numCards % 2 || numCards < 4 || numCards > 14)
      numCards = parseInt(prompt("Escolha um número par no intervalo de 4 a 14, incluidos"));
    this.numPairs = numCards/2;
    this.startPlaying();
  }

  startPlaying() {
    const pairs = deck.slice(0, this.numPairs);
    let cards = pairs.concat(pairs);
    cards.sort(() => {
      return Math.random() - 0.5;
    });
    this.injectCards(cards);
  }

  injectCards(cards) {
    cards.forEach(card => {
      const newCard = document.createElement("div");
      const frontFace = document.createElement("div");
      const backFace = document.createElement("div");
      newCard.classList.add("card");
      frontFace.classList.add("face");
      frontFace.classList.add("front-face");
      backFace.classList.add("face");
      backFace.classList.add("back-face");
      const frontImage = document.createElement("img");
      frontImage.src = card;
      const backImage = document.createElement("img");
      backImage.src = backFaceImg;
      frontImage.alt = backImage.alt = altMsg;
      frontImage.draggable = backImage.draggable = false;
      frontFace.appendChild(frontImage);
      backFace.appendChild(backImage);
      newCard.appendChild(frontFace);
      newCard.appendChild(backFace);
      const page = document.getElementById("page");
      page.appendChild(newCard);
      newCard.addEventListener("click", this.selectCard.bind(this));
    });
    this.startTime = (new Date()).getTime();
    this.clockID = setInterval(this.updateClock.bind(this), 1000);
  }

  async selectCard(e) {
    this.tempi++;
    if (!this.selected) {
      e.currentTarget.classList.add("selected");
      this.selected = e.currentTarget;
    } else if (this.selected !== e.currentTarget) {
      const showingFront = this.selected.firstElementChild.firstElementChild;
      const selectedFront = e.currentTarget.firstElementChild.firstElementChild;
      e.currentTarget.classList.add("selected");
      console.log(e.currentTarget);
      if (selectedFront.src === showingFront.src) {
        this.foundPairs++;
        this.selected = undefined;
        if (this.foundPairs === this.numPairs) {
          const [ minutesPLayed, secondsPlayed ] = this.timeElapsed();
          let finalMsg = `Parabéns! Você completou o jogo em ${this.tempi} jogadas, gastando`;
          if (minutesPLayed)
            finalMsg += ` ${minutesPLayed} minuto(s) e`;
          finalMsg += ` ${secondsPlayed} segundos`;
          alert(finalMsg);
          clearInterval(this.clockID);
          this.askUserRestart();
        }
      } else {
        const cardSelected = e.currentTarget;
        const previouslySelected = this.selected;
        this.selected = undefined;
        await delay(1000);
        cardSelected.classList.remove("selected");
        previouslySelected.classList.remove("selected");
      }
    }
  }

  askUserRestart() {
    const tryAgain = confirm("Deseja reiniciar a partida?");
    if (tryAgain){
      const page = document.getElementById("page");
      page.clearElementChildren();
      main();
    }
  }

  updateClock() {
    const clock = document.getElementById("clock");
    const [ minutesPLayed, secondsPlayed ] = this.timeElapsed();
    clock.innerText = `${minutesPLayed.toString().padStart(2, "0")}:`+
                       `${secondsPlayed.toString().padStart(2, "0")}`;
  }

  timeElapsed() {
    const second = 1000; // 1000 miliseconds
    const minute = 60; // 60 seconds
    const playedTime = ((new Date()).getTime()-this.startTime)/second;
    return [Math.floor(playedTime/minute), Math.floor(playedTime%minute)];
  }
}

main();

function main() {
  const game = new ParrotsGame();
}
