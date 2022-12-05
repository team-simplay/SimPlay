import pytest
import simpy
import src.simplay.core as simplay
from src.simplay.primitives import ComponentType, ErrorText, EventAction


class TestVisualEnvironment:
    def test_visualEnvironment(self):
        env = simplay.VisualEnvironment()
        assert env.visualization_manager is not None


class TestVisualComponent:
    def test_visualComponent(self):
        env = simplay.VisualEnvironment()
        _ = simplay.VisualComponent(env, "test", ComponentType.RESOURCE, "", 0)
        assert {
            "id": "test",
            "type": ComponentType.RESOURCE.value,
            "visual": "",
            "tint": 0,
        } in env.visualization_manager.entities

    def test_invalid_component_type(self):
        env = simplay.VisualEnvironment()
        with pytest.raises(TypeError, match=ErrorText.INVALID_COMPONENT_TYPE):
            _ = simplay.VisualComponent(env, "test", "INVALID", "", 0)

    def test_invalid_id(self):
        env = simplay.VisualEnvironment()
        with pytest.raises(TypeError, match=ErrorText.ID_MUST_BE_STRING):
            _ = simplay.VisualComponent(env, 0, ComponentType.RESOURCE, "", 0)

    def test_invalid_env(self):
        env = simpy.Environment()
        with pytest.raises(
                TypeError,
                match=ErrorText.ENV_MUST_BE_VISUAL_ENVIRONMENT):
            _ = simplay.VisualComponent(
                env, "test", ComponentType.RESOURCE, "", 0)

    def test_invalid_visual(self):
        env = simplay.VisualEnvironment()
        with pytest.raises(TypeError, match=ErrorText.VISUAL_MUST_BE_STRING):
            _ = simplay.VisualComponent(
                env, "test", ComponentType.RESOURCE, 0, 0)

    def test_invalid_tint(self):
        env = simplay.VisualEnvironment()
        with pytest.raises(TypeError, match=ErrorText.TINT_MUST_BE_INTEGER):
            _ = simplay.VisualComponent(
                env, "test", ComponentType.RESOURCE, "", "")


class TestVisualizationManager:
    def reset(self):
        self.env = simplay.VisualEnvironment()
        self.manager = self.env.visualization_manager

    def test_add_entity(self):
        self.reset()
        _ = simplay.VisualComponent(
            self.env, "test", ComponentType.RESOURCE, "", 0)
        assert {
            "id": "test",
            "type": ComponentType.RESOURCE.value,
            "visual": "",
            "tint": 0,
        } in self.manager.entities

    def test_invalid_entity_type(self):
        self.reset()
        with pytest.raises(TypeError,
                           match=ErrorText.INVALID_COMPONENT_TYPE):
            compo = simplay.VisualComponent(
                self.env, "test", ComponentType.RESOURCE, "", 0)
            self.manager.add_entity(compo, "INVALID")

    def test_add_event(self):
        self.reset()
        comp = simplay.VisualComponent(
            self.env, "test", ComponentType.RESOURCE, "", 0)
        event = simplay.VisualEvent(
            comp.id, 0, EventAction.CONTAINER_SET_CAPACITY, test="test")
        self.manager.add_event(event)
        assert event in self.manager.events

    def test_add_event_order(self):
        self.reset()
        comp = simplay.VisualComponent(
            self.env, "test", ComponentType.RESOURCE, "", 0)
        event1 = simplay.VisualEvent(
            comp.id, 1, EventAction.MOVE_NEAR_CELL, test="test")
        event2 = simplay.VisualEvent(
            comp.id, 0, EventAction.MOVE_NEAR_CELL, test="test")
        self.manager.add_event(event1)
        self.manager.add_event(event2)
        assert self.manager.events[0] == event2
        assert self.manager.events[1] == event1

    def test_register_visual(self):
        self.reset()
        self.manager.register_visual("test", "p_test")
        assert {"id": "test", "frames": ["p_test"]} in self.manager.visuals

    def test_no_duplicate_visuals(self):
        self.reset()
        self.manager.register_visual("duplicate", "p_test")
        with pytest.raises(ValueError, match=ErrorText.ID_NOT_UNIQUE):
            self.manager.register_visual("duplicate", "p_test2")
        assert len(self.manager.visuals) == 1

    def test_no_empty_visuals(self):
        self.reset()
        with pytest.raises(
                ValueError,
                match=ErrorText.FRAMES_MUST_NOT_BE_EMPTY):
            self.manager.register_visual("id", "")
        assert len(self.manager.visuals) == 0

    def test_no_none_visuals(self):
        self.reset()
        with pytest.raises(
                TypeError,
                match=ErrorText.FRAMES_MUST_BE_LIST_OF_STRINGS):
            self.manager.register_visual("id", None)
        assert len(self.manager.visuals) == 0

    def test_no_nonstring_visual_ids(self):
        self.reset()
        with pytest.raises(TypeError, match=ErrorText.ID_MUST_BE_STRING):
            self.manager.register_visual(0, "p_test")

    def test_no_nonstring_visual_paths(self):
        self.reset()
        with pytest.raises(TypeError,
                           match=ErrorText.FRAMES_MUST_BE_LIST_OF_STRINGS):
            self.manager.register_visual("id", 0)

    def test_register_sprite(self):
        self.reset()
        self.manager.register_sprites("test", ["p_test"])
        assert {"id": "test", "frames": ["p_test"]} in self.manager.visuals

    def test_no_duplicate_sprites(self):
        self.reset()
        self.manager.register_sprites("duplicate", ["p_test"])
        with pytest.raises(ValueError, match=ErrorText.ID_NOT_UNIQUE):
            self.manager.register_sprites("duplicate", ["p_test2"])
        assert len(self.manager.visuals) == 1

    def test_no_empty_sprites(self):
        self.reset()
        with pytest.raises(
                ValueError,
                match=ErrorText.FRAMES_MUST_NOT_BE_EMPTY):
            self.manager.register_sprites("id", [])
        assert len(self.manager.visuals) == 0

    def test_no_none_sprites(self):
        self.reset()
        with pytest.raises(
                ValueError,
                match=ErrorText.FRAMES_MUST_NOT_BE_EMPTY):
            self.manager.register_sprites("id", None)
        assert len(self.manager.visuals) == 0

    def test_no_nonstring_sprite_ids(self):
        self.reset()
        with pytest.raises(TypeError, match=ErrorText.ID_MUST_BE_STRING):
            self.manager.register_sprites(0, ["p_test"])

    def test_no_nonstring_sprite_frames(self):
        self.reset()
        with pytest.raises(
                TypeError,
                match=ErrorText.FRAMES_MUST_BE_LIST_OF_STRINGS):
            self.manager.register_sprites("id", [0])

    def test_set_grid(self):
        self.reset()
        grid = simplay.VisualGrid(10, 10, 10, 10)
        self.manager.set_grid(grid)
        assert self.manager.grid == grid

    def test_set_grid_none(self):
        self.reset()
        with pytest.raises(ValueError, match=ErrorText.GRID_MUST_NOT_BE_NONE):
            self.manager.set_grid(None)

    def test_set_grid_invalid(self):
        self.reset()
        with pytest.raises(
                TypeError,
                match=ErrorText.GRID_MUST_BE_VISUAL_GRID):
            self.manager.set_grid("INVALID")
