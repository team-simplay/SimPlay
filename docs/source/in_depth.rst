SimPlay in depth
============================================

How a simulation is set up, and how to work with processes is explained in :doc:`quickstart`.

Using Resources
---------------

The following example shows how to use the :class:`~simplay.components.VisualResource` class:

.. code-block:: python

    from simplay import VisualEnvironment, VisualResource

    class MyResource(VisualResource):
        def __init__(self, env):
            super().__init__(env, "MyResource", 3, visual="SOMEPNG", tint=0x00FF00)
            self.is_at(5, 5)
            self.is_visible()

    env = VisualEnvironment()
    grid = VisualGrid(1000, 1000, 10, 10)
    grid.set_area("area51", "ALIENS!", 5, 2, 0, 0, 0xFF0000)
    env.visualization_manager.set_grid(grid)

    resource = MyResource(env)
    env.run()

The :class:`~simplay.components.VisualResource` class inherits from the ``Resource`` class from the ``simpy`` package.
The API is the same, except that the ``request`` and ``release`` methods are overridden to
reflect for changes in the utilization and capacity of the resource, and will automatically create the
corresponding events.
Specialized classes like ``PreemptiveResource`` and ``PriorityResource`` are also supported,
and are inherited by the :class:`~simplay.components.VisualPreemptiveResource`
and :class:`~simplay.components.VisualPriorityResource` respectively.

The code example above creates a custom class for the resource, and by doing so declares
the visibility and position of the resource in the constructor.
Alternatively, you can create the resource without a custom class.

.. code-block:: python

    from simplay import VisualEnvironment, VisualResource

    env = VisualEnvironment()
    grid = VisualGrid(1000, 1000, 10, 10)
    grid.set_area("area51", "ALIENS!", 5, 2, 0, 0, 0xFF0000)
    env.visualization_manager.set_grid(grid)

    resource = VisualResource(env, "MyResource", 3, visual="SOMEPNG", tint=0x00FF00)
    resource.is_at(5, 5)
    resource.is_visible()

    env.run()

Using Containers
----------------

The following example shows how to use the :class:`~simplay.components.VisualContainer` class:

.. code-block:: python

    from simplay import VisualEnvironment, VisualContainer

    class MyContainer(VisualContainer):
        def __init__(self, env):
            super().__init__(env, "MyContainer", 3, visual="SOMEPNG", tint=0x00FF00)
            self.is_at(5, 5)
            self.is_visible()
    
    env = VisualEnvironment()
    grid = VisualGrid(1000, 1000, 10, 10)
    grid.set_area("area51", "ALIENS!", 5, 2, 0, 0, 0xFF0000)
    env.visualization_manager.set_grid(grid)

    container = MyContainer(env)
    env.run()

The :class:`~simplay.components.VisualContainer` class inherits from the ``Container``
class from the ``simpy`` package.
The API is the same, except that the ``put`` and ``get`` methods are overridden to
reflect for changes in the level and capacity of the container, and will automatically create the
corresponding events.

The code example above creates a custom class for the container, and by doing so declares
the visibility and position of the container.
Alternatively, you can create the container without a custom class.

.. code-block:: python

    from simplay import VisualEnvironment, VisualContainer

    env = VisualEnvironment()
    grid = VisualGrid(1000, 1000, 10, 10)
    grid.set_area("area51", "ALIENS!", 5, 2, 0, 0, 0xFF0000)
    env.visualization_manager.set_grid(grid)

    container = VisualContainer(env, "MyContainer", 3, visual="SOMEPNG", tint=0x00FF00)
    container.is_at(5, 5)
    container.is_visible()

    env.run()

Using Stores
------------

The following example shows how to use the :class:`~simplay.components.VisualStore` class:

.. code-block:: python

    from simplay import VisualEnvironment, VisualStore

    class MyStore(VisualStore):
        def __init__(self, env):
            super().__init__(env, "MyStore", 3, visual="SOMEPNG", tint=0x00FF00)
            self.is_at(5, 5)
            self.is_visible()
    
    env = VisualEnvironment()
    grid = VisualGrid(1000, 1000, 10, 10)
    grid.set_area("area51", "ALIENS!", 5, 2, 0, 0, 0xFF0000)
    env.visualization_manager.set_grid(grid)

    store = MyStore(env)
    env.run()

The :class:`~simplay.components.VisualStore` class inherits from the ``Store`` class from the ``simpy`` package.
The API is the same, except that the ``put`` and ``get`` methods are overridden to
reflect for changes in the contents and capacity of the store, and will automatically create the
corresponding events.

The specialized ``FilterStore`` is also supported, and is inherited by the
:class:`~simplay.components.VisualStore` class.

The code example above creates a custom class for your store, and by doing so declares
the visibility and position of the store.
Alternatively, you can create the store without a custom class.

.. code-block:: python

    from simplay import VisualEnvironment, VisualStore

    env = VisualEnvironment()
    grid = VisualGrid(1000, 1000, 10, 10)
    grid.set_area("area51", "ALIENS!", 5, 2, 0, 0, 0xFF0000)
    env.visualization_manager.set_grid(grid)

    store = VisualStore(env, "MyStore", 3, visual="SOMEPNG", tint=0x00FF00)
    store.is_at(5, 5)
    store.is_visible()

    env.run()

More details about the functions and classes of SimPlay are available in :ref:`api`.