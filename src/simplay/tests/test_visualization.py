import pytest
import src.simplay.visualization as simplay
from src.simplay.primitives import ErrorText


class TestVisualGrid:
    def test_init(self):
        grid = simplay.VisualGrid(100, 100, 10, 10)
        assert grid.width == 100
        assert grid.height == 100
        assert grid.cols == 10
        assert grid.rows == 10
        assert grid.areas == []

    def test_set_area(self):
        grid = simplay.VisualGrid(100, 100, 10, 10)
        grid.set_area("id", "name", 1, 1, 0, 0, 0)
        assert grid.areas == [
            {
                "id": "id",
                "name": "name",
                "color": 0,
                "gridDefinition": {"height": 1, "width": 1, "x": 0, "y": 0},
            }
        ]

    def test_set_area_invalid_args(self):
        grid = simplay.VisualGrid(100, 100, 10, 10)
        with pytest.raises(TypeError, match=ErrorText.ID_MUST_BE_STRING):
            grid.set_area(0, "name", 1, 1, 0, 0, 0)
        with pytest.raises(TypeError, match=ErrorText.NAME_MUST_BE_STRING):
            grid.set_area("id", 0, 1, 1, 0, 0, 0)
        with pytest.raises(TypeError,
                           match=ErrorText.HEIGHT_MUST_BE_POSITIVE_INT):
            grid.set_area("id", "name", 1.0, 1, 0, 0, 0)
        with pytest.raises(TypeError,
                           match=ErrorText.WIDTH_MUST_BE_POSITIVE_INT):
            grid.set_area("id", "name", 1, 1.0, 0, 0, 0)
        with pytest.raises(TypeError, match=ErrorText.X_MUST_BE_INT):
            grid.set_area("id", "name", 1, 1, 0.0, 0, 0)
        with pytest.raises(TypeError, match=ErrorText.Y_MUST_BE_INT):
            grid.set_area("id", "name", 1, 1, 0, 0.0, 0)
        with pytest.raises(TypeError, match=ErrorText.COLOR_MUST_BE_INT):
            grid.set_area("id", "name", 1, 1, 0, 0, 0.0)

    def test_set_area_invalid_values(self):
        grid = simplay.VisualGrid(100, 100, 10, 10)
        with pytest.raises(ValueError, match=ErrorText.X_OUT_OF_BOUNDS):
            grid.set_area("id", "name", 1, 1, -1, 0, 0)
        with pytest.raises(ValueError, match=ErrorText.X_OUT_OF_BOUNDS):
            grid.set_area("id", "name", 1, 1, 10, 0, 0)
        with pytest.raises(ValueError, match=ErrorText.Y_OUT_OF_BOUNDS):
            grid.set_area("id", "name", 1, 1, 0, -1, 0)
        with pytest.raises(ValueError, match=ErrorText.Y_OUT_OF_BOUNDS):
            grid.set_area("id", "name", 1, 1, 0, 10, 0)
        with pytest.raises(
                ValueError,
                match=ErrorText.X_OFFSET_OUT_OF_BOUNDS):
            grid.set_area("id", "name", 1, 2, 9, 0, 0)
        with pytest.raises(
                ValueError,
                match=ErrorText.Y_OFFSET_OUT_OF_BOUNDS):
            grid.set_area("id", "name", 2, 1, 0, 9, 0)
        with pytest.raises(ValueError,
                           match=ErrorText.HEIGHT_MUST_BE_POSITIVE_INT):
            grid.set_area("id", "name", 0, 1, 0, 0, 0)
        with pytest.raises(ValueError,
                           match=ErrorText.WIDTH_MUST_BE_POSITIVE_INT):
            grid.set_area("id", "name", 1, 0, 0, 0, 0)

    def test_set_area_duplicate_id(self):
        grid = simplay.VisualGrid(100, 100, 10, 10)
        grid.set_area("id", "name", 1, 1, 0, 0, 0)
        with pytest.raises(ValueError, match=ErrorText.ID_NOT_UNIQUE):
            grid.set_area("id", "name", 1, 1, 0, 0, 0)

    def test_overlapping_area_checked(self):
        grid = simplay.VisualGrid(100, 100, 10, 10)
        grid.set_area("id1", "name", 1, 1, 0, 0, 0)
        with pytest.raises(
                ValueError,
                match=ErrorText.AREA_OVERLAP):
            grid.set_area("id2", "name", 1, 1, 0, 0, 0)
