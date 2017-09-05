/**
 * Created by atg on 28/01/2015.
 */
//Manage all the labels (sprites) for the website

let spriteManager = (function () {
    //Default values
    let defaultFontFace = "Arial";
    let defaultBorderThickness = 2;
    let backgroundColour = 'rgba(55, 55, 55, 1.0)';
    let borderColour = 'rgba(0, 0, 0, 1.0)';
    let textColour = 'rgba(255, 255, 255, 1.0)';
    let defaultFontSize = 24;
    let defaultVisibility = false;
    let defaultRadius = 20;
    let currentFontSize;

    let labels = [];
    let labelNames = [];

    const DAYS_PER_MONTH = 31;

    return {
        create: function(textLines, position, scale, fontSize, opacity, visible, rect) {
            //Create label
            let canvas = document.createElement('canvas');
            let numLines = textLines.length;
            let spacing = 5;
            canvas.height = (fontSize * numLines) + spacing + (defaultBorderThickness * 2);

            let context = canvas.getContext('2d');
            context.font = fontSize + "px " + defaultFontFace;

            let metrics = context.measureText( textLines[0] );
            let textWidth = metrics.width;
            canvas.width = textWidth + (defaultBorderThickness * 2) + spacing;

            //Background
            context.fillStyle = backgroundColour;
            //Border
            context.strokeStyle = borderColour;
            context.lineWidth = defaultBorderThickness;
            context.fillStyle = textColour;
            context.font = fontSize + "px " + defaultFontFace;

            //Text
            let xStart = (canvas.width - textWidth)/2;
            let lineSpacing = fontSize + defaultBorderThickness + (spacing/2);
            let interLineSpace = 2;
            for(let i=0; i<numLines; ++i) {
                context.fillText(textLines[i], xStart, fontSize * (i+1));
                lineSpacing += (fontSize + interLineSpace);
            }

            // canvas contents will be used for a texture
            let texture = new THREE.Texture(canvas);
            texture.minFilter = THREE.LinearFilter;
            texture.needsUpdate = true;

            //texture.needsUpdate = true;
            let spriteMaterial = new THREE.SpriteMaterial({
                    transparent: false,
                    opacity: opacity,
                    map: texture}
            );

            let sprite = new THREE.Sprite(spriteMaterial);
            labels.push(sprite);
            sprite.index = labels.length-1;
            sprite.name = 'Label';
            labelNames.push(sprite.name);
            sprite.visible = visible;

            //let offset = (canvas.width - textWidth) / 80;
            sprite.position.copy(position);
            sprite.scale.set(scale.x, scale.y, 1);

            return sprite;
        },

        setBorderProperties: function(thickNess, colour) {
            defaultBorderThickness = thickNess != undefined ? thickNess : defaultBorderThickness;
            borderColour = colour != undefined ? 'rgba('+colour.r+','+colour.g+','+colour.b+','+colour.a+')' : borderColour;
        },

        setBorderColour: function(colour) {
            if(colour != undefined) {
                let red = Math.round(colour[0]);
                let green = Math.round(colour[1]);
                let blue = Math.round(colour[2]);

                borderColour = "rgba(" + red + "," + green + "," + blue + "," + "1.0)";
            }
        },

        setBackgroundColour: function(colour) {
            if(colour != undefined) {
                let red = Math.round(colour[0]);
                let green = Math.round(colour[1]);
                let blue = Math.round(colour[2]);

                backgroundColour = "rgba(" + red + "," + green + "," + blue + "," + "1.0)";
            }
        },

        setTextColour: function(colour) {
            if(colour != undefined) {
                let red = Math.round(colour[0]);
                let green = Math.round(colour[1]);
                let blue = Math.round(colour[2]);

                textColour = "rgba(" + red + "," + green + "," + blue + "," + "1.0)";
            }
        },

        getSprite: function(name) {
            for(let i=0; i<labelNames.length; ++i) {
                if(labelNames[i] === name) {
                    return labels[i];
                }
            }

            return null;
        },

        getSpriteByIndex: function(index) {
            for(let i=0; i<labels.length; ++i) {
                if(labels[i].index === index) {
                    return labels[i];
                }
            }

            return null;
        },

        getSpriteByDate: function(day, group) {
            let index = group * DAYS_PER_MONTH * 2;
            index += ((day * 2) + 1);
            if(index >= labels.length) {
                console.log("Invalid sprite index");
                return;
            }

            return labels[index];
        },

        setText: function(sprite, text) {
            for(let i=0; i<labels.length; ++i) {
                if(labels[i] === sprite) {
                    break;
                }
            }
            let canvas = labels[i].material.map.image;
            let context = canvas.getContext('2d');
            let metrics = context.measureText( text );
            let textWidth = metrics.width;
            let offset = (CANVAS_WIDTH - (textWidth + defaultBorderThickness))/2;

            context.clearRect(0, 0, canvas.width, canvas.height);
            context.fillText(text, defaultBorderThickness + offset, currentFontSize + defaultBorderThickness);
            labels[i].material.map.needsUpdate = true;
        },

        setTextAmount: function(sprite, text) {
            for(let i=0; i<labels.length; ++i) {
                if(labels[i] === sprite) {
                    break;
                }
            }
            let amount = text.toFixed(2);
            amount = '£'+amount;
            let canvas = labels[i].material.map.image;
            let context = canvas.getContext('2d');
            let metrics = context.measureText( amount );
            let textWidth = metrics.width;
            let offset = (CANVAS_WIDTH - (textWidth + defaultBorderThickness))/2;

            context.clearRect(0, 0, canvas.width, canvas.height);
            context.fillText(amount, defaultBorderThickness + offset, currentFontSize + defaultBorderThickness);
            labels[i].material.map.needsUpdate = true;
        }
    };
})();

// function for drawing rounded rectangles
function roundRect(ctx, xStart, yStart, width, height, radius)
{
    ctx.beginPath();
    ctx.moveTo(xStart + radius, yStart);
    ctx.lineTo(xStart + width - radius, yStart);
    ctx.quadraticCurveTo(xStart + width, yStart, xStart + width, yStart + radius);
    ctx.lineTo(xStart + width, yStart + height - radius);
    ctx.quadraticCurveTo(xStart + width, yStart + height, xStart + width - radius, yStart + height);
    ctx.lineTo(xStart +radius, yStart + height);
    ctx.quadraticCurveTo(xStart, yStart + height, xStart, yStart + height - radius);
    ctx.lineTo(xStart, yStart + radius);
    ctx.quadraticCurveTo(xStart, yStart, xStart + radius, yStart);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}
