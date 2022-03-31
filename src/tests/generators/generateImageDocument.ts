import { ImageDocumentRequestResponseSuccess } from "features/image/api";

export const generateImageDocument =
    (): ImageDocumentRequestResponseSuccess => {
        return {
            status: {
                finished_at: "2022-01-10T20:46:39+00:00",
                reason: "success",
                started_at: "2022-01-10T20:46:39+00:00",
                state: "success",
            },
            parameters: {},
            metadata: {
                analyzer: "thoth-package-extract",
                analyzer_version: "1.3.0",
                arguments: {
                    "extract-image": {
                        image: "quay.io/thoth-station/s2i-thoth-ubi8-py38:v0.14.1",
                        no_pretty: false,
                        no_tls_verify: false,
                        output: "/mnt/workdir/package-extract-220106085041-a6e38c8593af545e",
                        registry_credentials: null,
                        timeout: null,
                    },
                    "thoth-package-extract": {
                        metadata: {
                            environment_type: "runtime",
                            is_external: false,
                            origin: null,
                        },
                        verbose: false,
                    },
                },
                datetime: "2022-01-06T11:21:26.759528",
                distribution: {
                    codename: "",
                    id: "fedora",
                    like: "",
                    version: "32",
                    version_parts: {
                        build_number: "",
                        major: "32",
                        minor: "",
                    },
                },
                document_id: "package-extract-220106085041-a6e38c8593af545e",
                duration: 62,
                hostname:
                    "package-extract-220106085041-a6e38c8593af545e-583709264",
                os_release: {
                    id: "fedora",
                    name: "Fedora",
                    platform_id: "platform:f32",
                    redhat_bugzilla_product: "Fedora",
                    redhat_bugzilla_product_version: "32",
                    redhat_support_product: "Fedora",
                    redhat_support_product_version: "32",
                    variant_id: "container",
                    version: "32 (Container Image)",
                    version_id: "32",
                },
                python: {
                    api_version: 1013,
                    implementation_name: "cpython",
                    major: 3,
                    micro: 10,
                    minor: 8,
                    releaselevel: "final",
                    serial: 0,
                },
                thoth_deployment_name: "ocp4-stage",
                timestamp: 1641468086,
            },
            result: {
                "aicoe-ci": {
                    requirements: null,
                    requirements_lock: null,
                },
                "cuda-version": {},
                deb: [],
                "deb-dependencies": [],
                image_size: 347107430,
                layers: [
                    "a905c078265c2d3a1f959f8ca1d79b30453a16aed4de47dec5ed1c048b26a103",
                    "121d5409a427be35e19a57dbaa3d29e62baaf98a5f4296288b646aeb282fd554",
                    "a50500db3d1b335828f1a31bf32652ecf422beb7f12bd28f5ab052af90b81428",
                    "97b9bf14b9b756916dfa15569caa9183ae65a53d9f438356d2ba9540b64f9f78",
                    "c31e8174ade9b4489487e16212e64635220215261a8b9c29c40ed84a05767629",
                    "496d95f04eb94a14416198a04a2ae517d8a3ee8a44f5093c760ad92337850631",
                    "977f1e76e5f031b9e4ae5496db7bbc5ab7a5f96e977c1e85e5dc3d7065fc3eae",
                ],
                mercator: [
                    {
                        digests: {
                            manifest:
                                "0de531970deeb450d42f8e4237e684a97590bdde",
                        },
                        ecosystem: "Python",
                        path: "/usr/lib/node_modules/npm/node_modules/node-gyp/gyp/setup.py",
                        result: {
                            author: "Chromium Authors",
                            author_email: "chromium-dev@googlegroups.com",
                            description: "Generate Your Projects",
                            entry_points: {
                                console_scripts: ["gyp=gyp:script_main"],
                            },
                            ext_modules: [],
                            name: "gyp",
                            package_dir: {
                                "": "pylib",
                            },
                            packages: ["gyp", "gyp.generator"],
                            url: "http://code.google.com/p/gyp",
                            version: "0.1",
                        },
                    },
                    {
                        digests: {
                            manifest:
                                "e70ad6d2f68af45cc6e0be89fa83a1df9c214944",
                        },
                        ecosystem: "Python-Dist",
                        path: "/usr/lib/python3.6/site-packages/decorator-4.2.1-py3.6.egg-info/PKG-INFO",
                        result: {
                            author: "Michele Simionato",
                            "author-email": "michele.simionato@gmail.com",
                            classifier:
                                "Development Status :: 5 - Production/Stable\nIntended Audience :: Developers\nLicense :: OSI Approved :: BSD License\nNatural Language :: English\nOperating System :: OS Independent\nProgramming Language :: Python\nProgramming Language :: Python :: 2\nProgramming Language :: Python :: 2.6\nProgramming Language :: Python :: 2.7\nProgramming Language :: Python :: 3\nProgramming Language :: Python :: 3.2\nProgramming Language :: Python :: 3.3\nProgramming Language :: Python :: 3.4\nProgramming Language :: Python :: 3.5\nProgramming Language :: Python :: 3.6\nProgramming Language :: Python :: Implementation :: CPython\nTopic :: Software Development :: Libraries\nTopic :: Utilities",
                            description:
                                "Decorator module\n=================\n:Author: Michele Simionato\n:E-mail: michele.simionato@gmail.com\n:Requires: Python from 2.6 to 3.6\n:Download page: http://pypi.python.org/pypi/decorator\n:Installation: ``pip install decorator``\n:License: BSD license\nInstallation\n-------------\nIf you are lazy, just perform\n`$ pip install decorator`\nwhich will install just the module on your system.\nIf you prefer to install the full distribution from source, including\nthe documentation, clone the `GitHub repo`_ or download the tarball_, unpack it and run\n`$ pip install .`\nin the main directory, possibly as superuser.\n.. _tarball: http://pypi.python.org/pypi/decorator\n.. _GitHub repo: https://github.com/micheles/decorator\nTesting\n--------\nIf you have the source code installation you can run the tests with\n`$ python src/tests/test.py -v`\nor (if you have setuptools installed)\n`$ python setup.py test`\nNotice that you may run into trouble if in your system there\nis an older version of the decorator module; in such a case remove the\nold version. It is safe even to copy the module `decorator.py` over\nan existing one, since we kept backward-compatibility for a long time.\nRepository\n---------------\nThe project is hosted on GitHub. You can look at the source here:\nhttps://github.com/micheles/decorator\nDocumentation\n---------------\nThe documentation has been moved to http://decorator.readthedocs.io/en/latest/\nYou can download a PDF version of it from http://media.readthedocs.org/pdf/decorator/latest/decorator.pdf",
                            "home-page":
                                "https://github.com/micheles/decorator",
                            keywords: "decorators generic utility",
                            license: "new BSD License",
                            name: "decorator",
                            platform: "All",
                            summary:
                                "Better living through Python with decorators",
                            version: "4.2.1",
                        },
                    },
                    {
                        digests: {
                            manifest:
                                "10460bb1fe6c167f6ef25f56cf940fab6fb40dd1",
                        },
                        ecosystem: "Python-Dist",
                        path: "/usr/lib/python3.6/site-packages/iniparse-0.4-py3.6.egg-info/PKG-INFO",
                        result: {
                            author: "Paramjit Oberoi",
                            "author-email": "param@cs.wisc.edu",
                            classifier:
                                "Development Status :: 5 - Production/Stable\nIntended Audience :: Developers\nLicense :: OSI Approved :: MIT License\nLicense :: OSI Approved :: Python Software Foundation License\nOperating System :: OS Independent\nProgramming Language :: Python\nProgramming Language :: Python :: 2Programming Language :: Python :: 2.6\nProgramming Language :: Python :: 2.7\nProgramming Language :: Python :: 3\nProgramming Language :: Python :: 3.3\nProgramming Language :: Python :: 3.4Topic :: Software Development :: Libraries :: Python Modules",
                            description:
                                "iniparse is an INI parser for  Python which is API compatible\nwith the standard library's ConfigParser, preserves structure of INI\nfiles (order of sections & options, indentation, comments, and blank\nlines are preserved when data is updated), and is more convenient to\nuse.",
                            "home-page": "http://code.google.com/p/iniparse/",
                            license: "MIT",
                            name: "iniparse",
                            platform: "UNKNOWN",
                            summary: "Accessing and Modifying INI files",
                            version: "0.4",
                        },
                    },
                    {
                        digests: {
                            manifest:
                                "631ff27b520cadaae2221e8cb6c38d251d226998",
                        },
                        ecosystem: "Python-Dist",
                        path: "/usr/lib/python3.6/site-packages/pyinotify-0.9.6-py3.6.egg-info/PKG-INFO",
                        result: {
                            author: "Sebastien Martini",
                            "author-email": "seb@dbzteam.org",
                            classifier:
                                "Development Status :: 5 - Production/Stable\nEnvironment :: Console\nIntended Audience :: Developers\nLicense :: OSI Approved :: MIT License\nNatural Language :: English\nOperating System :: POSIX :: Linux\nProgramming Language :: Python\nProgramming Language :: Python :: 2.4\nProgramming Language :: Python :: 2.5\nProgramming Language :: Python :: 2.6\nProgramming Language :: Python :: 2.7\nProgramming Language :: Python :: 3\nProgramming Language :: Python :: 3.0\nProgramming Language :: Python :: 3.1\nProgramming Language :: Python :: 3.2\nProgramming Language :: Python :: 3.3\nProgramming Language :: Python :: 3.4\nProgramming Language :: Python :: Implementation :: CPython\nProgramming Language :: Python :: Implementation :: PyPy\nTopic :: Software Development :: Libraries :: Python Modules\nTopic :: System :: Filesystems\nTopic :: System :: Monitoring",
                            description: "UNKNOWN",
                            "download-url":
                                "http://pypi.python.org/pypi/pyinotify",
                            "home-page": "http://github.com/seb-m/pyinotify",
                            license: "MIT License",
                            name: "pyinotify",
                            platform: "Linux",
                            summary: "Linux filesystem events monitoring",
                            version: "0.9.6",
                        },
                    },
                    {
                        digests: {
                            manifest:
                                "781bb734f1d77ec58bd9ef10f56effd74b27c523",
                        },
                        ecosystem: "Python-Dist",
                        path: "/usr/lib/python3.6/site-packages/python_dateutil-2.6.1-py3.6.egg-info/PKG-INFO",
                        result: {
                            author: "Paul Ganssle",
                            "author-email": "dateutil@python.org",
                            classifier:
                                "Development Status :: 5 - Production/Stable\nIntended Audience :: Developers\nLicense :: OSI Approved :: BSD License\nProgramming Language :: Python\nProgramming Language :: Python :: 2\nProgramming Language :: Python :: 2.6\nProgramming Language :: Python :: 2.7\nProgramming Language :: Python :: 3\nProgramming Language :: Python :: 3.2\nProgramming Language :: Python :: 3.3\nProgramming Language :: Python :: 3.4\nProgramming Language :: Python :: 3.5\nProgramming Language :: Python :: 3.6\nTopic :: Software Development :: Libraries",
                            description:
                                "The dateutil module provides powerful extensions to the\ndatetime module available in the Python standard library.",
                            "home-page": "https://dateutil.readthedocs.io",
                            license: "Simplified BSD",
                            name: "python-dateutil",
                            platform: "UNKNOWN",
                            summary:
                                "Extensions to the standard Python datetime module",
                            version: "2.6.1",
                        },
                    },
                    {
                        digests: {
                            manifest:
                                "48237c4520c1e6712a66a0a03aa3daf1e8f1d8c7",
                        },
                        ecosystem: "Python-Dist",
                        path: "/usr/lib/python3.6/site-packages/setuptools-39.2.0.dist-info/metadata.json",
                        result: {
                            classifiers: [
                                "Development Status :: 5 - Production/Stable",
                                "Intended Audience :: Developers",
                                "License :: OSI Approved :: MIT License",
                                "Operating System :: OS Independent",
                                "Programming Language :: Python :: 2",
                                "Programming Language :: Python :: 2.7",
                                "Programming Language :: Python :: 3",
                                "Programming Language :: Python :: 3.3",
                                "Programming Language :: Python :: 3.4",
                                "Programming Language :: Python :: 3.5",
                                "Programming Language :: Python :: 3.6",
                                "Topic :: Software Development :: Libraries :: Python Modules",
                                "Topic :: System :: Archiving :: Packaging",
                                "Topic :: System :: Systems Administration",
                                "Topic :: Utilities",
                            ],
                            description_content_type:
                                "text/x-rst; charset=UTF-8",
                            extensions: {
                                "python.commands": {
                                    wrap_console: {
                                        easy_install:
                                            "setuptools.command.easy_install:main",
                                        "easy_install-3.6":
                                            "setuptools.command.easy_install:main",
                                    },
                                },
                                "python.details": {
                                    contacts: [
                                        {
                                            email: "distutils-sig@python.org",
                                            name: "Python Packaging Authority",
                                            role: "author",
                                        },
                                    ],
                                    document_names: {
                                        description: "DESCRIPTION.rst",
                                        license: "LICENSE.txt",
                                    },
                                    project_urls: {
                                        Home: "https://github.com/pypa/setuptools",
                                    },
                                },
                                "python.exports": {
                                    console_scripts: {
                                        easy_install:
                                            "setuptools.command.easy_install:main",
                                        "easy_install-3.6":
                                            "setuptools.command.easy_install:main",
                                    },
                                    "distutils.commands": {
                                        alias: "setuptools.command.alias:alias",
                                        bdist_egg:
                                            "setuptools.command.bdist_egg:bdist_egg",
                                        bdist_rpm:
                                            "setuptools.command.bdist_rpm:bdist_rpm",
                                        bdist_wininst:
                                            "setuptools.command.bdist_wininst:bdist_wininst",
                                        build_clib:
                                            "setuptools.command.build_clib:build_clib",
                                        build_ext:
                                            "setuptools.command.build_ext:build_ext",
                                        build_py:
                                            "setuptools.command.build_py:build_py",
                                        develop:
                                            "setuptools.command.develop:develop",
                                        dist_info:
                                            "setuptools.command.dist_info:dist_info",
                                        easy_install:
                                            "setuptools.command.easy_install:easy_install",
                                        egg_info:
                                            "setuptools.command.egg_info:egg_info",
                                        install:
                                            "setuptools.command.install:install",
                                        install_egg_info:
                                            "setuptools.command.install_egg_info:install_egg_info",
                                        install_lib:
                                            "setuptools.command.install_lib:install_lib",
                                        install_scripts:
                                            "setuptools.command.install_scripts:install_scripts",
                                        register:
                                            "setuptools.command.register:register",
                                        rotate: "setuptools.command.rotate:rotate",
                                        saveopts:
                                            "setuptools.command.saveopts:saveopts",
                                        sdist: "setuptools.command.sdist:sdist",
                                        setopt: "setuptools.command.setopt:setopt",
                                        test: "setuptools.command.test:test",
                                        upload: "setuptools.command.upload:upload",
                                        upload_docs:
                                            "setuptools.command.upload_docs:upload_docs",
                                    },
                                    "distutils.setup_keywords": {
                                        convert_2to3_doctests:
                                            "setuptools.dist:assert_string_list",
                                        dependency_links:
                                            "setuptools.dist:assert_string_list",
                                        eager_resources:
                                            "setuptools.dist:assert_string_list",
                                        entry_points:
                                            "setuptools.dist:check_entry_points",
                                        exclude_package_data:
                                            "setuptools.dist:check_package_data",
                                        extras_require:
                                            "setuptools.dist:check_extras",
                                        include_package_data:
                                            "setuptools.dist:assert_bool",
                                        install_requires:
                                            "setuptools.dist:check_requirements",
                                        namespace_packages:
                                            "setuptools.dist:check_nsp",
                                        package_data:
                                            "setuptools.dist:check_package_data",
                                        packages:
                                            "setuptools.dist:check_packages",
                                        python_requires:
                                            "setuptools.dist:check_specifier",
                                        setup_requires:
                                            "setuptools.dist:check_requirements",
                                        test_loader:
                                            "setuptools.dist:check_importable",
                                        test_runner:
                                            "setuptools.dist:check_importable",
                                        test_suite:
                                            "setuptools.dist:check_test_suite",
                                        tests_require:
                                            "setuptools.dist:check_requirements",
                                        use_2to3: "setuptools.dist:assert_bool",
                                        use_2to3_exclude_fixers:
                                            "setuptools.dist:assert_string_list",
                                        use_2to3_fixers:
                                            "setuptools.dist:assert_string_list",
                                        zip_safe: "setuptools.dist:assert_bool",
                                    },
                                    "egg_info.writers": {
                                        "PKG-INFO":
                                            "setuptools.command.egg_info:write_pkg_info",
                                        "dependency_links.txt":
                                            "setuptools.command.egg_info:overwrite_arg",
                                        "depends.txt":
                                            "setuptools.command.egg_info:warn_depends_obsolete",
                                        "eager_resources.txt":
                                            "setuptools.command.egg_info:overwrite_arg",
                                        "entry_points.txt":
                                            "setuptools.command.egg_info:write_entries",
                                        "namespace_packages.txt":
                                            "setuptools.command.egg_info:overwrite_arg",
                                        "requires.txt":
                                            "setuptools.command.egg_info:write_requirements",
                                        "top_level.txt":
                                            "setuptools.command.egg_info:write_toplevel_names",
                                    },
                                    "setuptools.installation": {
                                        eggsecutable:
                                            "setuptools.command.easy_install:bootstrap",
                                    },
                                },
                            },
                            extras: ["certs", "ssl"],
                            generator: "bdist_wheel (0.30.0)",
                            keywords: [
                                "CPAN",
                                "PyPI",
                                "distutils",
                                "eggs",
                                "package",
                                "management",
                            ],
                            metadata_version: "2.0",
                            name: "setuptools",
                            project_url:
                                "Documentation, https://setuptools.readthedocs.io/",
                            requires_python: ">=2.7,!=3.0.*,!=3.1.*,!=3.2.*",
                            run_requires: [
                                {
                                    extra: "certs",
                                    requires: ["certifi (==2016.9.26)"],
                                },
                                {
                                    environment: "sys_platform=='win32'",
                                    extra: "ssl",
                                    requires: ["wincertstore (==0.2)"],
                                },
                            ],
                            summary:
                                "Easily download, build, install, upgrade, and uninstall Python packages",
                            version: "39.2.0",
                        },
                    },
                    {
                        digests: {
                            manifest:
                                "3357d9151f71b02995ac3bde5cfc9ff6c15f34ff",
                        },
                        ecosystem: "Python-Dist",
                        path: "/usr/lib/python3.6/site-packages/six-1.11.0.dist-info/metadata.json",
                        result: {
                            classifiers: [
                                "Programming Language :: Python :: 2",
                                "Programming Language :: Python :: 3",
                                "Intended Audience :: Developers",
                                "License :: OSI Approved :: MIT License",
                                "Topic :: Software Development :: Libraries",
                                "Topic :: Utilities",
                            ],
                            extensions: {
                                "python.details": {
                                    contacts: [
                                        {
                                            email: "benjamin@python.org",
                                            name: "Benjamin Peterson",
                                            role: "author",
                                        },
                                    ],
                                    document_names: {
                                        description: "DESCRIPTION.rst",
                                    },
                                    project_urls: {
                                        Home: "http://pypi.python.org/pypi/six/",
                                    },
                                },
                            },
                            generator: "bdist_wheel (0.30.0)",
                            license: "MIT",
                            metadata_version: "2.0",
                            name: "six",
                            summary: "Python 2 and 3 compatibility utilities",
                            test_requires: [
                                {
                                    requires: ["pytest"],
                                },
                            ],
                            version: "1.11.0",
                        },
                    },
                    {
                        digests: {
                            manifest:
                                "75ce23d0235eca53f560195eb43160b12a95f847",
                        },
                        ecosystem: "Python-Dist",
                        path: "/usr/lib/python3.6/site-packages/syspurpose-1.26.17-py3.6.egg-info/PKG-INFO",
                        result: {
                            author: "Chris Snyder",
                            "author-email": "chainsaw@redhat.com",
                            description: "UNKNOWN",
                            "home-page": "http://www.candlepinproject.org",
                            license: "GPLv2",
                            name: "syspurpose",
                            platform: "UNKNOWN",
                            summary: "Manage Red Hat System Purpose",
                            version: "1.26.17",
                        },
                    },
                    {
                        digests: {
                            manifest:
                                "82a4c714303eed36aecd5d32a20b5b6306f9a5c7",
                        },
                        ecosystem: "Python-Dist",
                        path: "/usr/lib64/python3.6/site-packages/dbus_python-1.2.4-py3.6.egg-info/PKG-INFO",
                        result: {
                            classifier:
                                "Development Status :: 7 - Inactive\nLicense :: OSI Approved :: MIT License\nProgramming Language :: C\nProgramming Language :: Python :: 2\nProgramming Language :: Python :: 3\nProgramming Language :: Python :: Implementation :: CPython\nTopic :: Software Development :: Object Brokering",
                            description: "UNKNOWN",
                            "download-url":
                                "http://dbus.freedesktop.org/releases/dbus-python/",
                            "home-page":
                                "http://www.freedesktop.org/wiki/Software/DBusBindings/#python",
                            license: "Expat (MIT/X11)",
                            name: "dbus-python",
                            platform: "UNKNOWN",
                            summary: "Python bindings for libdbus",
                            version: "1.2.4",
                        },
                    },
                    {
                        digests: {
                            manifest:
                                "8497fae7a04ec9b2f3ff206b6f567643f419cbed",
                        },
                        ecosystem: "Python-Dist",
                        path: "/usr/lib64/python3.6/site-packages/ethtool-0.14-py3.6.egg-info/PKG-INFO",
                        result: {
                            author: "Harald Hoyer, Arnaldo Carvalho de Melo, David Sommerseth",
                            "author-email": "davids@redhat.com",
                            classifier:
                                "Development Status :: 7 - Inactive\nIntended Audience :: Developers\nIntended Audience :: System Administrators\nOperating System :: POSIX :: Linux\nLicense :: OSI Approved :: GNU General Public License v2 (GPLv2)\nProgramming Language :: Python\nProgramming Language :: Python :: 2\nProgramming Language :: Python :: 2.7\nProgramming Language :: Python :: 3\nProgramming Language :: Python :: 3.5\nProgramming Language :: Python :: 3.6\nProgramming Language :: Python :: 3.7\nProgramming Language :: Python :: Implementation :: CPython\nTopic :: Software Development :: Libraries\nTopic :: System :: Networking",
                            description:
                                "Python ethtool module\n=====================\n*Python bindings for the ethtool kernel interface*\nThe Python ``ethtool`` module allows querying and partially controlling network\ninterfaces, driver, and hardware settings.\n.. warning::\nThis is the new upstream for python-ethtool maintained by Fedora's\nPython SIG. We ported it to Python 3 and only maintain it for the current\ntools to keep working. **No new development is happening. This is a\ndeprecated package.** If you are considering to start using this, please\ndon't. We recommend `netifaces <https://pypi.org/project/netifaces/>`_ instead.\nInstallation\n------------\nThe easiest way to install ``ethtool`` is to use your distribution packages\nrepositories. For example:\n**Fedora**: ``sudo dnf install python3-ethtool`` or ``sudo dnf install python2-ethtool``\n**Ubuntu**: ``sudo apt install python-ethtool``\nIn order to install ``ethtool`` from source or PyPI install its dependencies first:\n**Fedora**: ``sudo dnf install libnl3-devel gcc redhat-rpm-config python3-devel``\n**Ubuntu**: ``sudo apt install python3 python3-setuptools libpython3.6-dev libnl-route-3-dev``\nAnd then install ``ethtool``:\n**from PyPI**: ``pip3 install ethtool``\n**from source**: ``python3 setup.py install``\nUsage\n-----\n``ethtool`` may be used as a Python library::\n>>> import ethtool\n>>> ethtool.get_active_devices()\n['lo', 'enp0s31f6', 'wlp4s0', 'virbr0', 'docker0', 'virbr1', 'eth0', 'tun0']\n>>> ethtool.get_ipaddr('lo')\n'127.0.0.1'\nThe ``ethtool`` package also provides the ``pethtool`` and ``pifconfig`` utilities.  More example usage may be gathered from their sources,\n`pethtool.py <https://github.com/fedora-python/python-ethtool/blob/master/scripts/pethtool>`_\nand\n`pifconfig.py <https://github.com/fedora-python/python-ethtool/blob/master/scripts/pethtool>`_.\n``pethtool`` mimics behavior of the ``ethtool`` utility, but does not\nsupport all options.\ne.g., to get driver information on the ``eth0`` interface::\n$ pethtool -i eth0\ndriver: cdc_ether\nbus-info: usb-0000:00:14.0-4.1.3\nAnalogically, ``pifconfig`` mimics ``ifconfig`` in usage.  It may be\nused to view information on an interface::\n$ pifconfig lo\nlo\ninet addr:127.0.0.1   Mask:255.0.0.0\ninet6 addr: ::1/128 Scope: host\nUP LOOPBACK RUNNING\nFurther usage information may be found in the respective manpages for\n`pethtool <https://github.com/fedora-python/python-ethtool/blob/master/man/pethtool.8.asciidoc>`_\nand\n`pifconfig <https://github.com/fedora-python/python-ethtool/blob/master/man/pifconfig.8.asciidoc>`_.\nTests\n-----\nTests may be run by ``tox``.\nAuthors\n-------\n* Andy Grover\n* Antoni S. Puimedon\n* Arnaldo Carvalho de Melo\n* Bohuslav Kabrda\n* Bra\u0148o N\u00e1ter\n* Dave Malcolm\n* David S. Miller\n* David Sommerseth\n* Harald Hoyer\n* Charalampos Stratakis\n* Jeff Garzik\n* Lumir Balhar\n* Miro Hron\u010dok\n* Miroslav Such\u00fd\n* Ruben Kerkhof\n* Sanqui\n* Yaakov Selkowitz\nCurrent maintainers\n-------------------\n* Lum\u00edr Balhar <lbalhar@redhat.com>\n* Miro Hron\u010dok <mhroncok@redhat.com>\n* Charalampos Stratakis <cstratak@redhat.com>\n* Sanqui <dlabsky@redhat.com>\nContributing\n------------\nFeel free to help us with improving test coverage, porting to Python 3\nor anything else.\nIssues and PRs `on GitHub <https://github.com/fedora-python/python-ethtool>`_\nare welcome.\nLicense\n-------\nThe Python ``ethtool`` project is free software distributed under the terms of\nthe GNU General Public License v2.0, see\n`COPYING <https://github.com/fedora-python/python-ethtool/blob/master/COPYING>`_.\nChangelog\n=========\n0.14\n----\nWed Sep 12 2018 Miro Hron\u010dok <mhroncok@redhat.com>\n- Declared project as bugfix only from now on\n- Support Python 3.7\n- Fix important issues reported by static analysis\n- Fix installation on non-UTF-8 locales on Python 3.5 and 3.6\n- Added set_gso(), get_gro() and set_gro() functions\n- Added installation instructions\n0.13\n----\nTue Jun 13 2017 Miro Hron\u010dok <mhroncok@redhat.com>\n- First release on PyPI\n- Supports both Python 2.7 and 3.5+\n- Dropped support for Python 2.6\n- Upstream URL changed to https://github.com/fedora-python/python-ethtool\n- Introduced a basic README file\n- PEP7 and PEP8 (code style) improvements\n- Fix compilation errors on modern Fedoras\n0.12\n----\nTue Mar 21 2017 Charalampos Stratakis <cstratak@redhat.com>\n- First attempt at python3 support\n0.11\n----\nThu May 8 2014 David Sommerseth <davids@redhat.com>\n- Improved error handling several places\n- Ensure that we get a valid libnl NETLINK connection when connecting\n- URL updates to SPEC file\n0.10\n----\nFri Jan 10 2014 David Sommerseth <davids@redhat.com>\n- Not really a full release, but a preliminary release to get more wide testing\n- FSF Copyright updates\n- Build fixes\n- Mostly code cleanup\n0.9\n---\nWed Dec 11 2013 David Sommerseth <davids@redhat.com>\n- Fixed get_active_devices() for IPv6 only interfaces\n- Moved from libnl1 to libnl3\n- Refactor PyNetlink*Address implementation\n0.8\n---\nTue Feb 19 2013 David Malcolm <dmalcolm@redhat.com>\n- Enable IPv6 in pifethtool example\n- Code cleanup, fixing buffer overflows, memory leaks, etc\n0.7\n---\nMon Apr 11 2011 David Sommerseth <davids@redhat.com>\n- Fixed several memory leaks (commit aa2c20e697af, abc7f912f66d)\n- Improved error checking towards NULL values(commit 4e928d62a8e3)\n- Fixed typo in pethtool --help (commit 710766dc722)\n- Only open a NETLINK connection when needed (commit 508ffffbb3c)\n- Added man page for pifconfig and pethtool (commit 9f0d17aa532, rhbz#638475)\n- Force NETLINK socket to close on fork() using FD_CLOEXEC (commit 1680cbeb40e)\n0.6\n---\nWed Jan 19 2011 David Sommerseth <davids@redhat.com>\n- Don't segfault if we don't receive any address from rtnl_link_get_addr()\n- Remove errornous file from MANIFEST\n- Added ethtool.version string constant\n- Avoid duplicating IPv6 address information\n- import sys module in setup.py (Miroslav Suchy)\n0.5\n---\nMon Aug  9 2010 David Sommerseth <davids@redhat.com>\n- Fixed double free issue (commit c52ed2cbdc5b851ebc7b)\n0.4\n---\nWed Apr 28 2010 David Sommerseth <davids@redhat.com>\n- David Sommerseth is now taking over the maintenance of python-ethtool\n- New URLs for upstream source code\n- Added new API: ethtool.get_interfaces_info() - returns list of etherinfo objects\n- Added support retrieving for IPv6 address, using etherinfo::get_ipv6_addresses()\n0.3\n---\nTue Aug 26 2008 Arnaldo Carvalho de Melo <acme@redhat.com>\n- Add get_flags method from the first python-ethtool contributor, yay\n- Add pifconfig command, that mimics the ifconfig tool using the\nbindings available\n0.2\n---\nWed Aug 20 2008 Arnaldo Carvalho de Melo <acme@redhat.com>\n- Expand description and summary fields, as part of the fedora\nreview process.\n0.1\n---\nTue Dec 18 2007 Arnaldo Carvalho de Melo <acme@redhat.com>\n- Get ethtool code from rhpl 0.212",
                            "home-page":
                                "https://github.com/fedora-python/python-ethtool",
                            keywords:
                                "network networking ethernet tool ethtool",
                            license: "GPL-2.0",
                            name: "ethtool",
                            platform: "UNKNOWN",
                            summary: "Python module to interface with ethtool",
                            version: "0.14",
                        },
                    },
                    {
                        digests: {
                            manifest:
                                "814775526c5c4bd46eeab3678ee3198a3d70de0f",
                        },
                        ecosystem: "Python-Dist",
                        path: "/usr/lib64/python3.6/site-packages/subscription_manager-1.26.17-py3.6.egg-info/PKG-INFO",
                        result: {
                            author: "Adrian Likins",
                            "author-email": "alikins@redhat.com",
                            description: "UNKNOWN",
                            "home-page": "http://www.candlepinproject.org",
                            license: "GPLv2",
                            name: "subscription-manager",
                            platform: "UNKNOWN",
                            summary:
                                "Manage subscriptions for Red Hat products.",
                            version: "1.26.17",
                        },
                    },
                    {
                        digests: {
                            manifest:
                                "ab211004bad21f637851c6ae69a429e4a0a88c0b",
                        },
                        ecosystem: "Python-Dist",
                        path: "/usr/local/lib/python3.8/site-packages/chardet-3.0.4.dist-info/metadata.json",
                        result: {
                            classifiers: [
                                "Development Status :: 4 - Beta",
                                "Intended Audience :: Developers",
                                "License :: OSI Approved :: GNU Library or Lesser General Public License (LGPL)",
                                "Operating System :: OS Independent",
                                "Programming Language :: Python",
                                "Programming Language :: Python :: 2",
                                "Programming Language :: Python :: 2.6",
                                "Programming Language :: Python :: 2.7",
                                "Programming Language :: Python :: 3",
                                "Programming Language :: Python :: 3.3",
                                "Programming Language :: Python :: 3.4",
                                "Programming Language :: Python :: 3.5",
                                "Programming Language :: Python :: 3.6",
                                "Topic :: Software Development :: Libraries :: Python Modules",
                                "Topic :: Text Processing :: Linguistic",
                            ],
                            extensions: {
                                "python.commands": {
                                    wrap_console: {
                                        chardetect:
                                            "chardet.cli.chardetect:main",
                                    },
                                },
                                "python.details": {
                                    contacts: [
                                        {
                                            email: "dan.blanchard@gmail.com",
                                            name: "Daniel Blanchard",
                                            role: "author",
                                        },
                                    ],
                                    document_names: {
                                        description: "DESCRIPTION.rst",
                                    },
                                    project_urls: {
                                        Home: "https://github.com/chardet/chardet",
                                    },
                                },
                                "python.exports": {
                                    console_scripts: {
                                        chardetect:
                                            "chardet.cli.chardetect:main",
                                    },
                                },
                            },
                            generator: "bdist_wheel (0.29.0)",
                            keywords: ["encoding", "i18n", "xml"],
                            license: "LGPL",
                            metadata_version: "2.0",
                            name: "chardet",
                            summary:
                                "Universal encoding detector for Python 2 and 3",
                            test_requires: [
                                {
                                    requires: ["hypothesis", "pytest"],
                                },
                            ],
                            version: "3.0.4",
                        },
                    },
                    {
                        digests: {
                            manifest:
                                "21f5fdafc8ecc191e8d9b720b08046056110f1d8",
                        },
                        ecosystem: "Python-Dist",
                        path: "/usr/local/lib/python3.8/site-packages/invectio-0.0.7.dist-info/metadata.json",
                        result: {
                            classifiers: [
                                "Operating System :: POSIX :: Linux",
                                "Topic :: Software Development",
                                "Development Status :: 4 - Beta",
                                "License :: OSI Approved :: GNU General Public License v3 or later (GPLv3+)",
                                "Intended Audience :: Developers",
                                "Programming Language :: Python :: 3",
                                "Programming Language :: Python :: 3.6",
                                "Programming Language :: Python :: 3.7",
                            ],
                            description_content_type: "UNKNOWN",
                            extensions: {
                                "python.commands": {
                                    wrap_console: {
                                        invectio: "invectio.cli:cli",
                                    },
                                },
                                "python.details": {
                                    contacts: [
                                        {
                                            email: "fridex.devel@gmail.com",
                                            name: "Fridolin Pokorny",
                                            role: "author",
                                        },
                                    ],
                                    document_names: {
                                        description: "DESCRIPTION.rst",
                                    },
                                    project_urls: {
                                        Home: "https://github.com/thoth-station/invectio",
                                    },
                                },
                                "python.exports": {
                                    console_scripts: {
                                        invectio: "invectio.cli:cli",
                                    },
                                },
                            },
                            extras: [],
                            generator: "bdist_wheel (0.30.0.a0)",
                            keywords: [
                                "ast",
                                "source",
                                "code",
                                "analysis",
                                "thoth",
                                "library",
                            ],
                            license: "GPLv3+",
                            metadata_version: "2.0",
                            name: "invectio",
                            run_requires: [
                                {
                                    requires: ["attrs", "click", "daiquiri"],
                                },
                            ],
                            summary:
                                "Statically analyze sources and extract information about called library functions in Python applications",
                            version: "0.0.7",
                        },
                    },
                    {
                        digests: {
                            manifest:
                                "3e91d36a66daa6666d508cc13bc388663fbf861e",
                        },
                        ecosystem: "Python-Dist",
                        path: "/usr/local/lib/python3.8/site-packages/jsonformatter-0.2.3-py3.8.egg-info/PKG-INFO",
                        result: {
                            author: "MyColorfulDays",
                            "author-email": "my_colorful_days@163.com",
                            classifier:
                                "Development Status :: 2 - Pre-Alpha\nIntended Audience :: Developers\nLicense :: OSI Approved :: BSD License\nOperating System :: OS Independent\nProgramming Language :: Python :: 2.7\nProgramming Language :: Python :: 3\nProgramming Language :: Python :: Implementation :: CPython\nTopic :: Utilities",
                            description:
                                'Table of Contents\n=================\n* [jsonformatter \\-\\- for python log json](#jsonformatter----for-python-log-json)\n* [Installation](#installation)\n* [Basic Usage](#basic-usage)\n* [Case 1\\. Use default config](#case-1-use-default-config)\n* [Case 2\\. config in python code](#case-2-config-in-python-code)\n* [Case 3\\. config from config file](#case-3-config-from-config-file)\n* [More Usage](#more-usage)\n* [Case 1\\. output multiple attributes in one key](#case-1-output-multiple-attributes-in-one-key)\n* [Case 2\\. support json\\.dumps all optional parameters](#case-2-support-jsondumps-all-optional-parameters)\n* [Case 3\\. support cumtom(add/replace) LogRecord  attribute](#case-3-support-cumtomaddreplace-logrecord--attribute)\n* [LogRecord Attributes](#logrecord-attributes)\n# jsonformatter -- for python log json\n**jsonformatter** is a formatter for python output json log,  you can easily output **LogStash** needed log format or other **custom** json format  and  you can easily **custom(add/replace)** `LogRecord` attribute.\n**Python 2.7** and **python 3** are supported from version 0.2.X,  if you are using a version lower than 0.2.X,  **python 3** is only supported.\n## Installation\njsonformatter is available on PyPI.\nUse pip to install:\n```shell\n$ pip install jsonformatter\n```\nor:\n```shell\n$ git clone https://github.com/MyColorfulDays/jsonformatter.git\n$ cd jsonformatter\n$ python setup.py install\n```\n## Basic Usage\n### Case 1. Use default config\n```python\nimport logging\nfrom jsonformatter import JsonFormatter\nroot = logging.getLogger()\nroot.setLevel(logging.INFO)\nformatter = JsonFormatter()\nsh = logging.StreamHandler()\nsh.setFormatter(formatter)\nsh.setLevel(logging.INFO)\nroot.addHandler(sh)\nroot.info("test %s config", \'default\')\n```\noutput:\n```shell\n{"levelname": "INFO", "name": "root", "message": "test default config"}\n```\n### Case 2. config in python code\n```python3\nimport logging\nfrom jsonformatter import JsonFormatter\n# `format` can be json, OrderedDict, dict.\n# If `format` is `dict` and python version<3.7.0, the output ordered is sorted keys, otherwise will same as define ordered.\n# key: string, can be whatever you like.\n# value: `LogRecord` attribute name.\nSTRING_FORMAT = \'\'\'{\n"Name":            "name",\n"Levelno":         "levelno",\n"Levelname":       "levelname",\n"Pathname":        "pathname",\n"Filename":        "filename",\n"Module":          "module",\n"Lineno":          "lineno",\n"FuncName":        "funcName",\n"Created":         "created",\n"Asctime":         "asctime",\n"Msecs":           "msecs",\n"RelativeCreated": "relativeCreated",\n"Thread":          "thread",\n"ThreadName":      "threadName",\n"Process":         "process",\n"Message":         "message"\n}\'\'\'\nroot = logging.getLogger()\nroot.setLevel(logging.INFO)\nformatter = JsonFormatter(STRING_FORMAT)\nsh = logging.StreamHandler()\nsh.setFormatter(formatter)\nsh.setLevel(logging.INFO)\nroot.addHandler(sh)\nroot.info("test %s format", \'string\')\n```\noutput:\n```shell\n{"Name": "root", "Levelno": 20, "Levelname": "INFO", "Pathname": "test.py", "Filename": "test.py", "Module": "test", "Lineno": 75, "FuncName": "test_string_format", "Created": 1588185267.3198836, "Asctime": "2020-04-30 02:34:27,319", "Msecs": 319.8835849761963, "RelativeCreated": 88.2880687713623, "Thread": 16468, "ThreadName": "MainThread", "Process": 16828, "Message": "test string format"}\n```\n### Case 3. config from config file\nconfig file:\n```shell\n$ cat logger_config.ini\n[loggers]\nkeys=root\n[logger_root]\nlevel=DEBUG\nhandlers=infohandler\n###############################################\n[handlers]\nkeys=infohandler\n[handler_infohandler]\nclass=StreamHandler\nlevel=INFO\nformatter=form01\nargs=(sys.stdout,)\n###############################################\n[formatters]\nkeys=form01\n[formatter_form01]\nclass=jsonformatter.JsonFormatter\nformat={"name": "name","levelno": "levelno","levelname": "levelname","pathname": "pathname","filename": "filename","module": "module","lineno": "lineno","funcName": "funcName","created": "created","asctime": "asctime","msecs": "msecs","relativeCreated": "relativeCreated","thread": "thread","threadName": "threadName","process": "process","message": "message"}\n```\npython code:\n```python3\nimport logging\nimport os\nfrom logging.config import fileConfig\nfileConfig(os.path.join(os.path.dirname(__file__), \'logger_config.ini\'))\nroot = logging.getLogger(\'root\')\nroot.info(\'test file config\')\n```\noutput:\n```shell\n{"name": "root", "levelno": 20, "levelname": "INFO", "pathname": "test.py", "filename": "test.py", "module": "test", "lineno": 315, "funcName": "test_file_config", "created": 1588185267.3020294, "asctime": "2020-04-30 02:34:27", "msecs": 302.0293712615967, "relativeCreated": 70.4338550567627, "thread": 16468, "threadName": "MainThread", "process": 16828, "message": "test file config"}\n```\n## More Usage\n### Case 1. output multiple attributes in one key\n```python3\nimport logging\nfrom jsonformatter import JsonFormatter\nMULTI_ATTRIBUTES_FORMAT = \'\'\'{\n"multi attributes in one key": "%(name)s - %(levelno)s - %(levelname)s - %(pathname)s - %(filename)s - %(module)s - %(lineno)d - %(funcName)s - %(created)f - %(asctime)s - %(msecs)d - %(relativeCreated)d - %(thread)d - %(threadName)s - %(process)d - %(message)s"\n}\n\'\'\'\nroot = logging.getLogger()\nroot.setLevel(logging.INFO)\nformatter = JsonFormatter(MULTI_ATTRIBUTES_FORMAT)\nsh = logging.StreamHandler()\nsh.setFormatter(formatter)\nsh.setLevel(logging.INFO)\nroot.addHandler(sh)\nroot.info(\'test multi attributes in one key\')\n```\n### Case 2. support `json.dumps` all optional parameters\n```python3\nimport logging\nfrom jsonformatter import JsonFormatter\nSTRING_FORMAT = \'\'\'{\n"Name":            "name",\n"Levelno":         "levelno",\n"Levelname":       "levelname",\n"Pathname":        "pathname",\n"Filename":        "filename",\n"Module":          "module",\n"Lineno":          "lineno",\n"FuncName":        "funcName",\n"Created":         "created",\n"Asctime":         "asctime",\n"Msecs":           "msecs",\n"RelativeCreated": "relativeCreated",\n"Thread":          "thread",\n"ThreadName":      "threadName",\n"Process":         "process",\n"Message":         "message"\n}\'\'\'\nroot = logging.getLogger()\nroot.setLevel(logging.INFO)\nformatter = JsonFormatter(STRING_FORMAT, indent=4, ensure_ascii=False)\nsh = logging.StreamHandler()\nsh.setFormatter(formatter)\nsh.setLevel(logging.INFO)\nroot.addHandler(sh)\nroot.info(\'test json optional paramter: \u4e2d\u6587\')\n```\n### Case 3. support cumtom(add/replace) `LogRecord`  attribute\n```python3\nimport datetime\nimport json\nimport logging\nimport random\nfrom collections import OrderedDict\nfrom jsonformatter import JsonFormatter\n# the key will add/replace `LogRecord` attribute.\n# the value must be `callable` type and not support paramters, the returned value will be as the `LogRecord` attribute value.\nRECORD_CUSTOM_ATTRS = {\n# `datetime.datetime` type is not JSON serializable.\n# solve it in three ways.\n# 1. use `LogRecord` attribute `Format`: %(asctme)s.\n# 2. use `json.dumps` optional parameter `default`.\n# 3. use `json.dumps` optional parameter `cls`.\n\'asctime\': lambda: datetime.datetime.today(),\n\'user id\': lambda: str(random.random())[2:10]\n}\nRECORD_CUSTOM_FORMAT = OrderedDict([\n("User id",         "user id"),  # new custom attrs\n("Name",            "name"),\n("Levelno",         "levelno"),\n("Levelname",       "levelname"),\n("Pathname",        "pathname"),\n("Filename",        "filename"),\n("Module",          "module"),\n("Lineno",          "lineno"),\n("FuncName",        "funcName"),\n("Created",         "created"),\n("Asctime",         "%(asctime)s"),  # use `LogRecord` attribute `Format` to find matched key from RECORD_CUSTOM_ATTRS and call it value.\n("Msecs",           "msecs"),\n("RelativeCreated", "relativeCreated"),\n("Thread",          "thread"),\n("ThreadName",      "threadName"),\n("Process",         "process"),\n("Message",         "message")\n])\n# use `json.dumps` optional parameter `default`\ndef DEFAULT_SOLUTION(o):\nif not isinstance(o, (str, int, float, bool, type(None))):\nreturn str(o)\nelse:\nreturn o\n# use `json.dumps` optional parameter `cls`\nclass CLS_SOLUTION(json.JSONEncoder):\ndef default(self, o):\nif isinstance(o, datetime.datetime):\nreturn o.isoformat()\nreturn json.JSONEncoder.default(self, o)\nroot = logging.getLogger()\nroot.setLevel(logging.INFO)\nformatter = JsonFormatter(RECORD_CUSTOM_FORMAT, record_custom_attrs=RECORD_CUSTOM_ATTRS, default=DEFAULT_SOLUTION, cls=CLS_SOLUTION)\nsh = logging.StreamHandler()\nsh.setFormatter(formatter)\nsh.setLevel(logging.INFO)\nroot.addHandler(sh)\nroot.info(\'record custom attrs\')\n```\n## LogRecord Attributes\nOffical url: https://docs.python.org/3/library/logging.html#logrecord-attributes\nAttribute name|Format|Description\n-|-|-\nargs|You shouldn\u2019t need to format this yourself.|The tuple of arguments merged into msg to produce message, or a dict whose values are used for the merge (when there is only one argument, and it is a dictionary).\nasctime|%(asctime)s|Human-readable time when the LogRecord was created. By default this is of the form \u20182003-07-08 16:49:45,896\u2019 (the numbers after the comma are millisecond portion of the time).\ncreated|%(created)f|Time when the LogRecord was created (as returned by time.time()).\nexc_info|You shouldn\u2019t need to format this yourself.|Exception tuple (\u00e0 la sys.exc_info) or, if no exception has occurred, None.\nfilename|%(filename)s|Filename portion of pathname.\nfuncName|%(funcName)s|Name of function containing the logging call.\nlevelname|%(levelname)s|Text logging level for the message (\'DEBUG\', \'INFO\', \'WARNING\', \'ERROR\', \'CRITICAL\').\nlevelno|%(levelno)s|Numeric logging level for the message (DEBUG, INFO, WARNING, ERROR, CRITICAL).\nlineno|%(lineno)d|Source line number where the logging call was issued (if available).\nmessage|%(message)s|The logged message, computed as msg % args. This is set when Formatter.format() is invoked.\nmodule|%(module)s|Module (name portion of filename).\nmsecs|%(msecs)d|Millisecond portion of the time when the LogRecord was created.\nmsg|You shouldn\u2019t need to format this yourself.|The format string passed in the original logging call. Merged with args to produce message, or an arbitrary object (see Using arbitrary objects as messages).\nname|%(name)s|Name of the logger used to log the call.\npathname|%(pathname)s|Full pathname of the source file where the logging call was issued (if available).\nprocess|%(process)d|Process ID (if available).\nprocessName|%(processName)s|Process name (if available).\nrelativeCreated|%(relativeCreated)d|Time in milliseconds when the LogRecord was created, relative to the time the logging module was loaded.\nstack_info|You shouldn\u2019t need to format this yourself.|Stack frame information (where available) from the bottom of the stack in the current thread, up to and including the stack frame of the logging call which resulted in the creation of this record.\nthread|%(thread)d|Thread ID (if available).\nthreadName|%(threadName)s|Thread name (if available).',
                            "home-page":
                                "https://github.com/MyColorfulDays/jsonformatter.git",
                            license: "BSD License",
                            name: "jsonformatter",
                            platform: "all",
                            summary: "Python log in json format.",
                            version: "0.2.3",
                        },
                    },
                    {
                        digests: {
                            manifest:
                                "d1158c379e522ad8403530e7e01b55e4d1028b51",
                        },
                        ecosystem: "Python-Dist",
                        path: "/usr/local/lib/python3.8/site-packages/openshift-0.10.3-py3.8.egg-info/PKG-INFO",
                        result: {
                            author: "OpenShift",
                            "author-email": "UNKNOWN",
                            classifier:
                                "Development Status :: 3 - Alpha\nTopic :: Utilities\nIntended Audience :: Developers\nIntended Audience :: Information Technology\nLicense :: OSI Approved :: Apache Software License\nOperating System :: OS Independent\nProgramming Language :: Python\nProgramming Language :: Python :: 2\nProgramming Language :: Python :: 2.7\nProgramming Language :: Python :: 3\nProgramming Language :: Python :: 3.5",
                            description:
                                "Python client for OpenShift http://openshift.redhat.com/",
                            "home-page":
                                "https://github.com/openshift/openshift-restclient-python",
                            keywords: "Swagger,OpenAPI,Kubernetes,OpenShift",
                            license: "Apache License Version 2.0",
                            name: "openshift",
                            platform: "UNKNOWN",
                            summary: "OpenShift python client",
                            version: "0.10.3",
                        },
                    },
                    {
                        digests: {
                            manifest:
                                "3e84e9d9cd4c2495c034a29656909eb28bcd600e",
                        },
                        ecosystem: "Python-Dist",
                        path: "/usr/local/lib/python3.8/site-packages/pyelftools-0.26.dist-info/metadata.json",
                        result: {
                            classifiers: [
                                "Programming Language :: Python :: 2",
                                "Programming Language :: Python :: 3",
                            ],
                            extensions: {
                                "python.details": {
                                    contacts: [
                                        {
                                            email: "eliben@gmail.com",
                                            name: "Eli Bendersky",
                                            role: "author",
                                        },
                                    ],
                                    document_names: {
                                        description: "DESCRIPTION.rst",
                                        license: "LICENSE.txt",
                                    },
                                    project_urls: {
                                        Home: "https://github.com/eliben/pyelftools",
                                    },
                                },
                            },
                            generator: "bdist_wheel (0.29.0)",
                            license: "Public domain",
                            metadata_version: "2.0",
                            name: "pyelftools",
                            platform: "Cross Platform",
                            summary:
                                "Library for analyzing ELF files and DWARF debugging information",
                            version: "0.26",
                        },
                    },
                    {
                        digests: {
                            manifest:
                                "c195c6c568f42676ba408758d0dded193ae51cce",
                        },
                        ecosystem: "Python-Dist",
                        path: "/usr/local/lib/python3.8/site-packages/python_json_logger-0.1.11-py3.8.egg-info/PKG-INFO",
                        result: {
                            author: "Zakaria Zajac",
                            "author-email": "zak@madzak.com",
                            classifier:
                                "Development Status :: 3 - Alpha\nIntended Audience :: Developers\nLicense :: OSI Approved :: BSD License\nOperating System :: OS Independent\nProgramming Language :: Python\nProgramming Language :: Python :: 2\nProgramming Language :: Python :: 2.7\nProgramming Language :: Python :: 3\nProgramming Language :: Python :: 3.4\nProgramming Language :: Python :: 3.5\nProgramming Language :: Python :: 3.6\nProgramming Language :: Python :: 3.7\nTopic :: System :: Logging",
                            description: "UNKNOWN",
                            "home-page":
                                "http://github.com/madzak/python-json-logger",
                            license: "BSD",
                            name: "python-json-logger",
                            platform: "UNKNOWN",
                            summary:
                                "A python library adding a json log formatter",
                            version: "0.1.11",
                        },
                    },
                    {
                        digests: {
                            manifest:
                                "baa46c0192b43aee0b83796850a7f75cda25723d",
                        },
                        ecosystem: "Python-Dist",
                        path: "/usr/local/lib/python3.8/site-packages/pytz-2020.1.dist-info/metadata.json",
                        result: {
                            classifiers: [
                                "Development Status :: 6 - Mature",
                                "Intended Audience :: Developers",
                                "License :: OSI Approved :: MIT License",
                                "Natural Language :: English",
                                "Operating System :: OS Independent",
                                "Programming Language :: Python",
                                "Programming Language :: Python :: 2",
                                "Programming Language :: Python :: 2.4",
                                "Programming Language :: Python :: 2.5",
                                "Programming Language :: Python :: 2.6",
                                "Programming Language :: Python :: 2.7",
                                "Programming Language :: Python :: 3",
                                "Programming Language :: Python :: 3.0",
                                "Programming Language :: Python :: 3.1",
                                "Programming Language :: Python :: 3.2",
                                "Programming Language :: Python :: 3.3",
                                "Programming Language :: Python :: 3.4",
                                "Programming Language :: Python :: 3.5",
                                "Programming Language :: Python :: 3.6",
                                "Topic :: Software Development :: Libraries :: Python Modules",
                            ],
                            download_url: "https://pypi.org/project/pytz/",
                            extensions: {
                                "python.details": {
                                    contacts: [
                                        {
                                            email: "stuart@stuartbishop.net",
                                            name: "Stuart Bishop",
                                            role: "author",
                                        },
                                        {
                                            email: "stuart@stuartbishop.net",
                                            name: "Stuart Bishop",
                                            role: "maintainer",
                                        },
                                    ],
                                    document_names: {
                                        description: "DESCRIPTION.rst",
                                        license: "LICENSE.txt",
                                    },
                                    project_urls: {
                                        Home: "http://pythonhosted.org/pytz",
                                    },
                                },
                            },
                            generator: "bdist_wheel (0.30.0)",
                            keywords: [
                                "timezone",
                                "tzinfo",
                                "datetime",
                                "olson",
                                "time",
                            ],
                            license: "MIT",
                            metadata_version: "2.0",
                            name: "pytz",
                            platform: "Independent",
                            summary:
                                "World timezone definitions, modern and historical",
                            version: "2020.1",
                        },
                    },
                    {
                        digests: {
                            manifest:
                                "38328935a60f227a5aab06d8612c94e8f4569e42",
                        },
                        ecosystem: "Python-Dist",
                        path: "/usr/local/lib/python3.8/site-packages/requests-2.24.0.dist-info/metadata.json",
                        result: {
                            classifiers: [
                                "Development Status :: 5 - Production/Stable",
                                "Intended Audience :: Developers",
                                "Natural Language :: English",
                                "License :: OSI Approved :: Apache Software License",
                                "Programming Language :: Python",
                                "Programming Language :: Python :: 2",
                                "Programming Language :: Python :: 2.7",
                                "Programming Language :: Python :: 3",
                                "Programming Language :: Python :: 3.5",
                                "Programming Language :: Python :: 3.6",
                                "Programming Language :: Python :: 3.7",
                                "Programming Language :: Python :: 3.8",
                                "Programming Language :: Python :: Implementation :: CPython",
                                "Programming Language :: Python :: Implementation :: PyPy",
                            ],
                            description_content_type: "text/markdown",
                            extensions: {
                                "python.details": {
                                    contacts: [
                                        {
                                            email: "me@kennethreitz.org",
                                            name: "Kenneth Reitz",
                                            role: "author",
                                        },
                                    ],
                                    document_names: {
                                        description: "DESCRIPTION.rst",
                                        license: "LICENSE.txt",
                                    },
                                    project_urls: {
                                        Home: "https://requests.readthedocs.io",
                                    },
                                },
                            },
                            extras: ["security", "socks"],
                            generator: "bdist_wheel (0.24.0)",
                            license: "Apache 2.0",
                            metadata_version: "2.0",
                            name: "requests",
                            project_url:
                                "Source, https://github.com/psf/requests",
                            requires_python:
                                ">=2.7, !=3.0.*, !=3.1.*, !=3.2.*, !=3.3.*, !=3.4.*",
                            run_requires: [
                                {
                                    extra: "socks",
                                    requires: ["PySocks (!=1.5.7,>=1.5.6)"],
                                },
                                {
                                    environment:
                                        'sys_platform == "win32" and python_version == "2.7"',
                                    extra: "socks",
                                    requires: ["win-inet-pton"],
                                },
                                {
                                    extra: "security",
                                    requires: [
                                        "pyOpenSSL (>=0.14)",
                                        "cryptography (>=1.3.4)",
                                    ],
                                },
                                {
                                    requires: [
                                        "chardet (>=3.0.2,<4)",
                                        "idna (>=2.5,<3)",
                                        "urllib3 (!=1.25.1,<1.26,!=1.25.0,>=1.21.1)",
                                        "certifi (>=2017.4.17)",
                                    ],
                                },
                            ],
                            summary: "Python HTTP for Humans.",
                            test_requires: [
                                {
                                    requires: [
                                        "pytest-httpbin (==0.0.7)",
                                        "pytest-cov",
                                        "pytest-mock",
                                        "pytest-xdist",
                                        "PySocks (!=1.5.7,>=1.5.6)",
                                        "pytest (>=3)",
                                    ],
                                },
                            ],
                            version: "2.24.0",
                        },
                    },
                    {
                        digests: {
                            manifest:
                                "35ef5a7a72e52defc8a9ffa14b5e8d95012454a2",
                        },
                        ecosystem: "Python-Dist",
                        path: "/usr/local/lib/python3.8/site-packages/termcolor-1.1.0-py3.8.egg-info/PKG-INFO",
                        result: {
                            author: "Konstantin Lepa",
                            "author-email": "konstantin.lepa@gmail.com",
                            classifier:
                                "Development Status :: 5 - Production/Stable\nEnvironment :: Console\nIntended Audience :: Developers\nLicense :: OSI Approved :: MIT License\nOperating System :: OS Independent\nProgramming Language :: Python\nTopic :: Terminals",
                            description:
                                "Example\n=======\n::\nimport sys\nfrom termcolor import colored, cprint\ntext = colored('Hello, World!', 'red', attrs=['reverse', 'blink'])\nprint(text)\ncprint('Hello, World!', 'green', 'on_red')\nprint_red_on_cyan = lambda x: cprint(x, 'red', 'on_cyan')\nprint_red_on_cyan('Hello, World!')\nprint_red_on_cyan('Hello, Universe!')\nfor i in range(10):\ncprint(i, 'magenta', end=' ')\ncprint(\"Attention!\", 'red', attrs=['bold'], file=sys.stderr)\nText Properties\n===============\nText colors:\n- grey\n- red\n- green\n- yellow\n- blue\n- magenta\n- cyan\n- white\nText highlights:\n- on_grey\n- on_red\n- on_green\n- on_yellow\n- on_blue\n- on_magenta\n- on_cyan\n- on_white\nAttributes:\n- bold\n- dark\n- underline\n- blink\n- reverse\n- concealed\nTerminal properties\n===================\n============ ======= ==== ========= ========== ======= =========\nTerminal     bold    dark underline blink      reverse concealed\n------------ ------- ---- --------- ---------- ------- ---------\nxterm        yes     no   yes       bold       yes     yes\nlinux        yes     yes  bold      yes        yes     no\nrxvt         yes     no   yes       bold/black yes     no\ndtterm       yes     yes  yes       reverse    yes     yes\nteraterm     reverse no   yes       rev/red    yes     no\naixterm      normal  no   yes       no         yes     yes\nPuTTY        color   no   yes       no         yes     no\nWindows      no      no   no        no         yes     no\nCygwin SSH   yes     no   color     color      color   yes\nMac Terminal yes     no   yes       yes        yes     yes\n============ ======= ==== ========= ========== ======= =========\nCHANGES\n=======\n1.1.0 (13.01.2011)\n------------------\n- Added cprint function.\n1.0.1 (13.01.2011)\n------------------\n- Updated README.rst.\n1.0.0 (13.01.2011)\n------------------\n- Changed license to MIT.\n- Updated copyright.\n- Refactored source code.\n0.2 (07.09.2010)\n----------------\n- Added support of Python 3.x.\n0.1.2 (04.06.2009)\n------------------\n- Fixed bold characters. (Thanks Tibor Fekete)\n0.1.1 (05.03.2009)\n------------------\n- Some refactoring.\n- Updated copyright.\n- Fixed reset colors.\n- Updated documentation.\n0.1 (09.06.2008)\n----------------\n- Initial release.",
                            "home-page":
                                "http://pypi.python.org/pypi/termcolor",
                            license: "MIT",
                            name: "termcolor",
                            platform: "UNKNOWN",
                            summary:
                                "ANSII Color formatting for output in terminal.",
                            version: "1.1.0",
                        },
                    },
                    {
                        digests: {
                            manifest:
                                "9442247b28277f7c56cb5b2112a62fbbfcb2b629",
                        },
                        ecosystem: "Python-Dist",
                        path: "/usr/local/lib/python3.8/site-packages/thoth_analyzer-0.1.8.dist-info/metadata.json",
                        result: {
                            description_content_type: "UNKNOWN",
                            extensions: {
                                "python.details": {
                                    contacts: [
                                        {
                                            email: "fridolin@redhat.com",
                                            name: "Fridolin Pokorny",
                                            role: "author",
                                        },
                                    ],
                                    document_names: {
                                        description: "DESCRIPTION.rst",
                                    },
                                },
                            },
                            extras: [],
                            generator: "bdist_wheel (0.30.0.a0)",
                            license: "GPLv3+",
                            metadata_version: "2.0",
                            name: "thoth-analyzer",
                            run_requires: [
                                {
                                    requires: [
                                        "click",
                                        "delegator.py (>=0.1.0)",
                                        "distro",
                                        "requests",
                                        "thoth-common",
                                    ],
                                },
                            ],
                            summary: "Analyzer library for project Thoht.",
                            version: "0.1.8",
                        },
                    },
                    {
                        digests: {
                            manifest:
                                "cd1d73c746a543f7a8587fd999ff4b18248b45e2",
                        },
                        ecosystem: "Python-Dist",
                        path: "/usr/local/lib/python3.8/site-packages/toml-0.10.1.dist-info/metadata.json",
                        result: {
                            classifiers: [
                                "Development Status :: 5 - Production/Stable",
                                "Intended Audience :: Developers",
                                "License :: OSI Approved :: MIT License",
                                "Operating System :: OS Independent",
                                "Programming Language :: Python",
                                "Programming Language :: Python :: 2",
                                "Programming Language :: Python :: 2.6",
                                "Programming Language :: Python :: 2.7",
                                "Programming Language :: Python :: 3",
                                "Programming Language :: Python :: 3.3",
                                "Programming Language :: Python :: 3.4",
                                "Programming Language :: Python :: 3.5",
                                "Programming Language :: Python :: 3.6",
                                "Programming Language :: Python :: 3.7",
                                "Programming Language :: Python :: 3.8",
                                "Programming Language :: Python :: Implementation :: CPython",
                                "Programming Language :: Python :: Implementation :: PyPy",
                            ],
                            extensions: {
                                "python.details": {
                                    contacts: [
                                        {
                                            email: "uiri@xqz.ca",
                                            name: "William Pearson",
                                            role: "author",
                                        },
                                    ],
                                    document_names: {
                                        description: "DESCRIPTION.rst",
                                        license: "LICENSE.txt",
                                    },
                                    project_urls: {
                                        Home: "https://github.com/uiri/toml",
                                    },
                                },
                            },
                            generator: "bdist_wheel (0.24.0)",
                            license: "MIT",
                            metadata_version: "2.0",
                            name: "toml",
                            summary:
                                "Python Library for Tom's Obvious, Minimal Language",
                            version: "0.10.1",
                        },
                    },
                    {
                        digests: {
                            manifest:
                                "7fc5aacdc0536f5eb86c63d2cb26a953773ba181",
                        },
                        ecosystem: "Python-Dist",
                        path: "/usr/local/lib64/python3.8/site-packages/PyYAML-5.3.1-py3.8.egg-info/PKG-INFO",
                        result: {
                            author: "Kirill Simonov",
                            "author-email": "xi@resolvent.net",
                            classifier:
                                "Development Status :: 5 - Production/Stable\nIntended Audience :: Developers\nLicense :: OSI Approved :: MIT License\nOperating System :: OS Independent\nProgramming Language :: Cython\nProgramming Language :: Python\nProgramming Language :: Python :: 2\nProgramming Language :: Python :: 2.7\nProgramming Language :: Python :: 3\nProgramming Language :: Python :: 3.5\nProgramming Language :: Python :: 3.6\nProgramming Language :: Python :: 3.7\nProgramming Language :: Python :: 3.8\nProgramming Language :: Python :: Implementation :: CPython\nProgramming Language :: Python :: Implementation :: PyPy\nTopic :: Software Development :: Libraries :: Python Modules\nTopic :: Text Processing :: Markup",
                            description:
                                "YAML is a data serialization format designed for human readability\nand interaction with scripting languages.  PyYAML is a YAML parser\nand emitter for Python.\nPyYAML features a complete YAML 1.1 parser, Unicode support, pickle\nsupport, capable extension API, and sensible error messages.  PyYAML\nsupports standard YAML tags and provides Python-specific tags that\nallow to represent an arbitrary Python object.\nPyYAML is applicable for a broad range of tasks from complex\nconfiguration files to object serialization and persistence.",
                            "download-url": "https://pypi.org/project/PyYAML/",
                            "home-page": "https://github.com/yaml/pyyaml",
                            license: "MIT",
                            name: "PyYAML",
                            platform: "Any",
                            summary: "YAML parser and emitter for Python",
                            version: "5.3.1",
                        },
                    },
                    {
                        digests: {
                            manifest:
                                "8f37294c4ab88d4f52b22dc9ae4f5cdbb09a90bf",
                        },
                        ecosystem: "Python-RequirementsTXT",
                        path: "/usr/local/requirements.txt/requirements.txt",
                        result: {
                            dependencies: [
                                "dictdiffer",
                                "jinja2",
                                "kubernetes ~= 10.0",
                                "python-string-utils",
                                "ruamel.yaml >= 0.15",
                                "six",
                            ],
                        },
                    },
                ],
                "operating-system": {
                    ansi_color: "0;31",
                    bug_report_url: "https://bugzilla.redhat.com/",
                    cpe_name: "cpe:/o:redhat:enterprise_linux:8.2:GA",
                    home_url: "https://www.redhat.com/",
                    id: "rhel",
                    id_like: "fedora",
                    name: "Red Hat Enterprise Linux",
                    platform_id: "platform:el8",
                    pretty_name: "Red Hat Enterprise Linux 8.2 (Ootpa)",
                    redhat_bugzilla_product: "Red Hat Enterprise Linux 8",
                    redhat_bugzilla_product_version: "8.2",
                    redhat_support_product: "Red Hat Enterprise Linux",
                    redhat_support_product_version: "8.2",
                    version: "8.2 (Ootpa)",
                    version_id: "8.2",
                },
                "python-files": [
                    {
                        filepath:
                            "/opt/app-root/lib/python3.8/site-packages/setuptools/command/install_lib.py",
                        sha256: "af936e6ac692c6f988ae3819363dfc22afb55091b5a359acec2b87aba3024db4",
                    },
                    {
                        filepath:
                            "/opt/app-root/lib/python3.8/site-packages/setuptools/command/install_scripts.py",
                        sha256: "503d2b119ebceb599362121dcdcb2a2a7525f0fa33a1c5d697d5414355535a77",
                    },
                    {
                        filepath:
                            "/opt/app-root/lib/python3.8/site-packages/setuptools/command/py36compat.py",
                        sha256: "4b38d970ec45ef3745513e3b66fda7ec03371fc9280f2b3fd0ea52fa7f6021f7",
                    },
                    {
                        filepath:
                            "/opt/app-root/lib/python3.8/site-packages/setuptools/command/register.py",
                        sha256: "2cedccbd828f13c74dd66f8a92b0511c2ebc645a0fbc0fef23c5e0a7bbefeb32",
                    },
                    {
                        filepath:
                            "/opt/app-root/lib/python3.8/site-packages/setuptools/command/rotate.py",
                        sha256: "728e42d44908ecfd06193e93ab3f93d92223d8b0494d95d810ba666a8e9de0a4",
                    },
                    {
                        filepath:
                            "/opt/app-root/lib/python3.8/site-packages/setuptools/command/saveopts.py",
                        sha256: "cdaed00817108a628aae259ca0271b8713e3533df481207be33b932f8ef1a4fe",
                    },
                    {
                        filepath:
                            "/opt/app-root/lib/python3.8/site-packages/setuptools/command/sdist.py",
                        sha256: "82be6116b0f352d19fa7fd2dbb4b25973232af78cc41e8089059a50dab90271c",
                    },
                    {
                        filepath:
                            "/opt/app-root/lib/python3.8/site-packages/setuptools/command/setopt.py",
                        sha256: "353583cb1fa08c317eb717f874ee7beececb3b31d5a0a47432adf7ac5c5a46bf",
                    },
                    {
                        filepath:
                            "/opt/app-root/lib/python3.8/site-packages/setuptools/command/test.py",
                        sha256: "bb69179e020875262ab6fc0594788de88c9ed480784d4eae69d076ba2575b33c",
                    },
                    {
                        filepath:
                            "/opt/app-root/lib/python3.8/site-packages/setuptools/command/upload.py",
                        sha256: "1b1b4d90897b480d2bf2600291b0dc4823759b6fd63e9a4af606572664128a8c",
                    },
                    {
                        filepath:
                            "/opt/app-root/lib/python3.8/site-packages/setuptools/command/upload_docs.py",
                        sha256: "a17886a6533f71428bc04e02596c3df11cc2b9f02ef2d061302f7b19e805726b",
                    },
                    {
                        filepath:
                            "/opt/app-root/lib/python3.8/site-packages/setuptools/extern/__init__.py",
                        sha256: "e2af60b52841d5714fe828ac96db323eab5c7d33ba64cf4bbb540197797eaa6a",
                    },
                ],
                "python-interpreters": [
                    {
                        link: "/usr/bin/python3.8",
                        path: "/usr/bin/python3.8",
                        version: "Python 3.8.10",
                    },
                ],
                "python-packages": [
                    {
                        location: "/usr/local/lib64/python3.8/site-packages",
                        package_name: "lxml",
                        package_version: "4.5.2",
                    },
                ],
                rpm: [
                    "perl-MIME-Base64-3.15-396.el8.x86_64",
                    "perl-File-Temp-0.230.600-1.el8.noarch",
                    "perl-Error-0.17025-2.el8.noarch",
                    "perl-Thread-Queue-3.13-1.el8.noarch",
                    "openssh-8.0p1-4.el8_1.x86_64",
                ],
                "rpm-dependencies": [
                    {
                        arch: "x86_64",
                        dependencies: [
                            "libc.so.6()(64bit)",
                            "libc.so.6(GLIBC_2.14)(64bit)",
                            "libc.so.6(GLIBC_2.2.5)(64bit)",
                            "libc.so.6(GLIBC_2.3.4)(64bit)",
                            "libc.so.6(GLIBC_2.4)(64bit)",
                            "rpmlib(CompressedFileNames) <= 3.0.4-1",
                            "rpmlib(FileDigests) <= 4.6.0-1",
                            "rpmlib(PayloadFilesHavePrefix) <= 4.0-1",
                            "rpmlib(PayloadIsXz) <= 5.2-1",
                            "rtld(GNU_HASH)",
                        ],
                        epoch: null,
                        name: "zlib",
                        package_identifier: "zlib-1.2.11-13.el8.x86_64",
                        release: "13.el8",
                        src: false,
                        version: "1.2.11",
                    },
                    {
                        arch: "x86_64",
                        dependencies: [
                            "/usr/bin/pkg-config",
                            "libz.so.1()(64bit)",
                            "rpmlib(CompressedFileNames) <= 3.0.4-1",
                            "rpmlib(FileDigests) <= 4.6.0-1",
                            "rpmlib(PayloadFilesHavePrefix) <= 4.0-1",
                            "rpmlib(PayloadIsXz) <= 5.2-1",
                            "zlib(x86-64) = 1.2.11-13.el8",
                        ],
                        epoch: null,
                        name: "zlib-devel",
                        package_identifier: "zlib-devel-1.2.11-13.el8.x86_64",
                        release: "13.el8",
                        src: false,
                        version: "1.2.11",
                    },
                ],
                "skopeo-inspect": {
                    Architecture: "amd64",
                    Created: "2020-07-22T12:55:31.255368846Z",
                    Digest: "sha256:5c806378f2868aae0ee27a93c6337151def87d6d7047fa3a3aa1ec9956d0f2a2",
                    DockerVersion: "18.02.0-ce",
                    Env: [
                        "PATH=/opt/app-root/src/.local/bin/:/opt/app-root/src/bin:/opt/app-root/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
                        "container=oci",
                        "SUMMARY=Thoth's Source-to-Image for Python 3.8 applications",
                        "DESCRIPTION=Thoth's Source-to-Image for Python 3.8 applications. This toolchain is based on Red Hat UBI8. It includes pipenv.",
                        "STI_SCRIPTS_URL=image:///usr/libexec/s2i",
                        "STI_SCRIPTS_PATH=/usr/libexec/s2i",
                        "APP_ROOT=/opt/app-root",
                        "HOME=/opt/app-root/src",
                        "PLATFORM=el8",
                        "NODEJS_VER=10",
                        "PYTHON_VERSION=3.8",
                        "PYTHONUNBUFFERED=1",
                        "PYTHONIOENCODING=UTF-8",
                        "LC_ALL=en_US.UTF-8",
                        "LANG=en_US.UTF-8",
                        "PIP_NO_CACHE_DIR=off",
                        "BASH_ENV=/opt/app-root/etc/scl_enable",
                        "ENV=/opt/app-root/etc/scl_enable",
                        "PROMPT_COMMAND=. /opt/app-root/etc/scl_enable",
                        "THOTH_S2I_VERSION=0.14.1",
                        "THAMOS_NO_PROGRESSBAR=1",
                        "THAMOS_NO_EMOJI=1",
                    ],
                    Labels: {
                        architecture: "x86_64",
                        "authoritative-source-url":
                            "https://quay.io/thoth-station/s2i-thoth",
                        "build-date": "2020-07-14T15:53:01.284945",
                        "com.redhat.build-host":
                            "cpt-1001.osbs.prod.upshift.rdu2.redhat.com",
                        "com.redhat.component": "python-38-container",
                        "com.redhat.license_terms":
                            "https://www.redhat.com/en/about/red-hat-end-user-license-agreements#UBI",
                        description:
                            "Thoth's Source-to-Image for Python 3.8 applications. This toolchain is based on Red Hat UBI8. It includes pipenv.",
                        "distribution-scope": "public",
                        "io.k8s.description":
                            "Thoth's Source-to-Image for Python 3.8 applications. This toolchain is based on Red Hat UBI8. It includes pipenv.",
                        "io.k8s.display-name": "Thoth Python 3.8-ubi8 S2I",
                        "io.openshift.expose-services": "8080:http",
                        "io.openshift.s2i.scripts-url":
                            "image:///usr/libexec/s2i",
                        "io.openshift.tags": "python,python38",
                        "io.s2i.scripts-url": "image:///usr/libexec/s2i",
                        maintainer: "Thoth Station <aicoe-thoth@redhat.com>",
                        name: "thoth-station/s2i-thoth-ubi8-py38:v0.14.1",
                        "ninja.thoth-station.version": "0.7.0-dev",
                        release: "0",
                        summary:
                            "Thoth's Source-to-Image for Python 3.8 applications",
                        url: "https://access.redhat.com/containers/#/registry.access.redhat.com/ubi8/python-38/images/1-26",
                        usage: "s2i build https://github.com/sclorg/s2i-python-container.git --context-dir=3.8/test/setup-test-app/ ubi8/python-38 python-sample-app",
                        "vcs-ref": "749cc8fa3861d218ff20e5ba7b00dc15e10458f6",
                        "vcs-type": "git",
                        vendor: "AICoE at the Office of the CTO, Red Hat Inc.",
                        version: "0.14.1",
                    },
                    Layers: [
                        "sha256:a905c078265c2d3a1f959f8ca1d79b30453a16aed4de47dec5ed1c048b26a103",
                        "sha256:121d5409a427be35e19a57dbaa3d29e62baaf98a5f4296288b646aeb282fd554",
                        "sha256:a50500db3d1b335828f1a31bf32652ecf422beb7f12bd28f5ab052af90b81428",
                        "sha256:97b9bf14b9b756916dfa15569caa9183ae65a53d9f438356d2ba9540b64f9f78",
                        "sha256:c31e8174ade9b4489487e16212e64635220215261a8b9c29c40ed84a05767629",
                        "sha256:496d95f04eb94a14416198a04a2ae517d8a3ee8a44f5093c760ad92337850631",
                        "sha256:977f1e76e5f031b9e4ae5496db7bbc5ab7a5f96e977c1e85e5dc3d7065fc3eae",
                    ],
                    Os: "linux",
                    RepoTags: [],
                },
                "system-symbols": {
                    "/lib64/ld-2.28.so": [
                        "GLIBC_2.4",
                        "GLIBC_2.2.5",
                        "GLIBC_PRIVATE",
                        "GLIBC_2.3",
                    ],
                    "/lib64/ld-linux-x86-64.so.2": [
                        "GLIBC_2.4",
                        "GLIBC_2.2.5",
                        "GLIBC_PRIVATE",
                        "GLIBC_2.3",
                    ],
                    "/lib64/libBrokenLocale-2.28.so": ["GLIBC_2.2.5"],
                    "/lib64/libBrokenLocale.so": ["GLIBC_2.2.5"],
                    "/lib64/libBrokenLocale.so.1": ["GLIBC_2.2.5"],
                    "/lib64/libacl.so.1": ["ACL_1.1", "ACL_1.0", "ACL_1.2"],
                    "/lib64/libacl.so.1.1.2253": [
                        "ACL_1.1",
                        "ACL_1.0",
                        "ACL_1.2",
                    ],
                    "/lib64/libanl-2.28.so": ["GLIBC_2.2.5"],
                    "/lib64/libanl.so": ["GLIBC_2.2.5"],
                    "/lib64/libanl.so.1": ["GLIBC_2.2.5"],
                    "/lib64/libasm-0.178.so": ["ELFUTILS_1.0"],
                    "/lib64/libasm.so.1": ["ELFUTILS_1.0"],
                    "/lib64/libassuan.so.0": ["LIBASSUAN_1.0"],
                    "/lib64/libassuan.so.0.8.1": ["LIBASSUAN_1.0"],
                    "/lib64/libattr.so.1": [
                        "ATTR_1.0",
                        "ATTR_1.3",
                        "ATTR_1.2",
                        "ATTR_1.1",
                    ],
                    "/lib64/libattr.so.1.1.2448": [
                        "ATTR_1.0",
                        "ATTR_1.3",
                        "ATTR_1.2",
                        "ATTR_1.1",
                    ],
                    "/lib64/libblkid.so.1": [
                        "BLKID_2.21",
                        "BLKID_2.23",
                        "BLKID_2.30",
                        "BLKID_2.20",
                        "BLKID_2_31",
                        "BLKID_2.15",
                        "BLKID_2.25",
                        "BLKID_1.0",
                        "BLKID_2.17",
                        "BLKID_2.18",
                    ],
                    "/lib64/libblkid.so.1.1.0": [
                        "BLKID_2.21",
                        "BLKID_2.23",
                        "BLKID_2.30",
                        "BLKID_2.20",
                        "BLKID_2_31",
                        "BLKID_2.15",
                        "BLKID_2.25",
                        "BLKID_1.0",
                        "BLKID_2.17",
                        "BLKID_2.18",
                    ],
                    "/usr/lib64/libz.so.1": [
                        "ZLIB_1.2.2",
                        "ZLIB_1.2.3.4",
                        "ZLIB_1.2.2.3",
                        "ZLIB_1.2.9",
                        "ZLIB_1.2.5.1",
                        "ZLIB_1.2.0.2",
                        "ZLIB_1.2.2.4",
                        "ZLIB_1.2.5.2",
                        "ZLIB_1.2.0.8",
                        "ZLIB_1.2.0",
                        "ZLIB_1.2.3.3",
                        "ZLIB_1.2.3.5",
                        "ZLIB_1.2.7.1",
                    ],
                    "/usr/lib64/libz.so.1.2.11": [
                        "ZLIB_1.2.2",
                        "ZLIB_1.2.3.4",
                        "ZLIB_1.2.2.3",
                        "ZLIB_1.2.9",
                        "ZLIB_1.2.5.1",
                        "ZLIB_1.2.0.2",
                        "ZLIB_1.2.2.4",
                        "ZLIB_1.2.5.2",
                        "ZLIB_1.2.0.8",
                        "ZLIB_1.2.0",
                        "ZLIB_1.2.3.3",
                        "ZLIB_1.2.3.5",
                        "ZLIB_1.2.7.1",
                    ],
                },
            },
        };
    };
