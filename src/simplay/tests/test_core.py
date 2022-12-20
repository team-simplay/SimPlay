import pytest
import simpy
import src.simplay.core as simplay
from src.simplay.core import VisualComponent
from src.simplay.primitives import ComponentType, ErrorText, EventAction

SAMPLE_BASE64 = ("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAJCAIAAA"
                 "BrBkF6AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADs"
                 "MAAA7DAcdvqGQAAAA5SURBVChTY/hPCFCgYsWKFa2trUAGigq4KBAAGQwMIF"
                 "kUFXBRZIDTFjggTgWy9ZgApAKr9VDw/z8AS5ITTSmJ+xoAAAAASUVORK5CYI"
                 "I=")
SAMPLE_IMG_PATH = "tests/sample.png"


class TestVisualEnvironment:
    def test_visualEnvironment(self):
        env = simplay.VisualEnvironment()
        assert env.visualization_manager is not None


class TestNonSimComponentShortHand:
    def test_create_custom_component_min(self):
        env = simplay.VisualEnvironment()
        component = VisualComponent.create_custom_component(env,
                                                            "test",
                                                            "TEST")
        assert {
            "id": "test",
            "type": ComponentType.CUSTOM.value,
            "visual": "TEST",
            "tint": 0xFFFFFF,
        } in env.visualization_manager.entities
        assert env.visualization_manager.events[0].for_id == "test"
        assert env.visualization_manager.events[0].timestamp == 0
        assert (env.visualization_manager.events[0].action ==
                EventAction.SET_POSITION.value)
        assert env.visualization_manager.events[0].args == {"x": 0, "y": 0}

    def test_create_custom_component_visibility(self):
        env = simplay.VisualEnvironment()
        component = VisualComponent.create_custom_component(env,
                                                            "test",
                                                            "TEST",
                                                            visible=True)
        assert {
            "id": "test",
            "type": ComponentType.CUSTOM.value,
            "visual": "TEST",
            "tint": 0xFFFFFF,
        } in env.visualization_manager.entities
        assert env.visualization_manager.events[0].for_id == "test"
        assert env.visualization_manager.events[0].timestamp == 0
        assert (env.visualization_manager.events[0].action ==
                EventAction.SET_POSITION.value)
        assert env.visualization_manager.events[0].args == {"x": 0, "y": 0}
        assert env.visualization_manager.events[1].for_id == "test"
        assert env.visualization_manager.events[1].timestamp == 0
        assert (env.visualization_manager.events[1].action ==
                EventAction.SET_VISIBLE.value)
        assert env.visualization_manager.events[1].args == {"visible": True}


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

    def test_is_visible(self):
        env = simplay.VisualEnvironment()
        component = simplay.VisualComponent(
            env, "id", ComponentType.CUSTOM, "", 0)
        component.is_visible()
        assert env.visualization_manager.events[0].for_id == "id"
        assert env.visualization_manager.events[0].timestamp == 0
        assert (env.visualization_manager.events[0].action ==
                EventAction.SET_VISIBLE.value)
        assert env.visualization_manager.events[0].args == {"visible": True}

    def test_is_invisible(self):
        env = simplay.VisualEnvironment()
        component = simplay.VisualComponent(
            env, "id", ComponentType.CUSTOM, "", 0)
        component.is_invisible()
        assert env.visualization_manager.events[0].for_id == "id"
        assert env.visualization_manager.events[0].timestamp == 0
        assert (env.visualization_manager.events[0].action ==
                EventAction.SET_VISIBLE.value)
        assert env.visualization_manager.events[0].args == {"visible": False}

    def test_is_at(self):
        env = simplay.VisualEnvironment()
        component = simplay.VisualComponent(
            env, "id", ComponentType.CUSTOM, "", 0)
        component.is_at(1, 2)
        assert env.visualization_manager.events[0].for_id == "id"
        assert env.visualization_manager.events[0].timestamp == 0
        assert (env.visualization_manager.events[0].action ==
                EventAction.SET_POSITION.value)
        assert env.visualization_manager.events[0].args == {"x": 1, "y": 2}

    def test_is_interacting_with(self):
        env = simplay.VisualEnvironment()
        component = simplay.VisualComponent(
            env, "id", ComponentType.CUSTOM, "", 0)
        other_component = simplay.VisualComponent(
            env, "other_id", ComponentType.CUSTOM, "", 0)
        with pytest.raises(
            TypeError, match=ErrorText.TARGET_MUST_BE_VISUAL_COMPONENT
        ):
            component.is_interacting_with(0)
        component.is_interacting_with(other_component)
        assert env.visualization_manager.events[0].for_id == "id"
        assert env.visualization_manager.events[0].timestamp == 0
        assert (env.visualization_manager.events[0].action ==
                EventAction.SET_INTERACTING.value)
        assert env.visualization_manager.events[0].args == {
            "with_id": "other_id"}

    def test_is_no_longer_interacting_with(self):
        env = simplay.VisualEnvironment()
        component = simplay.VisualComponent(
            env, "id", ComponentType.CUSTOM, "", 0)
        other_component = simplay.VisualComponent(
            env, "other_id", ComponentType.CUSTOM, "", 0)
        manager = env.visualization_manager
        with pytest.raises(
            TypeError, match=ErrorText.TARGET_MUST_BE_VISUAL_COMPONENT
        ):
            component.is_no_longer_interacting_with(0)
        component.is_no_longer_interacting_with(other_component)
        assert manager.events[0].for_id == "id"
        assert manager.events[0].timestamp == 0
        assert (manager.events[0].action ==
                EventAction.SET_NOT_INTERACTING.value)
        assert manager.events[0].args == {
            "with_id": "other_id"}

    def test_is_near(self):
        env = simplay.VisualEnvironment()
        component = simplay.VisualComponent(
            env, "id", ComponentType.CUSTOM, "", 0)
        other_component = simplay.VisualComponent(
            env, "other_id", ComponentType.CUSTOM, "", 0)
        with pytest.raises(
            TypeError, match=ErrorText.TARGET_MUST_BE_VISUAL_COMPONENT
        ):
            component.is_near(0)
        component.is_near(other_component)
        assert env.visualization_manager.events[0].for_id == "id"
        assert env.visualization_manager.events[0].timestamp == 0
        assert (env.visualization_manager.events[0].action ==
                EventAction.MOVE_NEAR.value)
        assert env.visualization_manager.events[0].args == {
            "target_id": "other_id"}

    def test_is_near_cell(self):
        env = simplay.VisualEnvironment()
        component = simplay.VisualComponent(
            env, "id", ComponentType.CUSTOM, "", 0)
        component.is_near_cell(1, 2)
        assert env.visualization_manager.events[0].for_id == "id"
        assert env.visualization_manager.events[0].timestamp == 0
        assert (env.visualization_manager.events[0].action ==
                EventAction.MOVE_NEAR_CELL.value)
        assert env.visualization_manager.events[0].args == {
            "x": 1, "y": 2}

    def test_has_tint(self):
        env = simplay.VisualEnvironment()
        component = simplay.VisualComponent(
            env, "id", ComponentType.CUSTOM, "", 0)
        component.has_tint(0xFFFFFF)
        assert env.visualization_manager.events[0].for_id == "id"
        assert env.visualization_manager.events[0].timestamp == 0
        assert (env.visualization_manager.events[0].action ==
                EventAction.SET_TINT_COLOR.value)
        assert env.visualization_manager.events[0].args == {"color": 0xFFFFFF}

    def test_has_original_tint(self):
        env = simplay.VisualEnvironment()
        component = simplay.VisualComponent(env, "id", ComponentType.CUSTOM,
                                            "", 0x000000)
        component.has_original_tint()
        assert env.visualization_manager.events[0].for_id == "id"
        assert env.visualization_manager.events[0].timestamp == 0
        assert (env.visualization_manager.events[0].action ==
                EventAction.SET_TINT_COLOR.value)
        assert env.visualization_manager.events[0].args == {"color": 0x000000}

    def test_has_decorating_text(self):
        env = simplay.VisualEnvironment()
        component = simplay.VisualComponent(
            env, "id", ComponentType.CUSTOM, "", 0)
        manager = env.visualization_manager
        component.has_decorating_text("text")
        assert manager.events[0].for_id == "id"
        assert manager.events[0].timestamp == 0
        assert (manager.events[0].action ==
                EventAction.SET_DECORATING_TEXT.value)
        assert manager.events[0].args == {"text": "text"}

    def test_has_frame(self):
        env = simplay.VisualEnvironment()
        component = simplay.VisualComponent(
            env, "id", ComponentType.CUSTOM, "", 0)
        manager = env.visualization_manager
        component.has_frame(0)
        assert manager.events[0].for_id == "id"
        assert manager.events[0].timestamp == 0
        assert (manager.events[0].action ==
                EventAction.SET_SPRITE_FRAME.value)
        assert manager.events[0].args == {"frame": 0}


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
        self.manager.register_visual("test", SAMPLE_IMG_PATH)
        assert {"id": "test", "frames": [
            SAMPLE_BASE64]} in self.manager.visuals

    def test_no_duplicate_visuals(self):
        self.reset()
        self.manager.register_visual("duplicate", SAMPLE_IMG_PATH)
        with pytest.raises(ValueError, match=ErrorText.ID_NOT_UNIQUE):
            self.manager.register_visual("duplicate", SAMPLE_IMG_PATH)
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
            self.manager.register_visual(0, SAMPLE_IMG_PATH)

    def test_no_nonstring_visual_paths(self):
        self.reset()
        with pytest.raises(TypeError,
                           match=ErrorText.FRAMES_MUST_BE_LIST_OF_STRINGS):
            self.manager.register_visual("id", 0)

    def test_register_sprite(self):
        self.reset()
        self.manager.register_sprites("test", [SAMPLE_IMG_PATH])
        assert {"id": "test", "frames": [
            SAMPLE_BASE64]} in self.manager.visuals

    def test_no_duplicate_sprites(self):
        self.reset()
        self.manager.register_sprites("duplicate", [SAMPLE_IMG_PATH])
        with pytest.raises(ValueError, match=ErrorText.ID_NOT_UNIQUE):
            self.manager.register_sprites("duplicate", [SAMPLE_IMG_PATH])
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
            self.manager.register_sprites(0, [SAMPLE_IMG_PATH])

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
