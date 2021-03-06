pipenv_envvars := $(and $(CI),PIPENV_IGNORE_VIRTUALENVS=1)
python := $(pipenv_envvars) pipenv run python
pip := $(pipenv_envvars) pipenv run pip
pytest := $(pipenv_envvars) pipenv run py.test

pipenv_opts := --dev
pipenv_opts += $(and $(CI),--keep-outdated --clear)
wheel_opts := $(if $(or $(CI),$(V),$(VERBOSE)),,-q)

# get the python package version
# (evaluates to that string)
# paramter 1: name of the project (aka api, robot-server, etc)
define python_package_version
$(shell $(python) ../scripts/python_build_utils.py $(1) normalize_version)
endef


# get the name of the wheel that setup.py will build
# parameter 1: the name of the project (aka api, robot-server, etc)
# parameter 2: the name of the python package (aka opentrons, robot_server, etc)
define python_get_wheelname
$(2)-$(call python_package_version,$(1))-py2.py3-none-any.whl
endef
