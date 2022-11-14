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
        """
        if not isinstance(id, str):
            raise ValueError("id must be a string")
        if not isinstance(name, str):
            raise ValueError("name must be a string")
        if not isinstance(height, int):
            raise ValueError("height must be an integer")
        if not isinstance(width, int):
            raise ValueError("width must be an integer")
        if not isinstance(x, int):
            raise ValueError("x must be an integer")
        if not isinstance(y, int):
            raise ValueError("y must be an integer")
        if not isinstance(color, int):
            raise ValueError("color must be an integer")
        if x < 0 or x >= self.cols:
            raise ValueError("x must be between 0 and cols")
        if y < 0 or y >= self.rows:
            raise ValueError("y must be between 0 and rows")
        if x + width > self.cols:
            raise ValueError(
                "x added to width must be less than or equal to cols")
        if y + height > self.rows:
            raise ValueError(
                "y added to height must be less than or equal to rows")
        if height == 0 or width == 0:
            raise ValueError("height and width must be greater than 0")
        if self.check_overlap(id, height, width, x, y):
            raise ValueError("area overlaps with another area")
        if not self.check_areaid_unique(id):
            raise ValueError("id must be unique")
        self.areas.append(
            {
                "id": id,
                "name": name,
                "color": color,
                "gridDefinition": {"height": height, "width": width, "x": x, "y": y},
            }
        )

    def check_areaid_unique(self, id: str):
        """
        Check if an area id is unique.

        :param id: The id of the area.
        :return: True if the id is unique, False otherwise.
        """
        for area in self.areas:
            if area["id"] == id:
                return False
        return True

    def check_overlap(self, id: str, height: int, width: int, x: int, y: int):
        """
        Check if an area overlaps with another area.

        :param id: The id of the area.
        :param height: The height of the area in rows.
        :param width: The width of the area in columns.
        :param x: The x coordinate (column) of the top left corner of the area.
        :param y: The y coordinate (row) of the top left corner of the area.
        :return: True if the area overlaps with another area, False otherwise.
        """
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
