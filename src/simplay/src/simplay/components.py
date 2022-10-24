from abc import ABC, abstractmethod
from functools import wraps
from simpy import Container, PreemptiveResource
from simpy import Resource

from animationutil import ContainerAnimationUtil, ResourceAnimationUtil


class AnimatedComponent(ABC):
    def __init__(self, env, id, visualname=None, tint=None):
        self.env = env
        self._id = id
        self._visualname = visualname
        self._tint = tint if tint is not None else -1

    @property
    def id(self):
        return self._id

    @id.setter
    def id(self, value):
        self._id = value

    @property
    def visualname(self):
        return self._visualname

    @visualname.setter
    def visualname(self, value):
        self._visualname = value

    @property
    def tint(self):
        return self._tint

    @tint.setter
    def tint(self, value):
        self._tint = value


class AnimatedProcess(AnimatedComponent):
    def __init__(self, env, id, visualname=None, tint=None):
        super().__init__(env, id, visualname, tint)
        self.env.animationManager.addEntity(self, "process")


class AnimatedResource(AnimatedComponent, Resource):
    def __init__(self, env, id, capacity, visualname=None, tint=None):
        super().__init__(env, id, visualname, tint)
        Resource.__init__(self, env, capacity)
        self.env.animationManager.addEntity(self, "resource")

    def request(self):
        req = super().request()
        ResourceAnimationUtil.increaseUsage(self)
        ResourceAnimationUtil.setUtilization(self, self.capacity, self.count)
        return req

    def release(self, req):
        super().release(req)
        ResourceAnimationUtil.decreaseUsage(self)
        ResourceAnimationUtil.setUtilization(self, self.capacity, self.count)


class AnimatedPreeemptiveResource(AnimatedComponent, PreemptiveResource):
    def __init__(self, env, id, capacity, visualname=None, tint=None):
        super().__init__(env, id, visualname, tint)
        PreemptiveResource.__init__(self, env, capacity)
        self.env.animationManager.addEntity(self, "resource")


class AnimatedContainer(AnimatedComponent, Container):
    def __init__(self, env, id, capacity, init=0, visualname=None, tint=None):
        super().__init__(env, id, visualname, tint)
        Container.__init__(self, env, capacity, init)
        self.env.animationManager.addEntity(self, "container")

    def put(self, amount):
        put = super().put(amount)
        ContainerAnimationUtil.put(self, amount)
        ContainerAnimationUtil.setLevel(self, self.level)
        return put

    def get(self, amount):
        get = super().get(amount)
        ContainerAnimationUtil.get(self, amount)
        ContainerAnimationUtil.setLevel(self, self.level)
        return get
