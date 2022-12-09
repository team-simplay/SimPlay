from typing import Any, Callable, Union

from simpy import (Container, FilterStore, PreemptiveResource,
                   PriorityResource, Resource, Store)
from simpy.resources.container import (ContainerAmount, ContainerGet,
                                       ContainerPut)
from simpy.resources.resource import PriorityRequest, Release, Request
from simpy.resources.store import FilterStoreGet, StoreGet, StorePut

from .core import VisualComponent, VisualEnvironment
from .visualutil import (ContainerVisualUtil, ResourceVisualUtil,
                         StoreVisualUtil)
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
        If no tint should be applied, set it to 0xFFFFFF.
    """

    def __init__(
            self,
            env: VisualEnvironment,
            id: str,
            visual: str,
            tint: int):
        super().__init__(env, id, ComponentType.PROCESS, visual, tint)


class VisualResource(VisualComponent, Resource):
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
        If no tint should be applied, set it to 0xFFFFFF.
    :raises ValueError: If the capacity is not a positive integer.
    :raises TypeError: If the capacity is not a integer.
    """

    def __init__(
            self,
            env: VisualEnvironment,
            id: str,
            capacity: int,
            visual: str,
            tint: int):
        if not isinstance(capacity, int):
            raise TypeError(ErrorText.CAPACITY_MUST_BE_POSITIVE_INT)
        if capacity <= 0:
            raise ValueError(ErrorText.CAPACITY_MUST_BE_POSITIVE_INT)
        VisualComponent.__init__(
            self, env, id, ComponentType.RESOURCE, visual, tint)
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
        If no tint should be applied, set it to 0xFFFFFF.
    :raises TypeError: If the capacity is not a integer.
    :raises ValueError: If the capacity is not a positive integer.
    """

    def __init__(
            self,
            env: VisualEnvironment,
            id: str,
            capacity: int,
            visual: str,
            tint: int):
        if not isinstance(capacity, int):
            raise TypeError(ErrorText.CAPACITY_MUST_BE_POSITIVE_INT)
        if capacity <= 0:
            raise ValueError(ErrorText.CAPACITY_MUST_BE_POSITIVE_INT)
        VisualComponent.__init__(
            self, env, id, ComponentType.RESOURCE, visual, tint)
        PreemptiveResource.__init__(self, env, capacity)
        ResourceVisualUtil.set_capacity(self, capacity)
        ResourceVisualUtil.set_utilization(self, 0)

    def request(
            self,
            priority: int = 0,
            preempt: bool = True) -> PriorityRequest:
        req = super().request(priority, preempt)
        ResourceVisualUtil.set_utilization(self, self.count)
        return req

    def release(self, request: PriorityRequest) -> Release:
        rel = super().release(request)
        ResourceVisualUtil.set_utilization(self, self.count)
        return rel


class VisualPriorityResource(VisualComponent, PriorityResource):
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
        If no tint should be applied, set it to 0xFFFFFF.
    :raises TypeError: If the capacity is not a integer.
    :raises ValueError: If the capacity is not a positive integer.
    """

    def __init__(
            self,
            env: VisualEnvironment,
            id: str,
            capacity: int,
            visual: str,
            tint: int):
        if not isinstance(capacity, int):
            raise TypeError(ErrorText.CAPACITY_MUST_BE_POSITIVE_INT)
        if capacity <= 0:
            raise ValueError(ErrorText.CAPACITY_MUST_BE_POSITIVE_INT)
        VisualComponent.__init__(self, env, id, ComponentType.RESOURCE,
                                 visual, tint)
        PriorityResource.__init__(self, env, capacity)
        ResourceVisualUtil.set_capacity(self, capacity)
        ResourceVisualUtil.set_utilization(self, 0)

    def request(
            self,
            priority: int = 0,
            preempt: bool = True) -> PriorityRequest:
        req = super().request(priority, preempt)
        ResourceVisualUtil.set_utilization(self, self.count)
        return req

    def release(self, request: PriorityRequest) -> Release:
        rel = super().release(request)
        ResourceVisualUtil.set_utilization(self, self.count)
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
        If no tint should be applied, set it to 0xFFFFFF.
    :raises TypeError: If the capacity is not a integer or float.
    :raises ValueError: If the capacity is not a positive integer or float.
    """

    def __init__(
        self,
        env: VisualEnvironment,
        id: str,
        visual: str,
        tint: int,
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
    :param visual: The visualization of the component, must be registered in
        the :class:`~simplay.core.VisualizationManager`.
    :param tint: The tint of the component. The tint is multiplied with the
        pixel value of each pixel. To use HEX values, write them as
        0xRRGGBB. For example: 0xFF0000 is red, 0x00FF00 is green,
        0x0000FF is blue.
        If the whole image is white, tinting it will change the color of the
        image. If the image is black, tinting it will have no effect.
        If no tint should be applied, set it to 0xFFFFFF.
    :raises TypeError: If the capacity is not a integer or float.
    :raises ValueError: If the capacity is not a positive integer or float.
    """

    def __init__(
        self,
        env: VisualEnvironment,
        id: str,
        visual: str,
        tint: int,
        capacity: Union[float, int] = float("inf"),
    ):
        if not isinstance(capacity, (int, float)):
            raise TypeError(
                ErrorText.CAPACITY_MUST_BE_POSITIVE_INT_OR_FLOAT)
        if capacity <= 0:
            raise ValueError(
                ErrorText.CAPACITY_MUST_BE_POSITIVE_INT_OR_FLOAT)
        VisualComponent.__init__(
            self, env, id, ComponentType.STORE, visual, tint)
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
        If no tint should be applied, set it to 0xFFFFFF.
    :raises TypeError: If the capacity is not a integer or float.
    :raises ValueError: If the capacity is not a positive integer or float.
    """

    def __init__(
            self,
            env: VisualEnvironment,
            id: str,
            capacity: int,
            visual: str,
            tint: int):
        if not isinstance(capacity, (int, float)):
            raise TypeError(ErrorText.CAPACITY_MUST_BE_POSITIVE_INT_OR_FLOAT)
        if capacity <= 0:
            raise ValueError(ErrorText.CAPACITY_MUST_BE_POSITIVE_INT_OR_FLOAT)
        VisualComponent.__init__(
            self, env, id, ComponentType.STORE, visual, tint)
        FilterStore.__init__(self, env, capacity)
        StoreVisualUtil.set_capacity(self, capacity)

    def put(self, item) -> StorePut:
        put = super().put(item)
        StoreVisualUtil.set_content(self, self.items)
        return put

    def get(self, filter: Callable[[Any], bool]
            = lambda item: True) -> FilterStoreGet:
        get = super().get(filter)
        StoreVisualUtil.set_content(self, self.items)
        return get
