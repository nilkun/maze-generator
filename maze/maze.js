import Viewport from '../engine/Viewport.js';
import Vector from '../engine/Vector.js';
import Hexagon from '../hexagon/Hexagon.js';
import Crawler from '../hexagon/Crawler.js';

export default class Maze{
    constructor() {
        this.twoSquared = 1.41421356237;
        this.diagonal = 10;
        this.horizontal = this.diagonal * this.twoSquared;
        this.hexColumns = 20;
        this.hexIndices = 20;
        this.spaceBetween = (2 * this.horizontal + 2 * this.diagonal)/2;
        this.scale = this.spaceBetween;
        this.offset = new Vector(0, this.diagonal);
        this.viewport = new Viewport(Math.ceil(this.hexColumns*this.spaceBetween) + this.diagonal, Math.ceil(this.hexColumns*this.spaceBetween));
        this.context = this.viewport.context;
        this.completed = false;
        this.hex = [];
        this.crawl;
        this.running;
    }

    init() {
        this.twoSquared = 1.41421356237;
        this.diagonal = 10;
        this.horizontal = this.diagonal * this.twoSquared;
        this.hexColumns = 20;
        this.hexIndices = 20;
        this.spaceBetween = (2 * this.horizontal + 2 * this.diagonal)/2;
        this.scale = this.spaceBetween;
        this.offset = new Vector(0, this.diagonal);
        this.viewport.refetchCanvas();
        this.context = this.viewport.context;
        this.completed = false;
        this.hex = [];
        
        clearInterval(this.running);
        this.completed = false;
        this.hex = [];
        this.viewport.clear();
        for(let i = 0; i < 20; i++) {
            for(let j = 0; j < 20; j++) {
                this.hex.push(new Hexagon(j, i));
            }
        }
        this.context.beginPath();
        for(let i = 0; i < this.hex.length; i++) {
            this.hex[i].render(this.offset, this.scale, this.diagonal, this.context, this.horizontal);        

        }
        this.context.strokeStyle = "black";
        this.context.stroke();

        this.crawl = new Crawler(this.hex, this.hexIndices, this.hexColumns, this.context, this.offset, this.scale, this.diagonal, this.horizontal);
        document.addEventListener("click", () => this.crawl.move());
        this.running = setInterval( () => {
                if(this.completed) clearInterval(this.running);
                this.crawl.move();
        }
        , 30);
        document.getElementById('button').addEventListener("click", () => {
            this.restart();
        });        
    }
    restart() {
        this.viewport.refetchCanvas();
        this.completed = false;
        this.hex = [];
        this.completed = false;
        this.hex = [];
        this.viewport.clear();
        for(let i = 0; i < 20; i++) {
            for(let j = 0; j < 20; j++) {
                this.hex.push(new Hexagon(j, i));
            }
        }
        this.context.beginPath();
        for(let i = 0; i < this.hex.length; i++) {
            this.hex[i].render(this.offset, this.scale, this.diagonal, this.context, this.horizontal);
        }
        this.context.strokeStyle = "black";
        this.context.stroke();

        this.crawl = new Crawler(this.hex, this.hexIndices, this.hexColumns, this.context, this.offset, this.scale, this.diagonal, this.horizontal);
    }
}