import Vector from '../engine/Vector.js';

export default class Hexagon {
    constructor(col, index) {
        this.column = col;
        this.index = index;

        this.neighbour = new Array(6);
        this.neighbour.fill(false);
        // could somehow extract this.
        this.isVisited = false;
    }

    // render()

    render(offset, scale, diagonal, context, horizontal) {
        // THIS FUNCTION DOES NOT STROKE, SHOULD BE DONE BY PARENT
        let position = new Vector(offset.x + this.column * scale, offset.y + this.index * 2 * diagonal);

        if(this.column%2===0) {
            position.y += diagonal;
        }

        context.moveTo(position.x, position.y); // SET POSITION TO LEFT SIDE

        // MOVE DIAGONALLY DOWN RIGHT AND THEN DRAW LINE IF THIS.NEIGHBOUR IS FALSE
        position.x += diagonal;
        position.y += diagonal;
        if(!this.neighbour[0]) context.lineTo(position.x, position.y);
        else context.moveTo (position.x, position.y);

        // MOVE HORIZONTALLY RIGHT
        position.x += horizontal;
        if(!this.neighbour[1]) context.lineTo(position.x, position.y);
        else context.moveTo (position.x, position.y)
    
        // MOVE DIAGONALLY UP RIGHT
        position.x += diagonal;
        position.y -= diagonal;
        if(!this.neighbour[2]) context.lineTo(position.x, position.y);
        else context.moveTo (position.x, position.y);

        // MOVE DIAGONALLY UP LEFT
        position.x -= diagonal;
        position.y -= diagonal;
        if(!this.neighbour[3]) context.lineTo(position.x, position.y);
        else context.moveTo (position.x, position.y);
        
        // MOVE HORIZONTALLY LEFT
        position.x -= horizontal;
        if(!this.neighbour[4]) context.lineTo(position.x, position.y);
        else context.moveTo (position.x, position.y)
    
        // MOVE DIAGONALLY DOWN LEFT
        position.x -= diagonal;
        position.y += diagonal;
        if(!this.neighbour[5]) context.lineTo(position.x, position.y);
        else context.moveTo (position.x, position.y)        
    }
}