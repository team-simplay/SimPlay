# Configuration file for the Sphinx documentation builder.

# -- Project information

project = "SimPlay"
copyright = "2022, David Kühnhanss, Moritz Schiesser"
author = "David Kühnhanss, Moritz Schiesser"

release = "0.1"
version = "0.1.0"

import sys
import os

import sphinx.builders.html
import sphinx.builders.latex
import sphinx.builders.texinfo
import sphinx.builders.text
import sphinx.ext.autodoc


sys.path.insert(0, os.path.abspath(os.path.join("../../", "src/simplay/src")))

import simplay
# -- General configuration

extensions = [
    "sphinx.ext.duration",
    "sphinx.ext.doctest",
    "sphinx.ext.autodoc",
    "sphinx.ext.autosummary",
    "sphinx.ext.intersphinx",
]
autosummary_generate = True

intersphinx_mapping = {
    "python": ("https://docs.python.org/3/", None),
    "sphinx": ("https://www.sphinx-doc.org/en/master/", None),
}
intersphinx_disabled_domains = ["std"]

templates_path = ["_templates"]
master_doc = "contents"

# -- Options for HTML output

html_theme = "sphinx_rtd_theme"

# -- Options for EPUB output
epub_show_urls = "footnote"
