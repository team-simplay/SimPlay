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
  private lastRedraw = 0;
  private frameTime = 1000 / 15;
  constructor(
    private sourceEntity: DisplayEntity,
    private targetEntity: DisplayEntity,
    context: SimplayContext
  ) {
    this.graphic = new PIXI.Graphics();
    this.graphic.name = `${sourceEntity.container.name} -> ${targetEntity.container.name}`;
    this.context = context;
    this.redraw();
    this.context.interactionContainer.addChild(this.graphic);
    this.ticker = new PIXI.Ticker();
    this.ticker.add(() => this.redraw());
    this.ticker.speed = 1;
    this.ticker.start();
  }

  public destroy() {
    this.context.interactionContainer.removeChild(this.graphic);
    this.ticker.destroy();
    this.graphic.destroy();
  }

  redraw() {
    if (Date.now() - this.lastRedraw < this.frameTime) {
      return;
    }
    const interactionLineSegments = 11;
    this.graphic.clear();
    this.createGradientLine(
      this.sourceEntity.container.x +
        this.sourceEntity.animatedSprite.width / 2,
      this.sourceEntity.container.y +
        this.sourceEntity.animatedSprite.height / 2,
      this.targetEntity.container.x +
        this.targetEntity.animatedSprite.width / 2,
      this.targetEntity.container.y +
        this.targetEntity.animatedSprite.height / 2,
      interactionLineSegments,
      0x000000,
      0xffffff
    );
    this.lastRedraw = Date.now();
  }

  createStartingSegment(
    fromX: number,
    fromY: number,
    color1: number,
    color2: number
  ) {
    this.graphic.lineStyle(2, color2, 1);
    if (this.switch) {
      this.graphic.lineStyle(2, color1, 1);
    }
    this.graphic.moveTo(fromX, fromY);
    this.graphic.lineTo(fromX + this.offsetX, fromY + this.offsetY);
  }

  createInnerSegment(
    color1: number,
    color2: number,
    deltaX: number,
    deltaY: number,
    fromX: number,
    fromY: number,
    i: number
  ) {
    let color = i % 2 === 0 ? color1 : color2;
    if (this.switch) {
      color = i % 2 === 0 ? color2 : color1;
    }
    this.graphic.lineStyle(2, color, 1);
    this.graphic.moveTo(
      fromX + this.offsetX + deltaX * i,
      fromY + this.offsetY + deltaY * i
    );
    this.graphic.lineTo(
      this.offsetX + fromX + deltaX * (i + 1),
      this.offsetY + fromY + deltaY * (i + 1)
    );
  }

  createEndSegment(
    toX: number,
    toY: number,
    deltaX: number,
    deltaY: number,
    stops: number,
    color1: number,
    color2: number
  ) {
    if (
      Math.abs(this.offsetX) > Math.abs(deltaX) ||
      Math.abs(this.offsetY) > Math.abs(deltaY)
    ) {
      this.offsetX = 0;
      this.offsetY = 0;
      this.switch = !this.switch;
    }

    if (this.switch) {
      this.graphic.lineStyle(2, color2, 1);
    } else {
      this.graphic.lineStyle(2, color1, 1);
    }

    this.graphic.moveTo(
      toX - (deltaX - this.offsetX),
      toY - (deltaY - this.offsetY)
    );
    this.graphic.lineTo(toX, toY);
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
    const lineMovementSpeedFactor = 5;
    const deltaX = (toX - fromX) / stops;
    const deltaY = (toY - fromY) / stops;
    this.offsetX += deltaX / lineMovementSpeedFactor;
    this.offsetY += deltaY / lineMovementSpeedFactor;

    this.createStartingSegment(fromX, fromY, color1, color2);
    for (let i = 0; i < stops; i++) {
      this.createInnerSegment(color1, color2, deltaX, deltaY, fromX, fromY, i);
    }
    this.createEndSegment(toX, toY, deltaX, deltaY, stops, color1, color2);
  }
}
