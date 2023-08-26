export class Sprite {
  constructor(url) {
    this.url = url

    this.callback = null

    this.img = new Image()
    this.img.onload = () => {
      this.callback()
    }
    this.img.src = this.url
  }

  on_ready(func) {
    this.callback = func
  }
}

export class Model {
  constructor(sprite_map, x, y, width = 32, height = 32) {
    this.sprite_map = sprite_map
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }

  get data() {
    return [this.sprite_map.img, this.x, this.y, this.width, this.height]
  }
}