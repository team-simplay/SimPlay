import src.simplay.visualutil as simplay
import src.simplay.core as simplaycore
import pytest


class TestVisualBasicUtil:
    def test_set_visible(self):
        env = simplaycore.VisualEnvironment()
        component = simplay.VisualComponent(env, "id", "CUSTOM", "", 0)
        with pytest.raises(TypeError, match="component must be a VisualComponent"):
            simplay.BasicVisualUtil.set_visible(0)
        simplay.BasicVisualUtil.set_visible(component)
        assert env.visualization_manager.events[0].for_id == "id"
        assert env.visualization_manager.events[0].timestamp == 0
        assert env.visualization_manager.events[0].action == "SET_VISIBLE"
        assert env.visualization_manager.events[0].args == {"visible": True}

    def test_set_invisible(self):
        env = simplaycore.VisualEnvironment()
        component = simplay.VisualComponent(env, "id", "CUSTOM", "", 0)
        with pytest.raises(TypeError, match="component must be a VisualComponent"):
            simplay.BasicVisualUtil.set_invisible(0)
        simplay.BasicVisualUtil.set_invisible(component)
        assert env.visualization_manager.events[0].for_id == "id"
        assert env.visualization_manager.events[0].timestamp == 0
        assert env.visualization_manager.events[0].action == "SET_VISIBLE"
        assert env.visualization_manager.events[0].args == {"visible": False}

    def test_set_position(self):
        env = simplaycore.VisualEnvironment()
        component = simplay.VisualComponent(env, "id", "CUSTOM", "", 0)
        with pytest.raises(TypeError, match="component must be a VisualComponent"):
            simplay.BasicVisualUtil.set_position(0, 0, 0)
        simplay.BasicVisualUtil.set_position(component, 1, 2)
        assert env.visualization_manager.events[0].for_id == "id"
        assert env.visualization_manager.events[0].timestamp == 0
        assert env.visualization_manager.events[0].action == "SET_POSITION"
        assert env.visualization_manager.events[0].args == {"x": 1, "y": 2}

    def test_set_interacting(self):
        env = simplaycore.VisualEnvironment()
        component = simplay.VisualComponent(env, "id", "CUSTOM", "", 0)
        other_component = simplay.VisualComponent(env, "other_id", "CUSTOM", "", 0)
        with pytest.raises(TypeError, match="component must be a VisualComponent"):
            simplay.BasicVisualUtil.set_interacting(0, other_component)
        with pytest.raises(
            TypeError, match="target must be a VisualComponent"
        ):
            simplay.BasicVisualUtil.set_interacting(component, 0)
        simplay.BasicVisualUtil.set_interacting(component, other_component)
        assert env.visualization_manager.events[0].for_id == "id"
        assert env.visualization_manager.events[0].timestamp == 0
        assert env.visualization_manager.events[0].action == "SET_INTERACTING"
        assert env.visualization_manager.events[0].args == {"with_id": "other_id"}

    def test_set_not_interacting(self):
        env = simplaycore.VisualEnvironment()
        component = simplay.VisualComponent(env, "id", "CUSTOM", "", 0)
        other_component = simplay.VisualComponent(env, "other_id", "CUSTOM", "", 0)
        with pytest.raises(TypeError, match="component must be a VisualComponent"):
            simplay.BasicVisualUtil.set_not_interacting(0, other_component)
        with pytest.raises(
            TypeError, match="target must be a VisualComponent"
        ):
            simplay.BasicVisualUtil.set_not_interacting(component, 0)
        simplay.BasicVisualUtil.set_not_interacting(component, other_component)
        assert env.visualization_manager.events[0].for_id == "id"
        assert env.visualization_manager.events[0].timestamp == 0
        assert env.visualization_manager.events[0].action == "SET_NOT_INTERACTING"
        assert env.visualization_manager.events[0].args == {"with_id": "other_id"}

    def test_move_near(self):
        env = simplaycore.VisualEnvironment()
        component = simplay.VisualComponent(env, "id", "CUSTOM", "", 0)
        other_component = simplay.VisualComponent(env, "other_id", "CUSTOM", "", 0)
        with pytest.raises(TypeError, match="component must be a VisualComponent"):
            simplay.BasicVisualUtil.move_near(0, other_component)
        with pytest.raises(
            TypeError, match="target must be a VisualComponent"
        ):
            simplay.BasicVisualUtil.move_near(component, 0)
        simplay.BasicVisualUtil.move_near(component, other_component)
        assert env.visualization_manager.events[0].for_id == "id"
        assert env.visualization_manager.events[0].timestamp == 0
        assert env.visualization_manager.events[0].action == "MOVE_NEAR"
        assert env.visualization_manager.events[0].args == {"target_id": "other_id"}

    def test_set_tint_color(self):
        env = simplaycore.VisualEnvironment()
        component = simplay.VisualComponent(env, "id", "CUSTOM", "", 0)
        with pytest.raises(TypeError, match="component must be a VisualComponent"):
            simplay.BasicVisualUtil.set_tint_color(0, 0xFFFFFF)
        simplay.BasicVisualUtil.set_tint_color(component, 0xFFFFFF)
        assert env.visualization_manager.events[0].for_id == "id"
        assert env.visualization_manager.events[0].timestamp == 0
        assert env.visualization_manager.events[0].action == "SET_TINT_COLOR"
        assert env.visualization_manager.events[0].args == {"color": 0xFFFFFF}

    def test_reset_tint_color(self):
        env = simplaycore.VisualEnvironment()
        component = simplay.VisualComponent(env, "id", "CUSTOM", "", 0x000000)
        with pytest.raises(TypeError, match="component must be a VisualComponent"):
            simplay.BasicVisualUtil.reset_tint_color(0)
        simplay.BasicVisualUtil.reset_tint_color(component)
        assert env.visualization_manager.events[0].for_id == "id"
        assert env.visualization_manager.events[0].timestamp == 0
        assert env.visualization_manager.events[0].action == "SET_TINT_COLOR"
        assert env.visualization_manager.events[0].args == {"color": 0x000000}

    def test_set_decorating_text(self):
        env = simplaycore.VisualEnvironment()
        component = simplay.VisualComponent(env, "id", "CUSTOM", "", 0)
        with pytest.raises(TypeError, match="component must be a VisualComponent"):
            simplay.BasicVisualUtil.set_decorating_text(0, "text")
        simplay.BasicVisualUtil.set_decorating_text(component, "text")
        assert env.visualization_manager.events[0].for_id == "id"
        assert env.visualization_manager.events[0].timestamp == 0
        assert env.visualization_manager.events[0].action == "SET_DECORATING_TEXT"
        assert env.visualization_manager.events[0].args == {"text": "text"}

    def test_set_sprite_frame(self):
        env = simplaycore.VisualEnvironment()
        component = simplay.VisualComponent(env, "id", "CUSTOM", "", 0)
        with pytest.raises(TypeError, match="component must be a VisualComponent"):
            simplay.BasicVisualUtil.set_sprite_frame(0, 0)
        simplay.BasicVisualUtil.set_sprite_frame(component, 0)
        assert env.visualization_manager.events[0].for_id == "id"
        assert env.visualization_manager.events[0].timestamp == 0
        assert env.visualization_manager.events[0].action == "SET_SPRITE_FRAME"
        assert env.visualization_manager.events[0].args == {"frame": 0}


class TestResourceVisualUtil:
    def test_set_capacity(self):
        env = simplaycore.VisualEnvironment()
        component = simplay.VisualComponent(env, "id", "CUSTOM", "", 0)
        with pytest.raises(
            TypeError, match="component must be a VisualComponent"
        ):
            simplay.ResourceVisualUtil.set_capacity(0, 0)
        simplay.ResourceVisualUtil.set_capacity(component, 0)
        assert env.visualization_manager.events[0].for_id == "id"
        assert env.visualization_manager.events[0].timestamp == 0
        assert env.visualization_manager.events[0].action == "RESOURCE.SET_CAPACITY"
        assert env.visualization_manager.events[0].args == {"capacity": 0}

    def test_set_utilization(self):
        env = simplaycore.VisualEnvironment()
        component = simplay.VisualComponent(env, "id", "CUSTOM", "", 0)
        with pytest.raises(
            TypeError, match="component must be a VisualComponent"
        ):
            simplay.ResourceVisualUtil.set_utilization(0, 0)
        simplay.ResourceVisualUtil.set_utilization(component, 0)
        assert env.visualization_manager.events[0].for_id == "id"
        assert env.visualization_manager.events[0].timestamp == 0
        assert env.visualization_manager.events[0].action == "RESOURCE.SET_UTILIZATION"
        assert env.visualization_manager.events[0].args == {"utilization": 0}


class TestContainerVisualUtil:
    def test_set_capacity(self):
        env = simplaycore.VisualEnvironment()
        component = simplay.VisualComponent(env, "id", "CUSTOM", "", 0)
        with pytest.raises(
            TypeError, match="component must be a VisualComponent"
        ):
            simplay.ContainerVisualUtil.set_capacity(0, 0)
        simplay.ContainerVisualUtil.set_capacity(component, 0)
        assert env.visualization_manager.events[0].for_id == "id"
        assert env.visualization_manager.events[0].timestamp == 0
        assert env.visualization_manager.events[0].action == "CONTAINER.SET_CAPACITY"
        assert env.visualization_manager.events[0].args == {"capacity": 0}

    def test_set_level(self):
        env = simplaycore.VisualEnvironment()
        component = simplay.VisualComponent(env, "id", "CUSTOM", "", 0)
        with pytest.raises(
            TypeError, match="component must be a VisualComponent"
        ):
            simplay.ContainerVisualUtil.set_level(0, 0)
        simplay.ContainerVisualUtil.set_level(component, 0)
        assert env.visualization_manager.events[0].for_id == "id"
        assert env.visualization_manager.events[0].timestamp == 0
        assert env.visualization_manager.events[0].action == "CONTAINER.SET_LEVEL"
        assert env.visualization_manager.events[0].args == {"level": 0}


class TestStoreVisualUtil:
    def test_set_capacity(self):
        env = simplaycore.VisualEnvironment()
        component = simplay.VisualComponent(env, "id", "CUSTOM", "", 0)
        with pytest.raises(TypeError, match="component must be a VisualComponent"):
            simplay.StoreVisualUtil.set_capacity(0, 0)
        simplay.StoreVisualUtil.set_capacity(component, 0)
        assert env.visualization_manager.events[0].for_id == "id"
        assert env.visualization_manager.events[0].timestamp == 0
        assert env.visualization_manager.events[0].action == "STORE.SET_CAPACITY"
        assert env.visualization_manager.events[0].args == {"capacity": 0}

    def test_set_content(self):
        env = simplaycore.VisualEnvironment()
        component = simplay.VisualComponent(env, "id", "CUSTOM", "", 0)
        with pytest.raises(TypeError, match="component must be a VisualComponent"):
            simplay.StoreVisualUtil.set_content(0, 0)
        simplay.StoreVisualUtil.set_content(component, 0)
        assert env.visualization_manager.events[0].for_id == "id"
        assert env.visualization_manager.events[0].timestamp == 0
        assert env.visualization_manager.events[0].action == "STORE.SET_CONTENT"
        assert env.visualization_manager.events[0].args == {"content": 0}
