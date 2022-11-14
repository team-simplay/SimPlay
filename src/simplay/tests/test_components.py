import pytest
import simpy
import src.simplay.core as simplay
import src.simplay.components as simplay


class TestVisualResource:
    def test_visualResource(self):
        env = simplay.VisualEnvironment()
        _ = simplay.VisualResource(env, "test", 1, "", 0)
        assert {
            "id": "test",
            "type": "RESOURCE",
            "graphic": "",
            "tint": 0,
        } in env.visualization_manager.entities

    def test_invalid_id(self):
        env = simplay.VisualEnvironment()
        with pytest.raises(ValueError, match="Id must be a string."):
            _ = simplay.VisualResource(env, 0, 1, "", 0)

    def test_invalid_env(self):
        env = simpy.Environment()
        with pytest.raises(ValueError,
                           match="Env must be of type VisualEnvironment."):
            _ = simplay.VisualResource(env, "test", 1, "", 0)

    def test_invalid_graphic(self):
        env = simplay.VisualEnvironment()
        with pytest.raises(ValueError, match="Graphic must be a string."):
            _ = simplay.VisualResource(env, "test", 1, 0, 0)

    def test_invalid_tint(self):
        env = simplay.VisualEnvironment()
        with pytest.raises(ValueError, match="Tint must be an integer."):
            _ = simplay.VisualResource(env, "test", 1, "", "")

    def test_invalid_capacity(self):
        env = simplay.VisualEnvironment()
        with pytest.raises(ValueError,
                           match="Capacity must be a positive integer."):
            _ = simplay.VisualResource(env, "test", 0, "", 0)

    def test_invalid_capacity_type(self):
        env = simplay.VisualEnvironment()
        with pytest.raises(ValueError,
                           match="Capacity must be a positive integer."):
            _ = simplay.VisualResource(env, "test", "", "", 0)

    def test_utilization_event(self):
        env = simplay.VisualEnvironment()
        resource = simplay.VisualResource(env, "test", 1, "", 0)
        manager = env.visualization_manager
        with resource.request():
            assert (
                manager.events[2].action
                == "RESOURCE.SET_UTILIZATION")
            assert manager.events[2].for_id == "test"
            assert manager.events[2].args["utilization"] == 1
            assert manager.events[2].timestamp == 0

        assert manager.events[3].action == "RESOURCE.SET_UTILIZATION"
        assert manager.events[3].for_id == "test"
        assert manager.events[3].args["utilization"] == 0
        assert manager.events[3].timestamp == 0


class TestVisualPreemtiveResource:
    def test_visualPreemptiveResource(self):
        env = simplay.VisualEnvironment()
        _ = simplay.VisualPreemptiveResource(env, "test", 1, "", 0)
        assert {
            "id": "test",
            "type": "RESOURCE",
            "graphic": "",
            "tint": 0,
        } in env.visualization_manager.entities

    def test_invalid_id(self):
        env = simplay.VisualEnvironment()
        with pytest.raises(ValueError, match="Id must be a string."):
            _ = simplay.VisualPreemptiveResource(env, 0, 1, "", 0)

    def test_invalid_env(self):
        env = simpy.Environment()
        with pytest.raises(ValueError,
                           match="Env must be of type VisualEnvironment."):
            _ = simplay.VisualPreemptiveResource(env, "test", 1, "", 0)

    def test_invalid_graphic(self):
        env = simplay.VisualEnvironment()
        with pytest.raises(ValueError, match="Graphic must be a string."):
            _ = simplay.VisualPreemptiveResource(env, "test", 1, 0, 0)

    def test_invalid_tint(self):
        env = simplay.VisualEnvironment()
        with pytest.raises(ValueError, match="Tint must be an integer."):
            _ = simplay.VisualPreemptiveResource(env, "test", 1, "", "")

    def test_invalid_capacity(self):
        env = simplay.VisualEnvironment()
        with pytest.raises(ValueError,
                           match="Capacity must be a positive integer."):
            _ = simplay.VisualPreemptiveResource(env, "test", 0, "", 0)

    def test_invalid_capacity_type(self):
        env = simplay.VisualEnvironment()
        with pytest.raises(ValueError,
                           match="Capacity must be a positive integer."):
            _ = simplay.VisualPreemptiveResource(env, "test", "", "", 0)

    def test_utilization_event(self):
        env = simplay.VisualEnvironment()
        resource = simplay.VisualPreemptiveResource(env, "test", 1, "", 0)
        manager = env.visualization_manager
        with resource.request():
            assert (
                manager.events[2].action == "RESOURCE.SET_UTILIZATION")
            assert manager.events[2].for_id == "test"
            assert manager.events[2].args["utilization"] == 1
            assert manager.events[2].timestamp == 0

        assert manager.events[3].action == "RESOURCE.SET_UTILIZATION"


class TestVisualPriorityResource:
    def test_visualPriorityResource(self):
        env = simplay.VisualEnvironment()
        _ = simplay.VisualPriorityResource(env, "test", 1, "", 0)
        assert {
            "id": "test",
            "type": "RESOURCE",
            "graphic": "",
            "tint": 0,
        } in env.visualization_manager.entities

    def test_invalid_id(self):
        env = simplay.VisualEnvironment()
        with pytest.raises(ValueError, match="Id must be a string."):
            _ = simplay.VisualPriorityResource(env, 0, 1, "", 0)

    def test_invalid_env(self):
        env = simpy.Environment()
        with pytest.raises(ValueError,
                           match="Env must be of type VisualEnvironment."):
            _ = simplay.VisualPriorityResource(env, "test", 1, "", 0)

    def test_invalid_graphic(self):
        env = simplay.VisualEnvironment()
        with pytest.raises(ValueError, match="Graphic must be a string."):
            _ = simplay.VisualPriorityResource(env, "test", 1, 0, 0)

    def test_invalid_tint(self):
        env = simplay.VisualEnvironment()
        with pytest.raises(ValueError, match="Tint must be an integer."):
            _ = simplay.VisualPriorityResource(env, "test", 1, "", "")

    def test_invalid_capacity(self):
        env = simplay.VisualEnvironment()
        with pytest.raises(ValueError,
                           match="Capacity must be a positive integer."):
            _ = simplay.VisualPriorityResource(env, "test", 0, "", 0)

    def test_invalid_capacity_type(self):
        env = simplay.VisualEnvironment()
        with pytest.raises(ValueError,
                           match="Capacity must be a positive integer."):
            _ = simplay.VisualPriorityResource(env, "test", "", "", 0)

    def test_utilization_event(self):
        env = simplay.VisualEnvironment()
        resource = simplay.VisualPriorityResource(env, "test", 1, "", 0)
        manager = env.visualization_manager
        with resource.request():
            assert (
                manager.events[2].action == "RESOURCE.SET_UTILIZATION")
            assert manager.events[2].for_id == "test"
            assert manager.events[2].args["utilization"] == 1
            assert manager.events[2].timestamp == 0

        assert manager.events[3].action == "RESOURCE.SET_UTILIZATION"


class TestVisualProcess:
    def test_visualProcess(self):
        env = simplay.VisualEnvironment()
        _ = simplay.VisualProcess(env, "test", "", 0)
        assert {
            "id": "test",
            "type": "PROCESS",
            "graphic": "",
            "tint": 0,
        } in env.visualization_manager.entities

    def test_invalid_id(self):
        env = simplay.VisualEnvironment()
        with pytest.raises(ValueError, match="Id must be a string."):
            _ = simplay.VisualProcess(env, 0, "", 0)

    def test_invalid_env(self):
        env = simpy.Environment()
        with pytest.raises(ValueError,
                           match="Env must be of type VisualEnvironment."):
            _ = simplay.VisualProcess(env, "test", "", 0)

    def test_invalid_graphic(self):
        env = simplay.VisualEnvironment()
        with pytest.raises(ValueError, match="Graphic must be a string."):
            _ = simplay.VisualProcess(env, "test", 0, 0)

    def test_invalid_tint(self):
        env = simplay.VisualEnvironment()
        with pytest.raises(ValueError, match="Tint must be an integer."):
            _ = simplay.VisualProcess(env, "test", "", "")


class TestVisualContainer:
    def test_visualContainer(self):
        env = simplay.VisualEnvironment()
        _ = simplay.VisualContainer(env, "test", "", 1, 1, 0)
        assert {
            "id": "test",
            "type": "CONTAINER",
            "graphic": "",
            "tint": 1,
        } in env.visualization_manager.entities

    def test_invalid_id(self):
        env = simplay.VisualEnvironment()
        with pytest.raises(ValueError, match="Id must be a string."):
            _ = simplay.VisualContainer(env, 0, "", 1, 1, 0)

    def test_invalid_env(self):
        env = simpy.Environment()
        with pytest.raises(ValueError,
                           match="Env must be of type VisualEnvironment."):
            _ = simplay.VisualContainer(env, "test", "", 1, 1, 0)

    def test_invalid_graphic(self):
        env = simplay.VisualEnvironment()
        with pytest.raises(ValueError, match="Graphic must be a string."):
            _ = simplay.VisualContainer(env, "test", 0, 1, 1, 0)

    def test_invalid_tint(self):
        env = simplay.VisualEnvironment()
        with pytest.raises(ValueError, match="Tint must be an integer."):
            _ = simplay.VisualContainer(env, "test", "", "", 1, 0)

    def test_invalid_capacity(self):
        env = simplay.VisualEnvironment()
        with pytest.raises(
            ValueError, match="Capacity must be a positive integer or float."
        ):
            _ = simplay.VisualContainer(env, "test", "", 1, -1, 0)

    def test_invalid_capacity_type(self):
        env = simplay.VisualEnvironment()
        with pytest.raises(
            ValueError, match="Capacity must be a positive integer or float."
        ):
            __ = simplay.VisualContainer(env, "test", "", 1, "", 0)


class TestVisualStore:
    def test_visualStore(self):
        env = simplay.VisualEnvironment()
        _ = simplay.VisualStore(env, "test", "", 1, 1)
        assert {
            "id": "test",
            "type": "STORE",
            "graphic": "",
            "tint": 1,
        } in env.visualization_manager.entities

    def test_invalid_id(self):
        env = simplay.VisualEnvironment()
        with pytest.raises(ValueError, match="Id must be a string."):
            _ = simplay.VisualStore(env, 0, "", 1, 1)

    def test_invalid_env(self):
        env = simpy.Environment()
        with pytest.raises(ValueError,
                           match="Env must be of type VisualEnvironment."):
            _ = simplay.VisualStore(env, "test", "", 1, 1)

    def test_invalid_graphic(self):
        env = simplay.VisualEnvironment()
        with pytest.raises(ValueError, match="Graphic must be a string."):
            _ = simplay.VisualStore(env, "test", 0, 1, 1)

    def test_invalid_tint(self):
        env = simplay.VisualEnvironment()
        with pytest.raises(ValueError, match="Tint must be an integer."):
            _ = simplay.VisualStore(env, "test", "", "", 1)

    def test_invalid_capacity(self):
        env = simplay.VisualEnvironment()
        with pytest.raises(
            ValueError, match="Capacity must be a positive integer or float."
        ):
            _ = simplay.VisualStore(env, "test", "", 0, 0)

    def test_invalid_capacity_type(self):
        env = simplay.VisualEnvironment()
        with pytest.raises(
            ValueError, match="Capacity must be a positive integer or float."
        ):
            _ = simplay.VisualStore(env, "test", "", 0, "")


class TestVisualFilterStore:
    def test_visualFilterStore(self):
        env = simplay.VisualEnvironment()
        _ = simplay.VisualFilterStore(env, "test", 1, "", 1)
        assert {
            "id": "test",
            "type": "STORE",
            "graphic": "",
            "tint": 1,
        } in env.visualization_manager.entities

    def test_invalid_id(self):
        env = simplay.VisualEnvironment()
        with pytest.raises(ValueError, match="Id must be a string."):
            _ = simplay.VisualFilterStore(env, 0, 1, "", 1)

    def test_invalid_env(self):
        env = simpy.Environment()
        with pytest.raises(ValueError,
                           match="Env must be of type VisualEnvironment."):
            _ = simplay.VisualFilterStore(env, "test", 1, "", 1)

    def test_invalid_graphic(self):
        env = simplay.VisualEnvironment()
        with pytest.raises(ValueError, match="Graphic must be a string."):
            _ = simplay.VisualFilterStore(env, "test", 1, 1, 1)

    def test_invalid_tint(self):
        env = simplay.VisualEnvironment()
        with pytest.raises(ValueError, match="Tint must be an integer."):
            _ = simplay.VisualFilterStore(env, "test", 1, "", "")

    def test_invalid_capacity(self):
        env = simplay.VisualEnvironment()
        with pytest.raises(
            ValueError, match="Capacity must be a positive integer or float."
        ):
            _ = simplay.VisualFilterStore(env, "test", 0, "", 1)

    def test_invalid_capacity_type(self):
        env = simplay.VisualEnvironment()
        with pytest.raises(
            ValueError, match="Capacity must be a positive integer or float."
        ):
            _ = simplay.VisualFilterStore(env, "test", "", "", 1)
