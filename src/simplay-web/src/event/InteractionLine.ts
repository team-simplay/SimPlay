import { DisplayEntity } from '../Entity';
import * as PIXI from 'pixi.js';
import { SimplayContext } from '../SimplayContext';

export class InteractionLine {
  public readonly graphic: PIXI.Graphics;
  private context: SimplayContext;
  private offsetX = 0;
  private offsetY = 0;
  private switch = false;
  private ticker: PIXI.Ticker;
  constructor(
    private sourceEntity: DisplayEntity,
    private targetEntity: DisplayEntity,
    context: SimplayContext
  ) {
    this.graphic = new PIXI.Graphics();
    this.graphic.name = `${sourceEntity.container.name} -> ${targetEntity.container.name}`;
    this.context = context;
    this.redraw();
    this.ticker = this.context.app.ticker.add(() => {
      this.redraw();
    });
    this.context.interactionContainer.addChild(this.graphic);
  }

  public destroy() {
    this.context.interactionContainer.removeChild(this.graphic);
    this.ticker.destroy();
    this.graphic.destroy();
  }

  redraw() {
    this.graphic.clear();
    this.createGradientLine(
      this.sourceEntity.container.x + this.sourceEntity.container.width / 2,
      this.sourceEntity.container.y + this.sourceEntity.container.height / 2,
      this.targetEntity.container.x + this.targetEntity.container.width / 2,
      this.targetEntity.container.y + this.targetEntity.container.height / 2,
      21,
      0x000000,
      0xffffff
    );
  }

  createGradientLine(
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    stops: number,
    color1: number,
    color2: number
  ) {
    const deltaX = (toX - fromX) / stops;
    const deltaY = (toY - fromY) / stops;
    this.offsetX += deltaX / 50;
    this.offsetY += deltaY / 50;
    this.graphic.lineStyle(2, color2, 0.8);
    if (this.switch) {
      this.graphic.lineStyle(2, color1, 0.8);
    }
    this.graphic.moveTo(fromX, fromY);
    this.graphic.lineTo(this.offsetX + fromX, this.offsetY + fromY);
    for (let i = 0; i < stops - 1; i++) {
      let color = i % 2 === 0 ? color1 : color2;
      if (this.switch) {
        color = i % 2 === 0 ? color2 : color1;
      }
      this.graphic.lineStyle(2, color, 0.8);
      this.graphic.moveTo(
        this.offsetX + fromX + deltaX * i,
        +this.offsetY + fromY + deltaY * i
      );
      this.graphic.lineTo(
        this.offsetX + fromX + deltaX * (i + 1),
        this.offsetY + fromY + deltaY * (i + 1)
      );
    }
    if (this.offsetX > deltaX || this.offsetY > deltaY) {
      this.offsetX = 0;
      this.offsetY = 0;
      this.switch = !this.switch;
    }

    if (stops % 2 === 0 || this.switch) {
      this.graphic.lineStyle(2, color2, 0.8);
    } else {
      this.graphic.lineStyle(2, color1, 0.8);
    }

    this.graphic.moveTo(
      toX - (deltaX - this.offsetX),
      toY - (deltaY - this.offsetY)
    );
    this.graphic.lineTo(toX, toY);
  }
}
