import os
import sys

# Définir docs_dir comme le répertoire parent du fichier de configuration conf.py
docs_dir = os.path.dirname(os.path.abspath(__file__))

try:
    import base
except ImportError:
    print("oh no 1")

sys.path.insert(0, os.path.abspath(os.path.join("..", "base")))

try:
    import base
except ImportError:
    print("oh no 2")



sys.path.insert(0, os.path.abspath(os.path.join("..", "..")))

import base  # ne produit plus d'erreur

# Configuration file for the Sphinx documentation builder.
#
# For the full list of built-in configuration values, see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Project information -----------------------------------------------------
project = 'Documentations du projet'
copyright = '2024, René PEPIN'
author = 'René PEPIN'
release = '01'

# -- General configuration ---------------------------------------------------
extensions = [ 
    'sphinx.ext.autodoc',
    'sphinx.ext.napoleon',  # Pour le support des docstrings NumPy et Google style
    'sphinx.ext.viewcode',  # Pour inclure les sources du code
]

templates_path = ['_templates']
exclude_patterns = []

language = 'fr'

# -- Options for HTML output -------------------------------------------------
html_theme = 'alabaster'
html_static_path = ['_static']

# -- Options for the source directory -----------------------------------------
source_dir = os.path.join(docs_dir, 'source')
build_dir = os.path.join(docs_dir, '_build')

# -- Options for source files ------------------------------------------------
master_doc = 'index'
source_suffix = ['.rst', '.md']

autodoc_mock_imports = ["django"]
