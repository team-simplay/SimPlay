import pytest
import simpy
import src.simplay.core as simplay
import src.simplay.components as simplay
from src.simplay.primitives import ComponentType, ErrorText, EventAction


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
