import Vector from '../engine/Vector.js';
export default class Crawler{
    constructor(clone, indices, columns, context, offset, scale, diagonal, horizontal) {
        this.stack = [];
        this.grid = clone.slice(0);
        this.next = new Vector();
        //this.pos = new Vector(1,0);

        this.column = 0;
        this.index = 0;
        this.limit = 0;

        this.hexIndices = indices;
        this.hexColumns = columns;

        this.context = context;
        this.offset = offset;
        this.scale = scale;
        this.diagonal = diagonal;
        this.horizontal = horizontal;
    }

    getNeighbours() {
        //TO FIND PATH
        let availableNeighbours = [];

        // IF CURRENT INDEX + 1 < this.hexIndices
        // IE, IF THE NEXT INDEX IS WITHIN LIMITS
        if(this.index<(this.hexIndices-1) 
            && !this.grid[this.column + (this.index + 1) * this.hexColumns].isVisited) 
                availableNeighbours.push(new Vector(this.column, this.index + 1));
        
        // IF CURRENT INDEX > 0
        // IE, IF THE PREVIOUS INDEX IS WITHIN LIMITS
        if(this.index > 0 
            && !this.grid[this.column + (this.index - 1) * this.hexColumns].isVisited) 
                availableNeighbours.push(new Vector(this.column, this.index - 1));

        // IF THE COLUMN IS AN EVEN NUMBER
        if(this.column%2 === 0) {       
            // IF COLUMN IS NOT ALL THE WAY TO THE LEFT
            if(this.column > 0) {
                // THEN ADD LEFT COLUMN, SAME INDEX (ABOVE)
                if(!this.grid[this.column - 1 + (this.index) * this.hexColumns].isVisited) 
                    availableNeighbours.push(new Vector(this.column - 1, this.index));
                // IF INDEX IS NOT THE LAST ONE
                if(this.index < this.hexIndices - 1 
                    && !this.grid[this.column -1 + (this.index + 1) * this.hexColumns].isVisited) 
                        // THEN ADD LEFT COLUMN, INDEX + 1 (BELOW)
                        availableNeighbours.push(new Vector(this.column - 1, this.index + 1));
            }
                 
            // IF COLUMN IS NOT ALL THE WAY TO THE RIGHT
            if(this.column < this.hexIndices - 1) {
                // THEN ADD RIGHT COLUMN, SAME INDEX
                if(!this.grid[this.column + 1 + (this.index) * this.hexColumns].isVisited) 
                    availableNeighbours.push(new Vector(this.column + 1, this.index));
                // IF INDEX IS NOT THE LAST ONE
                if(this.index < this.hexIndices - 1 
                    && !this.grid[this.column + 1 + (this.index + 1) * this.hexColumns].isVisited) 
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
                    && !this.grid[this.column - 1 + (this.index - 1) * this.hexColumns].isVisited) 
                        // THEN ADD LEFT COLUMN, INDEX - 1 (ABOVE)
                        availableNeighbours.push(new Vector(this.column - 1, this.index - 1));                         
                // THEN ADD LEFT COLUMN, INDEX (BELOW)           
                if(!this.grid[this.column - 1 + (this.index) * this.hexColumns].isVisited) 
                    availableNeighbours.push(new Vector(this.column - 1, this.index));

            }
            
            // IF COLUMN IS NOT ALL THE WAY TO THE RIGHT
            if(this.column < this.hexColumns - 1) {
                // IF INDEX IS NOT THE FIRST ONE               
                if(this.index > 0 
                    && !this.grid[this.column + 1 + (this.index - 1) * this.hexColumns].isVisited) 
                        // THEN ADD RIGHT COLUMN, INDEX - 1 
                        availableNeighbours.push(new Vector(this.column + 1, this.index - 1));
                // THEN ADD RIGHT COLUMN, SAME INDEX                
                if(!this.grid[this.column + 1 + (this.index) * this.hexColumns].isVisited) 
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
            this.renderHex(this.offset, this.scale, this.diagonal, this.context, this.horizontal);
            const popped = this.stack.pop();
            this.column = popped.x;
            this.index = popped.y;
            this.renderHex();

        } 
        else {
            this.completed = true;
        }
    }
    renderHex() {
        this.context.beginPath();
        this.grid[this.column + this.index * 20].render(this.offset, this.scale, this.diagonal, this.context, this.horizontal);
        this.context.strokeStyle = "black";
        this.context.stroke();
    }

    renderCrawler() {
        this.drawCrawler();
        this.context.fillStyle = "orange";
        this.context.fill();
        this.context.strokeStyle = "orange";
        this.context.stroke();
    }

    drawCrawler() {
        this.context.beginPath();
        
        let position = new Vector(this.offset.x + this.column * this.scale, this.offset.y + this.index * 2 * this.diagonal);

        if(this.column%2===0) {
            position.y += this.diagonal;
        }

        this.context.moveTo(position.x, position.y);
        
        position.x += this.diagonal;
        position.y += this.diagonal;
        this.context.lineTo(position.x, position.y);

        position.x += this.horizontal;
        this.context.lineTo(position.x, position.y);
    
        position.x += this.diagonal;
        position.y -= this.diagonal;
        this.context.lineTo(position.x, position.y);

        position.x -= this.diagonal;
        position.y -= this.diagonal;
        this.context.lineTo(position.x, position.y);

        position.x -= this.horizontal;
        this.context.lineTo(position.x, position.y);
    }

}