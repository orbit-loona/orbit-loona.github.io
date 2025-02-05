    // Automatic molten element generation
    function autoGen(newname,element,autoType) {
        var autoInfo = autoElements[autoType];
        var newcolor = elements[element].colorObject;
        var colorList = [];
        var colorObjectList = [];
        // if newcolor is not an array, put it in an array
        if (!(newcolor instanceof Array)) { newcolor = [newcolor]; }
        // for every color in the newcolor array, add a new color with the same value, but with the r and g values increased
        for (var i = 0; i < newcolor.length; i++) {
            var c = newcolor[i] ?? "#ff00ff";
            for (var j = 0; j < autoInfo.rgb.length; j++) {
                var newc = autoInfo.rgb[j];
                r = Math.floor(c.r * newc[0]);
                g = Math.floor(c.g * newc[1]);
                b = Math.floor(c.b * newc[2]);
                if (r > 255) {r = 255;} if (g > 255) {g = 255;}
                colorList.push("rgb("+r+","+g+","+b+")");
                colorObjectList.push({r:r,g:g,b:b});
            }
        }
        var newelem = {
            //"name": newname.replaceAll("_"," "),
            behavior: autoInfo.behavior,
            hidden: autoInfo.hidden || false,
            state: autoInfo.state || "solid",
            category: autoInfo.category || "states",
        }
        if (colorList.length <= 1) { colorList = colorList[0]; }
        if (colorObjectList.length <= 1) { colorObjectList = colorObjectList[0]; }
        newelem.color = colorList;
        newelem.colorObject = colorObjectList;
        var multiplier = 1.1;
        if (autoInfo.type === "high") {
            if (!elements[element].stateHigh) {elements[element].stateHigh = newname;}
            newelem.temp = elements[element].tempHigh;
            newelem.tempLow = elements[element].tempHigh+(autoInfo.tempDiff || 0);
            newelem.stateLow = element;
            // Change density by *0.9
            if (elements[element].density) { newelem.density = Math.round(elements[element].density * 0.9 * 10) / 10; }
        }
        else if (autoInfo.type === "low") {
            if (!elements[element].stateLow) {elements[element].stateLow = newname;}
            newelem.temp = elements[element].tempLow;
            newelem.tempHigh = elements[element].tempLow+(autoInfo.tempDiff || 0);
            newelem.stateHigh = element;
            multiplier = 0.5;
            // Change density by *1.1
            if (elements[element].density) { newelem.density = Math.round(elements[element].density * 1.1 * 10) / 10; }
        }
        if (!elements[element].ignore) { elements[element].ignore = [] }
        elements[element].ignore.push(newname);
        if (elements[element].viscosity || autoInfo.viscosity) {
            newelem.viscosity = elements[element].viscosity || autoInfo.viscosity;
        }
        // Change by *multiplier
        if (elements[element].conduct) { newelem.conduct = Math.round(elements[element].conduct * multiplier * 10) / 10; }
        if (elements[element].burn) { newelem.burn = Math.round(elements[element].burn * multiplier * 10) / 10; }
        if (elements[element].burnTime) { newelem.burnTime = Math.round(elements[element].burnTime * multiplier * 10) / 10; }
        if (elements[element].burnInto) { newelem.burnInto = elements[element].burnInto; }
        if (elements[element].fireColor) { newelem.fireColor = elements[element].fireColor; }
        // If the new element doesn't exist, add it
        if (!elements[newname]) { elements[newname] = newelem; }
        else {
            // Loop through newelem's keys and values, copy them to the new element if they are not already defined
            for (var key in newelem) {
                if (elements[newname][key] == undefined) { elements[newname][key] = newelem[key]; }
            }
        }
        // if (autoType === "molten" && (elements.molten_slag && elements.molten_slag.ignore && elements.molten_slag.ignore.indexOf(element) === -1)) { // Slag reactions
            // if (newname !== "molten_slag") {
                // if (!elements[newname].reactions) { elements[newname].reactions = {}; }
                // elements[newname].reactions.ash = { "elem1":null, "elem2":"molten_slag" };
                // elements[newname].reactions.dust = { "elem1":null, "elem2":"molten_slag" };
                // elements[newname].reactions.magma = { "elem1":null, "elem2":"molten_slag" }
            // };
        // }
    }
