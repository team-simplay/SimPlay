Getting started
============================================


.. _installation:

Install SimPlay
---------------

To use Simplay, first decide how you want to use it.
Three components exist:

  - `SimPlay-Jupyter <https://pypi.python.org/pypi/simplay-jupyter>`_ (the python package allowing you to view and enhance any SimPy Simulation within a jupyter notebook)
  - `SimPlay <https://pypi.python.org/pypi/simplay>`_ (the python library allowing you to generate the SimulationData)
  - `SimPlay-Web <https://www.npmjs.com/package/simplay-web>`_ (the npm packages allowing you to render the SimulationData)

To install the jupyter extension, execute the following command:

.. note::
   This guide assumes you have a working JupyterLab installation.
   The minimum version required is 3.0.

.. code-block:: console

   pip install simplay-jupyter

.. note::
   After installing simplay-jupyter, JupyterLab needs to be restarted.

The following installation steps are only necessary if you don't want to run within JupyterLab.
Otherwise continue with :ref:`AddVisualInformation`.

To install SimPlay:

.. code-block:: console

   pip install simplay


To install SimPlay-Web:

.. code-block:: console

   npm install simplay-web


.. _AddVisualInformation:

Adding visual information to your simulation
--------------------------------------------

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

    env.visualization_manager.register_visual('SOMEPNG', 'path/to/your/visual.png')

.. note::

    We recommend using PNG files with a transparent background, and a white foreground.
    This way, you can most effectively use the ``tint`` parameter.

The ``tint`` parameter multiplies the color of the visual with the given color.
If no tint is to be applied, set it to 0xFFFFFF, which is the default value, 
so all pixel values are kept the same.
The tint parameter must be a whole integer.

After having successfully created a process, it is time to learn how SimPlay is able to
log visual changes of the simulation.

The visual components provide various methods to declare visual changes.
These methods always start with ``is_`` or ``has_`` and create the corresponding event.
Find a complete list of events in the :doc:`api_reference/simplay.events` section.
The following section only provides a few examples for these methods, but should make the use of them clear.

The following example shows how to set the position of a component:

.. code-block:: python

    from simplay import VisualEnvironment, VisualProcess, VisualComponent, BasicVisualUtil

    class MyProcess(VisualProcess):
        def __init__(self, env, id):
            super().__init__(env, id, visual="SOMEPNG", tint=0x00FF00)
            self.is_at(self, 5, 5)
            self.is_visible()

        def run(self):
            while True:
                print(f'{self.id} is running')
                yield self.env.timeout(1)

The code above now sets the position of the component to (5, 5), at
the time of the simulation when the process is created, and declares the component visible.

The parameters of the ``is_at`` function refer to row and column values of a grid.

This is where the :class:`~simplay.visualization.VisualGrid` comes into (Sim)play.

The :class:`~simplay.visualization.VisualGrid` is a component that is used to map the simulation space to the screen space.

The following example shows how to create a :class:`~simplay.visualization.VisualGrid` and add it to the environment:

.. code-block:: python

    from simplay import VisualEnvironment, VisualGrid
    env = VisualEnvironment()
    # create a grid
    grid = VisualGrid(1000, 500, 10, 5)
    grid.set_area("area51", "ALIENS!", 5, 2, 0, 0, 0xbdbbbb)
    # add the grid to the environment
    env.visualization_manager.set_grid(grid)

The code above creates a grid with a width of 1000 and a height of 500, split into 10x5 cells.
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


.. note::
    It is recommended to not have areas with a white background.
    This is because the decorating and informational texts are also drawn in white, and thus would not be visible.
    Further, in order to correctly have tints applied to the components, it is recommended to have all-white transparent PNGs,
    and if no tint is applied, then the visual is invisible.

This guide covers the basics of SimPlay.
Learn more about the :doc:`api_reference/index`, or view some :doc:`examples` to see how SimPlay can be used in practice.

The section below provides some more in-depth explanation of how to use the components provided by SimPy.

Playing the Visualization
-------------------------

Follow the instructions under :ref:`installation` to install the simplay extension for jupyter.
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
            self.is_at(5, 5)

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
    output = env.visualization_manager.serialize_for_jupyter()
    display(output, raw=True)

The extension will now automatically display the visualization in the notebook.

Since ``simplay`` creates JSON output, save the output to a file if desired:

.. code-block:: python

    env.visualization_manager.write_to_file("output.simplay")

Then, open the ``.simplay`` file in JupyterLab and the visualization will be displayed.

How to use resources, containers and stores is explained in :doc:`in_depth`.
