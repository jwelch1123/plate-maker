

const mainContainer = document.getElementsByClassName('container')[0];
mainContainer.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});

document.getElementById('plate-type').addEventListener('change', function(event) {rowColSelector(event);});

function rowColSelector() {
    var plateType = document.getElementById('plate-type').value;
    var customPlateTable = document.getElementById('custom-plate-table');
    var rowInput = document.getElementById('rows');
    var colInput = document.getElementById('columns');

    if (plateType == 'custom') {
        customPlateTable.style.display = 'block';
    } else {
        customPlateTable.style.display = 'none';
        let rows = plateType.split('x')[0];
        let cols = plateType.split('x')[1];
        rowInput.value = rows;
        colInput.value = cols;
    }
    drawGrid();
}



// Functions to handel the label colors & Selection
function toggleSelection(element) {
    var selectableElements = document.querySelectorAll('.selected-ingredient');
    for (var i = 0; i < selectableElements.length; i++) {
        selectableElements[i].classList.remove('selected-ingredient');
    }
    element.classList.add('selected-ingredient');
}

function randomColor() {
    dim_1 = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    dim_2 = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    dim_3 = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    return '#' + dim_1 + dim_2 + dim_3;
}


// Add event listener to the colorbox input to update the color of the ingredient-square
document.addEventListener('input', function(event) {
    if (event.target.classList.contains('colorbox')) {
        var box = event.target.closest('.ingredient-box');
        var ingredientSquares = document.querySelectorAll(`.ingredient-square[data-ingredient-id='${box.id}']`);
        ingredientSquares.forEach(square => {
            square.style.backgroundColor = event.target.value;
            square.dataset.ingredientColor = event.target.value;
        });
    }
});


// Add and delete ingredients
let boxCounter = 0;

function addIngredient(ingredientText = '') {
    const container = document.getElementById('ingredients-container');
    const newBox = document.createElement('div');
    const boxId = 'ingredient-box-' + boxCounter;
    newBox.id = boxId;
    newBox.className = 'ingredient-box hover-boarder';
    if (boxCounter == 0) {
        newBox.classList.add('selected-ingredient');
    }
    newBox.onclick = function () { toggleSelection(this) };
    newBox.innerHTML = `
        <input type="color" class="colorbox ingredient-def hover-boarder" id='${boxId}-colorbox' name='${boxId}-colorbox' value="${randomColor()}">
        <input type="text" class="ingredient-text ingredient-def hover-boarder" placeholder="Ingredient..." value="${ingredientText}">
        <button type="delete-button" class="ingredient-def hover-boarder" onclick="deleteIngredientBox(this)">X</button>
        `;
    container.appendChild(newBox);
    boxCounter++;
}
document.addEventListener('DOMContentLoaded', addIngredient());


function deleteIngredientBox(element) {
    var box = element.closest('.ingredient-box');
    var ingredientSquares = document.querySelectorAll(`.ingredient-square[data-ingredient-id='${box.id}']`);
        ingredientSquares.forEach(square => {
            square.remove();
    });
    box.remove();
}

// Information Box
var informationButton = document.getElementById('information-button');
var informationModal = document.getElementById('information-modal');

informationButton.onclick = function() {
    informationModal.style.display = 'block';
}

// Import ingredients
var modal = document.getElementById('import-modal');
var importButton = document.getElementById('import-ingredient-button');
var closeButton = document.getElementsByClassName('close')[0];

importButton.onclick = function() {
    modal.style.display = 'block';
}

closeButton.onclick = function() {
    var ingredientList = document.getElementById('ingredient-input').value;
    importIngredient(ingredientList);
    document.getElementById('ingredient-input').value = '';
    modal.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
    if (event.target == informationModal) {
        informationModal.style.display = 'none';
    }
}

function importIngredient(importString) {

    let newestIngredient = document.getElementById('ingredients-container').lastElementChild;
    if (newestIngredient && newestIngredient.querySelector('.ingredient-text').value.trim() === '') {
        deleteIngredientBox(newestIngredient);
    }

    var lines = importString.split('\n');
    lines.forEach(line => {
        if (line.trim() != '') {
            let sanitizedLine = escapeHtml(line.trim());
            addIngredient(ingredientText = sanitizedLine);
        }
    });
    
}

// helper function to escape HTML special characters
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}



// Add hover effect for ingredient-box and ingredient-square

document.addEventListener('mouseover', function(event) { toggleIngredientBoarder(event, true); });
document.addEventListener('mouseout', function(event) { toggleIngredientBoarder(event, false); });


function toggleIngredientBoarder(event, toggle) {
    if (event.target.classList.contains('hover-boarder')) {
        let parentBox = event.target.closest('.ingredient-box');
        const ingredientSquares = document.querySelectorAll(`.ingredient-square[data-ingredient-id='${parentBox.id}']`);
        
            if (toggle) { // add the hover effect
                parentBox.style.border = '2px solid #000';
                ingredientSquares.forEach(square => {
                    square.style.border = '1px solid #000';
                });
            } else { // remove the hover effect
                parentBox.style.border = '';
                parentBox.style.margin = '';
                ingredientSquares.forEach(square => {
                    square.style.border = '1px transparent';
                });
            }       
    }
}


// Functions to handle Grid creation
var columnsInput = document.getElementById('columns');
var rowsInput = document.getElementById('rows');
var grid = document.getElementById('grid');

// Draw the Grid
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
                return function (ingredient, clearIngredients=false) {
                    var ingredientId = ingredient.id;
                    var ingredientColor = ingredient.querySelector('input[type="color"]').value;
                    var ingredientText = ingredient.querySelector('.ingredient-text').value;
                    
                    var ingredientSquare = document.createElement('div');
                    ingredientSquare.classList.add('ingredient-square');

                    ingredientSquare.dataset.ingredientId = ingredientId;
                    ingredientSquare.dataset.ingredientColor = ingredientColor;
                    ingredientSquare.dataset.ingredientText = ingredientText;
                    ingredientSquare.style.backgroundColor = ingredientColor;

                    var ingredientHolder = box.querySelector('.ingredient-holder');
                    var existingIngredients = box.querySelectorAll('.ingredient-holder .ingredient-square');
                    var existingFlag = false;

                    console.log("Applying toggle to box, clear value: ", clearIngredients);

                    if (clearIngredients) {
                        console.log("Setting interior to empty");
                        console.log(box.querySelector('.ingredient-holder'));
                        // ingredientHolder.removeChild(ingredientHolder.firstChild);
                        existingIngredients.forEach(ingredient => {
                            console.log("removing child new way: ", ingredient);
                            ingredient.remove();
                        });
                        
                        // while (ingredientHolder.firstChild) {
                        //     console.log("Removing child");
                        //     ingredientHolder.removeChild();
                        // }
                        existingFlag = true;

                        console.log(ingredientHolder);
                    } else {
                        for (var k = 0; k < existingIngredients.length; k++) {
                            if (existingIngredients[k].dataset.ingredientId == ingredientId || clearIngredients) {
                                existingFlag = true;
                                console.log("About to remove this normal way :", existingIngredients[k]);
                                existingIngredients[k].remove();
                            }
                        }
                    }

                    if (!existingFlag) {
                        console.log("adding ingredient")
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
var mouseButton = -1;
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
                console.log("Toggling box through selectTo")
                applyColorLabel(cell, clearIngredients = mouseButton == 2);
            }
        }
    }
}

function handleMouseDown(event) {
    isMouseDown = true;
    mouseButton = event.button;
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
    console.log("Toggling box through handleMouseDown");
    applyColorLabel(box, clearIngredients = mouseButton == 2);

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
    mouseButton = -1;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
}

document.addEventListener('mouseup', function () {
    isMouseDown = false;
    mouseButton = -1;
});


// Function to handle box color change
function applyColorLabel(box, clearIngredients=false) {
    var color = document.querySelector('.selected-ingredient').querySelector('input[type="color"]').value;
    var selected = box.classList.contains('selected-cell');
    var selectedIngredient = document.querySelector('.selected-ingredient');

    // this is a singlet...
    box.toggleIngredient(selectedIngredient, clearIngredients=clearIngredients); 

}





// Create the standardized plate notation
function toPlateNotation(row, col) {
    return String.fromCharCode(65 + parseInt(row)) + (parseInt(col) + 1);
}

// General copy text to clipboard function
function copyToClipboard(text) {

    navigator.clipboard.writeText(text).then(function () {
        console.log('Async: Copying to clipboard was successful!');
    }).catch(function (err) { // if the clipboard write fails, we can use the old method 
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
    // var label = ["Well ID", "Well Coordinate", "Row", "Column", "Color", "Ingredients"].join('\t') + '\n';
    var label = ["Well ID", "Well Coordinate", "Row", "Column", "Ingredients"].join('\t') + '\n';
    plate_str += label;

    for (var i = 0; i < boxes.length; i++) {
        var box = boxes[i];
        let nth = i + 1;
        let plate_note = toPlateNotation(box.dataset.row, box.dataset.col);
        let row = parseInt(box.dataset.row) + 1;
        let col = parseInt(box.dataset.col) + 1;
        //let color = box.style.backgroundColor;
        let ingredients = box.querySelectorAll('.ingredient-holder .ingredient-square');
        let ingredientsList = '';

        for (var j = 0; j < ingredients.length; j++) {
            let ingredient = ingredients[j];
            let ingredientId = ingredient.dataset.ingredientId;
            //let ingredientColor = ingredient.dataset.ingredientColor;
            let ingredientText = ingredient.dataset.ingredientText;         // This needs to be retreived dynamically
            //ingredientsList += `${ingredientText} (${ingredientColor});`;
            ingredientsList += `${ingredientText}; `;
        }

        //let text = [nth, plate_note, row, col, color, ingredientsList].join('\t');
        let text = [nth, plate_note, row, col, ingredientsList.trim()].join('\t');

        if (includeBlanks || ingredients.length > 0) {
            console.log("Adding text to plate_str: ", text);
            plate_str += text + '\n';
        }

    }

    copyToClipboard(plate_str);

    copyButtonText = document.getElementById('copy-button').innerHTML;
    document.getElementById('copy-button').innerHTML = 'Copied!';
    setTimeout(function () {
        document.getElementById('copy-button').innerHTML = copyButtonText;
    }, 3000);

}
