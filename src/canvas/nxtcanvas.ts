import { NxtCanvasError, NxtCanvasErrorCode } from "./error"

declare const document: Document

export interface IPoint {
  x: number
  y: number
}

export interface ISize {
  width: number
  height: number
}

export interface IColor {
  r: number
  g: number
  b: number
  a?: number
}

export interface IPixel {
  r: number
  g: number
  b: number
  a: number
}

export interface IMouseEventCallbackArgs {
  target: any
  x: number
  y: number
}

export interface ITouchEventCallbackArgs {
  target: any
  touchPoints: IPoint[]
}

export type Handler4MouseEvent = (args: IMouseEventCallbackArgs) => void
export type Handler4TouchEvent = (args: ITouchEventCallbackArgs) => void

export class NxtCanvas {
  private canvasElement: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private cachedPixels: IPixel[]

  constructor(selectorOrObject: string | HTMLElement) {
    let rootEl

    if (typeof selectorOrObject === "object") {
      rootEl = selectorOrObject
    } else {
      const selector = selectorOrObject as string
      rootEl = document.querySelector(selector)
    }

    if (!rootEl) {
      throw new NxtCanvasError(NxtCanvasErrorCode.NoRootElement)
    }

    if (rootEl.localName == "canvas") {
      this.canvasElement = rootEl as HTMLCanvasElement
    } else {
      this.canvasElement = document.createElement("canvas")
      rootEl.appendChild(this.canvasElement)
    }
    this.ctx = this.canvasElement.getContext("2d")
  }

  setWidth(width: number): NxtCanvas {
    this.canvasElement.width = width
    return this
  }

  setHeight(height: number): NxtCanvas {
    this.canvasElement.height = height
    return this
  }

  getWidth(): number {
    return this.canvasElement.width
  }

  getHeight(): number {
    return this.canvasElement.height
  }

  getSize(): ISize {
    return {
      width: this.canvasElement.width,
      height: this.canvasElement.height,
    }
  }

  setSize(width: number, height: number) {
    this.canvasElement.width = width
    this.canvasElement.height = height
    return this
  }

  get width(): number {
    return this.getWidth()
  }

  get height(): number {
    return this.getHeight()
  }

  get size(): ISize {
    return this.getSize()
  }

  set width(val: number) {
    this.setWidth(val)
  }

  set height(val: number) {
    this.setHeight(val)
  }

  set size(val: ISize) {
    this.setSize(val.width, val.height)
  }

  getRGBAColor(r: number, g: number, b: number, a: number): string {
    const ir = Math.floor(255 * r)
    const ig = Math.floor(255 * g)
    const ib = Math.floor(255 * b)
    return "rgba(" + ir + ", " + ig + ", " + ib + ", " + a + ")"
  }

  // Blend modes: lighter, multiply, xor, etc
  setBlendMode(blendMode): NxtCanvas {
    this.ctx.globalCompositeOperation = blendMode
    return this
  }

  setDrawColor(r: number, g: number, b: number, a = 1): NxtCanvas {
    this.ctx.strokeStyle = this.getRGBAColor(r, g, b, a)
    return this
  }

  setFillColor(r: number, g: number, b: number, a = 1): NxtCanvas {
    this.ctx.fillStyle = this.getRGBAColor(r, g, b, a)
    return this
  }

  setRandomColor(alpha = 0.75): NxtCanvas {
    const r = Math.random()
    const g = Math.random()
    const b = Math.random()
    this.setDrawColor(r, g, b, alpha)
    return this
  }

  setRandomFillColor(alpha = 0.75): NxtCanvas {
    const r = Math.random()
    const g = Math.random()
    const b = Math.random()
    this.setFillColor(r, g, b, alpha)
    return this
  }

  setFillStyle(fillStyle): NxtCanvas {
    this.ctx.fillStyle = fillStyle
    return this
  }

  getStrokeStyle() {
    return this.ctx.strokeStyle
  }

  getDrawStyle() {
    return this.getStrokeStyle()
  }

  setFillGradientColorHorizontal(startColor, endColor): NxtCanvas {
    const grd = this.ctx.createLinearGradient(0, 0, this.canvasElement.width, 0)
    grd.addColorStop(0, startColor)
    grd.addColorStop(1, endColor)
    this.ctx.fillStyle = grd
    return this
  }

  setFillGradientColorVertical(startColor, endColor): NxtCanvas {
    const grd = this.ctx.createLinearGradient(0, 0, 0, this.canvasElement.height)
    grd.addColorStop(0, startColor)
    grd.addColorStop(1, endColor)
    this.ctx.fillStyle = grd
    return this
  }

  setLineWidth = function(lineWidth): NxtCanvas {
    this.ctx.lineWidth = lineWidth
    return this
  }

  drawLine(x1: number, y1: number, x2: number, y2: number): NxtCanvas {
    const ctx = this.ctx
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
    return this
  }

  drawPolygon(points: IPoint[]): NxtCanvas {
    const ctx = this.ctx
    const len = points.length
    let p = points[0]

    ctx.beginPath()
    ctx.moveTo(p.x, p.y)

    for (let i = 1; i < len; i++) {
      p = points[i]
      ctx.lineTo(p.x, p.y)
    }
    ctx.closePath()
    ctx.stroke()

    return this
  }

  fillPolygon(points: IPoint[]): NxtCanvas {
    const ctx = this.ctx
    const len = points.length
    let p = points[0]

    ctx.beginPath()
    ctx.moveTo(p.x, p.y)

    for (let i = 1; i < len; i++) {
      p = points[i]
      ctx.lineTo(p.x, p.y)
    }
    ctx.closePath()
    ctx.fill()

    return this
  }

  drawRandomLines(nofLines = 1): NxtCanvas {
    const n = nofLines || 1
    const sw = this.getWidth()
    const sh = this.getHeight()

    for (let i = 0; i < n; i++) {
      const x1 = sw * Math.random()
      const y1 = sh * Math.random()
      const x2 = sw * Math.random()
      const y2 = sh * Math.random()

      this.drawLine(x1, y1, x2, y2)
    }

    return this
  }

  changeGlobalAlpha(alpha: number): NxtCanvas {
    this.ctx.globalAlpha = alpha

    return this
  }

  setShadowBlur(blurSize: number, color: string): NxtCanvas {
    this.ctx.shadowBlur = blurSize
    this.ctx.shadowColor = color
    return this
  }

  removeShadowBlur(): NxtCanvas {
    this.ctx.shadowBlur = 0
    return this
  }

  drawBezier(p1: IPoint, p2: IPoint, cp1: IPoint, cp2: IPoint): NxtCanvas {
    const ctx = this.ctx
    ctx.beginPath()
    ctx.moveTo(p1.x, p1.y)
    ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, p2.x, p2.y)
    ctx.stroke()

    return this
  }

  drawCircle(x: number, y: number, radius: number): NxtCanvas {
    const ctx = this.ctx
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, 2 * Math.PI)
    ctx.stroke()

    return this
  }

  fillCircle(x: number, y: number, radius: number): NxtCanvas {
    const ctx = this.ctx
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, 2 * Math.PI)
    ctx.fill()

    return this
  }

  drawImage(img: HTMLImageElement, x: number, y: number, w?: number, h?: number, rotation = 0): NxtCanvas {
    const ctx = this.ctx
    const rotationInRadian = (rotation * Math.PI) / 180
    const displayImage = img
    w = w || displayImage.width
    h = h || displayImage.height
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(rotationInRadian)
    ctx.drawImage(displayImage, -w / 2, -h / 2, w, h)
    ctx.restore()
    return this
  }

  clear(): NxtCanvas {
    const ctx = this.ctx
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    return this
  }

  rotate(rotation, x = 0, y = 0): NxtCanvas {
    const ctx = this.ctx
    const rotationInRadian = (rotation * Math.PI) / 180
    ctx.translate(x, y)
    ctx.rotate(rotationInRadian)
    ctx.translate(-x, -y)
    return this
  }

  drawRoundedRectangle(x: number, y: number, w: number, h: number, r = 5): NxtCanvas {
    return this.prepRoundedRectangle(x, y, w, h, r)
  }

  fillRoundedRectangle(x: number, y: number, w: number, h: number, r = 5, drawBorder = false): NxtCanvas {
    return this.prepRoundedRectangle(x, y, w, h, r, drawBorder, true)
  }

  drawRectangle(x: number, y: number, w: number, h: number): NxtCanvas {
    const ctx = this.ctx
    ctx.rect(x, y, w, h)
    ctx.stroke()
    return this
  }

  fillRectangle(x: number, y: number, w: number, h: number): NxtCanvas {
    this.ctx.fillRect(x, y, w, h)
    return this
  }

  fillBackground(color?: IColor) {
    if (color) {
      let { r, g, b, a } = color
      this.setFillColor(r, g, b, a)
    }
    this.fillRectangle(0, 0, this.width, this.height)
  }

  fillBackgroundWhite() {
    this.setFillColor(1, 1, 1)
    this.fillRectangle(0, 0, this.width, this.height)
  }

  fillBackgroundBlack() {
    this.setFillColor(0, 0, 0)
    this.fillRectangle(0, 0, this.width, this.height)
  }

  drawEllipse(x: number, y: number, w: number, h: number, angleOffset1 = 0, angleOffset2 = 0, angleDelta = 0.1): NxtCanvas {
    const ctx = this.ctx
    const startX = x + w * Math.cos(angleOffset1)
    const startY = y + h * Math.sin(angleOffset2)
    ctx.beginPath()
    ctx.moveTo(startX, startY)
    for (let angle = 0; angle < 2 * Math.PI; angle += angleDelta) {
      const currentX = x + w * Math.cos(angle + angleOffset1)
      const currentY = y + h * Math.sin(angle + angleOffset2)
      ctx.lineTo(currentX, currentY)
    }
    ctx.lineTo(startX, startY)
    ctx.stroke()
    return this
  }

  // Font example: 20pt Times, etc.
  setFont(font: string): NxtCanvas {
    this.ctx.font = font
    return this
  }

  fillString(x: number, y: number, msg: string): NxtCanvas {
    this.ctx.fillText(msg, x, y)
    return this
  }

  drawString(x: number, y: number, msg: string): NxtCanvas {
    this.ctx.strokeText(msg, x, y)
    return this
  }

  fillStringWithShadow(x: number, y: number, msg: string): NxtCanvas {
    this.ctx.save()
    this.ctx.shadowColor = "#111"
    this.ctx.shadowOffsetX = 1
    this.ctx.shadowOffsetY = 1
    this.ctx.shadowBlur = 7
    this.ctx.fillText(msg, x, y)
    this.ctx.restore()
    return this
  }

  getPosition(event): IPoint {
    const rect = this.canvasElement.getBoundingClientRect()
    const x = Math.floor(event.clientX - rect.left)
    const y = Math.floor(event.clientY - rect.top)
    return { x, y }
  }

  getCanvasElement(): HTMLCanvasElement {
    return this.canvasElement
  }

  toDataURL(): string {
    return this.canvasElement.toDataURL()
  }

  drawCanvas(canvas: NxtCanvas, x: number, y: number, w: number, h: number): NxtCanvas {
    const otherCanvasElement = canvas.getCanvasElement()
    this.ctx.drawImage(otherCanvasElement, x, y, w, h)
    return this
  }

  getRawPixelsData(): number[] {
    const imageData = this.ctx.getImageData(0, 0, this.getWidth(), this.getHeight())
    return Array.from(imageData.data)
  }

  getPixels(): IPixel[] {
    const data = this.getRawPixelsData()
    const pixels: IPixel[] = []

    for (let i = 0; i < data.length; i += 4) {
      pixels.push({
        r: data[i],
        g: data[i + 1],
        b: data[i + 2],
        a: data[i + 3],
      })
    }
    this.cachedPixels = pixels

    return pixels
  }

  getPixelAt(x: number, y: number, useCache = true) {
    let pixels, index

    if (useCache) {
      pixels = this.cachedPixels ? this.cachedPixels : this.getPixels()
    } else {
      pixels = this.getPixels()
    }

    x = Math.floor(x)
    y = Math.floor(y)
    index = x + y * this.width

    return pixels[index]
  }

  setPixels(pixels: IPixel[]) {
    const imageData = this.ctx.createImageData(this.getWidth(), this.getHeight())
    const data = imageData.data
    const len = Math.min(pixels.length, data.length / 4)
    let dataIndex = 0

    for (let i = 0; i < len; i++) {
      const { r, g, b, a } = pixels[i]
      data[dataIndex++] = r
      data[dataIndex++] = g
      data[dataIndex++] = b
      data[dataIndex++] = a
    }

    this.ctx.putImageData(imageData, 0, 0)
  }

  // --- Event Handlers ---
  addMouseClickHandler(callback: Handler4MouseEvent) {
    return this.addGenericMouseEventListener("click", callback)
  }

  addMouseDoubleClickHandler(callback: Handler4MouseEvent) {
    return this.addGenericMouseEventListener("dblclick", callback)
  }

  addMouseMoveHandler(callback: Handler4MouseEvent) {
    return this.addGenericMouseEventListener("mousemove", callback)
  }

  addMouseDownHandler(callback: Handler4MouseEvent) {
    return this.addGenericMouseEventListener("mousedown", callback)
  }

  addMouseUpHandler(callback: Handler4MouseEvent) {
    return this.addGenericMouseEventListener("mouseup", callback)
  }

  addMouseDragHandler(callback: Handler4MouseEvent) {
    let mouseDown = false

    this.addMouseDownHandler(() => {
      mouseDown = true
    })
    this.addMouseUpHandler(() => {
      mouseDown = false
    })

    return this.addGenericMouseEventListener("mousemove", args => {
      if (mouseDown) {
        callback(args)
      }
    })
  }

  addTouchMoveHandler(callback: Handler4TouchEvent) {
    return this.addGenericTouchEventListener("touchmove", callback)
  }

  addTouchStartHandler(callback: Handler4TouchEvent) {
    return this.addGenericTouchEventListener("touchstart", callback)
  }

  addTouchEndHandler(callback: Handler4TouchEvent) {
    return this.addGenericTouchEventListener("touchend", callback)
  }

  // --- Private Methods ---
  private prepRoundedRectangle(x: number, y: number, w: number, h: number, r = 5, draw = true, fill = false): NxtCanvas {
    const ctx = this.ctx

    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.arcTo(x + w, y, x + w, y + r, r)
    ctx.lineTo(x + w, y + h - r)
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
    ctx.lineTo(x + r, y + h)
    ctx.arcTo(x, y + h, x, y + h - r, r)
    ctx.lineTo(x, y + r)
    ctx.arcTo(x, y, x + r, y, r)
    ctx.closePath()

    if (fill) ctx.fill()

    if (draw) ctx.stroke()

    return this
  }

  private addGenericMouseEventListener(eventName: string, callback: Handler4MouseEvent) {
    this.canvasElement.addEventListener(
      eventName,
      (e: MouseEvent) => {
        e.preventDefault()
        const target = e.target
        const pos = this.getPosition(e)
        callback({ target, x: pos.x, y: pos.y })
      },
      false
    )

    return this
  }

  private addGenericTouchEventListener(eventName: string, callback: Handler4TouchEvent) {
    this.canvasElement.addEventListener(
      eventName,
      (e: TouchEvent) => {
        e.preventDefault()
        const target = e.target
        const touchPoints = []
        const touches = e.touches
        const len = touches.length
        for (let i = 0; i < len; i++) {
          const touch = touches[i]
          const pos = this.getPosition(touch)

          if (pos.x != NaN) touchPoints.push({ x: pos.x, y: pos.y })
        }
        callback({ target, touchPoints })
      },
      false
    )

    return this
  }
}
