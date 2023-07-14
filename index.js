let container = document.getElementsByClassName("main-container")[0];
let cellTemplate = document.getElementsByClassName("cell")[0];
let clrs = ["rgb(227, 202, 165)", "rgb(204,181,148)", "rgb(181,161,132)", "rgb(158,141,115)", "rgb(136,121,99)", "rgb(113,101,82)", "rgb(90,80,66)", "rgb(68,60,49)", "rgb(45,40,33)"];
let num_clr = [2, 4, 8, 16, 32, 64, 128, 256, 512];

// setup window
if (window.innerWidth <= 530){
  container.style.transform = "scale(" + (window.innerWidth / 530) + ")";
}

let map = [];
for(let i = 0; i < 4; i++){
  map.push([undefined, undefined, undefined, undefined]);
}

var cellSize = 125;
var cellPadding = 5;

let canMove = true;
let animTime = 500;

spawnCell();

document.addEventListener('keydown', (event) => {
  moveCells(event.key);
}, false);

function moveMe(oldPos, obj, newPos, add){
  //obj.style.left = newPos[0] * cellSize + cellPadding + "px";
  //obj.style.top = newPos[1] * cellSize + cellPadding + "px";

  //console.log(obj, oldPos, newPos, add);

  let a = map[oldPos[1]][oldPos[0]];
  let b = map[newPos[1]][newPos[0]];
  map[oldPos[1]][oldPos[0]] = undefined;
  map[newPos[1]][newPos[0]] = a;

  if (add){
    var val = Number(a.dataset.value) * 2;
    a.setAttribute("data-value", val);
    a.setAttribute("data-allow", 0);
    console.log(a, a.dataset.value, a.dataset.allow);
  }

  const anim = a.animate(
    [{left: oldPos[0] * cellSize + cellPadding + "px", top: oldPos[1] * cellSize + cellPadding + "px"}, 
    {left: newPos[0] * cellSize + cellPadding + "px", top: newPos[1] * cellSize + cellPadding + "px"}],
    {
      fill: "forwards",
      easing: "ease",
      duration: animTime,
    }
  );
  anim.play();


  setTimeout(() => {
    if (add){
      b.remove();

      a.setAttribute("data-allow", 1);
      a.textContent = val;
      let clr_index = num_clr.indexOf(val);
      if (clr_index == -1) clr_index = num_clr.length - 1;
      if (val >= 256) a.style.color = "white";
      a.style.backgroundColor = clrs[clr_index];
    }
  }, animTime);
}

function moveCells(code){
  if (!canMove) return;
  canMove = false;

  if (code != "ArrowUp" && code != "ArrowRight" && code != "ArrowDown" && code != "ArrowLeft") return;
  
  if (code == "ArrowUp"){
    for(let i = 0; i < 4; i++){
      for(let j = 0; j < 4; j++){
        if (map[j][i] != undefined && j != 0){
          let newPos = j;
          let myVal = map[j][i].dataset.value;
          let add = false;
          for(let k = j - 1; k >= 0; k--){
            if (map[k][i] == undefined){
              newPos = k;
            }
            else if (map[k][i].dataset.value == myVal && Number(map[k][i].dataset.allow) == 1){
              newPos = k;
              add = true;
            }
            else break;
          }
          moveMe([i, j], map[j][i], [i, newPos], add);
        }
      }
    }
  }
  else if (code == "ArrowDown"){
    for(let i = 0; i < 4; i++){
      for(let j = 3; j >= 0; j--){
        if (map[j][i] != undefined && j != 3){
          let newPos = j;
          let myVal = map[j][i].dataset.value;
          let add = false;
          for(let k = j + 1; k < 4; k++){
            if (map[k][i] == undefined){
              newPos = k;
            }
            else if (map[k][i].dataset.value == myVal && Number(map[k][i].dataset.allow) == 1){
              newPos = k;
              add = true;
            }
            else break;
          }
          moveMe([i, j], map[j][i], [i, newPos], add);
        }
      }
    }
  }
  else if (code == "ArrowRight"){
    for(let i = 0; i < 4; i++){
      for(let j = 3; j >= 0; j--){
        if (map[i][j] != undefined && j != 3){
          let newPos = j;
          let myVal = map[i][j].dataset.value;
          let add = false;
          for(let k = j + 1; k < 4; k++){
            if (map[i][k] == undefined){
              newPos = k;
            }
            else if (map[i][k].dataset.value == myVal && Number(map[i][k].dataset.allow) == 1){
              newPos = k;
              add = true;
            }
            else break;
          }
          moveMe([j, i], map[i][j], [newPos, i], add);
        }
      }
    }
  }
  else if (code == "ArrowLeft"){
    for(let i = 0; i < 4; i++){
      for(let j = 0; j < 4; j++){
        if (map[i][j] != undefined && j != 0){
          let newPos = j;
          let myVal = map[i][j].dataset.value;
          let add = false;
          for(let k = j - 1; k >= 0; k--){
            if (map[i][k] == undefined){
              newPos = k;
            }
            else if (map[i][k].dataset.value == myVal && Number(map[i][k].dataset.allow) == 1){
              newPos = k;
              add = true;
            }
            else break;
          }
          moveMe([j, i], map[i][j], [newPos, i], add);
        }
      }
    }
  }

  setTimeout(() => {
    canMove = true;
    spawnCell();
  }, animTime);
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

function spawnCell(){
  let randRow = getRandomInt(0, 4);
  let randCollumn = getRandomInt(0, 4);

  let cntError = 0;
  while(map[randCollumn][randRow] != undefined){
    randRow = getRandomInt(0, 4);
    randCollumn = getRandomInt(0, 4);
    cntError++;
    if (cntError >= 100) break;
  }
  if (cntError >= 100) return;

  var newCell = cellTemplate.cloneNode(true);
  newCell.style.display = "flex";
  newCell.style.left = randRow * cellSize + cellPadding + "px";
  newCell.style.top = randCollumn * cellSize + cellPadding + "px";
  newCell.setAttribute("data-value", 2);
  newCell.setAttribute("data-allow", 1);

  map[randCollumn][randRow] = newCell;
  container.appendChild(newCell);

  const anim = newCell.animate(
    [{ transform: "scale(0)" }, { transform: "scale(1)"}],
    {
      fill: "forwards",
      easing: "ease",
      duration: animTime,
    }
  );
  anim.play();
}


// swipe on mobile

document.addEventListener('touchstart', handleTouchStart, false);        
document.addEventListener('touchmove', handleTouchMove, false);

var xDown = null;                                                        
var yDown = null;

function getTouches(evt) {
  return evt.touches ||             // browser API
         evt.originalEvent.touches; // jQuery
}                                                     
                                                                         
function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];                                      
    xDown = firstTouch.clientX;                                      
    yDown = firstTouch.clientY;                                      
};                                                
                                                                         
function handleTouchMove(evt) {
    if ( ! xDown || ! yDown ) {
        return;
    }

    var xUp = evt.touches[0].clientX;                                    
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;
                                                                         
    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
        if ( xDiff > 0 ) {
          moveCells("ArrowLeft");/* right swipe */ 
        } else {
          moveCells("ArrowRight");/* left swipe */
        }                       
    } else {
        if ( yDiff > 0 ) {
          moveCells("ArrowUp"); /* down swipe */ 
        } else { 
          moveCells("ArrowDown"); /* up swipe */
        }                                                                 
    }
    /* reset values */
    xDown = null;
    yDown = null;                                             
};