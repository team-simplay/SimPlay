from typing import Any, Callable, Union
from simpy import (
    Resource,
    PreemptiveResource,
    PriorityResource,
    Container,
    Store,
    FilterStore,
)

from simpy.resources.resource import Request, Release, PriorityRequest
from simpy.resources.container import ContainerAmount, ContainerPut, ContainerGet
from simpy.resources.store import StoreGet, StorePut, FilterStoreGet
from .core import VisualEnvironment, VisualComponent
from .visualutil import ResourceVisualUtil, ContainerVisualUtil, StoreVisualUtil


class VisualProcess(VisualComponent):
    """
    Shorthand for creating an entity of type ``'PROCESS'``.

    :param env: The environment instance.
    :param id: The id of the component.
    :param graphic: The graphic of the component, either a 'simple' visual or a collection of sprites. Must be registered in the ``VisualizationManager``.
    :param tint: The tint of the component. This only works with visuals and sprites that have transparent pixels. The tint is applied to the pixels that are not transparent.
    """

    def __init__(self, env: VisualEnvironment, id: str, graphic: str, tint: int):
        super().__init__(env, id, "PROCESS", graphic, tint)


class VisualResource(VisualComponent, Resource):
    """
    Extends the :class:`~simpy.resources.resource.Resource` class with visualization.

    :param env: The environment instance.
    :param id: The id of the component.
    :param capacity: The capacity of the resource.
    :param graphic: The graphic of the component, either a 'simple' visual or a collection of sprites. Must be registered in the ``VisualizationManager``.
    :param tint: The tint of the component. This only works with visuals and sprites that have transparent pixels. The tint is applied to the pixels that are not transparent.
    """

    def __init__(
        self, env: VisualEnvironment, id: str, capacity: int, graphic: str, tint: int
    ):
        if not isinstance(capacity, int):
            raise ValueError("Capacity must be a positive integer.")
        if capacity <= 0:
            raise ValueError("Capacity must be a positive integer.")
        VisualComponent.__init__(self, env, id, "RESOURCE", graphic, tint)
        Resource.__init__(self, env, capacity)
        ResourceVisualUtil.set_capacity(self, capacity)
        ResourceVisualUtil.set_utilization(self, 0)

    def request(self) -> Request:
        req = super().request()
        ResourceVisualUtil.set_utilization(self, self.count)
        return req

    def release(self, request: Request) -> Release:
        rel = super().release(request)
        ResourceVisualUtil.set_utilization(self, self.count)
        return rel


class VisualPreemptiveResource(VisualComponent, PreemptiveResource):
    """
    Extends the :class:`~simpy.resources.resource.PreemptiveResource` class with visualization.

    :param env: The environment instance.
    :param id: The id of the component.
    :param capacity: The capacity of the resource.
    :param graphic: The graphic of the component, either a 'simple' visual or a collection of sprites. Must be registered in the ``VisualizationManager``.
    :param tint: The tint of the component. This only works with visuals and sprites that have transparent pixels. The tint is applied to the pixels that are not transparent.
    """

    def __init__(
        self, env: VisualEnvironment, id: str, capacity: int, graphic: str, tint: int
    ):
        VisualComponent.__init__(self, env, id, "RESOURCE", graphic, tint)
        PreemptiveResource.__init__(self, env, capacity)
        ResourceVisualUtil.set_capacity(self, capacity)
        ResourceVisualUtil.set_utilization(self, 0)

    def request(self, priority: int = 0, preempt: bool = True) -> PriorityRequest:
        req = super().request(priority, preempt)
        ResourceVisualUtil.set_utilization(self, self.count)
        return req

    def release(self, request: PriorityRequest) -> Release:
        rel = super().release(request)
        ResourceVisualUtil.set_utilization(self, self.count)
        return rel


class VisualPriorityResource(VisualComponent, PriorityResource):
    """
    Extends the :class:`~simpy.resources.resource.PriorityResource` class with visualization.

    :param env: The environment instance.
    :param id: The id of the component.
    :param capacity: The capacity of the resource.
    :param graphic: The graphic of the component, either a 'simple' visual or a collection of sprites. Must be registered in the ``VisualizationManager``.
    :param tint: The tint of the component. This only works with visuals and sprites that have transparent pixels. The tint is applied to the pixels that are not transparent.
    """

    def __init__(
        self, env: VisualEnvironment, id: str, capacity: int, graphic: str, tint: int
    ):
        VisualComponent.__init__(self, env, id, "RESOURCE", graphic, tint)
        PriorityResource.__init__(self, env, capacity)
        ResourceVisualUtil.set_capacity(self, capacity)
        ResourceVisualUtil.set_utilization(self, 0)

    def request(self, priority: int = 0, preempt: bool = True) -> PriorityRequest:
        req = super().request(priority, preempt)
        ResourceVisualUtil.set_utilization(self, self.count)
        return req

    def release(self, request: PriorityRequest) -> Release:
        rel = super().release(request)
        ResourceVisualUtil.set_utilization(self, self.count)
        return rel


class VisualContainer(VisualComponent, Container):
    """
    Extends the :class:`~simpy.resources.container.Container` class with visualization.

    :param env: The environment instance.
    :param id: The id of the component.
    :param capacity: The capacity of the container.
    :param init: The initial amount of the container.
    :param graphic: The graphic of the component, either a 'simple' visual or a collection of sprites. Must be registered in the ``VisualizationManager``.
    :param tint: The tint of the component. This only works with visuals and sprites that have transparent pixels. The tint is applied to the pixels that are not transparent.
    """

    def __init__(
        self,
        env: VisualEnvironment,
        id: str,
        graphic: str,
        tint: int,
        capacity: ContainerAmount = float("inf"),
        init: ContainerAmount = 0,
    ):
        if not isinstance(capacity, (int, float)):
            raise ValueError("Capacity must be a positive integer or float.")
        if capacity <= 0:
            raise ValueError("Capacity must be a positive integer or float.")
        VisualComponent.__init__(self, env, id, "CONTAINER", graphic, tint)
        Container.__init__(self, env, capacity, init)
        ContainerVisualUtil.set_capacity(self, capacity)
        ContainerVisualUtil.set_level(self, self.level)

    def put(self, amount: ContainerAmount) -> ContainerPut:
        put = super().put(amount)
        ContainerVisualUtil.set_level(self, self.level)
        return put

    def get(self, amount: ContainerAmount) -> ContainerGet:
        get = super().get(amount)
        ContainerVisualUtil.set_level(self, self.level)
        return get


class VisualStore(VisualComponent, Store):
    """
    Extends the :class:`~simpy.resources.store.Store` class with visualization.

    :param env: The environment instance.
    :param id: The id of the component.
    :param capacity: The capacity of the store.
    :param graphic: The graphic of the component, either a 'simple' visual or a collection of sprites. Must be registered in the ``VisualizationManager``.
    :param tint: The tint of the component. This only works with visuals and sprites that have transparent pixels. The tint is applied to the pixels that are not transparent.
    """

    def __init__(
        self,
        env: VisualEnvironment,
        id: str,
        graphic: str,
        tint: int,
        capacity: Union[float, int] = float("inf"),
    ):
        if not isinstance(capacity, (int, float)):
            raise ValueError("Capacity must be a positive integer or float.")
        if capacity <= 0:
            raise ValueError("Capacity must be a positive integer or float.")
        VisualComponent.__init__(self, env, id, "STORE", graphic, tint)
        Store.__init__(self, env, capacity)
        StoreVisualUtil.set_capacity(self, capacity)

    def put(self, item) -> StorePut:
        put = super().put(item)
        StoreVisualUtil.set_content(self, self.items)
        return put

    def get(self) -> StoreGet:
        get = super().get()
        StoreVisualUtil.set_content(self, self.items)
        return get


class VisualFilterStore(VisualComponent, FilterStore):
    """
    Extends the :class:`~simpy.resources.store.FilterStore` class with visualization.

    :param env: The environment instance.
    :param id: The id of the component.
    :param capacity: The capacity of the store.
    :param graphic: The graphic of the component, either a 'simple' visual or a collection of sprites. Must be registered in the ``VisualizationManager``.
    :param tint: The tint of the component. This only works with visuals and sprites that have transparent pixels. The tint is applied to the pixels that are not transparent.
    """

    def __init__(
        self, env: VisualEnvironment, id: str, capacity: int, graphic: str, tint: int
    ):
        VisualComponent.__init__(self, env, id, "STORE", graphic, tint)
        FilterStore.__init__(self, env, capacity)
        StoreVisualUtil.set_capacity(self, capacity)

    def put(self, item) -> StorePut:
        put = super().put(item)
        StoreVisualUtil.set_content(self, self.items)
        return put

    def get(self, filter: Callable[[Any], bool] = lambda item: True) -> FilterStoreGet:
        get = super().get(filter)
        StoreVisualUtil.set_content(self, self.items)
        return get
