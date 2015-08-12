"use strict";
// creates a new donut diagram and immediately renders it
function DonutDiagram(canvas, data, colors)
{
    if (!canvas.getContext)
        return null;
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.data = Array.isArray(data) ? data : [];
    this.oldData = data;
    this.colors = Array.isArray(colors) ? colors : [];
    this.newPortion = 1;
    this.redrawTimer = null;
    this.redraw();
}

DonutDiagram.prototype = {
    // draws the diagram on a canvas
    redraw: function() {
        // if newPortion is 1 or greater, the transition is completed
        if (this.newPortion >= 1 && this.redrawTimer) {
            clearInterval(this.redrawTimer);
            this.redrawTimer = null;
        }
        // otherwise proceeding with transition
        else {
            this.newPortion += 1 / this._framerate;
            if (this.newPortion > 1)
                this.newPortion = 1;
        }
        var data = this._getIntermediateData(this.oldData, this.data, this.newPortion);
        this._drawDiagram(this.canvas, this.context, data, this.colors);
    },
    
    // updates data for the diagram and performs redrawing
    updateData: function(data) {
        this.oldData = this.data;
        this.data = Array.isArray(data) ? data : [];
        this.newPortion = 0;
        var step = 1000 / this._framerate;
        this.redrawTimer = setInterval(this.redraw.bind(this), step);
    },

    // updates the color set for the diagram
    updateColors: function(colors) {
        this.colors = Array.isArray(colors) ? colors : [];
        this.redraw();
    },
    
    _framerate: 60,
    
    // normalizes data so that the sum of values becomes 1
    _normalizeData: function(data) {
        var sum = 0;
        for (var i = 0; i < data.length; i++) {
            var value = data[i];
            if (isNaN(value) || value < 0)
                value = 0;
            sum += value;
        }
        var normalizedData = [];
        if (sum > 0)
            for (var i = 0; i < data.length; i++) {
                value = data[i];
                if (isNaN(value) || value < 0)
                    value = 0;
                normalizedData.push(value / sum);
            }
        return normalizedData;
    },

    // calculates angles for drawing sectors
    _getAnglesForData: function(data) {
        var normalizedData = this._normalizeData(data);
        var angles = [];
        var angle = -Math.PI / 2;
        angles.push(angle);
        for (var i = 0; i < normalizedData.length; i++) {
            var increment = normalizedData[i] * 2 * Math.PI;
            angle += increment;
            angles.push(angle);
        }
        return angles;
    },

    // calculates intermediate data for smooth transition between two states
    _getIntermediateData: function(oldData, newData, newPortion) {
        var data = [];
        var oldPortion = 1 - newPortion;
        for (var i = 0; i < newData.length; i++) {
            var value = newData[i] * newPortion + oldData[i] * oldPortion;
            data.push(value);
        }
        return data;
    },

    // permorms the actual drawing on a canvas
    _drawDiagram: function(canvas, context, data, colors) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        var x = canvas.width / 2;
        var y = canvas.height / 2;
        var outerRadius = x < y ? x : y;
        var innerRadius = 2 / 3 * outerRadius;
        var angles = this._getAnglesForData(data);
        for (var i = 0; i < angles.length - 1; i++) {
            context.beginPath();
            context.arc(x, y, outerRadius, angles[i], angles[i+1], false);
            context.arc(x, y, innerRadius, angles[i+1], angles[i], true);
            context.closePath();
            if (!colors[i])
                colors.push(getRandomColor());
            context.fillStyle = colors[i];
            context.fill();
        }
    }
};

// generates a random color able to be used in CSS
function getRandomColor()
{
    var r = Math.floor(Math.random() * 256).toString(16);
    var g = Math.floor(Math.random() * 256).toString(16);
    var b = Math.floor(Math.random() * 256).toString(16);
    while (r.length < 2) r = "0" + r;
    while (g.length < 2) g = "0" + g;
    while (b.length < 2) b = "0" + b;
    return "#" + r + g + b;
}

// returns an array of random colors for use in CSS
function generateRandomColors(count)
{
    var colors = new Array();
    for (var i = 0; i < count; i++)
        colors.push(getRandomColor());
    return colors;
}