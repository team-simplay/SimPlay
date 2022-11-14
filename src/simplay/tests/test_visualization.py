import pytest
import src.simplay.visualization as simplay

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
        with pytest.raises(ValueError, match="id must be a string"):
            grid.set_area(0, "name", 1, 1, 0, 0, 0)
        with pytest.raises(ValueError, match="name must be a string"):
            grid.set_area("id", 0, 1, 1, 0, 0, 0)
        with pytest.raises(ValueError, match="height must be an integer"):
            grid.set_area("id", "name", 1.0, 1, 0, 0, 0)
        with pytest.raises(ValueError, match="width must be an integer"):
            grid.set_area("id", "name", 1, 1.0, 0, 0, 0)
        with pytest.raises(ValueError, match="x must be an integer"):
            grid.set_area("id", "name", 1, 1, 0.0, 0, 0)
        with pytest.raises(ValueError, match="y must be an integer"):
            grid.set_area("id", "name", 1, 1, 0, 0.0, 0)
        with pytest.raises(ValueError, match="color must be an integer"):
            grid.set_area("id", "name", 1, 1, 0, 0, 0.0)
    
    def test_set_area_invalid_values(self):
        grid = simplay.VisualGrid(100, 100, 10, 10)
        with pytest.raises(ValueError, match="x must be between 0 and cols"):
            grid.set_area("id", "name", 1, 1, -1, 0, 0)
        with pytest.raises(ValueError, match="x must be between 0 and cols"):
            grid.set_area("id", "name", 1, 1, 10, 0, 0)
        with pytest.raises(ValueError, match="y must be between 0 and rows"):
            grid.set_area("id", "name", 1, 1, 0, -1, 0)
        with pytest.raises(ValueError, match="y must be between 0 and rows"):
            grid.set_area("id", "name", 1, 1, 0,10, 0)
        with pytest.raises(ValueError, match="x added to width must be less than or equal to cols"):
            grid.set_area("id", "name", 1, 2, 9, 0, 0)
        with pytest.raises(ValueError, match="y added to height must be less than or equal to rows"):
            grid.set_area("id", "name", 2, 1, 0, 9, 0)
        with pytest.raises(ValueError, match="height and width must be greater than 0"):
            grid.set_area("id", "name", 0, 1, 0, 0, 0)
        with pytest.raises(ValueError, match="height and width must be greater than 0"):
            grid.set_area("id", "name", 1, 0, 0, 0, 0)
    
    def test_set_area_duplicate_id(self):
        grid = simplay.VisualGrid(100, 100, 10, 10)
        grid.set_area("id", "name", 1, 1, 0, 0, 0)
        with pytest.raises(ValueError, match="id must be unique"):
            grid.set_area("id", "name", 1, 1, 0, 0, 0)
    
    def test_overlapping_area_checked(self):
        grid = simplay.VisualGrid(100, 100, 10, 10)
        grid.set_area("id1", "name", 1, 1, 0, 0, 0)
        with pytest.raises(ValueError, match="area overlaps with another area"):
            grid.set_area("id2", "name", 1, 1, 0, 0, 0)