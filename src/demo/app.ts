// NxtCanvas Demo
import { NxtCanvas } from "../index"

class Node {
  constructor(public x: number, public y: number, public width = 25, public height = 25) {}

  drawOn(canvas: NxtCanvas) {
    canvas.drawEllipse(this.x, this.y, this.width, this.height)
  }
}

class Ball extends Node {
  private deltaX: number
  private deltaY: number
  private deltaRotation: number
  private rotationAngle: number

  constructor(public image: HTMLImageElement, public x: number, public y: number, public width = 75, public height = 75) {
    super(x, y, width, height)
    this.init()
  }

  init() {
    const max = 10
    this.deltaX = max * (0.5 - Math.random())
    this.deltaY = max * (0.5 - Math.random())
    this.deltaRotation = max * (0.5 - Math.random())
    this.rotationAngle = 360 * (0.5 - Math.random())
  }

  drawOn(canvas: NxtCanvas) {
    canvas.drawImage(this.image, this.x, this.y, this.width, this.height, this.rotationAngle)
  }

  nudge(constraint: { x: number; y: number; width: number; height: number }) {
    this.x += this.deltaX
    this.y += this.deltaY
    if (this.x - this.width / 2 < constraint.x || this.x + this.width / 2 > constraint.width) this.deltaX *= -1
    if (this.y - this.height / 2 < constraint.y || this.y + this.height / 2 > constraint.height) this.deltaY *= -1
    this.rotationAngle += this.deltaRotation
  }
}

const canvas1 = new NxtCanvas("#canvas1")
const canvas2 = new NxtCanvas("#canvas2")
const canvas3 = new NxtCanvas("#canvas3")
const width = window.innerWidth
const height = window.innerHeight
const imgBall1 = new Image()
const imgBall2 = new Image()
const imgBall3 = new Image()
const images = [imgBall1, imgBall2, imgBall3]
const nofBalls = 100
const balls: Ball[] = []
const screenConstraint = { x: 0, y: 0, width: width, height: height }
const singleBall = new Ball(imgBall1, width / 2, height / 2, 75, 75)
const btn1 = document.getElementById("btn1")
const btn2 = document.getElementById("btn2")
const btn3 = document.getElementById("btn3")
const btn4 = document.getElementById("btn4")
const cb1 = document.getElementById("cb1")
let alwaysClearBackgroud = true
let animate = true

canvas1.setWidth(width)
canvas1.setHeight(height)
canvas2.setWidth(width / 4)
canvas2.setHeight(height / 4)
canvas3.setWidth(width / 4)
canvas3.setHeight(height / 4)

imgBall1.src = require("./images/soccerball.png")
imgBall2.src = require("./images/basketball.png")
imgBall3.src = require("./images/volleyball.png")

for (let i = 0; i < nofBalls; i++) {
  const x = 100 + 0.5 * width * Math.random()
  const y = 100 + 0.5 * height * Math.random()
  const size = 25 + 50 * Math.random()
  const imgIndex = Math.floor(images.length * Math.random())
  const img = images[imgIndex]
  balls.push(new Ball(img, x, y, size, size))
}

const clearBackground = () => {
  if (alwaysClearBackgroud) {
    canvas1.clear()
    canvas2.clear()
    canvas1.removeShadowBlur()
  }
}

const drawBalls = () => {
  clearBackground()
  balls.forEach(ball => {
    ball.drawOn(canvas1)
    ball.nudge(screenConstraint)
  })
}

const drawLines = () => {
  const p1 = { x: width * Math.random(), y: height * Math.random() }
  const p2 = { x: width * Math.random(), y: height * Math.random() }
  const cp1 = { x: width * Math.random(), y: height * Math.random() }
  const cp2 = { x: width * Math.random(), y: height * Math.random() }
  clearBackground()
  canvas1
    .setLineWidth(1)
    .setRandomColor()
    .drawBezier(p1, p2, cp1, cp2)
    .setRandomFillColor()
    .fillCircle(p1.x, p1.y, 10 * Math.random())
    .fillRectangle(p2.x - 5, p2.y - 5, 10, 10)
}

const drawSample3 = () => {
  const trianglePoints = [
    { x: width / 2, y: height / 4 },
    { x: width / 2 - 100, y: height / 2 },
    { x: width / 2 + 100, y: height / 2 },
  ]
  canvas1
    .clear()
    .setLineWidth(2)
    .removeShadowBlur()
    .setDrawColor(1, 0, 0, 1)
    .drawRoundedRectangle(75, 150, 300, 200)
    .setDrawColor(0, 1, 0, 1)
    .drawCircle(350, 150, 100)
    .setDrawColor(0, 0, 1, 1)
    .setLineWidth(5)
    .drawPolygon(trianglePoints)
    .setLineWidth(3)
    .setDrawColor(0.5, 0, 0.1)
    .drawLine(0, 0, width, height)
    .setDrawColor(0.1, 0.5, 0.9)
    .setShadowBlur(3, "#444")
    .drawLine(width, 0, 0, height)
    .drawImage(imgBall1, width / 2, height / 2, 75, 75)
    .setDrawColor(0.1, 0.5, 0.9)
    .setFillGradientColorHorizontal("#aaa", "#000")
    .fillRectangle(width / 4, height / 1.1, width / 2, 50)
    .setDrawColor(0, 0, 0)
    .setFillColor(1, 1, 1)
    .setShadowBlur(2, "#333")
    .setFont("20pt Times")
    .fillString(width / 4 + 20, height / 1.1 + 30, "This is a test...")

  canvas2.clear()
}

const drawSample4 = () => {
  clearBackground()
  canvas1.setFillColor(0.15, 0.15, 0.25, 1)
  canvas1.fillRectangle(0, 0, canvas1.getWidth(), canvas1.getHeight())
  singleBall.drawOn(canvas1)
}

const drawingFunctions = [drawBalls, drawLines, drawSample3, drawSample4]
let currentDrawingFunction = drawingFunctions[0]

btn1.onclick = () => {
  canvas1.clear()
  animate = true
  currentDrawingFunction = drawingFunctions[0]
}

btn2.onclick = () => {
  canvas1.clear()
  animate = true
  currentDrawingFunction = drawingFunctions[1]
}

btn3.onclick = () => {
  canvas1.clear()
  animate = true
  currentDrawingFunction = drawingFunctions[2]
}

btn4.onclick = () => {
  canvas1.clear()
  animate = true
  currentDrawingFunction = drawingFunctions[3]
}

cb1.onchange = () => {
  alwaysClearBackgroud = !alwaysClearBackgroud
}

const invertPixels = pixels => {
  let newPixels = []

  for (let i = 0; i < pixels.length; i += 4) {
    newPixels[i] = 255 - pixels[i] // red
    newPixels[i + 1] = 255 - pixels[i + 1] // green
    newPixels[i + 2] = 255 - pixels[i + 2] // blue
    newPixels[i + 3] = pixels[i + 3]
  }

  return newPixels
}

setInterval(() => {
  if (!animate) return
  currentDrawingFunction()
  canvas2.drawCanvas(canvas1, 0, 0, width / 4, height / 4)
  let pixels = canvas2.getPixels()
  let invertedPixels = invertPixels(pixels)
  canvas3.setPixels(invertedPixels)
}, 33)

canvas1.addMouseDoubleClickHandler(e => {
  animate = !animate
})

canvas1.addMouseDragHandler(e => {
  const { x, y } = e
  singleBall.x = x
  singleBall.y = y
})
