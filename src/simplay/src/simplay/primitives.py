from enum import Enum


class ComponentType(Enum):
    """Enum for component types."""
    PROCESS = "PROCESS"
    RESOURCE = "RESOURCE"
    CONTAINER = "CONTAINER"
    STORE = "STORE"
    CUSTOM = "CUSTOM"


class ErrorText:
    INVALID_COMPONENT_TYPE = "Invalid component type."
    ID_MUST_BE_STRING = "Id must be a string."
    ENV_MUST_BE_VISUAL_ENVIRONMENT = "Env must be of type VisualEnvironment."
    VISUAL_MUST_BE_STRING = "Visual must be a string."
    TINT_MUST_BE_INTEGER = "Tint must be an integer."
    ENTITY_MUST_BE_VISUAL_COMPONENT = "Entity must be of type VisualComponent."
    COMPONENT_MUST_BE_VISUAL_COMPONENT = "Component must be of type VisualComponent."  # noqa
    TARGET_MUST_BE_VISUAL_COMPONENT = "Target must be of type VisualComponent."
    CAPACITY_MUST_BE_POSITIVE_INT = "Capacity must be a positive integer."
    CAPACITY_MUST_BE_POSITIVE_INT_OR_FLOAT = "Capacity must be a positive integer or float."  # noqa
    FORID_MUST_BE_STRING = "for_id must be a string."
    TIMESTAMP_MUST_BE_INT_OR_FLOAT = "Timestamp must be an integer or float."
    ACTION_MUST_BE_EVENTACTION = "Action must be a EventAction."
    VISIBLE_MUST_BE_BOOL = "Visible must be a boolean."
    X_MUST_BE_INT = "x must be an integer."
    X_OUT_OF_BOUNDS = "x must be between 0 and cols"
    X_OFFSET_OUT_OF_BOUNDS = "x added to width must be less than or equal to cols"  # noqa
    Y_MUST_BE_INT = "y must be an integer."
    Y_OUT_OF_BOUNDS = "y must be between 0 and rows"
    Y_OFFSET_OUT_OF_BOUNDS = "y added to height must be less than or equal to rows"  # noqa
    WITHID_MUST_BE_STRING = "with_id must be a string."
    TARGETID_MUST_BE_STRING = "target_id must be a string."
    COLOR_MUST_BE_INT = "Color must be an integer."
    TEXT_MUST_BE_STRING = "Text must be a string."
    FRAME_MUST_BE_INT = "Frame must be an integer."
    UTILIZATION_MUST_BE_INT = "Utilization must be a integer."
    LEVEL_MUST_BE_POSITIVE_INT_OR_FLOAT = "Level must be a positive integer or float."  # noqa
    ID_NOT_UNIQUE = "Id must be unique."
    PATH_EMPTY = "Path must not be None / empty."
    PATH_MUST_BE_STRING = "Path must be a string."
    FRAMES_MUST_BE_LIST_OF_STRINGS = "Frames must be a list of strings."
    FRAMES_MUST_NOT_BE_EMPTY = "Frames must not be empty."
    GRID_MUST_NOT_BE_NONE = "Grid must not be None."
    GRID_MUST_BE_VISUAL_GRID = "Grid must be of type VisualGrid."
    NAME_MUST_BE_STRING = "Name must be a string."
    HEIGHT_MUST_BE_POSITIVE_INT = "Height must be a positive integer."
    WIDTH_MUST_BE_POSITIVE_INT = "Width must be a positive integer."
    AREA_OVERLAP = "Area must not overlap with other areas."


class EventAction(Enum):
    """Enum for event actions."""
    SET_VISIBLE = "SET_VISIBLE"
    SET_POSITION = "SET_POSITION"
    SET_INTERACTING = "SET_INTERACTING"
    SET_NOT_INTERACTING = "SET_NOT_INTERACTING"
    MOVE_NEAR = "MOVE_NEAR"
    MOVE_NEAR_CELL = "MOVE_NEAR_CELL"
    SET_TINT_COLOR = "SET_TINT_COLOR"
    SET_DECORATING_TEXT = "SET_DECORATING_TEXT"
    SET_SPRITE_FRAME = "SET_SPRITE_FRAME"
    RESOURCE_SET_CAPACITY = "RESOURCE.SET_CAPACITY"
    RESOURCE_SET_UTILIZATION = "RESOURCE.SET_UTILIZATION"
    CONTAINER_SET_CAPACITY = "CONTAINER.SET_CAPACITY"
    STORE_SET_CONTENT = "STORE.SET_CONTENT"
    STORE_SET_CAPACITY = "STORE.SET_CAPACITY"
    CONTAINER_SET_LEVEL = "CONTAINER.SET_LEVEL"
