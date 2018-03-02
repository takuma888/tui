module.exports = function (grunt) {
    'use strict';

    // Force use of Unix newlines
    grunt.util.linefeed = '\n';

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*!\n' +
        ' * Tachigo UI v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
        ' * Copyright 2011-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
        ' * Licensed under the <%= pkg.license %> license\n' +
        ' */\n',
        sass: {
            normalize: {
                options: {
                    style: 'expanded'
                },
                files: {
                    'dist/css/normalize.css': 'src/scss/normalize.scss'
                }
            },
            tui_normalize: {
                options: {
                    style: 'expanded'
                },
                files: {
                    'dist/css/tui-normalize.css': 'src/scss/tui-normalize.scss'
                }
            },
            tui_grid: {
                options: {
                    style: 'expanded'
                },
                files: {
                    'dist/css/tui-grid.css': 'src/scss/tui-grid.scss'
                }
            },
            tui_util: {
                options: {
                    style: 'expanded'
                },
                files: {
                    'dist/css/tui-util.css': 'src/scss/tui-util.scss'
                }
            },
            tui_typography: {
                options: {
                    style: 'expanded'
                },
                files: {
                    'dist/css/tui-typography.css': 'src/scss/tui-typography.scss'
                }
            },
            doc: {
                options: {
                    style: 'expanded'
                },
                files: {
                    'dist/css/tui-doc.css': 'src/scss/tui-doc.scss'
                }
            }
        },
        autoprefixer: {
            options: {
                browsers: [
                    "Android 2.3",
                    "Android >= 4",
                    "Chrome >= 20",
                    "Firefox >= 24",
                    "Explorer >= 8",
                    "iOS >= 6",
                    "Opera >= 12",
                    "Safari >= 6"
                ]
            },
            normalize: {
                options: {
                    map: true
                },
                src: 'dist/css/normalize.css'
            },
            tui_normalize: {
                options: {
                    map: true
                },
                src: 'dist/css/tui-normalize.css'
            },
            tui_grid: {
                options: {
                    map: true
                },
                src: 'dist/css/tui-grid.css'
            },
            tui_util: {
                options: {
                    map: true
                },
                src: 'dist/css/tui-util.css'
            },
            tui_typography: {
                options: {
                    map: true
                },
                src: 'dist/css/tui-typography.css'
            },
            doc: {
                options: {
                    map: true
                },
                src: 'dist/css/tui-doc.css'
            }
        },
        csscomb: {
            options: {
                config: '.csscomb.json'
            },
            normalize: {
                expand: true,
                cwd: 'dist/css/',
                src: 'normalize.css',
                dest: 'dist/css/'
            },
            tui_normalize: {
                expand: true,
                cwd: 'dist/css/',
                src: 'tui-normalize.css',
                dest: 'dist/css/'
            },
            tui_grid: {
                expand: true,
                cwd: 'dist/css/',
                src: 'tui-grid.css',
                dest: 'dist/css/'
            },
            tui_util: {
                expand: true,
                cwd: 'dist/css/',
                src: 'tui-util.css',
                dest: 'dist/css/'
            },
            tui_typography: {
                expand: true,
                cwd: 'dist/css/',
                src: 'tui-typography.css',
                dest: 'dist/css/'
            },
            doc: {
                expand: true,
                cwd: 'dist/css/',
                src: 'tui-doc.css',
                dest: 'dist/css/'
            }
        },
        cssmin: {
            options: {
                compatibility: 'ie8',
                keepSpecialComments: '*',
                sourceMap: true,
                sourceMapInlineSources: true,
                advanced: false
            },
            normalize: {
                src: ['dist/css/normalize.css'],
                dest: 'dist/css/normalize.min.css'
            },
            tui_normalize: {
                src: ['dist/css/tui-normalize.css'],
                dest: 'dist/css/tui-normalize.min.css'
            },
            tui_grid: {
                src: ['dist/css/tui-grid.css'],
                dest: 'dist/css/tui-grid.min.css'
            },
            tui_util: {
                src: ['dist/css/tui-util.css'],
                dest: 'dist/css/tui-util.min.css'
            },
            tui_typography: {
                src: ['dist/css/tui-typography.css'],
                dest: 'dist/css/tui-typography.min.css'
            },
            tui: {
                src: ['dist/css/tui.css'],
                dest: 'dist/css/tui.min.css'
            },
            doc: {
                src: ['dist/css/tui-doc.css'],
                dest: 'dist/css/tui-doc.min.css'
            }
        },
        // js
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            tui: {
                src: 'src/js/*.js'
            }
        },
        jscs: {
            options: {
                config: '.jscsrc'
            },
            tui: {
                src: '<%= jshint.tui.src %>'
            }
        },
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: false
            },
            tui_css: {
                src: [
                    'dist/css/tui-normalize.css',
                    'dist/css/tui-grid.css',
                    'dist/css/tui-util.css',
                    'dist/css/tui-typography.css'
                ],
                dest: 'dist/css/tui.css'
            },
            tui_js: {
                src: [
                    'src/js/util.js'
                ],
                dest: 'dist/js/tui.js'
            }
        },
        uglify: {
            options: {
                compress: {
                    warnings: false
                },
                mangle: true,
                preserveComments: /^!|@preserve|@license|@cc_on/i
            },
            tui: {
                src: '<%= concat.tui_js.dest %>',
                dest: 'dist/js/tui.min.js'
            }
        },
        // copy
        copy: {
            release: {
                expand: true,
                cwd: 'src/img/',
                src: [
                    '**/*'
                ],
                dest: 'dist/img'
            }
        }
    });

    require('load-grunt-tasks')(grunt, { scope: 'devDependencies' });
    require('time-grunt')(grunt);


    grunt.registerTask('default', [
        'sass:normalize', 'autoprefixer:normalize', 'csscomb:normalize', 'cssmin:normalize',
        'sass:tui_normalize', 'autoprefixer:tui_normalize', 'csscomb:tui_normalize', 'cssmin:tui_normalize',
        'sass:tui_grid', 'autoprefixer:tui_grid', 'csscomb:tui_grid', 'cssmin:tui_grid',
        'sass:tui_util', 'autoprefixer:tui_util', 'csscomb:tui_util', 'cssmin:tui_util',
        'sass:tui_typography', 'autoprefixer:tui_typography', 'csscomb:tui_typography', 'cssmin:tui_typography',
        'concat:tui_css', 'cssmin:tui',
        'sass:doc', 'autoprefixer:doc', 'csscomb:doc', 'cssmin:doc',
        'jshint:tui', 'jscs:tui', 'concat:tui_js', 'uglify:tui',
        'copy:release'
    ]);
};