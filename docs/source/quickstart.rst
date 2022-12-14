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

So, to get started, you'll need to import the :class:`~simplay.core.VisualEnvironment`:

.. code-block:: python

    from simplay import VisualEnvironment

Then, you can create a :class:`~simplay.core.VisualEnvironment` object and start adding components:

.. code-block:: python

    env = VisualEnvironment()
    # add components here
    env.run()

The components that you know, such as simple processes and resources, must be classes
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

If you've read the ``__super__`` call of the ``MyProcess`` constructor carefully, you'll have noticed
that it takes a ``graphic`` and a ``tint`` parameter.
In the example, the value of ``graphic`` is ``SOMEPNG``.
In order for the visualzation to work,
the :class:`~simplay.core.VisualizationManager` -
which exists on :class:`~simplay.core.VisualEnvironment` -
needs to know where to find the graphic.
Register visuals with the following call:

.. code-block:: python

    env.visual_manager.register_visual('SOMEPNG', 'path/to/your/graphic.png')

.. note::

    We recommend using PNG files with a transparent background, and a white foreground.
    This way, you can most effectively use the ``tint`` parameter.

The ``tint`` parameter multiplies the color of the graphic with the given color.
If you do not wish to apply a tint, set it to 0xFFFFFF, so all pixel values are kept.

Now that you have successfully created a process, it is time to learn how SimPlay is able to
log visual changes of the simulation.

SimPlay provides utility classes to ``set`` different type of events.
You can find a complete list of events in the :doc:`api_reference/simplay.events` section.
Usually however, you won't be instantiating these classes yourself, but rather use one of the
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
            super().__init__(env, id, graphic="SOMEPNG", tint=0x00FF00)
            BasicVisualUtil.set_position(self, 5, 5)

        def run(self):
            while True:
                print(f'{self.id} is running')
                yield self.env.timeout(1)

The code above now sets the position of the component to (5, 5), at
the time of the simulation when the process is created.

If you've followed this guide critically, you're surely by now asking what the parameters
of the ``set_position`` refer to.

This is where the :class:`~simplay.visualization.VisualGrid` comes into (Sim)play.

The :class:`~simplay.visualization.VisualGrid` is a component that is used to map the simulation space to the screen space.

The following example shows how to create a :class:`~simplay.visualization.VisualGrid` and add it to the environment:

.. code-block:: python

    from simplay import VisualEnvironment, VisualGrid
    env = VisualEnvironment()
    # create a grid
    grid = VisualGrid(1000, 1000, 10, 10)
    grid.set_area("area51", "ALIENS!", 5, 2, 0, 0, 0xFF0000)
    # add the grid to the environment
    env.visualization_manager.set_grid(grid)

The code above creates a grid with a width of 1000 and a height of 1000, split into 10x10 cells.
The grid must be registered with the :class:`~simplay.core.VisualizationManager` of the environment.
As you can see, we've also added an area to the grid.
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


You've now learned the basics of how to use SimPlay to visualize your simulation.
Head over to :doc:`api_reference/index` to learn more about the API, or check out
the :doc:`examples` to see how SimPlay can be used in practice.

If you wish to read a more detailed explanation on how to use other components, you can
follow the section below.

simplay in depth
----------------

**Using Resources:**

The following example shows how to use the :class:`~simplay.components.VisualResource` class:

.. code-block:: python

    from simplay import VisualEnvironment, VisualResource, BasicVisualUtil, ResourceVisualUtil

    class MyResource(VisualResource):
        def __init__(self, env):
            super().__init__(env, "MyResource", 3, graphic="SOMEPNG", tint=0x00FF00)
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

The code example above creates a custom class for your resource, and by doing so declares
the visibility and position of the resource.
Should you not wish to do this, you can use the :class:`~simplay.visualutil.BasicVisualUtil` class to set the position
and visibility of the resource.

.. code-block:: python

    from simplay import VisualEnvironment, VisualResource, BasicVisualUtil, ResourceVisualUtil

    env = VisualEnvironment()
    grid = VisualGrid(1000, 1000, 10, 10)
    grid.set_area("area51", "ALIENS!", 5, 2, 0, 0, 0xFF0000)
    env.visualization_manager.set_grid(grid)

    resource = VisualResource(env, "MyResource", 3, graphic="SOMEPNG", tint=0x00FF00)
    BasicVisualUtil.set_position(resource, 5, 5)
    BasicVisualUtil.set_visible(resource)

    env.run()


**Using Containers:**

The following example shows how to use the :class:`~simplay.components.VisualContainer` class:

.. code-block:: python

    from simplay import VisualEnvironment, VisualContainer, BasicVisualUtil, ContainerVisualUtil

    class MyContainer(VisualContainer):
        def __init__(self, env):
            super().__init__(env, "MyContainer", 3, graphic="SOMEPNG", tint=0x00FF00)
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

The code example above creates a custom class for your container, and by doing so declares
the visibility and position of the container.
Should you not wish to do this, you can use the :class:`~simplay.visualutil.BasicVisualUtil` class to set the position
and visibility of the container.

.. code-block:: python

    from simplay import VisualEnvironment, VisualContainer
    from simplay import BasicVisualUtil, ContainerVisualUtil

    env = VisualEnvironment()
    grid = VisualGrid(1000, 1000, 10, 10)
    grid.set_area("area51", "ALIENS!", 5, 2, 0, 0, 0xFF0000)
    env.visualization_manager.set_grid(grid)

    container = VisualContainer(env, "MyContainer", 3, graphic="SOMEPNG", tint=0x00FF00)
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
            super().__init__(env, "MyStore", 3, graphic="SOMEPNG", tint=0x00FF00)
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
Should you not wish to do this, you can use the :class:`~simplay.visualutil.BasicVisualUtil` class to set the position
and visibility of the store.

.. code-block:: python

    from simplay import VisualEnvironment, VisualStore, BasicVisualUtil, StoreVisualUtil

    env = VisualEnvironment()
    grid = VisualGrid(1000, 1000, 10, 10)
    grid.set_area("area51", "ALIENS!", 5, 2, 0, 0, 0xFF0000)
    env.visualization_manager.set_grid(grid)

    store = VisualStore(env, "MyStore", 3, graphic="SOMEPNG", tint=0x00FF00)
    BasicVisualUtil.set_position(store, 5, 5)
    BasicVisualUtil.set_visible(store)

    env.run()


with simplay-jupyter
--------------------

Follow the instructions under :doc:`usage` to install the simplay extension for jupyter.
Once you've done that, you can start a new notebook and import the ``simplay`` module:

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
            super().__init__(env, id, graphic="SOMEPNG", tint=0x00FF00)
            BasicVisualUtil.set_position(self, 5, 5)

        def run(self):
            while True:
                print(f'{self.id} is running')
                yield self.env.timeout(1)

    env.process(MyProcess(env, 1))
    env.run(until=10)

The code above is the same as the one in the previous section, but now it is executed in a jupyter notebook.
To display the visualization, you can use the ``display`` function provided by ``IPython.display``:

.. code-block:: python

    from IPython.display import display
    output = env.visualization_manager.serialize()
    display({"application/simplay+json": output}, raw=True)

The extension will now automatically display the visualization in the notebook.
Please note the MIME-Type ``application/simplay+json``.
This is the MIME-Type that the extension registers with jupyter.

Since ``simplay`` creates JSON output, you can also save the output to a file:

.. code-block:: python

    env.visualization_manager.write_to_file("output.simplay")

Then, open the ``.simplay`` file in JupyterLab and the visualization will be displayed.


with simplay-web
----------------

In case a custom generator for `application/simplay+json` exists and there is
a need to spool the events, the simplay-web package can be used directly.
Find more information about simplay-web at https://www.npmjs.com/package/simplay-web.

