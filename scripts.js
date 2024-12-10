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

function rand_color() {
    dim_1 = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    dim_2 = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');;
    dim_3 = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');;
    return '#' + dim_1 + dim_2 + dim_3;
}

let boxCounter = 0;

function addIngredient() {
    const container = document.getElementById('ingredients-container');
    const newBox = document.createElement('div');
    const boxId = 'ingredient-box-' + boxCounter;
    newBox.id = boxId;
    newBox.className = 'ingredient-box';
    if (boxCounter == 0) {
        newBox.classList.add('selected-ingredient');
    }
    newBox.onclick = function () { toggleSelection(this) };
    newBox.innerHTML = `
        <input type="color" id='${boxId}-colorbox' name='${boxId}-colorbox' value="${rand_color()}">
        <input type="text" class="text-field" placeholder="Enter text here...">
        <button type="delete-button" onclick="deleteIngredientBox(this)">X</button>
        `;
    container.appendChild(newBox);
    boxCounter++;
}
document.addEventListener('DOMContentLoaded', addIngredient);


// Functions to handle Grid creation
var columnsInput = document.getElementById('columns');
var rowsInput = document.getElementById('rows');
var grid = document.getElementById('grid');


// Add hover effect for ingredient-box and ingredient-square
document.addEventListener('mouseover', function (event) {
    if (event.target.classList.contains('ingredient-box')) {
        event.target.style.border = '2px solid #000';
    }
    if (event.target.classList.contains('ingredient-box')) {
        const ingredientId = event.target.id;
        const ingredientSquares = document.querySelectorAll(`.ingredient-square[data-ingredient-id='${ingredientId}']`);
        ingredientSquares.forEach(square => {
            square.style.border = '1px solid #000';
        });
    }
});

document.addEventListener('mouseout', function (event) {
    if (event.target.classList.contains('ingredient-box')) {
        event.target.style.border = '';
    }
    if (event.target.classList.contains('ingredient-box')) {
        const ingredientId = event.target.id;
        const ingredientSquares = document.querySelectorAll(`.ingredient-square[data-ingredient-id='${ingredientId}']`);
        ingredientSquares.forEach(square => {
            square.style.border = '';
        });
    }
});




function drawGrid() {
    grid.innerHTML = "";

    var columns = parseInt(columnsInput.value);
    var rows = parseInt(rowsInput.value);

    grid.style.gridTemplateColumns = 'repeat(' + columns + ', 1fr)';
    grid.style.gridTemplateRows = 'repeat(' + rows + ', 1fr)';

    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < columns; j++) {
            // break the box creation out into a seperate function
            var box = document.createElement('div');
            box.classList.add('box');
            box.setAttribute('data-row', i);
            box.setAttribute('data-col', j);

            
            
            box.addEventListener('mousedown', handleMouseDown);
            box.addEventListener('mouseover', handleMouseMove);
            box.style.backgroundColor = 'white';

            var ingredientHolder = document.createElement('div');
            ingredientHolder.classList.add('ingredient-holder'); 
            box.appendChild(ingredientHolder);

            box.toggleIngredient = (function (box) {
                return function (ingredient) {
                    var ingredientId = ingredient.id;
                    var ingredientColor = ingredient.querySelector('input[type="color"]').value;
                    var ingredientText = ingredient.querySelector('.text-field').value;
                    
                    var ingredientSquare = document.createElement('div');
                    ingredientSquare.classList.add('ingredient-square');

                    ingredientSquare.dataset.ingredientId = ingredientId;
                    ingredientSquare.dataset.ingredientColor = ingredientColor;
                    ingredientSquare.dataset.ingredientText = ingredientText;
                    ingredientSquare.style.backgroundColor = ingredientColor;

                    var existingIngredients = box.querySelectorAll('.ingredient-holder .ingredient-square');
                    var existingFlag = false;


                    for (var k = 0; k < existingIngredients.length; k++) {
                        if (existingIngredients[k].dataset.ingredientId == ingredientId) {
                            existingFlag = true;
                            existingIngredients[k].remove();
                        } 
                    } 

                    if (!existingFlag) {
                        box.querySelector('.ingredient-holder').appendChild(ingredientSquare);
                    }
                    
                }
            })(box);


            grid.appendChild(box);
        }
    }
}

document.addEventListener('DOMContentLoaded', drawGrid);
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

    if (box.classList.contains('selected-cell')) {
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
function applyColorLabel(box) {
    var color = document.querySelector('.selected-ingredient').querySelector('input[type="color"]').value;
    var selected = box.classList.contains('selected-cell');
    var selectedIngredient = document.querySelector('.selected-ingredient');

    if (selected) {
        //box.style.backgroundColor = color;
        box.toggleIngredient(selectedIngredient);
        console.log(box);
    } else {
        box.toggleIngredient(selectedIngredient);
        //box.style.backgroundColor = ''; // Reset to original CSS styling
    }
}


// Create the standardized plate notation
function toPlateNotation(row, col) {
    return String.fromCharCode(65 + parseInt(row)) + (parseInt(col) + 1);
}

// General copy text to clipboard function
function copyToClipboard(text) {

    navigator.clipboard.writeText(text).then(function () {
        //execcommand is deprecated in modern browsers, this should be the way to do it
        console.log('Async: Copying to clipboard was successful!');
    }, function (err) { // if the clipboard write fails, we can use the old method 
        console.error('Async: Could not copy text: ', err);
        var copyPastePlaceholder = document.createElement("textarea");
        document.body.appendChild(copyPastePlaceholder);
        copyPastePlaceholder.value = text;
        copyPastePlaceholder.select();
        document.execCommand("copy");
        document.body.removeChild(copyPastePlaceholder);
    });
}

// Function to export the plate map
function exportPlateMap() {
    var grid = document.getElementById('grid');
    var boxes = grid.querySelectorAll('.box');
    var includeBlanks = document.getElementById('include-blank').checked;
    var bkgdColor = grid.style.backgroundColor;

    var plate_str = '';
    var label = ["Well ID", "Well Coordinate", "Row", "Column", "Color", "Ingredients"].join('\t') + '\n';
    plate_str += label;

    for (var i = 0; i < boxes.length; i++) {
        var box = boxes[i];
        let nth = i + 1;
        let plate_note = toPlateNotation(box.dataset.row, box.dataset.col);
        let row = parseInt(box.dataset.row) + 1;
        let col = parseInt(box.dataset.col) + 1;
        let color = box.style.backgroundColor;

        let ingredients = box.querySelectorAll('.ingredient-info');
        let ingredientsList = '';
        for (var j = 0; j < ingredients.length; j++) {
            let ingredient = ingredients[j];
            let ingredientId = ingredient.dataset.ingredientId;
            let ingredientColor = ingredient.dataset.ingredientColor;
            let ingredientText = ingredient.dataset.ingredientText;
            ingredientsList += `${ingredientText} (${ingredientColor});`;
        }

        let text = [nth, plate_note, row, col, color, ingredientsList].join('\t');

        if (includeBlanks || box.classList.contains('selected-cell')) {
            plate_str += text + '\n';
        }

    }

    copyToClipboard(plate_str);

    document.getElementById('copy-button').innerHTML = 'Copied!';
    setTimeout(function () {
        document.getElementById('copy-button').innerHTML = 'Export Plate Map';
    }, 3000);

}
