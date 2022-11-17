import pytest
from src.simplay.internals import ComponentType, ErrorText, EventAction
import src.simplay.core as simplay

env = simplay.VisualEnvironment()
comp = simplay.VisualComponent(env, "id", ComponentType.CONTAINER, "", 0)


def test_visual_event():
    event = simplay.VisualEvent(
        comp, 0, EventAction.MOVE_NEAR, arg1="value1", arg2="value2")
    assert event.for_id == "id"
    assert event.timestamp == 0
    assert event.action == EventAction.MOVE_NEAR.value
    assert event.args == {"arg1": "value1", "arg2": "value2"}


def test_visual_event_invalid_args():
    with pytest.raises(TypeError,
                       match=ErrorText.COMPONENT_MUST_BE_VISUAL_COMPONENT):
        simplay.VisualEvent(12, 0, EventAction.MOVE_NEAR)
    with pytest.raises(TypeError,
                       match=ErrorText.TIMESTAMP_MUST_BE_INT_OR_FLOAT):
        simplay.VisualEvent(comp, "0", EventAction.MOVE_NEAR)
    with pytest.raises(TypeError,
                       match=ErrorText.ACTION_MUST_BE_EVENTACTION):
        simplay.VisualEvent(comp, 0, 0)


def test_set_visible():
    event = simplay.SetVisible(comp, 0, True)
    assert event.for_id == "id"
    assert event.timestamp == 0
    assert event.action == EventAction.SET_VISIBLE.value
    assert event.args == {"visible": True}


def test_set_visible_invalid_args():
    with pytest.raises(TypeError, match=ErrorText.VISIBLE_MUST_BE_BOOL):
        simplay.SetVisible(comp, 0, 0)


def test_set_position():
    event = simplay.SetPosition(comp, 0, 1, 2)
    assert event.for_id == "id"
    assert event.timestamp == 0
    assert event.action == EventAction.SET_POSITION.value
    assert event.args == {"x": 1, "y": 2}


def test_set_position_invalid_args():
    with pytest.raises(TypeError, match=ErrorText.X_MUST_BE_INT):
        simplay.SetPosition(comp, 0, 1.0, 2)
    with pytest.raises(TypeError, match=ErrorText.Y_MUST_BE_INT):
        simplay.SetPosition(comp, 0, 1, 2.0)


def test_set_interacting():
    event = simplay.SetInteracting(comp, 0, "other_id")
    assert event.for_id == "id"
    assert event.timestamp == 0
    assert event.action == EventAction.SET_INTERACTING.value
    assert event.args == {"with_id": "other_id"}


def test_set_interacting_invalid_args():
    with pytest.raises(TypeError, match=ErrorText.WITHID_MUST_BE_STRING):
        simplay.SetInteracting(comp, 0, 0)


def test_set_not_interacting():
    event = simplay.SetNotInteracting(comp, 0, "other_id")
    assert event.for_id == "id"
    assert event.timestamp == 0
    assert event.action == EventAction.SET_NOT_INTERACTING.value
    assert event.args == {"with_id": "other_id"}


def test_set_not_interacting_invalid_args():
    with pytest.raises(TypeError, match=ErrorText.WITHID_MUST_BE_STRING):
        simplay.SetNotInteracting(comp, 0, 0)


def test_move_near():
    event = simplay.MoveNear(comp, 0, "other_id")
    assert event.for_id == "id"
    assert event.timestamp == 0
    assert event.action == EventAction.MOVE_NEAR.value
    assert event.args == {"target_id": "other_id"}


def test_move_near_invalid_args():
    with pytest.raises(TypeError, match=ErrorText.TARGETID_MUST_BE_STRING):
        simplay.MoveNear(comp, 0, 0)


def test_move_near_cell():
    event = simplay.MoveNearCell(comp, 0, 1, 2)
    assert event.for_id == "id"
    assert event.timestamp == 0
    assert event.action == EventAction.MOVE_NEAR_CELL.value
    assert event.args == {"x": 1, "y": 2}


def test_move_near_cell_invalid_args():
    with pytest.raises(TypeError, match=ErrorText.X_MUST_BE_INT):
        simplay.MoveNearCell("id", 0, 1.0, 2)
    with pytest.raises(TypeError, match=ErrorText.Y_MUST_BE_INT):
        simplay.MoveNearCell("id", 0, 1, 2.0)


def test_set_tint_color():
    event = simplay.SetTintColor(comp, 0, 1)
    assert event.for_id == "id"
    assert event.timestamp == 0
    assert event.action == EventAction.SET_TINT_COLOR.value
    assert event.args == {"color": 1}


def test_set_tint_color_invalid_args():
    with pytest.raises(TypeError, match=ErrorText.COLOR_MUST_BE_INT):
        simplay.SetTintColor(comp, 0, "blue")


def test_set_decorating_text():
    event = simplay.SetDecoratingText(comp, 0, "text")
    assert event.for_id == "id"
    assert event.timestamp == 0
    assert event.action == EventAction.SET_DECORATING_TEXT.value
    assert event.args == {"text": "text"}


def test_set_decorating_text_invalid_args():
    with pytest.raises(TypeError, match=ErrorText.TEXT_MUST_BE_STRING):
        simplay.SetDecoratingText(comp, 0, 0)


def test_set_sprite_frame():
    event = simplay.SetSpriteFrame(comp, 0, 1)
    assert event.for_id == "id"
    assert event.timestamp == 0
    assert event.action == EventAction.SET_SPRITE_FRAME.value
    assert event.args == {"frame": 1}


def test_set_sprite_frame_invalid_args():
    with pytest.raises(TypeError, match=ErrorText.FRAME_MUST_BE_INT):
        simplay.SetSpriteFrame(comp, 0, "the third one")


def test_resource_set_capacity():
    event = simplay.ResourceSetCapacity(comp, 0, 1)
    assert event.for_id == "id"
    assert event.timestamp == 0
    assert event.action == EventAction.RESOURCE_SET_CAPACITY.value
    assert event.args == {"capacity": 1}


def test_resource_set_capacity_invalid_args():
    with pytest.raises(TypeError,
                       match=ErrorText.CAPACITY_MUST_BE_POSITIVE_INT):
        simplay.ResourceSetCapacity("id", 0, 1.0)


def test_resource_set_utilization():
    event = simplay.ResourceSetUtilization(comp, 0, 1)
    assert event.for_id == "id"
    assert event.timestamp == 0
    assert event.action == EventAction.RESOURCE_SET_UTILIZATION.value
    assert event.args == {"utilization": 1}


def test_resource_set_utilization_invalid_args():
    with pytest.raises(TypeError, match=ErrorText.UTILIZATION_MUST_BE_INT):
        simplay.ResourceSetUtilization(comp, 0, 1.0)


def test_container_set_capacity():
    event = simplay.ContainerSetCapacity(comp, 0, 1)
    assert event.for_id == "id"
    assert event.timestamp == 0
    assert event.action == EventAction.CONTAINER_SET_CAPACITY.value
    assert event.args == {"capacity": 1}


def test_container_set_capacity_invalid_args():
    with pytest.raises(TypeError,
                       match=ErrorText.CAPACITY_MUST_BE_POSITIVE_INT_OR_FLOAT):
        simplay.ContainerSetCapacity(comp, 0, "zehn")


def test_container_set_level():
    event = simplay.ContainerSetLevel(comp, 0, 1)
    assert event.for_id == "id"
    assert event.timestamp == 0
    assert event.action == EventAction.CONTAINER_SET_LEVEL.value
    assert event.args == {"level": 1}


def test_container_set_level_invalid_args():
    with pytest.raises(TypeError,
                       match=ErrorText.LEVEL_MUST_BE_POSITIVE_INT_OR_FLOAT):
        simplay.ContainerSetLevel(comp, 0, "three")


def test_store_set_capacity():
    event = simplay.StoreSetCapacity(comp, 0, 1)
    assert event.for_id == "id"
    assert event.timestamp == 0
    assert event.action == EventAction.STORE_SET_CAPACITY.value
    assert event.args == {"capacity": 1}


def test_store_set_capacity_invalid_args():
    with pytest.raises(TypeError,
                       match=ErrorText.CAPACITY_MUST_BE_POSITIVE_INT_OR_FLOAT):
        simplay.StoreSetCapacity(comp, 0, "twenty")


def test_store_set_content():
    event = simplay.StoreSetContent(comp, 0, 1)
    assert event.for_id == "id"
    assert event.timestamp == 0
    assert event.action == EventAction.STORE_SET_CONTENT.value
    assert event.args == {"content": 1}
