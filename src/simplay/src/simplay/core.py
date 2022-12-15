import base64
from typing import List, Union
import jsons
import json
from simpy.core import SimTime, Environment
from simpy.resources.container import ContainerAmount

from .primitives import EventAction, ComponentType, ErrorText
from .visualization import VisualGrid
from .events import VisualEvent


class VisualEnvironment(Environment):
    """
    Extends the :class:`~simpy.core.Environment` class with visualization.
    """

    def __init__(self, initial_time: SimTime = 0):
        super().__init__(initial_time)
        self.visualization_manager = VisualizationManager()


class VisualComponent:
    """
    Base class for all visual components.

    :param env: The environment instance.
    :param id: The id of the component.
    :param type: The type of the component, one of
        :class:`~simplay.primitives.ComponentType`..
    :param visual: The visualization of the component, must be registered in
        the :class:`~simplay.core.VisualizationManager`.
    :param tint: The tint of the component. The tint is multiplied with the
        pixel value of each pixel. To use HEX values, write them as
        0xRRGGBB. For example: 0xFF0000 is red, 0x00FF00 is green,
        0x0000FF is blue.
        If the whole image is white, tinting it will change the color of the
        image. If the image is black, tinting it will have no effect.
        If no tint should be applied, set it to 0xFFFFFF.
    :raises TypeError: If the type is invalid.
    :raises TypeError: If the id is not a string.
    :raises TypeError: If the environment is not a
        :class:`~simplay.core.VisualEnvironment`.
    :raises TypeError: If the visual is not a string.
    :raises TypeError: If the tint is not an integer.
    """

    def __init__(
            self,
            env: VisualEnvironment,
            id: str,
            type: ComponentType,
            visual: str,
            tint: int):
        if not isinstance(type, ComponentType):
            raise TypeError(ErrorText.INVALID_COMPONENT_TYPE)
        if not isinstance(id, str):
            raise TypeError(ErrorText.ID_MUST_BE_STRING)
        if not isinstance(env, VisualEnvironment):
            raise TypeError(ErrorText.ENV_MUST_BE_VISUAL_ENVIRONMENT)
        if not isinstance(visual, str):
            raise TypeError(ErrorText.VISUAL_MUST_BE_STRING)
        if not isinstance(tint, int):
            raise TypeError(ErrorText.TINT_MUST_BE_INTEGER)
        self.env = env
        self.id = id
        self.type = type
        self.visual = visual
        self.tint = tint
        self.env.visualization_manager.add_entity(self, type)


class VisualizationManager:
    """
    This class acts as a central point for all entities, visuals and
    events.
    """

    def __init__(self):
        self.events = []
        """
        The events that happened in the simulation.
        """
        self.entities = []
        """
        The entities of the simulation.
        """
        self.visuals = []
        """
        The visuals that have been registered with the manager.
        """
        self.grid = None
        """
        The grid that is used for the visualization.
        """

    def add_entity(self, entity: VisualComponent, type: ComponentType):
        """
        Add an entity to the visualization.

        :param entity: The entity to add.
        :param type: The type of the entity, one of
            :class:`~simplay.primitives.ComponentType`.
        :raises TypeError: If the type is invalid.
        :raises TypeError: If the entity is not a
            :class:`~simplay.core.VisualComponent`.

        """
        if not isinstance(type, ComponentType):
            raise TypeError(ErrorText.INVALID_COMPONENT_TYPE)
        if not isinstance(entity, VisualComponent):
            raise TypeError(ErrorText.ENTITY_MUST_BE_VISUAL_COMPONENT)

        self.entities.append(
            {
                "id": entity.id,
                "type": type.value,
                "visual": entity.visual,
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

    def register_visual(self, id: str, path: str):
        """
        Register a visual with the manager.
        The visual is a sprite with a list of frames
        whose length is equal to one.

        :param id: The id of the visual, it must be unique and can be used to
            reference the visual in components.
        :param path: The path to the visual.
        :raises TypeError: If the id is not a string.
        :raises TypeError: If the path is not a string.
        :raises ValueError: If the id is not unique.
        :raises ValueError: If the path is empty.
        """
        self.register_sprites(id, [path])

    def __getBase64FromImg(self, path: str):
        """
        Get the base64 representation of an image.

        :param path: The path to the image.
        :return: The base64 representation of the image.
        """
        with open(path, "rb") as image_file:
            encoded_string = base64.b64encode(image_file.read())
            return f"data:image/png;base64,{encoded_string.decode('utf-8')}"

    def register_sprites(self, id: str, frames: List[str]):
        """
        Register sprites with the manager.

        :param id: The id of the visual, it must be unique and can be used to
            reference the visual in components.
        :param frames: A list of paths to the frames of the sprite.
        :raises TypeError: If the id is not a string.
        :raises TypeError: If the frames are not a list.
        :raises ValueError: If the id is not unique.
        :raises ValueError: If the frames are empty.
        """
        for s in self.visuals:
            if s["id"] == id:
                raise ValueError(ErrorText.ID_NOT_UNIQUE)
        if frames is None or len(frames) == 0:
            raise ValueError(ErrorText.FRAMES_MUST_NOT_BE_EMPTY)
        if not all(isinstance(f, str) for f in frames):
            raise TypeError(ErrorText.FRAMES_MUST_BE_LIST_OF_STRINGS)
        if not all(f is not None for f in frames):
            raise ValueError(ErrorText.FRAMES_MUST_NOT_BE_EMPTY)
        if not all(f != "" for f in frames):
            raise ValueError(ErrorText.FRAMES_MUST_NOT_BE_EMPTY)
        if not isinstance(id, str):
            raise TypeError(ErrorText.ID_MUST_BE_STRING)

        frames = [self.__getBase64FromImg(f) for f in frames]

        self.visuals.append({"id": id, "frames": frames})

    def set_grid(self, grid: VisualGrid):
        """
        Set the grid for the visualization.

        :param grid: The grid to use.
        :raises TypeError: If the grid is not a
            :class:`~simplay.visualization.VisualGrid`.
        :raises ValueError: If the grid is None.
        """
        if grid is None:
            raise ValueError(ErrorText.GRID_MUST_NOT_BE_NONE)
        if not isinstance(grid, VisualGrid):
            raise TypeError(ErrorText.GRID_MUST_BE_VISUAL_GRID)
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
                "grid": self.grid,
            },
            strip_privates=True,
            key_transformer=jsons.KEY_TRANSFORMER_CAMELCASE,
        )

    def serialize_for_jupyter(self) -> dict:
        """
        Serialize the visualization for use with Jupyter.
        """
        return json.loads(self.serialize())

    def write_to_file(self, filename: str):
        """
        Write the visualization to a file.

        :param filename: The name of the file to write to.
        """
        with open(filename, "w") as f:
            f.write(self.serialize())
