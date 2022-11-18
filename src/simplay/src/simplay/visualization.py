
from .primitives import ErrorText


class VisualGrid:
    """
    This class represents a grid for the visualization.

    :param width: The width of the grid in pixels.
    :param height: The height of the grid in pixels.
    :param cols: The number of columns in the grid.
    :param rows: The number of rows in the grid.
    """

    def __init__(self, width: int, height: int, cols: int, rows: int):
        self.width = width
        self.height = height
        self.cols = cols
        self.rows = rows
        self.areas = []

    def set_area(
            self,
            id: str,
            name: str,
            height: int,
            width: int,
            x: int,
            y: int,
            color: int):
        """
        Set an area in the grid.

        :param id: The id of the area.
        :param name: The name of the area.
        :param height: The height of the area in rows.
        :param width: The width of the area in columns.
        :param x: The x coordinate (column) of the top left corner of the area.
        :param y: The y coordinate (row) of the top left corner of the area.
        :param color: The color of the area.
        :raises TypeError: If the id is not a string.
        :raises TypeError: If the name is not a string.
        :raises TypeError: If the height is not a positive integer.
        :raises TypeError: If the width is not a positive integer.
        :raises TypeError: If the x is not an integer.
        :raises TypeError: If the y is not an integer.
        :raises TypeError: If the color is not an integer.
        :raises ValueError: If the id is not unique.
        :raises ValueError: If the area overlaps with another area.
        :raises ValueError: If x is negative or greater than the number of
            columns.
        :raises ValueError: If y is negative or greater than the number of
            rows.
        :raises ValueError: If x + width is greater than the number of columns.
        :raises ValueError: If y + height is greater than the number of rows.
        """
        if not isinstance(id, str):
            raise TypeError(ErrorText.ID_MUST_BE_STRING)
        if not isinstance(name, str):
            raise TypeError(ErrorText.NAME_MUST_BE_STRING)
        if not isinstance(height, int):
            raise TypeError(ErrorText.HEIGHT_MUST_BE_POSITIVE_INT)
        if height <= 0:
            raise ValueError(ErrorText.HEIGHT_MUST_BE_POSITIVE_INT)
        if not isinstance(width, int):
            raise TypeError(ErrorText.WIDTH_MUST_BE_POSITIVE_INT)
        if width <= 0:
            raise ValueError(ErrorText.WIDTH_MUST_BE_POSITIVE_INT)
        if not isinstance(x, int):
            raise TypeError(ErrorText.X_MUST_BE_INT)
        if not isinstance(y, int):
            raise TypeError(ErrorText.Y_MUST_BE_INT)
        if not isinstance(color, int):
            raise TypeError(ErrorText.COLOR_MUST_BE_INT)
        if x < 0 or x >= self.cols:
            raise ValueError(ErrorText.X_OUT_OF_BOUNDS)
        if y < 0 or y >= self.rows:
            raise ValueError(ErrorText.Y_OUT_OF_BOUNDS)
        if x + width > self.cols:
            raise ValueError(ErrorText.X_OFFSET_OUT_OF_BOUNDS)
        if y + height > self.rows:
            raise ValueError(ErrorText.Y_OFFSET_OUT_OF_BOUNDS)
        if self._check_overlap(id, height, width, x, y):
            raise ValueError(ErrorText.AREA_OVERLAP)
        if not self._check_areaid_unique(id):
            raise ValueError(ErrorText.ID_NOT_UNIQUE)
        self.areas.append(
            {
                "id": id,
                "name": name,
                "color": color,
                "gridDefinition": {
                    "height": height,
                    "width": width,
                    "x": x,
                    "y": y
                },
            }
        )

    def _check_areaid_unique(self, id: str):
        for area in self.areas:
            if area["id"] == id:
                return False
        return True

    def _check_overlap(self, id: str, height: int, width: int, x: int, y: int):
        for area in self.areas:
            if area["id"] == id:
                continue
            area_x = area["gridDefinition"]["x"]
            area_y = area["gridDefinition"]["y"]
            area_width = area["gridDefinition"]["width"]
            area_height = area["gridDefinition"]["height"]
            if (
                x + width > area_x
                and x < area_x + area_width
                and y + height > area_y
                and y < area_y + area_height
            ):
                return True
        return False
