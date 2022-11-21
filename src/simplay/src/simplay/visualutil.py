from typing import Union
from .components import VisualComponent
from .events import (
    ContainerSetCapacity,
    ContainerSetLevel,
    MoveNear,
    MoveNearCell,
    ResourceSetCapacity,
    ResourceSetUtilization,
    SetDecoratingText,
    SetInteracting,
    SetNotInteracting,
    SetPosition,
    SetSpriteFrame,
    SetTintColor,
    SetVisible,
    StoreSetCapacity,
    StoreSetContent,
)
from .primitives import ErrorText

from simpy.resources.container import ContainerAmount


class BasicVisualUtil:
    """
    This class provides basic visual utilities for all components.
    """

    @staticmethod
    def set_visible(component: VisualComponent):
        """
        Adds an ``SetVisible`` event for the given component to the EventQueue,
        making it visible.

        :param component: The component to create the event for.
        :raises TypeError: If the component is not a
            :class:`~simplay.core.VisualComponent`.
        """
        if not isinstance(component, VisualComponent):
            raise TypeError(ErrorText.COMPONENT_MUST_BE_VISUAL_COMPONENT)
        component.env.visualization_manager.add_event(
            SetVisible(component.id, component.env.now, True)
        )

    @staticmethod
    def set_invisible(component: VisualComponent):
        """
        Adds an ``SetVisible`` event for the given component to the EventQueue,
        making it invisible.

        :param component: The component to create the event for.
        :raises TypeError: If the component is not a
            :class:`~simplay.core.VisualComponent`.
        """
        if not isinstance(component, VisualComponent):
            raise TypeError(ErrorText.COMPONENT_MUST_BE_VISUAL_COMPONENT)
        component.env.visualization_manager.add_event(
            SetVisible(component.id, component.env.now, False)
        )

    @staticmethod
    def set_position(component: VisualComponent, x: int, y: int):
        """
        Adds an ``SetPosition`` event for the given component to the
        EventQueue.

        :param component: The component to create the event for.
        :param x: The x coordinate of the component.
        :param y: The y coordinate of the component.
        :raises TypeError: If the component is not a
            :class:`~simplay.core.VisualComponent`.
        """
        if not isinstance(component, VisualComponent):
            raise TypeError(ErrorText.COMPONENT_MUST_BE_VISUAL_COMPONENT)
        component.env.visualization_manager.add_event(
            SetPosition(component.id, component.env.now, x, y)
        )

    @staticmethod
    def move_near(component: VisualComponent, target: VisualComponent):
        """
        Adds an ``MoveNear`` event for the given component to the EventQueue.

        :param component: The component to create the event for.
        :param target: The target component.
        :raises TypeError: If the target is not a
            :class:`~simplay.core.VisualComponent`.
        :raises TypeError: If the component is not a
            :class:`~simplay.core.VisualComponent`.
        """
        if not isinstance(component, VisualComponent):
            raise TypeError(ErrorText.COMPONENT_MUST_BE_VISUAL_COMPONENT)
        if not isinstance(target, VisualComponent):
            raise TypeError(ErrorText.TARGET_MUST_BE_VISUAL_COMPONENT)
        component.env.visualization_manager.add_event(
            MoveNear(component.id, component.env.now, target.id)
        )

    @staticmethod
    def move_near_cell(component: VisualComponent, x: int, y: int):
        """
        Adds an ``MoveNearCell`` event for the given component to the
        EventQueue.

        :param component: The component to create the event for.
        :param x: The x coordinate of the target cell.
        :param y: The y coordinate of the target cell.
        :raises TypeError: If the component is not a
            :class:`~simplay.core.VisualComponent`.
        """
        if not isinstance(component, VisualComponent):
            raise TypeError(ErrorText.COMPONENT_MUST_BE_VISUAL_COMPONENT)
        component.env.visualization_manager.add_event(
            MoveNearCell(component.id, component.env.now, x, y)
        )

    @staticmethod
    def set_interacting(component: VisualComponent, target: VisualComponent):
        """
        Adds an ``SetInteracting`` event for the given component to the
        EventQueue.

        :param component: The component to create the event for.
        :param target: The component the first component is interacting with.
        :raises TypeError: If the target is not a
            :class:`~simplay.core.VisualComponent`.
        :raises TypeError: If the component is not a
            :class:`~simplay.core.VisualComponent`.
        """
        if not isinstance(component, VisualComponent):
            raise TypeError(ErrorText.COMPONENT_MUST_BE_VISUAL_COMPONENT)
        if not isinstance(target, VisualComponent):
            raise TypeError(ErrorText.TARGET_MUST_BE_VISUAL_COMPONENT)
        component.env.visualization_manager.add_event(
            SetInteracting(component.id, component.env.now, target.id)
        )

    @staticmethod
    def set_not_interacting(
            component: VisualComponent,
            target: VisualComponent):
        """
        Adds an ``SetNotInteracting`` event for the given component to the
        EventQueue.

        :param component: The component to create the event for.
        :param target: The component the first component is not interacting
            with anymore.
        :raises TypeError: If the target is not a
            :class:`~simplay.core.VisualComponent`.
        :raises TypeError: If the component is not a
            :class:`~simplay.core.VisualComponent`.
        """
        if not isinstance(component, VisualComponent):
            raise TypeError(ErrorText.COMPONENT_MUST_BE_VISUAL_COMPONENT)
        if not isinstance(target, VisualComponent):
            raise TypeError(ErrorText.TARGET_MUST_BE_VISUAL_COMPONENT)
        component.env.visualization_manager.add_event(
            SetNotInteracting(component.id, component.env.now, target.id)
        )

    @staticmethod
    def set_tint_color(component: VisualComponent, color: int):
        """
        Adds an ``SetTintColor`` event for the given component to the
        EventQueue.

        :param component: The component to create the event for.
        :param color: The color to tint the component with, as an integer.
            To use HEX values, write them as 0xRRGGBB.
            For example: 0xFF0000 is red, 0x00FF00 is green, 0x0000FF is blue.
        :raises TypeError: If the component is not a
            :class:`~simplay.core.VisualComponent`.
        """
        if not isinstance(component, VisualComponent):
            raise TypeError(ErrorText.COMPONENT_MUST_BE_VISUAL_COMPONENT)
        component.env.visualization_manager.add_event(
            SetTintColor(component.id, component.env.now, color)
        )

    @staticmethod
    def reset_tint_color(component: VisualComponent):
        """
        Adds an ``SetTintColor`` event for the given component to the
        EventQueue, resetting the tint color to its initial value.

        :param component: The component to create the event for.
        :raises TypeError: If the component is not a
            :class:`~simplay.core.VisualComponent`.
        """
        if not isinstance(component, VisualComponent):
            raise TypeError(ErrorText.COMPONENT_MUST_BE_VISUAL_COMPONENT)
        component.env.visualization_manager.add_event(
            SetTintColor(component.id, component.env.now, component.tint)
        )

    @staticmethod
    def set_decorating_text(component: VisualComponent, text: str):
        """
        Adds an ``SetDecoratingText`` event for the given component to the
        EventQueue.

        :param component: The component to create the event for.
        :param text: The text to display.
        :raises TypeError: If the component is not a
            :class:`~simplay.core.VisualComponent`.
        """
        if not isinstance(component, VisualComponent):
            raise TypeError(ErrorText.COMPONENT_MUST_BE_VISUAL_COMPONENT)
        component.env.visualization_manager.add_event(
            SetDecoratingText(component.id, component.env.now, text)
        )

    @staticmethod
    def set_sprite_frame(component: VisualComponent, frame: int):
        """
        Adds an ``SetSpriteFrame`` event for the given component to the
        EventQueue.

        :param component: The component to create the event for.
        :param frame: The index of the frame to display.
        :raises TypeError: If the component is not a
            :class:`~simplay.core.VisualComponent`.
        """
        if not isinstance(component, VisualComponent):
            raise TypeError(ErrorText.COMPONENT_MUST_BE_VISUAL_COMPONENT)
        component.env.visualization_manager.add_event(
            SetSpriteFrame(component.id, component.env.now, frame)
        )


class ResourceVisualUtil:
    """
    This class provides visual utilities for resources.
    """

    @staticmethod
    def set_capacity(component: VisualComponent, capacity: int):
        """
        Adds an ``ResourceSetCapacity`` event for the given resource to the
        EventQueue.

        :param component: The component to create the event for.
        :param capacity: The capacity of the resource.
        :raises TypeError: If the component is not a
            :class:`~simplay.core.VisualComponent`.
        """
        if not isinstance(component, VisualComponent):
            raise TypeError(ErrorText.COMPONENT_MUST_BE_VISUAL_COMPONENT)
        component.env.visualization_manager.add_event(
            ResourceSetCapacity(component.id, component.env.now, capacity)
        )

    @staticmethod
    def set_utilization(component: VisualComponent, utilization: int):
        """
        Adds an ``ResourceSetUtilization`` event for the given resource to the
        EventQueue.

        :param component: The component to create the event for.
        :param utilization: The utilization of the resource.
        :raises TypeError: If the component is not a
            :class:`~simplay.core.VisualComponent`.
        """
        if not isinstance(component, VisualComponent):
            raise TypeError(ErrorText.COMPONENT_MUST_BE_VISUAL_COMPONENT)
        component.env.visualization_manager.add_event(
            ResourceSetUtilization(
                component.id, component.env.now, utilization))


class ContainerVisualUtil:
    """
    This class provides visual utilities for containers.
    """

    @staticmethod
    def set_capacity(component: VisualComponent, capacity: ContainerAmount):
        """
        Adds an ``ContainerSetCapacity`` event for the given container to the
        EventQueue.

        :param component: The component to create the event for.
        :param capacity: The capacity of the container.
        :raises TypeError: If the component is not a
            :class:`~simplay.core.VisualComponent`.
        """
        if not isinstance(component, VisualComponent):
            raise TypeError(ErrorText.COMPONENT_MUST_BE_VISUAL_COMPONENT)
        component.env.visualization_manager.add_event(
            ContainerSetCapacity(component.id, component.env.now, capacity)
        )

    @staticmethod
    def set_level(component: VisualComponent, level: ContainerAmount):
        """
        Adds an ``ContainerSetLevel`` event for the given container to the
        EventQueue.

        :param component: The component to create the event for.
        :param level: The level of the container.
        :raises TypeError: If the component is not a
            :class:`~simplay.core.VisualComponent`.
        """
        if not isinstance(component, VisualComponent):
            raise TypeError(ErrorText.COMPONENT_MUST_BE_VISUAL_COMPONENT)
        component.env.visualization_manager.add_event(
            ContainerSetLevel(component.id, component.env.now, level)
        )


class StoreVisualUtil:
    """
    This class provides visual utilities for stores.
    """

    @staticmethod
    def set_capacity(component: VisualComponent, capacity: Union[float, int]):
        """
        Adds an ``StoreSetCapacity`` event for the given store to the
        EventQueue.

        :param component: The component to create the event for.
        :param capacity: The capacity of the store.
        :raises TypeError: If the component is not a
            :class:`~simplay.core.VisualComponent`.
        """
        if not isinstance(component, VisualComponent):
            raise TypeError(ErrorText.COMPONENT_MUST_BE_VISUAL_COMPONENT)
        component.env.visualization_manager.add_event(
            StoreSetCapacity(component.id, component.env.now, capacity)
        )

    @staticmethod
    def set_content(component: VisualComponent, content):
        """
        Adds an ``StoreSetContent`` event for the given store to the
        EventQueue.

        :param component: The component to create the event for.
        :param content: The content of the store.
        :raises TypeError: If the component is not a
            :class:`~simplay.core.VisualComponent`.
        """
        if not isinstance(component, VisualComponent):
            raise TypeError(ErrorText.COMPONENT_MUST_BE_VISUAL_COMPONENT)
        component.env.visualization_manager.add_event(
            StoreSetContent(component.id, component.env.now, content)
        )
