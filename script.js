"use strict";
// generates random values between 0 and 100
function generateRandomData(count) {
    var UPPER_LIMIT = 100;
    var data = [];
    for (var i = 0; i < count; i++) {
        var value = Math.floor(Math.random() * (UPPER_LIMIT + 1));
        data.push(value);
    }
    return data;
}

// collects data from the form and returns it as an array
function getDataFromForm(count) {
    var values = [];
    for (var i = 1; i <= count; i++) {
        var numberElement = document.getElementById("value" + i);
        if (numberElement)
            values.push(numberElement.value);
    }
    return values;
}

// places data of a given array into respective form fields
function putDataIntoForm(values) {
    for (var i = 1; i <= values.length; i++) {
        var numberElement = document.getElementById("value" + i);
        if (numberElement)
            numberElement.value = values[i - 1];
    }
}

// colors squares on the form using a given array of colors
function putColorsIntoForm(colors) {
    for (var i = 1; i <= colors.length; i++) {
        var colorElement = document.getElementById("color" + i);
        if (colorElement)
            colorElement.style.backgroundColor = colors[i - 1];
    }
}

// enables or disables form fields for modifying data
function toggleControls(disable) {
    var updateDataButton = document.getElementById("updateDataButton");
    var numberElements = document.querySelectorAll("#formBlock input[type='number']");
    updateDataButton.disabled = disable;
    for (var i = 0; i < numberElements.length; i++)
        numberElements[i].disabled = disable;
    var toggleTimerButton = document.getElementById("toggleTimerButton");
    if (disable)
        toggleTimerButton.value = "Stop timer";
    else
        toggleTimerButton.value = "Start timer";
}

// validates data in form fields
function validateData(event) {
    var numberElement = event.target;
    var value = numberElement.value;
    if (isNaN(value) || value < 0)
        value = 0;
    else if (value > 100)
        value = 100;
    else
        value = Math.floor(value);
    numberElement.value = value;
}

window.onload = function() {
    // initializing the diagram and controls in the form
    
    var DATA_SIZE = 8;
    var TIMER_DURATION = 5000;
    var canvas = document.getElementById("diagram");
    var data = generateRandomData(DATA_SIZE);
    var colors = generateRandomColors(DATA_SIZE);
    toggleControls(false);
    putDataIntoForm(data);
    putColorsIntoForm(colors);
    var diagram = new DonutDiagram(canvas, data, colors);
    
    // adding event handlers on controls
    
    var numberElements = document.querySelectorAll("#formBlock input[type='number']");
    for (var i = 0; i < numberElements.length; i++)
        numberElements[i].onchange = validateData;  
    
    var updateDataButton = document.getElementById("updateDataButton");
    updateDataButton.onclick = function() {
        data = getDataFromForm(DATA_SIZE);
        diagram.updateData(data);
    };
    
    var updateColorsButton = document.getElementById("updateColorsButton");
    updateColorsButton.onclick = function() {
        colors = generateRandomColors(DATA_SIZE);
        putColorsIntoForm(colors);
        diagram.updateColors(colors);
    }; 
    
    var timer = null;
    var toggleTimerButton = document.getElementById("toggleTimerButton");
    toggleTimerButton.onclick = function() {
        function updateData() {
            data = generateRandomData(DATA_SIZE);
            putDataIntoForm(data);
            diagram.updateData(data);
        }
        
        if (timer) {
            toggleControls(false);
            clearInterval(timer);
            timer = null;
        }
        else {
            toggleControls(true);
            updateData();
            timer = setInterval(updateData, TIMER_DURATION);
        }
    };
};