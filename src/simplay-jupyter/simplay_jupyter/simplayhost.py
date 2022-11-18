#!/usr/bin/env python
# coding: utf-8

# Copyright (c) team-simplay.
# Distributed under the terms of the Modified BSD License.

"""
This module contains the implementation of the SimplayHost class.
"""

from ipywidgets import DOMWidget
from traitlets import Unicode
from ._frontend import module_name, module_version


class SimPlayHost(DOMWidget):
    """The Host element for the SimPlay Jupyter widget"""

    _model_name = Unicode("SimPlayHostModel").tag(sync=True)
    _model_module = Unicode(module_name).tag(sync=True)
    _model_module_version = Unicode(module_version).tag(sync=True)
    _view_name = Unicode("SimPlayHostView").tag(sync=True)
    _view_module = Unicode(module_name).tag(sync=True)
    _view_module_version = Unicode(module_version).tag(sync=True)

    simulationdata = Unicode("{}").tag(sync=True)
    height = Unicode("500px").tag(sync=True)
    width = Unicode("500px").tag(sync=True)
