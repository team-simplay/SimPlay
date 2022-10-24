import jsons


class AnimationEvent:
    def __init__(self, forId, timestamp, action, **kwargs):
        self.forId = forId
        self.timestamp = timestamp
        self.action = action
        self.args = kwargs


class Grid:
    def __init__(self, rows, cols):
        self.rows = rows
        self.cols = cols
        self.areas = []

    def setArea(self, id, name, height, width, x, y, color):
        self.areas.append(
            {
                "id": id,
                "name": name,
                "color": color,
                "gridDefinition": {"height": height, "width": width, "x": x, "y": y},
            }
        )


class AnimationManager:
    def __init__(self, env):
        self.env = env
        self.events = []
        self.entities = []
        self.visuals = []

    def addEvent(self, event):
        self.events.append(event)
        self.events.sort(key=lambda x: x.timestamp)

    def addEntity(self, entity, type):
        self.entities.append(
            {
                "id": entity.id,
                "type": type,
                "visual": entity.visualname,
                "tint": entity.tint,
            }
        )

    def print(self, text):
        self.addEvent(AnimationEvent("console", self.env.now, "log", text=text))
        print(text)

    def registerVisual(self, id, visual):
        self.visuals.append({"id": id, "visual": visual})

    def setGrid(self, grid):
        self.grid = grid

    def getAsJSON(self):
        return jsons.dumps(
            {
                "events": self.events,
                "entities": self.entities,
                "visuals": self.visuals,
                "grid": self.grid,
            }
        )


class AnimationUtil:
    @staticmethod
    def setVisible(component):
        component.env.animationManager.addEvent(
            AnimationEvent(component.id, component.env.now, "setVisible", visible=True)
        )

    @staticmethod
    def setInvisible(component):
        component.env.animationManager.addEvent(
            AnimationEvent(component.id, component.env.now, "setVisible", visible=False)
        )

    @staticmethod
    def setPositon(component, x, y):
        component.env.animationManager.addEvent(
            AnimationEvent(component.id, component.env.now, "setPosition", x=x, y=y)
        )

    @staticmethod
    def moveNear(component, target):
        component.env.animationManager.addEvent(
            AnimationEvent(
                component.id, component.env.now, "moveNear", target=target.id
            )
        )

    @staticmethod
    def moveNearPoint(component, x, y):
        component.env.animationManager.addEvent(
            AnimationEvent(component.id, component.env.now, "moveNearPoint", x=x, y=y)
        )

    @staticmethod
    def setInteracting(component, withComponent):
        component.env.animationManager.addEvent(
            AnimationEvent(
                component.id,
                component.env.now,
                "setInteracting",
                withId=withComponent.id,
            )
        )

    @staticmethod
    def setNotInteracting(component, withComponent):
        component.env.animationManager.addEvent(
            AnimationEvent(
                component.id,
                component.env.now,
                "setNotInteracting",
                withId=withComponent.id,
            )
        )

    @staticmethod
    def setTintColor(component, color):
        component.env.animationManager.addEvent(
            AnimationEvent(component.id, component.env.now, "setTintColor", color=color)
        )

    @staticmethod
    def resetTintColor(component):
        AnimationUtil.setTintColor(component, component.tint)

    @staticmethod
    def setDecoratingText(component, text):
        component.env.animationManager.addEvent(
            AnimationEvent(
                component.id, component.env.now, "setDecoratingText", text=text
            )
        )


class ResourceAnimationUtil:
    @staticmethod
    def increaseUsage(component):
        component.env.animationManager.addEvent(
            AnimationEvent(component.id, component.env.now, "resource.increaseUsage")
        )

    @staticmethod
    def decreaseUsage(component):
        component.env.animationManager.addEvent(
            AnimationEvent(component.id, component.env.now, "resource.decreaseUsage")
        )

    @staticmethod
    def setUtilization(component, capacity, usage):
        component.env.animationManager.addEvent(
            AnimationEvent(
                component.id,
                component.env.now,
                "resource.setUtilization",
                capacity=capacity,
                usage=usage,
            )
        )


class ContainerAnimationUtil:
    @staticmethod
    def put(component, amount):
        component.env.animationManager.addEvent(
            AnimationEvent(
                component.id, component.env.now, "container.put", amount=amount
            )
        )

    @staticmethod
    def get(component, amount):
        component.env.animationManager.addEvent(
            AnimationEvent(
                component.id, component.env.now, "container.get", amount=amount
            )
        )

    @staticmethod
    def setLevel(component, level):
        component.env.animationManager.addEvent(
            AnimationEvent(
                component.id, component.env.now, "container.setLevel", level=level
            )
        )
