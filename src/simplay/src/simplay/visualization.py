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
        self, id: str, name: str, height: int, width: int, x: int, y: int, color: int
    ):
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
        self.areas.append(
            {
                "id": id,
                "name": name,
                "color": color,
                "gridDefinition": {"height": height, "width": width, "x": x, "y": y},
            }
        )
