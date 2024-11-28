// Functions to handel the label colors & Selection
function toggleSelection(element) {
    var selectableElements = document.querySelectorAll('.selected-ingredient');
    for (var i = 0; i < selectableElements.length; i++) {
      selectableElements[i].classList.remove('selected-ingredient');
    }
    element.classList.add('selected-ingredient');
  }

  function deleteIngredientBox(element) {
    element.parentNode.remove();

  }

  let boxCounter = 0;

  function addIngredient() {
    const container = document.getElementById('container');
    const newBox = document.createElement('div');
    const boxId = 'ingredient-box-' + boxCounter++;
    boxCounter++;
    const rand_color = '#' + Math.floor(Math.random() * 16777215).toString(16);

    newBox.id = boxId;
    newBox.className = 'ingredient-box';
    newBox.onclick = function() {toggleSelection(this)};
    newBox.innerHTML = `
        <input type="color" id='${boxId}-colorbox' name='${boxId}-colorbox' value="${rand_color}">
        <input type="text" class="text-field" placeholder="Enter text here...">
        <button type="delete-button" onclick="deleteIngredientBox(this)">X</button>
        `;
    container.appendChild(newBox);
  }

  
  // Functions to handle Grid creation
  var columnsInput = document.getElementById('columns');
  var rowsInput = document.getElementById('rows');
  var grid = document.getElementById('grid');

  function drawGrid(){
    grid.innerHTML = "";

    var columns = parseInt(columnsInput.value);
    var rows = parseInt(rowsInput.value); 

    grid.style.gridTemplateColumns = 'repeat(' + columns + ', 1fr)';
    grid.style.gridTemplateRows = 'repeat(' + rows + ', 1fr)';

    for (var i = 0; i < rows; i++) {
      for (var j = 0; j < columns; j++) {
        var box = document.createElement('div');
        box.classList.add('box');
        box.setAttribute('data-row', i);
        box.setAttribute('data-col', j);
        box.addEventListener('mousedown', handleMouseDown);
        box.addEventListener('mouseover', handleMouseMove);
        box.style.backgroundColor = 'white';
        
        grid.appendChild(box);
      }
    }
  }
  drawGrid();
  columnsInput.addEventListener('change', drawGrid);
  rowsInput.addEventListener('change', drawGrid);



// Functions to handle the mouse detection
var isMouseDown = false;
var startRowIndex = null;
var startColIndex = null;
var selectedBoxes = [];

function selectTo(box) {
    var rowIndex = parseInt(box.getAttribute('data-row'));
    var colIndex = parseInt(box.getAttribute('data-col'));

    var rowStart = Math.min(rowIndex, startRowIndex);
    var rowEnd = Math.max(rowIndex, startRowIndex);
    var colStart = Math.min(colIndex, startColIndex);
    var colEnd = Math.max(colIndex, startColIndex);

    for (var i = rowStart; i <= rowEnd; i++) {
        for (var j = colStart; j <= colEnd; j++) {
            var cell = grid.querySelector(`.box[data-row='${i}'][data-col='${j}']`);
            if (cell && !selectedBoxes.includes(cell)) {
                //console.log(`Selecting cell at row: ${i}, col: ${j}`);
                //console.log(cell);
                if (cell.classList.contains('selected-cell')) {
                    cell.classList.remove('selected-cell');
                } else {
                    cell.classList.add('selected-cell');
                }
                selectedBoxes.push(cell);
                applyColorLabel(cell);
            }
        }
    }
}

function handleMouseDown(event) {
    isMouseDown = true;
    selectedBoxes = [];
    var box = this;

    startRowIndex = parseInt(box.getAttribute('data-row'));
    startColIndex = parseInt(box.getAttribute('data-col'));

    if (box.classList.contains('selected-cell')){
        box.classList.remove('selected-cell');
    } else {
        box.classList.add('selected-cell');
    }
    selectedBoxes.push(box);
    applyColorLabel(box);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return false; // prevent text selection
}

function handleMouseMove(event) {
    if (!isMouseDown) return;
    var box = document.elementFromPoint(event.clientX, event.clientY);
    if (box && box.classList.contains('box')) {
        selectTo(box);
    }
}

function handleMouseUp() {
    isMouseDown = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp); 
}

document.addEventListener('mouseup', function () {
    isMouseDown = false;
});


  // Function to handle box color change
function applyColorLabel(box){
    var color = document.querySelector('.selected-ingredient').querySelector('input[type="color"]').value;
    var boxColor = box.style.backgroundColor;
    var selected = box.classList.contains('selected-cell');

    if (selected) {
        box.style.backgroundColor = color;
    } else {
        box.style.backgroundColor = ''; // Reset to original CSS styling
    }
}


// Create the standardized plate notation
function toPlateNotation(row, col) {
    return String.fromCharCode(65 + parseInt(row)) + (parseInt(col) + 1);
}

// General copy text to clipboard function
function textToClipboard (text) {
    var copyPastePlaceholder = document.createElement("textarea");
    document.body.appendChild(copyPastePlaceholder);
    copyPastePlaceholder.value = text;
    copyPastePlaceholder.select();
    document.execCommand("copy");
    document.body.removeChild(copyPastePlaceholder);
}

// Function to export the plate map
function exportPlateMap() {
    var grid = document.getElementById('grid');
    var boxes = grid.querySelectorAll('.box');
    var includeBlanks = document.getElementById('include-blank').checked;
    var bkgdColor = grid.style.backgroundColor;
    
    var plate_str = '';
    var label = ["Well ID","Well Coordinate","Row","Column","Color"].join('\t') + '\n';
    plate_str += label;



    for (var i = 0; i < boxes.length; i++) {
        var box = boxes[i];
        let nth = i + 1;
        let plate_note = toPlateNotation(box.dataset.row, box.dataset.col);
        let row = parseInt(box.dataset.row) + 1;
        let col = parseInt(box.dataset.col) + 1;
        let color = box.style.backgroundColor;
        let text = [nth, plate_note, row, col, color].join('\t');

        if (includeBlanks || box.classList.contains('selected-cell')) {
            plate_str += text+'\n';
        }
        
    }
    
    textToClipboard(plate_str);

    document.getElementById('copy-button').innerHTML = 'Copied!';
    setTimeout(function() {
        document.getElementById('copy-button').innerHTML = 'Export Plate Map';
    }, 3000);

}
