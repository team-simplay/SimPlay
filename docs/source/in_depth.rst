SimPlay in depth
============================================

How to setup a simulation and how to work with processes is explained in :doc:`quickstart`.

Using Resources
---------------

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

Using Containers
----------------

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

Using Stores
------------

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

More detailes about the functions and classes of SimPlay are available in :ref:`api`.