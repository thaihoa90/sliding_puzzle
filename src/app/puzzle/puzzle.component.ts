import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-puzzle',
  templateUrl: './puzzle.component.html',
  styleUrls: ['./puzzle.component.css']
})
export class PuzzleComponent implements OnInit {

  private col: number = 4;
  private row: number = 4;

  private emptyTileX = 3;
  private emptyTileY = 3;

  private complete: boolean;
  
  public message: string;
  public puzzle: any[] = [];

  constructor() {
    this.resetPuzzle()
  }

  ngOnInit(): void {
  }

  /**
   * Reset puzzle
   */
  public resetPuzzle() {
    this.emptyTileX = 3;
    this.emptyTileY = 3;

    this.complete = true;
    this.message = 'Click on new game to start';
    this.puzzle = [
      {
        columns: [{
          id: 0,
          x: 0,
          y: 0,
          tile: 'tile1'
        }, {
          id: 1,
          x: 1,
          y: 0,
          tile: 'tile2'
        }, {
          id: 2,
          x: 2,
          y: 0,
          tile: 'tile3'
        }, {
          id: 3,
          x: 3,
          y: 0,
          tile: 'tile4'
        }]
      }, {
        columns: [{
          id: 4,
          x: 0,
          y: 1,
          tile: 'tile5'
        }, {
          id: 5,
          x: 1,
          y: 1,
          tile: 'tile6'
        }, {
          id: 6,
          x: 2,
          y: 1,
          tile: 'tile7'
        }, {
          id: 7,
          x: 3,
          y: 1,
          tile: 'tile8'
        }]
      }, {
        columns: [{
          id: 8,
          x: 0,
          y: 2,
          tile: 'tile9'
        }, {
          id: 9,
          x: 1,
          y: 2,
          tile: 'tile10'
        }, {
          id: 10,
          x: 2,
          y: 2,
          tile: 'tile11'
        }, {
          id: 11,
          x: 3,
          y: 2,
          tile: 'tile12'
        }]
      }, {
        columns: [{
          id: 12,
          x: 0,
          y: 3,
          tile: 'tile13'
        }, {
          id: 13,
          x: 1,
          y: 3,
          tile: 'tile14'
        }, {
          id: 14,
          x: 2,
          y: 3,
          tile: 'tile15'
        }, {
          id: 15,
          x: 3,
          y: 3,
          tile: 'tile-empty'
        }]
      }]
  }

  /**
   * Start a new game
   */
  public newGame() {
    this.resetPuzzle();
    this.complete = false;

    this.shuffle(50);

  }

  /**
   * Called when clicking a tile
   * @param x x coordinate of the tile
   * @param y y coordinate of the tile
   */
  public clickTile(x: number, y: number) {
    if(this.complete) return;

    this.moveTile(x, y);

    if (this.checkPuzzleCompletion()) { 
      this.complete = true; 
      this.message = 'Succes!'
    }
  }

  /**
   * Generate a random number between 0 and max-1
   * @param max 
   */
  private randomNumber(max: number) {
    return Math.floor(Math.random() * Math.floor(max))
  }

  /**
   * Returns an array with adjacent tiles
   * @param x x coordinate of the tile
   * @param y y coordinate of the tile
   */
  private getAdjacentTile(x: number, y: number) {
    if (x === 3 && y === 3) return [{ x: 2, y: 3 }, { x: 3, y: 2 }];
    if (x === 0 && y === 0) return [{ x: 1, y: 0 }, { x: 0, y: 1 }];
    if (x === 0 && y === 3) return [{ x: 1, y: 3 }, { x: 0, y: 2 }];
    if (x === 3 && y === 0) return [{ x: 2, y: 0 }, { x: 3, y: 1 }];
    if (x < 3 && x > 0 && y === 3) return [{ x: x - 1, y: 3 }, { x: x + 1, y: 3 }, { x: x, y: 2 }];
    if (x < 3 && x > 0 && y === 0) return [{ x: x - 1, y: 0 }, { x: x + 1, y: 0 }, { x: x, y: 1 }];
    if (x === 3 && y < 3 && y > 0) return [{ x: 3, y: y - 1 }, { x: 3, y: y + 1 }, { x: 2, y: y }];
    if (x === 0 && y < 3 && y > 0) return [{ x: 0, y: y - 1 }, { x: 0, y: y + 1 }, { x: 1, y: y }];
    if (x < 3 && x > 0 && y < 3 && y > 0) return [{ x: x + 1, y: y }, { x: x - 1, y: y }, { x: x, y: y - 1 }, { x: x, y: y + 1 }];
  }

  /**
   * Shuffle tiles around
   * @param steps number of times a tile will be moved
   */
  private shuffle(steps: number) {
    let previousX, previousY;
    for (let i = 0; i < steps; i++) {

      let options: any[] = this.getAdjacentTile(this.emptyTileX, this.emptyTileY)
      if (!options) return;
      let index = this.randomNumber(options.length)

      if (options[index].x === previousX && options[index].y === previousY) {
        options.splice(index, 1);
        index = this.randomNumber(options.length)
      }

      this.moveTile(options[index].x, options[index].y);
      previousX = options[index].x;
      previousY = options[index].y

    }
  }
  
  /**
   * Move a tile to an empty spot
   * @param x x coordinate of the tile
   * @param y y coordinate of the tile
   */
  private moveTile(x: number, y: number) {

    if (this.allowedToMove(x, y)) {
      let tile = this.puzzle[y].columns[x]
      let emptyTile = this.puzzle[this.emptyTileY].columns[this.emptyTileX];

      tile.x = emptyTile.x;
      tile.y = emptyTile.y;

      emptyTile.x = x;
      emptyTile.y = y;

      this.puzzle[this.emptyTileY].columns[this.emptyTileX] = tile
      this.puzzle[y].columns[x] = emptyTile

      this.emptyTileX = x;
      this.emptyTileY = y;

    }

  }

  /**
   * Check if tile is allowed to move
   * @param x x coordinate of the tile
   * @param y y coordinate of the tile
   */
  private allowedToMove(x: number, y: number) {
    if (x + 1 === this.emptyTileX && y === this.emptyTileY) return true;
    if (x - 1 === this.emptyTileX && y === this.emptyTileY) return true;
    if (x === this.emptyTileX && y + 1 === this.emptyTileY) return true;
    if (x === this.emptyTileX && y - 1 === this.emptyTileY) return true;
    return false;
  }

  /**
   * Check if puzzle has been completed
   */
  private checkPuzzleCompletion() {
    let counter = 0;
    for (let row of this.puzzle) {
      for (let column of row.columns) {
        if (column.id !== counter) return false;
        counter++;
      }
    }
    return true;
  }

}
