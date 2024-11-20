// JavaScript to handle color selection and box selection
var colorSelector = document.getElementById("color");
var boxes = document.getElementsByClassName("box");
var selectedBox = null;
var isDragging = false;

// Change the border of the selected box and update the selectedBox variable
function selectBox(box) {
	if (selectedBox != null) {
		selectedBox.style.border = "1px solid #ccc";
	}
	selectedBox = box;
	selectedBox.style.border = "2px solid #000";
}

// Change the color of a box to the selected color, or append the selected color to the existing color(s)
function changeBoxColor(box) {
	var color = colorSelector.value;
	var existingColors = box.style.backgroundColor;

	// If the box doesn't have any existing colors, set the background color to the selected color
	if (existingColors == "") {
		box.style.backgroundColor = color;
	}
	// If the box already has existing colors, append the selected color to the existing colors
	else {
		// Split the existing colors into an array
		var colorsArray = existingColors.split(" ");

		// If the selected color is not already in the array, append it
		if (colorsArray.indexOf(color) == -1) {
			colorsArray.push(color);
			box.style.backgroundColor = colorsArray.join(" ");
		}

		// If there is only one color in the array, set the background color to that color
		if (colorsArray.length == 1) {
			box.style.backgroundColor = colorsArray[0];
		}
		// If there are multiple colors in the array, create a gradient with each color occupying half of the box
		else {
			// Calculate the percentage of the box width that each color should occupy
			var colorWidth = 100 / colorsArray.length;

			// Construct the gradient string with each color and its corresponding width
			var gradientString = "linear-gradient(to right";
			for (var i = 0; i < colorsArray.length; i++) {
				gradientString += ", " + colorsArray[i] + " " + (i * colorWidth) + "% " + ((i + 1) * colorWidth) + "%";
			}
			gradientString += ")";

			// Set the background color to the gradient
			box.style.background = gradientString;
		}
	}
}

// Loop through all boxes and add event listeners for click and drag
for (var i = 0; i < boxes.length; i++) {
	// Add click event listener to select box
	boxes[i].addEventListener("click", function() {
		selectBox(this);
		changeBoxColor(this);
	});

	// Add mousedown event listener to set isDragging to true
	boxes[i].addEventListener("mousedown", function() {
		isDragging = true;
	});

	// Add mouseover event listener to change color of box when dragging
	boxes[i].addEventListener("mouseover", function() {
		if (isDragging) {
			changeBoxColor(this);
		}
	});

	// Add mouseup event listener to set isDragging to false
	boxes[i].addEventListener("mouseup", function() {
		isDragging = false;
	});
}
