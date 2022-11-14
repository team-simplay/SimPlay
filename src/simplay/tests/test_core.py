import pytest
import simpy
import src.simplay.core as simplay


class TestVisualEnvironment:
    def test_visualEnvironment(self):
        env = simplay.VisualEnvironment()
        assert env.visualization_manager is not None


class TestVisualComponent:
    def test_visualComponent(self):
        env = simplay.VisualEnvironment()
        _ = simplay.VisualComponent(env, "test", "RESOURCE", "", 0)
        assert {
            "id": "test",
            "type": "RESOURCE",
            "graphic": "",
            "tint": 0,
        } in env.visualization_manager.entities

    def test_invalid_component_type(self):
        env = simplay.VisualEnvironment()
        with pytest.raises(ValueError, match="Invalid component type."):
            _ = simplay.VisualComponent(env, "test", "INVALID", "", 0)

    def test_invalid_id(self):
        env = simplay.VisualEnvironment()
        with pytest.raises(ValueError, match="Id must be a string."):
            _ = simplay.VisualComponent(env, 0, "RESOURCE", "", 0)

    def test_invalid_env(self):
        env = simpy.Environment()
        with pytest.raises(
                ValueError,
                match="Env must be of type VisualEnvironment."):
            _ = simplay.VisualComponent(env, "test", "RESOURCE", "", 0)

    def test_invalid_graphic(self):
        env = simplay.VisualEnvironment()
        with pytest.raises(ValueError, match="Graphic must be a string."):
            _ = simplay.VisualComponent(env, "test", "RESOURCE", 0, 0)

    def test_invalid_tint(self):
        env = simplay.VisualEnvironment()
        with pytest.raises(ValueError, match="Tint must be an integer."):
            _ = simplay.VisualComponent(env, "test", "RESOURCE", "", "")


class TestVisualizationManager:
    def reset(self):
        self.env = simplay.VisualEnvironment()
        self.manager = self.env.visualization_manager

    def test_add_entity(self):
        self.reset()
        _ = simplay.VisualComponent(self.env, "test", "RESOURCE", "", 0)
        assert {
            "id": "test",
            "type": "RESOURCE",
            "graphic": "",
            "tint": 0,
        } in self.manager.entities

    def test_invalid_entity_type(self):
        self.reset()
        with pytest.raises(ValueError, match="Invalid entity type."):
            compo = simplay.VisualComponent(
                self.env, "test", "RESOURCE", "", 0)
            self.manager.add_entity(compo, "INVALID")

    def test_add_event(self):
        self.reset()
        event = simplay.VisualEvent("test", 0, "test", test="test")
        self.manager.add_event(event)
        assert event in self.manager.events

    def test_add_event_order(self):
        self.reset()
        event1 = simplay.VisualEvent("test", 1, "test", test="test")
        event2 = simplay.VisualEvent("test", 0, "test", test="test")
        self.manager.add_event(event1)
        self.manager.add_event(event2)
        assert self.manager.events[0] == event2
        assert self.manager.events[1] == event1

    def test_register_visual(self):
        self.reset()
        self.manager.register_visual("test", "p_test")
        assert {"id": "test", "path": "p_test"} in self.manager.visuals

    def test_no_duplicate_visuals(self):
        self.reset()
        self.manager.register_visual("duplicate", "p_test")
        with pytest.raises(ValueError, match="Visual id must be unique."):
            self.manager.register_visual("duplicate", "p_test2")
        assert len(self.manager.visuals) == 1

    def test_no_empty_visuals(self):
        self.reset()
        with pytest.raises(
                ValueError,
                match="Visual path must not be None / empty."):
            self.manager.register_visual("id", "")
        assert len(self.manager.visuals) == 0

    def test_no_none_visuals(self):
        self.reset()
        with pytest.raises(
                ValueError,
                match="Visual path must not be None / empty."):
            self.manager.register_visual("id", None)
        assert len(self.manager.visuals) == 0

    def test_no_nonstring_visual_ids(self):
        self.reset()
        with pytest.raises(ValueError, match="Visual id must be a string."):
            self.manager.register_visual(0, "p_test")

    def test_no_nonstring_visual_paths(self):
        self.reset()
        with pytest.raises(ValueError, match="Visual path must be a string."):
            self.manager.register_visual("id", 0)

    def test_register_sprite(self):
        self.reset()
        self.manager.register_sprite("test", ["p_test"])
        assert {"id": "test", "frames": ["p_test"]} in self.manager.sprites

    def test_no_duplicate_sprites(self):
        self.reset()
        self.manager.register_sprite("duplicate", ["p_test"])
        with pytest.raises(ValueError, match="Sprite id must be unique."):
            self.manager.register_sprite("duplicate", ["p_test2"])
        assert len(self.manager.sprites) == 1

    def test_no_empty_sprites(self):
        self.reset()
        with pytest.raises(
                ValueError,
                match="Sprite frames must not be None / empty."):
            self.manager.register_sprite("id", [])
        assert len(self.manager.sprites) == 0

    def test_no_none_sprites(self):
        self.reset()
        with pytest.raises(
                ValueError,
                match="Sprite frames must not be None / empty."):
            self.manager.register_sprite("id", None)
        assert len(self.manager.sprites) == 0

    def test_no_nonstring_sprite_ids(self):
        self.reset()
        with pytest.raises(ValueError, match="Sprite id must be a string."):
            self.manager.register_sprite(0, ["p_test"])

    def test_no_nonstring_sprite_frames(self):
        self.reset()
        with pytest.raises(
                ValueError,
                match="Sprite frames must be a list of strings."):
            self.manager.register_sprite("id", [0])

    def test_set_grid(self):
        self.reset()
        grid = simplay.VisualGrid(10, 10, 10, 10)
        self.manager.set_grid(grid)
        assert self.manager.grid == grid

    def test_set_grid_none(self):
        self.reset()
        with pytest.raises(ValueError, match="Grid must not be None."):
            self.manager.set_grid(None)

    def test_set_grid_invalid(self):
        self.reset()
        with pytest.raises(
                ValueError,
                match="Grid must be of type VisualGrid."):
            self.manager.set_grid("INVALID")
