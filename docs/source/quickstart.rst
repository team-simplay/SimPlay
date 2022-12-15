Getting started
============================================

with simplay
------------

SimPlay is designed to integrate with `SimPy <https://simpy.readthedocs.io/en/latest/>`_ as easily as possible.
The usual structures and components of `SimPy <https://simpy.readthedocs.io/en/latest/>`_ are recreated as objects
with capabilities to animate the simulation.

The components known from `SimPy <https://simpy.readthedocs.io/en/latest/>`_ are prefixed with ``Visual``.
For example, ``Environment`` becomes :class:`~simplay.core.VisualEnvironment`.
The :class:`~simplay.core.VisualEnvironment` is needed by other components,
such as :class:`~simplay.components.VisualProcess`, to gain information
about the visualization.

To get started, import the :class:`~simplay.core.VisualEnvironment`:

.. code-block:: python

    from simplay import VisualEnvironment

Then create a instance of :class:`~simplay.core.VisualEnvironment` and start adding components:

.. code-block:: python

    env = VisualEnvironment()
    # add components here
    env.run()

The components provided by SimPy, such as simple processes and resources, must be classes
in order to be able to be integrated into the visualization.

A simple process can be created as follows:

.. code-block:: python

    class MyProcess(VisualProcess):
        def __init__(self, env, id):
            super().__init__(env, id, visual="SOMEPNG", tint=0x00FF00)

        def run(self):
            while True:
                print(f'{self.id} is running')
                yield self.env.timeout(1)

Then, create an instance of the process and add it to the environment:

.. code-block:: python

    env = VisualEnvironment()
    p = MyProcess(env, 'MyProcess')
    env.process(p.run())
    env.run()

Keep in mind, that the ``id`` parameter should be unique across the whole environment.

Reading the ``__super__`` call of the ``MyProcess`` constructor carefully, notice
that it takes a ``visual`` and a ``tint`` parameter.
In the example, the value of ``visual`` is ``SOMEPNG``.
In order for the visualzation to work,
the :class:`~simplay.core.VisualizationManager` -
which exists on :class:`~simplay.core.VisualEnvironment` -
needs to know where to find the visual.
Register visuals with the following call:

.. code-block:: python

    env.visual_manager.register_visual('SOMEPNG', 'path/to/your/visual.png')

.. note::

    We recommend using PNG files with a transparent background, and a white foreground.
    This way, you can most effectively use the ``tint`` parameter.

The ``tint`` parameter multiplies the color of the visual with the given color.
If no tint is to be applied, set it to 0xFFFFFF, so all pixel values are kept the same.
The tint parameter must be a whole integer.

After having successfully created a process, it is time to learn how SimPlay is able to
log visual changes of the simulation.

SimPlay provides utility classes to ``set`` different type of events.
Find a complete list of events in the :doc:`api_reference/simplay.events` section.
Usually however, these classes won't be instantiated manually, but rather through the use one of the
``-VisualUtil`` classes which provide a more declarative way of declaring visual state changes.
All the methods available are documented in their respective sections in :doc:`api_reference/simplay.visualutil`.
The following section only provides a few examples for these ``VisualUtils``.

It is important to notice, that the first parameter of all these functions is of the type ``VisualComponent``.
This lets the utility functions identify the component for which the event should be logged, and extract additional information
from the component.

The following example shows how to set the position of a component:

.. code-block:: python

    from simplay import VisualEnvironment, VisualProcess, VisualComponent, BasicVisualUtil

    class MyProcess(VisualProcess):
        def __init__(self, env, id):
            super().__init__(env, id, visual="SOMEPNG", tint=0x00FF00)
            BasicVisualUtil.set_position(self, 5, 5)

        def run(self):
            while True:
                print(f'{self.id} is running')
                yield self.env.timeout(1)

The code above now sets the position of the component to (5, 5), at
the time of the simulation when the process is created.

The parameters of the ``set_position`` function refer to row and column values of a grid.

This is where the :class:`~simplay.visualization.VisualGrid` comes into (Sim)play.

The :class:`~simplay.visualization.VisualGrid` is a component that is used to map the simulation space to the screen space.

The following example shows how to create a :class:`~simplay.visualization.VisualGrid` and add it to the environment:

.. code-block:: python

    from simplay import VisualEnvironment, VisualGrid
    env = VisualEnvironment()
    # create a grid
    grid = VisualGrid(1000, 1000, 10, 10)
    grid.set_area("area51", "ALIENS!", 5, 2, 0, 0, 0xbdbbbb)
    # add the grid to the environment
    env.visualization_manager.set_grid(grid)

The code above creates a grid with a width of 1000 and a height of 1000, split into 10x10 cells.
The grid must be registered with the :class:`~simplay.core.VisualizationManager` of the environment.
Additionally, the code above adds an area to the grid.
The area is a rectangle that is drawn on the grid, and can be used to visually separate different parts of the simulation.
The area is defined by the id, the text that is displayed in the area, the height (in cells) and the width (in cells),
and the top-left position (in cells) of the area. The following is a visual representation of this,
where 'X' marks the cells where this area is drawn, and ' ' marks the cells where it is not:

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


.. note::
    It is recommended to not have areas with a white background.
    This is because the decorating and informational texts are also drawn in white, and thus would not be visible.
    Further, in order to correctly have tints applied to the components, it is recommended to have all-white transparent PNGs,
    and if no tint is applied, then the visual is invisible.

This guide covers the basics of SimPlay.
Learn more about the :doc:`api_reference/index`, or view some :doc:`examples` to see how SimPlay can be used in practice.

The section below provides some more in-depth explanation of how to use the components provided by SimPy.

simplay in depth
----------------

**Using Resources:**

The following example shows how to use the :class:`~simplay.components.VisualResource` class:

.. code-block:: python

    from simplay import VisualEnvironment, VisualResource, BasicVisualUtil, ResourceVisualUtil

    class MyResource(VisualResource):
        def __init__(self, env):
            super().__init__(env, "MyResource", 3, visual="SOMEPNG", tint=0x00FF00)
            BasicVisualUtil.set_position(self, 5, 5)
            BasicVisualUtil.set_visible(self)

    env = VisualEnvironment()
    grid = VisualGrid(1000, 1000, 10, 10)
    grid.set_area("area51", "ALIENS!", 5, 2, 0, 0, 0xFF0000)
    env.visualization_manager.set_grid(grid)

    resource = MyResource(env)
    env.run()

The :class:`~simplay.components.VisualResource` class inherits from the ``Resource`` class from the ``simpy`` package.
The API is the same, except that the ``request`` and ``release`` methods are overridden to
reflect for changes in the utilization and capacity of the resource.
Within these methods, the ``ResourceVisualUtil`` class is used to update the utilization
and capacity of the resource, using the ``set_utilization`` and ``set_capacity`` methods.
Spezialized classes like ``PreemptiveResource`` and ``PriorityResource`` are also supported,
and are inherited by the :class:`~simplay.components.VisualPreemptiveResource`
and :class:`~simplay.components.VisualPriorityResource` respectively.

The code example above creates a custom class for the resource, and by doing so declares
the visibility and position of the resource.
Alternatively, use the :class:`~simplay.visualutil.BasicVisualUtil` class to set the position
and visibility of the resource.

.. code-block:: python

    from simplay import VisualEnvironment, VisualResource, BasicVisualUtil, ResourceVisualUtil

    env = VisualEnvironment()
    grid = VisualGrid(1000, 1000, 10, 10)
    grid.set_area("area51", "ALIENS!", 5, 2, 0, 0, 0xFF0000)
    env.visualization_manager.set_grid(grid)

    resource = VisualResource(env, "MyResource", 3, visual="SOMEPNG", tint=0x00FF00)
    BasicVisualUtil.set_position(resource, 5, 5)
    BasicVisualUtil.set_visible(resource)

    env.run()


**Using Containers:**

The following example shows how to use the :class:`~simplay.components.VisualContainer` class:

.. code-block:: python

    from simplay import VisualEnvironment, VisualContainer, BasicVisualUtil, ContainerVisualUtil

    class MyContainer(VisualContainer):
        def __init__(self, env):
            super().__init__(env, "MyContainer", 3, visual="SOMEPNG", tint=0x00FF00)
            BasicVisualUtil.set_position(self, 5, 5)
            BasicVisualUtil.set_visible(self)
    
    env = VisualEnvironment()
    grid = VisualGrid(1000, 1000, 10, 10)
    grid.set_area("area51", "ALIENS!", 5, 2, 0, 0, 0xFF0000)
    env.visualization_manager.set_grid(grid)

    container = MyContainer(env)
    env.run()

The :class:`~simplay.components.VisualContainer` class inherits from the ``Container``
class from the ``simpy`` package.
The API is the same, except that the ``put`` and ``get`` methods are overridden to
reflect for changes in the level and capacity of the container.
Within these methods, the :class:`~simplay.visualutil.BasicVisualUtil` class is used to update the level
and capacity of the container, using the ``set_level`` and ``set_capacity`` methods.

The code example above creates a custom class for the container, and by doing so declares
the visibility and position of the container.
Alternatively, use the :class:`~simplay.visualutil.BasicVisualUtil` class to set the position
and visibility of the container.

.. code-block:: python

    from simplay import VisualEnvironment, VisualContainer
    from simplay import BasicVisualUtil, ContainerVisualUtil

    env = VisualEnvironment()
    grid = VisualGrid(1000, 1000, 10, 10)
    grid.set_area("area51", "ALIENS!", 5, 2, 0, 0, 0xFF0000)
    env.visualization_manager.set_grid(grid)

    container = VisualContainer(env, "MyContainer", 3, visual="SOMEPNG", tint=0x00FF00)
    BasicVisualUtil.set_position(container, 5, 5)
    BasicVisualUtil.set_visible(container)

    env.run()

**Using Stores:**

The following example shows how to use the :class:`~simplay.components.VisualStore` class:

.. code-block:: python

    from simplay import VisualEnvironment, VisualStore
    from simplay import BaiscVisualUtil, StoreVisualUtil

    class MyStore(VisualStore):
        def __init__(self, env):
            super().__init__(env, "MyStore", 3, visual="SOMEPNG", tint=0x00FF00)
            BasicVisualUtil.set_position(self, 5, 5)
            BasicVisualUtil.set_visible(self)
    
    env = VisualEnvironment()
    grid = VisualGrid(1000, 1000, 10, 10)
    grid.set_area("area51", "ALIENS!", 5, 2, 0, 0, 0xFF0000)
    env.visualization_manager.set_grid(grid)

    store = MyStore(env)
    env.run()

The :class:`~simplay.components.VisualStore` class inherits from the ``Store`` class from the ``simpy`` package.
The API is the same, except that the ``put`` and ``get`` methods are overridden to
reflect for changes in the contents and capacity of the store.
Within these methods, the :class:`~simplay.visualutil.StoreVisualUtil` class is used to update the contents
and capacity of the store, using the ``set_contents`` and ``set_capacity`` methods.
The spezialized ``FilterStore`` is also supported, and is inherited by the
:class:`~simplay.components.VisualStore` class.

The code example above creates a custom class for your store, and by doing so declares
the visibility and position of the store.
Alternatively, use the :class:`~simplay.visualutil.BasicVisualUtil` class to set the position
and visibility of the store.

.. code-block:: python

    from simplay import VisualEnvironment, VisualStore, BasicVisualUtil, StoreVisualUtil

    env = VisualEnvironment()
    grid = VisualGrid(1000, 1000, 10, 10)
    grid.set_area("area51", "ALIENS!", 5, 2, 0, 0, 0xFF0000)
    env.visualization_manager.set_grid(grid)

    store = VisualStore(env, "MyStore", 3, visual="SOMEPNG", tint=0x00FF00)
    BasicVisualUtil.set_position(store, 5, 5)
    BasicVisualUtil.set_visible(store)

    env.run()


with simplay-jupyter
--------------------

Follow the instructions under :doc:`usage` to install the simplay extension for jupyter.
Once the installation is complete, start a new notebook and import the ``simplay`` module:

.. code-block:: python

    from simplay import VisualEnvironment, VisualGrid, BasicVisualUtil

    env = VisualEnvironment()
    # create a grid
    grid = VisualGrid(1000, 1000, 10, 10)
    grid.set_area("area51", "ALIENS!", 5, 2, 0, 0, 0xFF0000)
    # add the grid to the environment
    env.visualization_manager.set_grid(grid)

    class MyProcess(VisualProcess):
        def __init__(self, env, id):
            super().__init__(env, id, visual="SOMEPNG", tint=0x00FF00)
            BasicVisualUtil.set_position(self, 5, 5)

        def run(self):
            while True:
                print(f'{self.id} is running')
                yield self.env.timeout(1)

    env.process(MyProcess(env, 1))
    env.run(until=10)

The code above is the same as the one in the previous section, but now it is executed in a jupyter notebook.
To display the visualization, use the ``display`` function provided by ``IPython.display``:

.. code-block:: python

    from IPython.display import display
    output = env.visualization_manager.serialize()
    display({"application/simplay+json": output}, raw=True)

The extension will now automatically display the visualization in the notebook.
Please note the MIME-Type ``application/simplay+json``.
This is the MIME-Type that the extension registers with jupyter.

Since ``simplay`` creates JSON output, save the output to a file if desired:

.. code-block:: python

    env.visualization_manager.write_to_file("output.simplay")

Then, open the ``.simplay`` file in JupyterLab and the visualization will be displayed.


with simplay-web
----------------

In case a custom generator for `application/simplay+json` exists and there is
a need to spool the events, the simplay-web package can be used directly.
Find more information about simplay-web at https://www.npmjs.com/package/simplay-web.

