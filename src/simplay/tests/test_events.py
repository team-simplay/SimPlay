import pytest
import src.simplay.events as simplay


def test_visual_event():
    event = simplay.VisualEvent(
        "id", 0, "action", arg1="value1", arg2="value2")
    assert event.for_id == "id"
    assert event.timestamp == 0
    assert event.action == "action"
    assert event.args == {"arg1": "value1", "arg2": "value2"}


def test_visual_event_invalid_args():
    with pytest.raises(ValueError, match="for_id must be a string"):
        simplay.VisualEvent(0, 0, "action")
    with pytest.raises(ValueError, match="timestamp must be a number"):
        simplay.VisualEvent("id", "0", "action")
    with pytest.raises(ValueError, match="action must be a string"):
        simplay.VisualEvent("id", 0, 0)


def test_set_visible():
    event = simplay.SetVisible("id", 0, True)
    assert event.for_id == "id"
    assert event.timestamp == 0
    assert event.action == "SET_VISIBLE"
    assert event.args == {"visible": True}


def test_set_visible_invalid_args():
    with pytest.raises(ValueError, match="visible must be a boolean"):
        simplay.SetVisible("id", 0, 0)


def test_set_position():
    event = simplay.SetPosition("id", 0, 1, 2)
    assert event.for_id == "id"
    assert event.timestamp == 0
    assert event.action == "SET_POSITION"
    assert event.args == {"x": 1, "y": 2}


def test_set_position_invalid_args():
    with pytest.raises(ValueError, match="x must be an integer"):
        simplay.SetPosition("id", 0, 1.0, 2)
    with pytest.raises(ValueError, match="y must be an integer"):
        simplay.SetPosition("id", 0, 1, 2.0)


def test_set_interacting():
    event = simplay.SetInteracting("id", 0, "other_id")
    assert event.for_id == "id"
    assert event.timestamp == 0
    assert event.action == "SET_INTERACTING"
    assert event.args == {"with_id": "other_id"}


def test_set_interacting_invalid_args():
    with pytest.raises(ValueError, match="with_id must be a string"):
        simplay.SetInteracting("id", 0, 0)


def test_set_not_interacting():
    event = simplay.SetNotInteracting("id", 0, "other_id")
    assert event.for_id == "id"
    assert event.timestamp == 0
    assert event.action == "SET_NOT_INTERACTING"
    assert event.args == {"with_id": "other_id"}


def test_set_not_interacting_invalid_args():
    with pytest.raises(ValueError, match="with_id must be a string"):
        simplay.SetNotInteracting("id", 0, 0)


def test_move_near():
    event = simplay.MoveNear("id", 0, "other_id")
    assert event.for_id == "id"
    assert event.timestamp == 0
    assert event.action == "MOVE_NEAR"
    assert event.args == {"target_id": "other_id"}


def test_move_near_invalid_args():
    with pytest.raises(ValueError, match="target_id must be a string"):
        simplay.MoveNear("id", 0, 0)


def test_move_near_cell():
    event = simplay.MoveNearCell("id", 0, 1, 2)
    assert event.for_id == "id"
    assert event.timestamp == 0
    assert event.action == "MOVE_NEAR_CELL"
    assert event.args == {"x": 1, "y": 2}


def test_move_near_cell_invalid_args():
    with pytest.raises(ValueError, match="x must be an integer"):
        simplay.MoveNearCell("id", 0, 1.0, 2)
    with pytest.raises(ValueError, match="y must be an integer"):
        simplay.MoveNearCell("id", 0, 1, 2.0)


def test_set_tint_color():
    event = simplay.SetTintColor("id", 0, 1)
    assert event.for_id == "id"
    assert event.timestamp == 0
    assert event.action == "SET_TINT_COLOR"
    assert event.args == {"color": 1}


def test_set_tint_color_invalid_args():
    with pytest.raises(ValueError, match="color must be an integer"):
        simplay.SetTintColor("id", 0, "blue")


def test_set_decorating_text():
    event = simplay.SetDecoratingText("id", 0, "text")
    assert event.for_id == "id"
    assert event.timestamp == 0
    assert event.action == "SET_DECORATING_TEXT"
    assert event.args == {"text": "text"}


def test_set_decorating_text_invalid_args():
    with pytest.raises(ValueError, match="text must be a string"):
        simplay.SetDecoratingText("id", 0, 0)


def test_set_sprite_frame():
    event = simplay.SetSpriteFrame("id", 0, 1)
    assert event.for_id == "id"
    assert event.timestamp == 0
    assert event.action == "SET_SPRITE_FRAME"
    assert event.args == {"frame": 1}


def test_set_sprite_frame_invalid_args():
    with pytest.raises(ValueError, match="frame must be an integer"):
        simplay.SetSpriteFrame("id", 0, "the third one")


def test_resource_set_capacity():
    event = simplay.ResourceSetCapacity("id", 0, 1)
    assert event.for_id == "id"
    assert event.timestamp == 0
    assert event.action == "RESOURCE.SET_CAPACITY"
    assert event.args == {"capacity": 1}


def test_resource_set_capacity_invalid_args():
    with pytest.raises(ValueError, match="capacity must be an integer"):
        simplay.ResourceSetCapacity("id", 0, 1.0)


def test_resource_set_utilization():
    event = simplay.ResourceSetUtilization("id", 0, 1)
    assert event.for_id == "id"
    assert event.timestamp == 0
    assert event.action == "RESOURCE.SET_UTILIZATION"
    assert event.args == {"utilization": 1}


def test_resource_set_utilization_invalid_args():
    with pytest.raises(ValueError, match="utilization must be an integer"):
        simplay.ResourceSetUtilization("id", 0, 1.0)


def test_container_set_capacity():
    event = simplay.ContainerSetCapacity("id", 0, 1)
    assert event.for_id == "id"
    assert event.timestamp == 0
    assert event.action == "CONTAINER.SET_CAPACITY"
    assert event.args == {"capacity": 1}


def test_container_set_capacity_invalid_args():
    with pytest.raises(ValueError, match="capacity must be an integer"):
        simplay.ContainerSetCapacity("id", 0, 1.0)


def test_container_set_level():
    event = simplay.ContainerSetLevel("id", 0, 1)
    assert event.for_id == "id"
    assert event.timestamp == 0
    assert event.action == "CONTAINER.SET_LEVEL"
    assert event.args == {"level": 1}


def test_container_set_level_invalid_args():
    with pytest.raises(ValueError, match="level must be a number"):
        simplay.ContainerSetLevel("id", 0, "three")


def test_store_set_capacity():
    event = simplay.StoreSetCapacity("id", 0, 1)
    assert event.for_id == "id"
    assert event.timestamp == 0
    assert event.action == "STORE.SET_CAPACITY"
    assert event.args == {"capacity": 1}


def test_store_set_capacity_invalid_args():
    with pytest.raises(ValueError, match="capacity must be a float or integer"):
        simplay.StoreSetCapacity("id", 0, "twenty")


def test_store_set_content():
    event = simplay.StoreSetContent("id", 0, 1)
    assert event.for_id == "id"
    assert event.timestamp == 0
    assert event.action == "STORE.SET_CONTENT"
    assert event.args == {"content": 1}
