
.. only:: html

    .. figure:: assets/simplay_logo.png
        :align: center

        Animation capabilities for `SimPy <https://simpy.readthedocs.io/en/latest/>`_

        `PyPI (simplay) <https://pypi.python.org/pypi/simplay>`_ |
        `PyPI (simplay-jupyter) <https://pypi.python.org/pypi/simplay-jupyter>`_ |
        `npm (simplay-web) <https://www.npmjs.com/package/simplay-web>`_ |
        `GitHub <https://github.com/team-simplay/SimPlay/>`_ |
        `Issues
        <https://github.com/team-simplay/SimPlay/issues>`_ 

.. note::

   This project is under active development, expect changes and bugs.

Overview
===================================

**SimPlay** is a project that aims to bring simple animation capabilities to the `SimPy <https://simpy.readthedocs.io/en/latest/>`_ project.

Check out the :doc:`usage` section for further information, including how to :ref:`installation`.


The API documentation is available at :ref:`api`.

Structure of the project
------------------------

SimPlay is split into three parts:

-  The **SimPlay** package, which is a Python package that can be integrated into SimPy simulations.
   It is used to generate the animation data and to provide a simple API to do so.
   It is available on PyPI at https://pypi.python.org/pypi/simplay.

-  The **SimPlay-Web** package, which is a TypeScript package that is used to display the generated animation data.
   It is available on npm at https://www.npmjs.com/package/simplay-web.

-  The **SimPlay-Jupyter** package, which depends on both the packages mentioned above.
   It is used to display the animation data in Jupyter Lab.
   It is available on PyPI at https://pypi.python.org/pypi/simplay-jupyter.
