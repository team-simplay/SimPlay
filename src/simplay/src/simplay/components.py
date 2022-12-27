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
        super().__init__(env, id, ComponentType.RESOURCE, visual, tint)
        Resource.__init__(self, env, capacity)
        self.__update_capacity()
        self.__update_utilization()

    @property
    def capacity(self) -> ContainerAmount:
        return self._capacity

    @capacity.setter
    def capacity(self, capacity: ContainerAmount):
        self._capacity = capacity
        self.__update_capacity()

    def __update_capacity(self):
        self.visualization_manager.add_event(
            ResourceSetCapacity(self.id, self.env.now, self.capacity)
        )

    def __update_utilization(self, _=None):
        self.visualization_manager.add_event(
            ResourceSetUtilization(
                self.id, self.env.now, self.count))

    def request(self) -> Request:
        req = super().request()
        self.__update_utilization()
        req.callbacks.append(self.__update_utilization)
        return req

    def release(self, request: Request) -> Release:
        rel = super().release(request)
        self.__update_utilization()
        rel.callbacks.append(self.__update_utilization)
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
        super().__init__(env, id, ComponentType.RESOURCE, visual, tint)
        PreemptiveResource.__init__(self, env, capacity)
        self.__update_capacity()
        self.__update_utilization()

    @property
    def capacity(self) -> ContainerAmount:
        return self._capacity

    @capacity.setter
    def capacity(self, capacity: ContainerAmount):
        self._capacity = capacity
        self.__update_capacity()

    def __update_capacity(self):
        self.visualization_manager.add_event(
            ResourceSetCapacity(self.id, self.env.now, self.capacity)
        )

    def __update_utilization(self, _=None):
        self.visualization_manager.add_event(
            ResourceSetUtilization(
                self.id, self.env.now, self.count))

    def request(
            self,
            priority: int = 0,
            preempt: bool = True) -> PriorityRequest:
        req = super().request(priority, preempt)
        self.__update_utilization()
        req.callbacks.append(self.__update_utilization)
        return req

    def release(self, request: PriorityRequest) -> Release:
        rel = super().release(request)
        self.__update_utilization()
        rel.callbacks.append(self.__update_utilization)
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
        super().__init__(env, id, ComponentType.RESOURCE, visual, tint)
        PriorityResource.__init__(self, env, capacity)
        self.__update_capacity()
        self.__update_utilization()

    @property
    def capacity(self) -> ContainerAmount:
        return self._capacity

    @capacity.setter
    def capacity(self, capacity: ContainerAmount):
        self._capacity = capacity
        self.__update_capacity()

    def __update_capacity(self):
        self.visualization_manager.add_event(
            ResourceSetCapacity(self.id, self.env.now, self.capacity)
        )

    def __update_utilization(self, _=None):
        self.visualization_manager.add_event(
            ResourceSetUtilization(
                self.id, self.env.now, self.count))

    def request(
            self,
            priority: int = 0,
            preempt: bool = True) -> PriorityRequest:
        req = super().request(priority, preempt)
        self.__update_utilization()
        req.callbacks.append(self.__update_utilization)
        return req

    def release(self, request: PriorityRequest) -> Release:
        rel = super().release(request)
        self.__update_utilization()
        rel.callbacks.append(self.__update_utilization)
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
        self.__update_capacity()
        self.__update_level()

    @property
    def capacity(self) -> ContainerAmount:
        return self._capacity

    @capacity.setter
    def capacity(self, capacity: ContainerAmount):
        self._capacity = capacity
        self.__update_capacity()

    def __update_capacity(self):
        self.visualization_manager.add_event(
            ContainerSetCapacity(self.id, self.env.now, self.capacity)
        )

    def __update_level(self, _=None):
        self.visualization_manager.add_event(
            ContainerSetLevel(self.id, self.env.now, self.level)
        )

    def put(self, amount: ContainerAmount) -> ContainerPut:
        put = super().put(amount)
        self.__update_level()
        put.callbacks.append(self.__update_level)
        return put

    def get(self, amount: ContainerAmount) -> ContainerGet:
        get = super().get(amount)
        self.__update_level()
        get.callbacks.append(self.__update_level)
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
        Store.__init__(self, env, capacity)
        VisualComponent.__init__(
            self, env, id, ComponentType.STORE, visual, tint)
        self.__update_capacity()
        self.__update_content()

    @property
    def capacity(self) -> Union[float, int]:
        return self._capacity

    @capacity.setter
    def capacity(self, capacity: Union[float, int]):
        self._capacity = capacity
        self.__update_capacity()

    def __update_capacity(self):
        self.visualization_manager.add_event(
            StoreSetCapacity(self.id, self.env.now, self.capacity)
        )

    def __update_content(self, _=None):
        self.visualization_manager.add_event(
            StoreSetContent(self.id, self.env.now, self.items)
        )

    def put(self, item) -> StorePut:
        put = super().put(item)
        self.__update_content()
        put.callbacks.append(self.__update_content)
        return put

    def get(self) -> StoreGet:
        get = super().get()
        self.__update_content()
        get.callbacks.append(self.__update_content)
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
        FilterStore.__init__(self, env, capacity)
        VisualComponent.__init__(
            self, env, id, ComponentType.STORE, visual, tint)
        self.__update_capacity()
        self.__update_content()

    @property
    def capacity(self) -> int:
        return self._capacity

    @capacity.setter
    def capacity(self, capacity: int):
        self._capacity = capacity
        self.__update_capacity()

    def __update_capacity(self):
        self.visualization_manager.add_event(
            StoreSetCapacity(self.id, self.env.now, self.capacity)
        )

    def __update_content(self, _=None):
        self.visualization_manager.add_event(
            StoreSetContent(self.id, self.env.now, self.items)
        )

    def put(self, item) -> StorePut:
        put = super().put(item)
        self.__update_content()
        put.callbacks.append(self.__update_content)
        return put

    def get(self, filter: Callable[[Any], bool]
            = lambda item: True) -> FilterStoreGet:
        get = super().get(filter)
        self.__update_content()
        get.callbacks.append(self.__update_content)
        return get
