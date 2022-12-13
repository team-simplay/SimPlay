Getting started
============================================

with simplay
------------

SimPlay is designed to integrate with SimPy as easily as possible.
Hence, you'll find the usual structures and components of SimPy recreated as objects
with capabilities to animate the simulation.

The components known from SimPy are prefixed with ``Visual``.
For example, ``Environment`` becomes ``VisualEnvironment``.
The ``VisualEnvironment`` is needed by other components, such as ``VisualProcess``, to gain information
about the visualization.

So, to get started, you'll need to import the ``VisualEnvironment``:

.. code-block:: python

    from simplay import VisualEnvironment

Then, you can create a ``VisualEnvironment`` object and start adding components:

.. code-block:: python

    env = VisualEnvironment()
    # add components here
    env.run()

The components that you know, such as simple processes and resources, need to be classes
in order to be able to be integrated into the visualization.

For example, a simple process can be created as follows:

.. code-block:: python

    class MyProcess(VisualProcess):
        def __init__(self, env, id):
            super().__init__(env, id, graphic="SOMEPNG", tint=0x00FF00)

        def run(self):
            while True:
                print(f'{self.id} is running')
                yield self.env.timeout(1)

Then, you can create an instance of the process and add it to the environment:

.. code-block:: python

    env = VisualEnvironment()
    p = MyProcess(env, 'MyProcess')
    env.process(p.run())
    env.run()

Keep in mind, that the ``id`` parameter should be unique across the whole environment.
It'll identify the component for which an event is logged.

If you've read the ``__super__`` call of the ``MyProcess`` constructor carefully, you'll have noticed
that it takes a ``graphic`` and a ``tint`` parameter.
In the example, the value of ``graphic`` is ``SOMEPNG``.
In order for the visualzation to work, the ``VisualManager`` - which exists on ``VisualEnvironment`` -
needs to know where to find the graphic.
Register visuals with the following call:

.. code-block:: python

    env.visual_manager.register_visual('SOMEPNG', 'path/to/your/graphic.png')

The ``tint`` parameter multiplies the color of the graphic with the given color.
If you do not wish to apply a tint, set it to 0xFFFFFF, so all pixel values are kept.

Now that you have successfully created a process, it is time to learn how SimPlay is able to
log visual changes of the simulation.

SimPlay provides utility classes to ``set`` different type of events.
You can find a complete list of events in the :doc:`api_reference/simplay.events` section.
Usually however, you won't be instantiating these classes yourself, but rather use one of the
``-VisualUtil`` classes which provide a more declarative way of declaring visual state changes.
All the methods available are documented in their respective sections in :doc:`api_reference/simplay.visualutil`.
The following section only provides a few examples for these class.

It is important to notice, that the first parameter of all these functions is of the type ``VisualComponent``.
This lets the utility functions identify the component for which the event should be logged, and extract additional information
from the component.

The following example shows how to set the position of a component:

.. code-block:: python

    from simplay import VisualEnvironment, VisualProcess, VisualComponent
    # import the utility class
    from simplay import BasicVisualUtil

    class MyProcess(VisualProcess):
        def __init__(self, env, id):
            super().__init__(env, id, graphic="SOMEPNG", tint=0x00FF00)
            BasicVisualUtil.set_position(self, 100, 100)

        def run(self):
            while True:
                print(f'{self.id} is running')
                yield self.env.timeout(1)

The code above now sets the position of the component to (100, 100), at
the time of the simulation when the process is created.

If you've followed this guide critically, you're surely by now asking what the parameters
of the ``set_position`` refer to.

This is where the ``VisualGrid`` comes into (Sim)play.

The ``VisualGrid`` is a component that is used to map the simulation space to the screen space.

The following example shows how to create a ``VisualGrid`` and add it to the environment:

.. code-block:: python

    from simplay import VisualEnvironment, VisualGrid
    env = VisualEnvironment()
    # create a grid
    grid = VisualGrid(1000, 1000, 10, 10)
    grid.set_area("area51", "ALIENS!", 5, 2, 0, 0, 0xFF0000)
    # add the grid to the environment
    env.visualization_manager.set_grid(grid)

The code above creates a grid with a width of 1000 and a height of 1000, split into 10x10 cells.
The grid must be registered with the ``VisualizationManager`` of the environment.
As you can see, we've also added an area to the grid.
The area is a rectangle that is drawn on the grid, and can be used to visually separate different parts of the simulation.
The area is defined by the id, the text that is displayed in the area, the height (in cells) and the width (in cells),
and the top-left position (in cells) of the area. The following is a visual representation of this,
where 'X' marks the cells where this area is drawn and colored red, and ' ' marks the cells where it is not:

.. code-block:: text
    
        +---+---+---+---+---+---+---+---+---+---+
        | X | X |   |   |   |   |   |   |   |   |
        +---+---+---+---+---+---+---+---+---+---+
        | X | X |   |   |   |   |   |   |   |   |
        +---+---+---+---+---+---+---+---+---+---+
        | X | X |   |   |   |   |   |   |   |   |
        +---+---+---+---+---+---+---+---+---+---+
        | X | X |   |   |   |   |   |   |   |   |
        +---+---+---+---+---+---+---+---+---+---+
        | X | X |   |   |   |   |   |   |   |   |
        +---+---+---+---+---+---+---+---+---+---+
        |   |   |   |   |   |   |   |   |   |   |
        +---+---+---+---+---+---+---+---+---+---+
        |   |   |   |   |   |   |   |   |   |   |
        +---+---+---+---+---+---+---+---+---+---+
        |   |   |   |   |   |   |   |   |   |   |
        +---+---+---+---+---+---+---+---+---+---+
        |   |   |   |   |   |   |   |   |   |   |
        +---+---+---+---+---+---+---+---+---+---+
        |   |   |   |   |   |   |   |   |   |   |
        +---+---+---+---+---+---+---+---+---+---+


You've now learned the basics of how to use SimPlay to visualize your simulation.
Head over to :doc:`api_reference/index` to learn more about the API, or check out
the :doc:`examples` to see how SimPlay can be used in practice.


with simplay-jupyter
--------------------

Follow the instructions under :doc:`usage` to install the simplay extension for jupyter.

