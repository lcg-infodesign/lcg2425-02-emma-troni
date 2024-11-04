// ======== ASSIGMENT 02 =========

// PER OGNI GLIFO
//    - linee che hanno un angolo variabile tra 0/45/90° 
//      --> creo una sottogriglia per ogni mappa -> passaggio obbligato per punti della sottogriglia
//    - maggiore probabilità di passaggio verso il centro 
//      --> inizializzo linea per avere come coordinate iniziali di passaggio in un intorno del centro
//    - per ogni linea almeno due punti esterni e un punto vicino al centro

// CICLO PER DEFINIRE LOGICA DELLE FERMATE 
// continua a generare punti a caso finché non ne trova uno che rispetta le condizioni:
//    - nextX non deve uscire dalla griglia a sx/dx
//    - nextY non deve uscire dalla griglia in alto/basso   
//    - se la fermata già stata visitata, ha una probablità 
//      random<5% fermarsi su un punto già visitato

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(1);
}

function draw() {
  background("white");
  // dimensioni scalate sulla base di quelle date:
  let scaleRatio = windowWidth / 1920;
  let maxUnitSize = 200;
  let unitSize = maxUnitSize * scaleRatio;
  // valore massimo del margine = 0.2% della larghezza della finestra
  let margin = windowWidth * 0.02;

  let contentWidth = windowWidth - margin * 2;
  let contentHeight = windowHeight - margin * 2;

  // n max di colonne/righe si adatta in base allo spazio disponibile
  let nColumns = floor(contentWidth / unitSize);
  let nRows = floor(contentHeight / unitSize);

  // dim effettive della griglia
  let gridWidth = nColumns * unitSize;
  let gridHeight = nRows * unitSize;

  // centrare la griglia all'interno della finestra
  translate((windowWidth - gridWidth) / 2, (windowHeight - gridHeight) / 2);

  // grid
  noFill();
  for (let r = 0; r < nRows; r++) {
    for (let c = 0; c < nColumns; c++) {
      push();
      translate(c * unitSize, r * unitSize);
      drawMap(unitSize, scaleRatio);
      pop();

    }
  }
}

function drawMap(unitSize, scaleRatio) {
  let gridSize = 10;
  // griglia 10x10 all'interno di ogni unità della griglia + grande
  let scaledStroke = 8 * scaleRatio;
  let unitSmallSize = unitSize / gridSize;
  let colors = ["blue", "red", "green", "orange", "hotpink"];
  let linesCount = floor(random(3, colors.length + 1));

  // voglio gestire la griglia di punti per tenere traccia dei punti su cui sono già passata
  // points[x qualsiasi][y qualsiasi]=true
  // la matrice points[row][col] verrà impostata true quando una fermata viene "visitata"
  let points = [];
  for (let row = 0; row < gridSize; row++) {
    let singlePoint = [];
    for (let col = 0; col < gridSize; col++) {
      singlePoint.push(false);
    }
    points.push(singlePoint);
  }
  // n fermate dipende dal n di colori --> iterazione --> ogni linea un colore !=
  for (let color = 0; color < linesCount; color++) {
    stroke(colors[color]);
    // posizione iniziale linea all'interno griglia 10x10 
    let [x, y] = [floor(random(3, 6)), floor(random(3, 6))];
    let stopsCount = floor(random(5, gridSize * scaleRatio));
    // CICLO PER DEFINIRE LOGICA DELLE FERMATE 
    for (let stop = 0; stop < stopsCount; stop++) {
      let nextX, nextY;
      do {
        // floor(random (-1,2) --> -1,0,1 --> 8 pti + vicini nella griglia rispetto alla cella/pto precedente
        // - - -
        // - x -
        // - - -  
        nextX = x + floor(random(-1, 2));
        nextY = y + floor(random(-1, 2));

      } while (
        // verifico validità (nextX, nextY)
        nextX < 0 || nextX >= gridSize ||
        nextY < 0 || nextY >= gridSize ||
        (points[nextX][nextY] && random() > 0.05)
      );
      strokeWeight(scaledStroke);
      line(x * unitSmallSize, y * unitSmallSize, nextX * unitSmallSize, nextY * unitSmallSize);
      drawStop(x, y, unitSmallSize, scaledStroke);
      drawStop(nextX, nextY, unitSmallSize, scaledStroke);
      points[x][y] = true;
      points[nextX][nextY] = true;
      x = nextX;
      y = nextY;
    }
  }
}

function drawStop(x, y, unitSmallSize, scaledStroke) {
  strokeWeight(1);
  fill("white");
  circle(x * unitSmallSize, y * unitSmallSize, scaledStroke);
}

// https://p5js.org/reference/p5/resizeCanvas/ 
// resizeCanvas() immediately clears the canvas and calls redraw()
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  redraw();
}