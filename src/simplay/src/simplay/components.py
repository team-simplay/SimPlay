from typing import Any, Callable, Union

from simpy import (Container, FilterStore, PreemptiveResource,
                   PriorityResource, Resource, Store)
from simpy.resources.container import (ContainerAmount, ContainerGet,
                                       ContainerPut)
from simpy.resources.resource import PriorityRequest, Release, Request
from simpy.resources.store import FilterStoreGet, StoreGet, StorePut

from .events import (ContainerSetCapacity, ContainerSetLevel,
                     ResourceSetCapacity, ResourceSetUtilization,
                     StoreSetCapacity, StoreSetContent)

from .core import VisualComponent, VisualEnvironment
from .primitives import ComponentType, ErrorText


class VisualProcess(VisualComponent):
    """
    Shorthand for creating an entity of type
    :class:`~simplay.primitives.ComponentType.PROCESS`.

    :param env: The environment instance.
    :param id: The id of the component.
    :param visual: The visualization of the component, must be registered in
        the :class:`~simplay.core.VisualizationManager`.
    :param tint: The tint of the component. The tint is multiplied with the
        pixel value of each pixel. To use HEX values, write them as
        0xRRGGBB. For example: 0xFF0000 is red, 0x00FF00 is green,
        0x0000FF is blue.
        If the whole image is white, tinting it will change the color of the
        image. If the image is black, tinting it will have no effect.
        If no tint should be applied, set it to 0xFFFFFF, which is the default
        value.
    """

    def __init__(
            self,
            env: VisualEnvironment,
            id: str,
            visual: str,
            tint: int = 0xFFFFFF):
        super().__init__(env, id, ComponentType.PROCESS, visual, tint)


class VisualResourceBase(VisualComponent):
    """
    Base class for all resources.

    :param env: The environment instance.
    :param id: The id of the component.
    :param visual: The visualization of the component, must be registered in
        the :class:`~simplay.core.VisualizationManager`.
    :param tint: The tint of the component. The tint is multiplied with the
        pixel value of each pixel. To use HEX values, write them as
        0xRRGGBB. For example: 0xFF0000 is red, 0x00FF00 is green,
        0x0000FF is blue.
        If the whole image is white, tinting it will change the color of the
        image. If the image is black, tinting it will have no effect.
        If no tint should be applied, set it to 0xFFFFFF, which is the default
        value.
    """

    def __init__(
            self,
            env: VisualEnvironment,
            id: str,
            visual: str,
            tint: int = 0xFFFFFF):
        super().__init__(env, id, ComponentType.RESOURCE, visual, tint)

    def has_capacity(self, capacity: int):
        """
        Adds an ``ResourceSetCapacity`` event for the given resource to the
        EventQueue.

        :param capacity: The capacity of the resource.
        """
        self.visualization_manager.add_event(
            ResourceSetCapacity(self.id, self.env.now, capacity)
        )

    def has_utilization(self, utilization: int):
        """
        Adds an ``ResourceSetUtilization`` event for the given resource to the
        EventQueue.

        :param utilization: The utilization of the resource.
        """
        self.visualization_manager.add_event(
            ResourceSetUtilization(
                self.id, self.env.now, utilization))


class VisualResource(VisualResourceBase, Resource):
    """
    Extends the :class:`~simpy.resources.resource.Resource` class with
     visualization.

    :param env: The environment instance.
    :param id: The id of the component.
    :param capacity: The capacity of the resource.
    :param visual: The visualization of the component, must be registered in
        the :class:`~simplay.core.VisualizationManager`.
    :param tint: The tint of the component. The tint is multiplied with the
        pixel value of each pixel. To use HEX values, write them as
        0xRRGGBB. For example: 0xFF0000 is red, 0x00FF00 is green,
        0x0000FF is blue.
        If the whole image is white, tinting it will change the color of the
        image. If the image is black, tinting it will have no effect.
        If no tint should be applied, set it to 0xFFFFFF, which is the default
        value.
    :raises ValueError: If the capacity is not a positive integer.
    :raises TypeError: If the capacity is not a integer.
    """

    def __init__(
            self,
            env: VisualEnvironment,
            id: str,
            capacity: int,
            visual: str,
            tint: int = 0xFFFFFF):
        if not isinstance(capacity, int):
            raise TypeError(ErrorText.CAPACITY_MUST_BE_POSITIVE_INT)
        if capacity <= 0:
            raise ValueError(ErrorText.CAPACITY_MUST_BE_POSITIVE_INT)
        VisualResourceBase.__init__(
            self, env, id, visual, tint)
        Resource.__init__(self, env, capacity)
        self.has_capacity(capacity)
        self.has_utilization(0)

    def request(self) -> Request:
        req = super().request()
        self.has_utilization(self.count)
        return req

    def release(self, request: Request) -> Release:
        rel = super().release(request)
        self.has_utilization(self.count)
        return rel


class VisualPreemptiveResource(VisualResourceBase, PreemptiveResource):
    """
    Extends the :class:`~simpy.resources.resource.PreemptiveResource` class
     with visualization.

    :param env: The environment instance.
    :param id: The id of the component.
    :param capacity: The capacity of the resource.
    :param visual: The visualization of the component, must be registered in
        the :class:`~simplay.core.VisualizationManager`.
    :param tint: The tint of the component. The tint is multiplied with the
        pixel value of each pixel. To use HEX values, write them as
        0xRRGGBB. For example: 0xFF0000 is red, 0x00FF00 is green,
        0x0000FF is blue.
        If the whole image is white, tinting it will change the color of the
        image. If the image is black, tinting it will have no effect.
        If no tint should be applied, set it to 0xFFFFFF, which is the default
        value.
    :raises TypeError: If the capacity is not a integer.
    :raises ValueError: If the capacity is not a positive integer.
    """

    def __init__(
            self,
            env: VisualEnvironment,
            id: str,
            capacity: int,
            visual: str,
            tint: int = 0xFFFFFF):
        if not isinstance(capacity, int):
            raise TypeError(ErrorText.CAPACITY_MUST_BE_POSITIVE_INT)
        if capacity <= 0:
            raise ValueError(ErrorText.CAPACITY_MUST_BE_POSITIVE_INT)
        VisualResourceBase.__init__(
            self, env, id, visual, tint)
        PreemptiveResource.__init__(self, env, capacity)
        self.has_capacity(capacity)
        self.has_utilization(0)

    def request(
            self,
            priority: int = 0,
            preempt: bool = True) -> PriorityRequest:
        req = super().request(priority, preempt)
        self.has_utilization(self.count)
        return req

    def release(self, request: PriorityRequest) -> Release:
        rel = super().release(request)
        self.has_utilization(self.count)
        return rel


class VisualPriorityResource(VisualResourceBase, PriorityResource):
    """
    Extends the :class:`~simpy.resources.resource.PriorityResource` class with
     visualization.

    :param env: The environment instance.
    :param id: The id of the component.
    :param capacity: The capacity of the resource.
    :param visual: The visualization of the component, must be registered in
        the :class:`~simplay.core.VisualizationManager`.
    :param tint: The tint of the component. The tint is multiplied with the
        pixel value of each pixel. To use HEX values, write them as
        0xRRGGBB. For example: 0xFF0000 is red, 0x00FF00 is green,
        0x0000FF is blue.
        If the whole image is white, tinting it will change the color of the
        image. If the image is black, tinting it will have no effect.
        If no tint should be applied, set it to 0xFFFFFF, which is the default
        value.
    :raises TypeError: If the capacity is not a integer.
    :raises ValueError: If the capacity is not a positive integer.
    """

    def __init__(
            self,
            env: VisualEnvironment,
            id: str,
            capacity: int,
            visual: str,
            tint: int = 0xFFFFFF):
        if not isinstance(capacity, int):
            raise TypeError(ErrorText.CAPACITY_MUST_BE_POSITIVE_INT)
        if capacity <= 0:
            raise ValueError(ErrorText.CAPACITY_MUST_BE_POSITIVE_INT)
        VisualResourceBase.__init__(self, env, id, visual, tint)
        PriorityResource.__init__(self, env, capacity)
        self.has_capacity(capacity)
        self.has_utilization(0)

    def request(
            self,
            priority: int = 0,
            preempt: bool = True) -> PriorityRequest:
        req = super().request(priority, preempt)
        self.has_utilization(self.count)
        return req

    def release(self, request: PriorityRequest) -> Release:
        rel = super().release(request)
        self.has_utilization(self.count)
        return rel


class VisualContainer(VisualComponent, Container):
    """
    Extends the :class:`~simpy.resources.container.Container` class with
     visualization.

    :param env: The environment instance.
    :param id: The id of the component.
    :param capacity: The capacity of the container.
    :param init: The initial amount of the container.
    :param visual: The visualization of the component, must be registered in
        the :class:`~simplay.core.VisualizationManager`.
    :param tint: The tint of the component. The tint is multiplied with the
        pixel value of each pixel. To use HEX values, write them as
        0xRRGGBB. For example: 0xFF0000 is red, 0x00FF00 is green,
        0x0000FF is blue.
        If the whole image is white, tinting it will change the color of the
        image. If the image is black, tinting it will have no effect.
        If no tint should be applied, set it to 0xFFFFFF, which is the default
        value.
    :raises TypeError: If the capacity is not a integer or float.
    :raises ValueError: If the capacity is not a positive integer or float.
    """

    def __init__(
        self,
        env: VisualEnvironment,
        id: str,
        visual: str,
        tint: int = 0xFFFFFF,
        capacity: ContainerAmount = float("inf"),
        init: ContainerAmount = 0,
    ):
        if not isinstance(capacity, (int, float)):
            raise TypeError(ErrorText.CAPACITY_MUST_BE_POSITIVE_INT_OR_FLOAT)
        if capacity <= 0:
            raise ValueError(ErrorText.CAPACITY_MUST_BE_POSITIVE_INT_OR_FLOAT)
        VisualComponent.__init__(
            self, env, id, ComponentType.CONTAINER, visual, tint)
        Container.__init__(self, env, capacity, init)
        self.has_capacity(capacity)
        self.has_level(self.level)

    def has_capacity(self, capacity: ContainerAmount):
        """
        Adds an ``ContainerSetCapacity`` event for the given container to the
        EventQueue.

        :param capacity: The capacity of the container.
        """
        self.visualization_manager.add_event(
            ContainerSetCapacity(self.id, self.env.now, capacity)
        )

    def has_level(self, level: ContainerAmount):
        """
        Adds an ``ContainerSetLevel`` event for the given container to the
        EventQueue.

        :param level: The level of the container.
        """
        self.visualization_manager.add_event(
            ContainerSetLevel(self.id, self.env.now, level)
        )

    def put(self, amount: ContainerAmount) -> ContainerPut:
        put = super().put(amount)
        self.has_level(self.level)
        return put

    def get(self, amount: ContainerAmount) -> ContainerGet:
        get = super().get(amount)
        self.has_level(self.level)
        return get


class VisualStoreBase(VisualComponent):
    """
    Base class for all store classes.

    :param env: The environment instance.
    :param id: The id of the component.
    :param visual: The visualization of the component, must be registered in
        the :class:`~simplay.core.VisualizationManager`.
    :param tint: The tint of the component. The tint is multiplied with the
        pixel value of each pixel. To use HEX values, write them as
        0xRRGGBB. For example: 0xFF0000 is red, 0x00FF00 is green,
        0x0000FF is blue.
        If the whole image is white, tinting it will change the color of the
        image. If the image is black, tinting it will have no effect.
        If no tint should be applied, set it to 0xFFFFFF, which is the default
        value.
    """

    def __init__(self, env: VisualEnvironment, id: str,
                 visual: str, tint: int = 0xFFFFFF):
        VisualComponent.__init__(
            self, env, id, ComponentType.STORE, visual, tint)

    def has_capacity(self, capacity: Union[float, int]):
        """
        Adds an ``StoreSetCapacity`` event for the given store to the
        EventQueue.

        :param capacity: The capacity of the store.
        """
        self.visualization_manager.add_event(
            StoreSetCapacity(self.id, self.env.now, capacity)
        )

    def has_content(self, content):
        """
        Adds an ``StoreSetContent`` event for the given store to the
        EventQueue.

        :param content: The content of the store.
        """
        self.visualization_manager.add_event(
            StoreSetContent(self.id, self.env.now, content)
        )


class VisualStore(VisualStoreBase, Store):
    """
    Extends the :class:`~simpy.resources.store.Store` class with visualization.

    :param env: The environment instance.
    :param id: The id of the component.
    :param capacity: The capacity of the store.
    :param visual: The visualization of the component, must be registered in
        the :class:`~simplay.core.VisualizationManager`.
    :param tint: The tint of the component. The tint is multiplied with the
        pixel value of each pixel. To use HEX values, write them as
        0xRRGGBB. For example: 0xFF0000 is red, 0x00FF00 is green,
        0x0000FF is blue.
        If the whole image is white, tinting it will change the color of the
        image. If the image is black, tinting it will have no effect.
        If no tint should be applied, set it to 0xFFFFFF, which is the default
        value.
    :raises TypeError: If the capacity is not a integer or float.
    :raises ValueError: If the capacity is not a positive integer or float.
    """

    def __init__(
        self,
        env: VisualEnvironment,
        id: str,
        visual: str,
        tint: int = 0xFFFFFF,
        capacity: Union[float, int] = float("inf"),
    ):
        if not isinstance(capacity, (int, float)):
            raise TypeError(
                ErrorText.CAPACITY_MUST_BE_POSITIVE_INT_OR_FLOAT)
        if capacity <= 0:
            raise ValueError(
                ErrorText.CAPACITY_MUST_BE_POSITIVE_INT_OR_FLOAT)
        VisualStoreBase.__init__(
            self, env, id, visual, tint)
        Store.__init__(self, env, capacity)
        self.has_capacity(capacity)

    def put(self, item) -> StorePut:
        put = super().put(item)
        self.has_content(self.items)
        return put

    def get(self) -> StoreGet:
        get = super().get()
        self.has_content(self.items)
        return get


class VisualFilterStore(VisualStoreBase, FilterStore):
    """
    Extends the :class:`~simpy.resources.store.FilterStore` class with
     visualization.

    :param env: The environment instance.
    :param id: The id of the component.
    :param capacity: The capacity of the store.
    :param visual: The visualization of the component, must be registered in
        the :class:`~simplay.core.VisualizationManager`.
    :param tint: The tint of the component. The tint is multiplied with the
        pixel value of each pixel. To use HEX values, write them as
        0xRRGGBB. For example: 0xFF0000 is red, 0x00FF00 is green,
        0x0000FF is blue.
        If the whole image is white, tinting it will change the color of the
        image. If the image is black, tinting it will have no effect.
        If no tint should be applied, set it to 0xFFFFFF, which is the default
        value.
    :raises TypeError: If the capacity is not a integer or float.
    :raises ValueError: If the capacity is not a positive integer or float.
    """

    def __init__(
            self,
            env: VisualEnvironment,
            id: str,
            capacity: int,
            visual: str,
            tint: int = 0xFFFFFF):
        if not isinstance(capacity, (int, float)):
            raise TypeError(ErrorText.CAPACITY_MUST_BE_POSITIVE_INT_OR_FLOAT)
        if capacity <= 0:
            raise ValueError(ErrorText.CAPACITY_MUST_BE_POSITIVE_INT_OR_FLOAT)
        VisualStoreBase.__init__(
            self, env, id, visual, tint)
        FilterStore.__init__(self, env, capacity)
        self.has_capacity(capacity)

    def put(self, item) -> StorePut:
        put = super().put(item)
        self.has_content(self.items)
        return put

    def get(self, filter: Callable[[Any], bool]
            = lambda item: True) -> FilterStoreGet:
        get = super().get(filter)
        self.has_content(self.items)
        return get
