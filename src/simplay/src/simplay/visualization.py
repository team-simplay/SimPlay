from typing import List
import jsons

from components import VisualComponent, VisualEnvironment
from events import VisualEvent


class VisualGrid:
    """
    This class represents a grid for the visualization.
    """

    def __init__(self, width: int, height: int, cols: int, rows: int):
        """
        :param width: The width of the grid in pixels.
        :param height: The height of the grid in pixels.
        :param cols: The number of columns in the grid.
        :param rows: The number of rows in the grid.
        """
        self.width = width
        self.height = height
        self.cols = cols
        self.rows = rows
        self.areas = []

    def set_area(
        self, id: str, name: str, height: int, width: int, x: int, y: int, color: int
    ):
        """
        Set an area in the grid.

        :param id: The id of the area.
        :param name: The name of the area.
        :param height: The height of the area in rows.
        :param width: The width of the area in columns.
        :param x: The x coordinate (column) of the top left corner of the area.
        :param y: The y coordinate (row) of the top left corner of the area.
        :param color: The color of the area.
        """
        self.areas.append(
            {
                "id": id,
                "name": name,
                "color": color,
                "gridDefinition": {"height": height, "width": width, "x": x, "y": y},
            }
        )


class VisualizationManager:
    """
    This class acts as a central point for all entities, visuals, sprites and events.
    """

    def __init__(self, env: VisualEnvironment):
        """
        :param env: The simulation environment that is visualized.
        """
        self.env = env
        """
        The simulation environment that is visualized.
        """
        self.events = []
        """
        The events that happened in the simulation.
        """
        self.entities = []
        """
        The entities which exist in the simulation.
        """
        self.visuals = []
        """
        The visuals that have been registered with the manager.
        """
        self.sprites = []
        """
        The sprites that have been registered with the manager.
        """
        self.grid = None
        """
        The grid that is used for the visualization.
        """

    def add_entity(self, entity: VisualComponent, type: str):
        """
        Add an entity to the visualization.

        :param entity: The entity to add.
        :param type: The type of the entity, one of ``'PROCESS'``, ``'RESOURCE'``, ``'CONTAINER'``, ``'STORE'``, ``'CUSTOM'``.
        """
        self.entities.append(
            {
                "id": entity.id,
                "type": type,
                "visual": entity.graphic,
                "tint": entity.tint,
            }
        )

    def add_event(self, event: VisualEvent):
        """
        Add an event to the visualization.

        :param event: The event to add.
        """
        self.events.append(event)
        self.events.sort(key=lambda x: x.timestamp)

    def register_visual(self, id: str, visual: str):
        """
        Register a visual with the manager.

        :param id: The id of the visual, it must be unique and can be used to reference the graphic in components.
        :param visual: The path to the visual.
        """
        self.visuals.append({"id": id, "visual": visual})

    def register_sprite(self, id: str, frames: List[str]):
        """
        Register a sprite with the manager.

        :param id: The id of the sprite, it must be unique and can be used to reference the graphic in components.
        :param frames: A list of paths to the frames of the sprite.
        """
        self.sprites.append({"id": id, "frames": frames})

    def set_grid(self, grid: VisualGrid):
        """
        Set the grid for the visualization.

        :param grid: The grid to use.
        """
        self.grid = grid

    def serialize(self) -> str:
        """
        Serialize the visualization to a JSON string.
        """
        return jsons.dumps(
            {
                "events": self.events,
                "entities": self.entities,
                "visuals": self.visuals,
                "sprites": self.sprites,
                "grid": self.grid,
            },
            strip_privates=True,
            key_transformer=jsons.KEY_TRANSFORMER_CAMELCASE,
        )

    def write_to_file(self, filename: str):
        """
        Write the visualization to a file.

        :param filename: The name of the file to write to.
        """
        with open(filename, "w") as f:
            f.write(self.serialize())
