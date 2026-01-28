//sum()
//function sum(){
  //  console.log("hehehehehe");
//}
//sum()
//let sum=()=>{                 (different method to define a function)
  //  console.log("hehehehehe");
//}
let canvas = document.querySelector("canvas")
let pen = canvas.getContext("2d")
// ===== THEME SETUP =====
let isDarkMode = true
let isPaused = false
let maxScore = localStorage.getItem("maxScore") 
    ? Number(localStorage.getItem("maxScore")) 
    : 0
let themes = {
    dark: {
        bg: "black",
        snake: "red",
        food: "yellow",
        text: "white"
    },
    light: {
        bg: "white",
        snake: "green",
        food: "orange",
        text: "black"
    }
}

let currentTheme = themes.dark

let cell = 25
let direction = "right"
let nextDirection = "right"
let score = 0
let speed = 100
let gameOver = false
let interval

let snake = [{ x: 0, y: 0 }]
let food = createFood()
// theme toggle icon
let themeIcon = document.getElementById("themeToggle")

themeIcon.addEventListener("click", () => {
    isDarkMode = !isDarkMode
    currentTheme = isDarkMode ? themes.dark : themes.light
    themeIcon.textContent = isDarkMode ? "🌙" : "☀️"
    document.body.style.background = currentTheme.bg
})

// controls
document.addEventListener("keydown", (e) => {

    // PAUSE / RESUME (SPACE BAR)
    if (e.code === "Space") {
        isPaused = !isPaused
        return
    }

    if (isPaused) return

    if (e.key === "ArrowUp" && direction !== "down") nextDirection = "up"
    if (e.key === "ArrowDown" && direction !== "up") nextDirection = "down"
    if (e.key === "ArrowLeft" && direction !== "right") nextDirection = "left"
    if (e.key === "ArrowRight" && direction !== "left") nextDirection = "right"

    if (e.key === "Enter" && gameOver) restartGame()
})

// create food
function createFood() {
    return {
        x: Math.floor(Math.random() * (canvas.width / cell)) * cell,
        y: Math.floor(Math.random() * (canvas.height / cell)) * cell
    }
}
function drawSnake() {
    snake.forEach((part, index) => {
        // HEAD
        if (index === snake.length - 1) {
            drawHead(part)
        }
        // TAIL
        else if (index === 0) {
            drawRoundedRect(part.x + 6, part.y + 6, cell - 12, cell - 12)
        }
        // BODY
        else {
            drawRoundedRect(part.x + 4, part.y + 4, cell - 8, cell - 8)
        }
    })
}

// draw everything
function draw() {
    // background
    pen.fillStyle = currentTheme.bg
    pen.fillRect(0, 0, canvas.width, canvas.height)

    // snake
    pen.fillStyle = currentTheme.snake
    pen.fillStyle = currentTheme.snake
    drawSnake()

    // food
    pen.fillStyle = currentTheme.food
    pen.fillRect(food.x, food.y, cell, cell)

    // score
    pen.fillStyle = currentTheme.text
    pen.font = "18px Arial"
    pen.fillText(`Score: ${score}   Max: ${maxScore}`, 10, 585)

    // GAME OVER UI
    if (isPaused && !gameOver) {
    pen.fillStyle = "rgba(0,0,0,0.5)"
    pen.fillRect(0, 0, canvas.width, canvas.height)

    pen.fillStyle = currentTheme.text
    pen.font = "40px Arial"
    pen.fillText("PAUSED", canvas.width / 2 - 80, canvas.height / 2)
    }
    if (gameOver) {
        pen.fillStyle = "rgba(0,0,0,0.6)"
        pen.fillRect(0, 0, canvas.width, canvas.height)

        pen.fillStyle = currentTheme.text
        pen.font = "40px Arial"
        pen.fillText("GAME OVER", 220, 280)

        pen.font = "20px Arial"
        pen.fillText("Press ENTER to Restart", 230, 320)
    }
}

// update logic

function update() {
    if (gameOver || isPaused) return

    direction = nextDirection
    let head = snake[snake.length - 1]

    let nextX = head.x
    let nextY = head.y

    if (direction === "right") nextX += cell
    if (direction === "left") nextX -= cell
    if (direction === "up") nextY -= cell
    if (direction === "down") nextY += cell

    // WALL COLLISION
    if (
        nextX < 0 || nextY < 0 ||
        nextX >= canvas.width || nextY >= canvas.height
    ) {
        if (score > maxScore) {
            maxScore = score
            localStorage.setItem("maxScore", maxScore)
        }
        gameOver = true
        return
    }

    // SELF COLLISION
    for (let p of snake) {
        if (p.x === nextX && p.y === nextY) {
            if (score > maxScore) {
                maxScore = score
                localStorage.setItem("maxScore", maxScore)
            }
            gameOver = true
            return
        }
    }

    snake.push({ x: nextX, y: nextY })

    // FOOD EATEN
    if (nextX === food.x && nextY === food.y) {
        score += 10
        food = createFood()
    } else {
        snake.shift()
    }
}
function drawRoundedRect(x, y, w, h) {
    pen.beginPath()
    pen.arc(x + w / 2, y + h / 2, w / 2, 0, Math.PI * 2)
    pen.fill()
}

function drawHead(head) {
    // head circle
    pen.beginPath()
    pen.arc(
        head.x + cell / 2,
        head.y + cell / 2,
        cell / 2,
        0,
        Math.PI * 2
    )
    pen.fill()

    // eyes
    pen.fillStyle = currentTheme.text
    let eyeOffsetX = direction === "left" ? -6 : direction === "right" ? 6 : 0
    let eyeOffsetY = direction === "up" ? -6 : direction === "down" ? 6 : 0

    pen.beginPath()
    pen.arc(head.x + cell / 2 - 5 + eyeOffsetX, head.y + cell / 2 - 5 + eyeOffsetY, 2, 0, Math.PI * 2)
    pen.arc(head.x + cell / 2 + 5 + eyeOffsetX, head.y + cell / 2 - 5 + eyeOffsetY, 2, 0, Math.PI * 2)
    pen.fill()
}

// restart game
function restartGame() {
    snake = [{ x: 0, y: 0 }]
    direction = "right"
    nextDirection = "right"
    score = 0
    gameOver = false
    food = createFood()
    isPaused = false
}

// game loop
interval = setInterval(() => {
    draw()
    update()
}, speed)

