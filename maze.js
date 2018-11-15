import Viewport from '../engine/Viewport.js';
import Vector from '../engine/Vector.js';

const twoSquared = 1.41421356237;
const diagonal = 10;
const horizontal = diagonal * twoSquared;
const hexColumns = 20;
const hexIndices = 20;
const spaceBetween = (2 * horizontal + 2 * diagonal)/2;
const scale = spaceBetween;
const offset = new Vector(0, diagonal);


class Hexagon {
    constructor(col, index) {
        this.column = col;
        this.index = index;

        this.neighbour = new Array(6);
        this.neighbour.fill(false);
        // could somehow extract this.
        this.isVisited = false;
    }

    // render()

    render() {
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

class Crawler{
    constructor(clone) {
        this.stack = [];
        this.grid = clone.slice(0);
        this.next = new Vector();
        //this.pos = new Vector(1,0);

        this.column = 0;
        this.index = 0;
        this.limit = 0;
    }

    getNeighbours() {
        //TO FIND PATH
        let availableNeighbours = [];

        // IF CURRENT INDEX + 1 < HEXINDICES
        // IE, IF THE NEXT INDEX IS WITHIN LIMITS
        if(this.index<(hexIndices-1) 
            && !this.grid[this.column + (this.index + 1) * hexColumns].isVisited) 
                availableNeighbours.push(new Vector(this.column, this.index + 1));
        
        // IF CURRENT INDEX > 0
        // IE, IF THE PREVIOUS INDEX IS WITHIN LIMITS
        if(this.index > 0 
            && !this.grid[this.column + (this.index - 1) * hexColumns].isVisited) 
                availableNeighbours.push(new Vector(this.column, this.index - 1));

        // IF THE COLUMN IS AN EVEN NUMBER
        if(this.column%2 === 0) {       
            // IF COLUMN IS NOT ALL THE WAY TO THE LEFT
            if(this.column > 0) {
                // THEN ADD LEFT COLUMN, SAME INDEX (ABOVE)
                if(!this.grid[this.column - 1 + (this.index) * hexColumns].isVisited) 
                    availableNeighbours.push(new Vector(this.column - 1, this.index));
                // IF INDEX IS NOT THE LAST ONE
                if(this.index < hexIndices - 1 
                    && !this.grid[this.column -1 + (this.index + 1) * hexColumns].isVisited) 
                        // THEN ADD LEFT COLUMN, INDEX + 1 (BELOW)
                        availableNeighbours.push(new Vector(this.column - 1, this.index + 1));
            }
                 
            // IF COLUMN IS NOT ALL THE WAY TO THE RIGHT
            if(this.column < hexIndices - 1) {
                // THEN ADD RIGHT COLUMN, SAME INDEX
                if(!this.grid[this.column + 1 + (this.index) * hexColumns].isVisited) 
                    availableNeighbours.push(new Vector(this.column + 1, this.index));
                // IF INDEX IS NOT THE LAST ONE
                if(this.index < hexIndices - 1 
                    && !this.grid[this.column + 1 + (this.index + 1) * hexColumns].isVisited) 
                        // THEN ADD RIGHT COLUMN, INDEX + 1
                        availableNeighbours.push(new Vector(this.column + 1, this.index + 1));
            }                
        } 
        // ELSE IF THE COLUMN IS ODD NUMBERED
        else {
            // IF COLUMN IS NOT ALL THE WAY TO THE LEFT
            if(this.column > 0) {
                // IF INDEX IS NOT THE FIRST ONE
                if(this.index > 0 
                    && !this.grid[this.column - 1 + (this.index - 1) * hexColumns].isVisited) 
                        // THEN ADD LEFT COLUMN, INDEX - 1 (ABOVE)
                        availableNeighbours.push(new Vector(this.column - 1, this.index - 1));                         
                // THEN ADD LEFT COLUMN, INDEX (BELOW)           
                if(!this.grid[this.column - 1 + (this.index) * hexColumns].isVisited) 
                    availableNeighbours.push(new Vector(this.column - 1, this.index));

            }
            
            // IF COLUMN IS NOT ALL THE WAY TO THE RIGHT
            if(this.column < hexColumns - 1) {
                // IF INDEX IS NOT THE FIRST ONE               
                if(this.index > 0 
                    && !this.grid[this.column + 1 + (this.index - 1) * hexColumns].isVisited) 
                        // THEN ADD RIGHT COLUMN, INDEX - 1 
                        availableNeighbours.push(new Vector(this.column + 1, this.index - 1));
                // THEN ADD RIGHT COLUMN, SAME INDEX                
                if(!this.grid[this.column + 1 + (this.index) * hexColumns].isVisited) 
                    availableNeighbours.push(new Vector(this.column + 1, this.index));
            }  
        } 
        return availableNeighbours;
    }

    openWalls() {
        const negativeMeansUp = this.index - this.next.y;
        switch(this.column - this.next.x) {
            // NEIGHBOUR IS TO THE RIGHT
            case -1: {
                switch(negativeMeansUp) {

                    // COLUMN IS EVEN
                    case -1: {
                        this.grid[this.next.x + this.next.y * 20].neighbour[5]=true;
                        this.grid[this.column + this.index * 20].neighbour[2]=true;                            
                        break;
                    }

                    // COLUMN COULD BE EITHER, SO CHECK
                    case 0: {
                        if(this.column%2 === 0) {
                            this.grid[this.next.x + this.next.y * 20].neighbour[0]=true;
                            this.grid[this.column + this.index * 20].neighbour[3]=true;
                        } else {
                            this.grid[this.next.x + this.next.y * 20].neighbour[5]=true;
                            this.grid[this.column + this.index * 20].neighbour[2]=true;
                        }        
                        break;
                    }        

                    // COLUMN IS ODD
                    case 1: {
                        this.grid[this.next.x + this.next.y * 20].neighbour[0]=true;
                        this.grid[this.column + this.index * 20].neighbour[3]=true;
                        break;
                    }
                }
                break;
            }

            // NEIGHBOUR IS ABOVE OR BELOW
            case 0: {
                switch(negativeMeansUp) {
                    case -1: {
                            this.grid[this.next.x + this.next.y * 20].neighbour[4]=true;
                            this.grid[this.column + this.index * 20].neighbour[1]=true;
                        break;
                    }
                    case 1: {
                            this.grid[this.next.x + this.next.y * 20].neighbour[1]=true;
                            this.grid[this.column + this.index * 20].neighbour[4]=true;
                        break;
                    }
                }                    
                break;
            }

            // NEIGHBOUR IS TO THE LEFT
            case 1: {
                switch(negativeMeansUp) {

                    // COLUMN IS EVEN
                    case -1: {
                        this.grid[this.next.x + this.next.y * 20].neighbour[3]=true;
                        this.grid[this.column + this.index * 20].neighbour[0]=true;                            
                        break;
                    }

                    // COLUMN COULD BE EITHER, SO CHECK
                    case 0: {
                        // IF COLUMN IS EVEN
                        if(this.column%2 === 0) {
                            this.grid[this.next.x + this.next.y * 20].neighbour[2]=true;
                            this.grid[this.column + this.index * 20].neighbour[5]=true;
                        } else {
                            this.grid[this.next.x + this.next.y * 20].neighbour[3]=true;
                            this.grid[this.column + this.index * 20].neighbour[0]=true;
                        }        
                        break;
                    }        

                    // COLUMN IS ODD
                    case 1: {
                        this.grid[this.next.x + this.next.y * 20].neighbour[2]=true;
                        this.grid[this.column + this.index * 20].neighbour[5]=true;
                        break;
                    }
                }
                break;
            }
        }
    }

    draw() {
        this.renderCrawler();
        this.renderHex();
        this.column = this.next.x;
        this.index = this.next.y;
        this.renderHex();
    }

    move() {  

        this.grid[this.column + this.index * 20].isVisited = true;
        let potentialMoves = this.getNeighbours();

        // IF THERE ARE ANY POTENTIAL MOVES
        if(potentialMoves.length) { 
            this.next = potentialMoves[Math.floor(Math.random() * potentialMoves.length)];
            // OPEN UP WALLS
            this.openWalls();
            // ADD CURRENT POSITION TO STACK
            this.stack.push(new Vector(this.column, this.index));

            this.draw();  
        }
        else if(this.stack.length > 0) {
            
            this.renderCrawler();
            this.renderHex();
            const popped = this.stack.pop();
            this.column = popped.x;
            this.index = popped.y;
            this.renderHex();

        } 
        else {
            completed = true;
        }
    }
    renderHex() {
        context.beginPath();
        this.grid[this.column + this.index * 20].render();
        context.strokeStyle = "black";
        context.stroke();
    }

    renderCrawler() {
        this.drawCrawler();
        context.fillStyle = "orange";
        context.fill();
        context.strokeStyle = "orange";
        context.stroke();
    }

    drawCrawler() {
        context.beginPath();
        
        let position = new Vector(offset.x + this.column * scale, offset.y + this.index * 2 * diagonal);

        if(this.column%2===0) {
            position.y += diagonal;
        }

        context.moveTo(position.x, position.y);
        
        position.x += diagonal;
        position.y += diagonal;
        context.lineTo(position.x, position.y);

        position.x += horizontal;
        context.lineTo(position.x, position.y);
    
        position.x += diagonal;
        position.y -= diagonal;
        context.lineTo(position.x, position.y);

        position.x -= diagonal;
        position.y -= diagonal;
        context.lineTo(position.x, position.y);

        position.x -= horizontal;
        context.lineTo(position.x, position.y);
    }

}

const init = () => {
    viewport.clear();
    for(let i = 0; i < 20; i++) {
        for(let j = 0; j < 20; j++) {
            hex.push(new Hexagon(j, i));
        }
    }
    context.beginPath();
    hex.forEach(item => item.render());
    context.strokeStyle = "black";
    context.stroke();

    crawl = new Crawler(hex);
    document.addEventListener("click", () => crawl.move());
    running = setInterval(()=>update(), 30);
}

const update = () => {
    if(completed) clearInterval(running);
    crawl.move();
}

const restart = () => {
    clearInterval(running);
    completed = false;
    hex = [];
    init();
}
const viewport = new Viewport(Math.ceil(hexColumns*spaceBetween) + diagonal, Math.ceil(hexColumns*spaceBetween));
const context = viewport.context;
let completed = false;
let hex = [];
let crawl;
let running;

document.getElementById('button').addEventListener("click", () => restart());

init();

