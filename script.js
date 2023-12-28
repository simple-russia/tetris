const canvas = document.body.querySelector('.engine');

const ctx = canvas.getContext('2d')

width = 10;
height = 20;

let score = 0;

const figures = Array(height).fill(null).map(() => Array(width).fill(null));

figures[19] = Array(width-1).fill("#FF0000");
figures[18] = Array(width-1).fill("#FF0000");
figures[17] = Array(width-1).fill("#FF0000");


let fallingFigure = null;

const _sq = [[0, 0], [0, 1], [1, 0], [1, 1]];
const _ln = [[0, 0], [1, 0], [2, 0], [3, 0]];
const _py = [[0, 1], [1, 1], [2, 1], [1, 0]];
const _ge = [[0, 0], [0, 1], [0, 2], [1, 0]];
const _figs = [_sq, _ln, _py, _ge];
const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];
const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)]
const getRandomFigure = () => [..._figs[Math.floor(Math.random() * _figs.length)]]

const generateFallingFigure = () => {
    if (fallingFigure) return

    fallingFigure = {
        color: getRandomColor(),
        cells: getRandomFigure(),
        pos: {
            x: 0,
            y: 0,
        }
    };
}


const renderPixel = (x, y, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 1, 1);
}

const renderFrame = () => {
    ctx.fillStyle = "#374340";
    ctx.fillRect(0, 0, width, height);

    figures.forEach((row, i) => {
        row.forEach((cell, j) => {
            if (cell) {
                renderPixel(j, i, cell)
            }
        })
    })

    if (fallingFigure) {
        fallingFigure.cells.forEach(cell => {
            renderPixel(cell[0] + fallingFigure.pos.x, cell[1] + fallingFigure.pos.y, fallingFigure.color)
        });
    }

    document.querySelector('.score').innerHTML = score;
};

const clearLine = (i) => {
    score += 10
    figures[i].forEach((_, j) => {
        figures[i][j] = null;
    })
}

const moveLine = (i) => {
    for (let j = i-1; j >= 0; j--) {
        console.log(j)
        figures[j+1] = figures[j]
        figures[0] = Array(width).fill(null)
    }
}

const checkLines = () => {
    const linesToMove = []

    figures.forEach((line, i) => {
        if (line.every(c => Boolean(c))) {
            linesToMove.push(i)
        }
    });

    linesToMove.reverse().forEach((line, i) => {
        setTimeout(() => {
            // moveLine(line);
            clearLine(line)
        }, (i + 1) * 200)
    })

    setTimeout(() => {
        console.log(linesToMove)
        linesToMove.reverse().forEach(line => moveLine(line))
    }, linesToMove.length * 200 + 400)
}

const freezeFallingFig = () => {
    console.log('freeze');

    fallingFigure.cells.forEach((cell) => {
        figures[cell[1] + fallingFigure.pos.y][cell[0] + fallingFigure.pos.x] = fallingFigure.color;
    });

    fallingFigure = null;

    checkLines();

    setTimeout(() => {
        generateFallingFigure();
    }, 2000);
}

const moveFallingFigureDown = () => {
    if (fallingFigure) {
        const newPos = {
            ...fallingFigure.pos,
            y: fallingFigure.pos.y + 1,
        }
        if (canMoveFallingFigure(newPos)) {
            fallingFigure.pos = newPos;
        } else {
            freezeFallingFig()
        }
    }
}

const rotateFigure = () => {
    fallingFigure.cells.forEach(cell => {
        [cell[0], cell[1]] = [cell[1], cell[0]]
    })
}

const moveFallingFigureSide = (dir) => {
    if (dir == 'right') {
        const newPos = {
            ...fallingFigure.pos,
            x: fallingFigure.pos.x + 1,
        }
        if (canMoveFallingFigure(newPos)) {
            fallingFigure.pos = newPos;
        }
    } else {
        const newPos = {
            ...fallingFigure.pos,
            x: fallingFigure.pos.x - 1,
        }
        if (canMoveFallingFigure(newPos)) {
            fallingFigure.pos = newPos;
        }
    }
}

const canMoveFallingFigure = (pos) => {
    if (!fallingFigure) throw new Error('no falling fig');

    const hasCellAt = (x, y) => {
        if (x >= width || x < 0 || y >= height || y < 0) return true;

        try {
            if (figures[y][x]) {
                return true;
            }
            return false;
        } catch (e) {
            console.error(e, x, y)
            return false
        }
    }

    let canMove = true;

    fallingFigure.cells.forEach(cell => {
        const hs = hasCellAt(cell[0] + pos.x, cell[1] + pos.y);
        if (hs) {
            canMove = false;
        }
    })

    return canMove;
}

generateFallingFigure();

setInterval(() => {
    renderFrame();
}, 20);

setInterval(() => {
    moveFallingFigureDown();
}, 1000);

window.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') {
        moveFallingFigureSide('left')
    }
    if (e.key === 'ArrowRight') {
        moveFallingFigureSide('right')
    }
    if (e.key === 'ArrowDown') {
        moveFallingFigureDown();
    }
    if (e.key === 'ArrowUp') {
        rotateFigure();
    }
})

console.log(ctx);
