import pytest
import src.simplay.core as simplay
import src.simplay.components as simplay
from src.simplay.primitives import ComponentType, ErrorText, EventAction


class TestVisualResourceBase:
    def test_has_capacity(self):
        env = simplay.VisualEnvironment()
        component = simplay.VisualResourceBase(env, "id", "", 0)
        manager = env.visualization_manager
        component.has_capacity(0)
        assert manager.events[0].for_id == "id"
        assert manager.events[0].timestamp == 0
        assert (manager.events[0].action ==
                EventAction.RESOURCE_SET_CAPACITY.value)
        assert manager.events[0].args == {"capacity": 0}

    def test_has_utilization(self):
        env = simplay.VisualEnvironment()
        component = simplay.VisualResourceBase(env, "id", "", 0)
        manager = env.visualization_manager
        component.has_utilization(0)
        assert manager.events[0].for_id == "id"
        assert manager.events[0].timestamp == 0
        assert (manager.events[0].action ==
                EventAction.RESOURCE_SET_UTILIZATION.value)
        assert manager.events[0].args == {"utilization": 0}


class TestVisualResource:
    def test_visualResource(self):
        env = simplay.VisualEnvironment()
        _ = simplay.VisualResource(env, "test", 1, "", 0)
        assert {
            "id": "test",
            "type": ComponentType.RESOURCE.value,
            "visual": "",
            "tint": 0,
        } in env.visualization_manager.entities

    def test_invalid_capacity(self):
        env = simplay.VisualEnvironment()
        with pytest.raises(ValueError,
                           match=ErrorText.CAPACITY_MUST_BE_POSITIVE_INT):
            _ = simplay.VisualResource(env, "test", 0, "", 0)

    def test_invalid_capacity_type(self):
        env = simplay.VisualEnvironment()
        with pytest.raises(TypeError,
                           match=ErrorText.CAPACITY_MUST_BE_POSITIVE_INT):
            _ = simplay.VisualResource(env, "test", "", "", 0)

    def test_utilization_event(self):
        env = simplay.VisualEnvironment()
        resource = simplay.VisualResource(env, "test", 1, "", 0)
        manager = env.visualization_manager
        with resource.request():
            assert (
                manager.events[2].action
                == EventAction.RESOURCE_SET_UTILIZATION.value)
            assert manager.events[2].for_id == "test"
            assert manager.events[2].args["utilization"] == 1
            assert manager.events[2].timestamp == 0

        assert (manager.events[3].action ==
                EventAction.RESOURCE_SET_UTILIZATION.value)
        assert manager.events[3].for_id == "test"
        assert manager.events[3].args["utilization"] == 0
        assert manager.events[3].timestamp == 0


class TestVisualPreemtiveResource:
    def test_visualPreemptiveResource(self):
        env = simplay.VisualEnvironment()
        _ = simplay.VisualPreemptiveResource(env, "test", 1, "", 0)
        assert {
            "id": "test",
            "type": ComponentType.RESOURCE.value,
            "visual": "",
            "tint": 0,
        } in env.visualization_manager.entities

    def test_invalid_capacity(self):
        env = simplay.VisualEnvironment()
        with pytest.raises(ValueError,
                           match=ErrorText.CAPACITY_MUST_BE_POSITIVE_INT):
            _ = simplay.VisualPreemptiveResource(env, "test", 0, "", 0)

    def test_invalid_capacity_type(self):
        env = simplay.VisualEnvironment()
        with pytest.raises(TypeError,
                           match=ErrorText.CAPACITY_MUST_BE_POSITIVE_INT):
            _ = simplay.VisualPreemptiveResource(env, "test", "", "", 0)

    def test_utilization_event(self):
        env = simplay.VisualEnvironment()
        resource = simplay.VisualPreemptiveResource(env, "test", 1, "", 0)
        manager = env.visualization_manager
        with resource.request():
            assert (manager.events[2].action ==
                    EventAction.RESOURCE_SET_UTILIZATION.value)
            assert manager.events[2].for_id == "test"
            assert manager.events[2].args["utilization"] == 1
            assert manager.events[2].timestamp == 0

        assert (manager.events[3].action ==
                EventAction.RESOURCE_SET_UTILIZATION.value)


class TestVisualPriorityResource:
    def test_visualPriorityResource(self):
        env = simplay.VisualEnvironment()
        _ = simplay.VisualPriorityResource(env, "test", 1, "", 0)
        assert {
            "id": "test",
            "type": ComponentType.RESOURCE.value,
            "visual": "",
            "tint": 0,
        } in env.visualization_manager.entities

    def test_invalid_capacity(self):
        env = simplay.VisualEnvironment()
        with pytest.raises(ValueError,
                           match=ErrorText.CAPACITY_MUST_BE_POSITIVE_INT):
            _ = simplay.VisualPriorityResource(env, "test", 0, "", 0)

    def test_invalid_capacity_type(self):
        env = simplay.VisualEnvironment()
        with pytest.raises(TypeError,
                           match=ErrorText.CAPACITY_MUST_BE_POSITIVE_INT):
            _ = simplay.VisualPriorityResource(env, "test", "", "", 0)

    def test_utilization_event(self):
        env = simplay.VisualEnvironment()
        resource = simplay.VisualPriorityResource(env, "test", 1, "", 0)
        manager = env.visualization_manager
        with resource.request():
            assert (manager.events[2].action ==
                    EventAction.RESOURCE_SET_UTILIZATION.value)
            assert manager.events[2].for_id == "test"
            assert manager.events[2].args["utilization"] == 1
            assert manager.events[2].timestamp == 0

        assert (manager.events[3].action ==
                EventAction.RESOURCE_SET_UTILIZATION.value)


class TestVisualProcess:
    def test_visualProcess(self):
        env = simplay.VisualEnvironment()
        _ = simplay.VisualProcess(env, "test", "", 0)
        assert {
            "id": "test",
            "type": ComponentType.PROCESS.value,
            "visual": "",
            "tint": 0,
        } in env.visualization_manager.entities


class TestVisualContainer:
    def test_visualContainer(self):
        env = simplay.VisualEnvironment()
        _ = simplay.VisualContainer(env, "test", "", 1, 1, 0)
        assert {
            "id": "test",
            "type": ComponentType.CONTAINER.value,
            "visual": "",
            "tint": 1,
        } in env.visualization_manager.entities

    def test_invalid_capacity(self):
        env = simplay.VisualEnvironment()
        with pytest.raises(
            ValueError, match=ErrorText.CAPACITY_MUST_BE_POSITIVE_INT_OR_FLOAT
        ):
            _ = simplay.VisualContainer(env, "test", "", 1, -1, 0)

    def test_invalid_capacity_type(self):
        env = simplay.VisualEnvironment()
        with pytest.raises(
            TypeError, match=ErrorText.CAPACITY_MUST_BE_POSITIVE_INT_OR_FLOAT
        ):
            __ = simplay.VisualContainer(env, "test", "", 1, "", 0)

    def test_has_capacity(self):
        env = simplay.VisualEnvironment()
        component = simplay.VisualContainer(env, "id", "", 0, 1, 0)
        manager = env.visualization_manager
        assert manager.events[0].for_id == "id"
        assert manager.events[0].timestamp == 0
        assert (manager.events[0].action ==
                EventAction.CONTAINER_SET_CAPACITY.value)
        assert manager.events[0].args == {"capacity": 1}

    def test_has_level(self):
        env = simplay.VisualEnvironment()
        component = simplay.VisualContainer(env, "id", "", 0, 1, 0)
        manager = env.visualization_manager
        assert manager.events[1].for_id == "id"
        assert manager.events[1].timestamp == 0
        assert (manager.events[1].action ==
                EventAction.CONTAINER_SET_LEVEL.value)
        assert manager.events[1].args == {"level": 0}


class TestVisualStoreBase:
    def test_has_capacity(self):
        env = simplay.VisualEnvironment()
        component = simplay.VisualStoreBase(env, "id", "", 0)
        manager = env.visualization_manager
        component.has_capacity(0)
        assert manager.events[0].for_id == "id"
        assert manager.events[0].timestamp == 0
        assert (manager.events[0].action ==
                EventAction.STORE_SET_CAPACITY.value)
        assert manager.events[0].args == {"capacity": 0}

    def test_has_content(self):
        env = simplay.VisualEnvironment()
        component = simplay.VisualStoreBase(env, "id", "", 0)
        manager = env.visualization_manager
        component.has_content(0)
        assert manager.events[0].for_id == "id"
        assert manager.events[0].timestamp == 0
        assert (manager.events[0].action ==
                EventAction.STORE_SET_CONTENT.value)
        assert manager.events[0].args == {"content": 0}


class TestVisualStore:
    def test_visualStore(self):
        env = simplay.VisualEnvironment()
        _ = simplay.VisualStore(env, "test", "", 1, 1)
        assert {
            "id": "test",
            "type": ComponentType.STORE.value,
            "visual": "",
            "tint": 1,
        } in env.visualization_manager.entities

    def test_invalid_capacity(self):
        env = simplay.VisualEnvironment()
        with pytest.raises(
            ValueError, match=ErrorText.CAPACITY_MUST_BE_POSITIVE_INT_OR_FLOAT
        ):
            _ = simplay.VisualStore(env, "test", "", 0, 0)

    def test_invalid_capacity_type(self):
        env = simplay.VisualEnvironment()
        with pytest.raises(
            TypeError, match=ErrorText.CAPACITY_MUST_BE_POSITIVE_INT_OR_FLOAT
        ):
            _ = simplay.VisualStore(env, "test", "", 0, "")


class TestVisualFilterStore:
    def test_visualFilterStore(self):
        env = simplay.VisualEnvironment()
        _ = simplay.VisualFilterStore(env, "test", 1, "", 1)
        assert {
            "id": "test",
            "type": ComponentType.STORE.value,
            "visual": "",
            "tint": 1,
        } in env.visualization_manager.entities

    def test_invalid_capacity(self):
        env = simplay.VisualEnvironment()
        with pytest.raises(
            ValueError, match=ErrorText.CAPACITY_MUST_BE_POSITIVE_INT_OR_FLOAT
        ):
            _ = simplay.VisualFilterStore(env, "test", 0, "", 1)

    def test_invalid_capacity_type(self):
        env = simplay.VisualEnvironment()
        with pytest.raises(
            TypeError, match=ErrorText.CAPACITY_MUST_BE_POSITIVE_INT_OR_FLOAT
        ):
            _ = simplay.VisualFilterStore(env, "test", "", "", 1)
