import { create } from './Grid';

export interface SimplayGrid {
  areas: Area[];
  cols: number;
  rows: number;
}

export interface Area {
  id: string;
  name: string;
  color: number;
  gridDefinition: {
    width: number; // in colums
    height: number; // in rows
    x: number;
    y: number;
  };
}

export interface EventUnserialized {
  action:
    | 'log'
    | 'system'
    | 'setDecoratingText'
    | 'setPosition'
    | 'setVisible'
    | 'setRemoveInteracting'
    | 'setCreateInteracting'
    | 'setNotInteracting'
    | 'moveNear'
    | 'moveNearPoint'
    | 'container.setLevel'
    | 'resource.setUtilization'; // TODO what else should be available?
  args: Args;
  forId: string;
  timestamp: number;
}

export interface Event {
  forId: string;
  timestamp: number;
}

export interface PositioningEvent extends Event {
  x: number;
  y: number;
}

export interface LogEvent extends Event {
  text: string;
}

export interface VisibilityEvent extends Event {
  visible: boolean;
}
export interface DecoratingTextEvent extends Event {
  text: string;
}
export interface CreateInteractionEvent extends Event {
  withId: string;
}
export interface RemoveInteractionEvent extends Event {
  withId: string;
}
export interface MoveNearEvent extends Event {
  targetId: string;
}
export interface MoveNearPointEvent extends Event {
  x: number;
  y: number;
}
export interface ContainerGetEvent extends Event {
  amount: number;
}
export interface ContainerLevelEvent extends Event {
  level: number;
}
export interface ResourceUtilizationEvent extends Event {
  capacity: number;
  usage: number;
}

export interface Args {
  x?: number;
  y?: number;
  target?: string;
  withId?: string;
  amount?: number;
  visible?: boolean;
  text?: string;
}

export interface SimulationData {
  events: EventUnserialized[];
  grid: SimplayGrid;
  entities: Entity[];
  visuals: Visual[];
}

interface Visual {
  id: string;
  visual: string;
}

interface Entity {
  id: string;
  type: string;
  visual: string;
  tint: number;
}

export class SimulationSpooler {
  private DOMContainer: HTMLElement;
  private simulationData: SimulationData;

  constructor(simulationData: SimulationData, container: HTMLElement) {
    this.simulationData = simulationData;
    this.DOMContainer = container;
    create(simulationData.grid, container);
  }

  run(speedFactor = 1) {
    throw Error('TODO implement');
  }

  pause() {
    throw Error('TODO implement');
  }

  continue() {
    throw Error('TODO implement');
  }

  skipTo() {
    throw Error('TODO implement');
  }

  reset() {
    throw Error('TODO implement');
  }

  setSpeedFactor() {
    throw Error('TODO implement');
  }

  increaseSpeed(increaseBy: number) {
    throw Error('TODO implement');
  }

  decreaseSpeed(decreaseBy: number) {
    throw Error('TODO implement');
  }
}
