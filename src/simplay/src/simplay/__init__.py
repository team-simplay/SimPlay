"""
The ``simplay`` module aggregates SimPlay's classes and
functions. It is the only module that is imported by default when importing
SimPlay.

The following tables list all of the available components in this module.

{toc}

"""

from pkgutil import extend_path
from typing import List, Tuple, Type

# from pkg_resources import get_distribution

from .core import (
    VisualComponent,
    VisualEnvironment,
    VisualizationManager,
)

from .components import (
    VisualProcess,
    VisualResource,
    VisualContainer,
    VisualPreemptiveResource,
    VisualPriorityResource,
    VisualStore,
    VisualFilterStore,
)

from .visualutil import (
    BasicVisualUtil,
    ResourceVisualUtil,
    ContainerVisualUtil,
    StoreVisualUtil,
)

from .primitives import (
    ComponentType,
    EventAction
)

from .visualization import VisualGrid

from .events import (
    VisualEvent,
    SetVisible,
    SetPosition,
    SetInteracting,
    SetNotInteracting,
    MoveNear,
    MoveNearCell,
    SetTintColor,
    SetSpriteFrame,
    SetDecoratingText,
    ResourceSetCapacity,
    ResourceSetUtilization,
    ContainerSetCapacity,
    ContainerSetLevel,
    StoreSetCapacity,
    StoreSetContent,
)

__all__ = [
    "VisualEnvironment",
    "VisualComponent",
    "VisualProcess",
    "VisualResource",
    "VisualContainer",
    "VisualPreemptiveResource",
    "VisualPriorityResource",
    "VisualStore",
    "VisualFilterStore",
    "BasicVisualUtil",
    "ResourceVisualUtil",
    "ContainerVisualUtil",
    "StoreVisualUtil",
    "VisualizationManager",
    "VisualGrid",
    "VisualEvent",
    "SetVisible",
    "SetPosition",
    "SetInteracting",
    "SetNotInteracting",
    "MoveNear",
    "MoveNearCell",
    "SetTintColor",
    "SetSpriteFrame",
    "SetDecoratingText",
    "ResourceSetCapacity",
    "ResourceSetUtilization",
    "ContainerSetCapacity",
    "ContainerSetLevel",
    "StoreSetCapacity",
    "StoreSetContent",
    "ComponentType",
    "EventAction",
]


def _compile_toc(
    entries: Tuple[Tuple[str, Tuple[Type, ...]], ...],
    section_marker: str = "=",
) -> str:
    toc = ""
    for section, objs in entries:
        toc += "\n\n"
        toc += f"{section}\n"
        toc += f"{section_marker * len(section)}\n\n"
        toc += ".. autosummary::\n\n"
        for obj in objs:
            toc += f"    ~{obj.__module__}.{obj.__name__}\n"
    return toc


_toc = (
    ("Core",
     (
         VisualEnvironment,
         VisualComponent,
         VisualizationManager,
     )
     ),
    (
        "Components",
        (
            VisualProcess,
            VisualResource,
            VisualContainer,
            VisualPreemptiveResource,
            VisualPriorityResource,
            VisualStore,
            VisualFilterStore,
        ),
    ),
    (
        "Visual Utilities",
        (
            BasicVisualUtil,
            ResourceVisualUtil,
            ContainerVisualUtil,
            StoreVisualUtil,
        ),
    ),
    (
        "Visualization",
        (VisualGrid,),
    ),
    (
        "Events",
        (
            VisualEvent,
            SetVisible,
            SetPosition,
            SetInteracting,
            SetNotInteracting,
            MoveNear,
            MoveNearCell,
            SetTintColor,
            SetSpriteFrame,
            SetDecoratingText,
            ResourceSetCapacity,
            ResourceSetUtilization,
            ContainerSetCapacity,
            ContainerSetLevel,
            StoreSetCapacity,
            StoreSetContent,
        )
    ),
    (
        "Primitives",
        (
            ComponentType,
            EventAction,
        )
    ),
)

if __doc__:
    __doc__ = __doc__.format(toc=_compile_toc(_toc))
    assert set(__all__) == {obj.__name__ for _, objs in _toc for obj in objs}

__path__: List[str] = list(extend_path(__path__, __name__))
# __version__: str = get_distribution(__name__).version
