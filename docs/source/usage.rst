Usage
=====

.. _installation:

Installation
------------

To use Simplay, first decide how you want to use it.
Three components exist:
- SimPlay (the python library allowing you to generate the SimulationData)
- SimPlay-Web (the npm packages allowing you to render the SimulationData)
- SimPlay-Jupyter (the python package allowing you to use both within jupyter notebooks)


To install SimPlay:

.. code-block:: console

   (.venv) $ pip install simplay


To install SimPlay-Web:

.. code-block:: console

   $ npm install simplay-web

To install the jupyter extension:

.. note::
   This guide assumes you have a working jupyter-lab installation.
   The minimum version required is 3.0.

To install the extension, execute the following command:

.. code-block:: console

   $ pip install simplay-jupyter

Should you want to uninstall the extension, execute the following command:

.. code-block:: console

   $ pip uninstall simplay-jupyter
