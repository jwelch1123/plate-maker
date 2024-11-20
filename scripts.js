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
    const boxId = 'box-' + boxCounter++;
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
        
        //box.addEventListener('click', function() { applyColorLabel(this); });
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
            if (cell) {
                cell.classList.add('selected-cell');
            }
        }
    }
}

function handleMouseDown(event) {
    isMouseDown = true;
    var box = this;
    applyColorLabel(this);

    grid.querySelectorAll('.selected-cell').forEach(function (cell) {
        cell.classList.remove('selected-cell');
    });

    startRowIndex = parseInt(box.getAttribute('data-row'));
    startColIndex = parseInt(box.getAttribute('data-col'));

    if (event.shiftKey) {
        selectTo(box);
    } else {
        box.classList.add('selected-cell');
    }
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    console.log(`Cell clicked at row: ${startRowIndex}, col: ${startColIndex}`);

    return false; // prevent text selection
}

function handleMouseMove(event) {
    if (!isMouseDown) return;
    var box = document.elementFromPoint(event.clientX, event.clientY);
    if (box && box.classList.contains('box')) {
        selectTo(box);
        grid.querySelectorAll('.selected-cell').forEach(function (cell) {
            //cell.classList.remove('selected-cell');
            applyColorLabel(cell);
        });
        console.log(`Mouse moved over cell at row: ${box.getAttribute('data-row')}, col: ${box.getAttribute('data-col')}`);
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
    console.log("boxColor: " + boxColor + " color: " + color);
    if (boxColor != 'white' && boxColor != ''){
        box.style.backgroundColor = 'white';
    } else if (boxColor == color) {
        box.style.backgroundColor = color;
    } else {
        box.style.backgroundColor = color;
    }
}


// color change flickers and the comparison between hex and rgb doesnt work
