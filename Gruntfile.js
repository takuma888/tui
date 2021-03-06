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
            tui_table: {
                options: {
                    style: 'expanded'
                },
                files: {
                    'dist/css/tui-table.css': 'src/scss/tui-table.scss'
                }
            },
            tui_button: {
                options: {
                    style: 'expanded'
                },
                files: {
                    'dist/css/tui-button.css': 'src/scss/tui-button.scss'
                }
            },
            tui_form: {
                options: {
                    style: 'expanded'
                },
                files: {
                    'dist/css/tui-form.css': 'src/scss/tui-form.scss'
                }
            },
            tui_badge: {
                options: {
                    style: 'expanded'
                },
                files: {
                    'dist/css/tui-badge.css': 'src/scss/tui-badge.scss'
                }
            },
            tui_breadcrumb: {
                options: {
                    style: 'expanded'
                },
                files: {
                    'dist/css/tui-breadcrumb.css': 'src/scss/tui-breadcrumb.scss'
                }
            },
            tui_card: {
                options: {
                    style: 'expanded'
                },
                files: {
                    'dist/css/tui-card.css': 'src/scss/tui-card.scss'
                }
            },
            tui_jumbotron: {
                options: {
                    style: 'expanded'
                },
                files: {
                    'dist/css/tui-jumbotron.css': 'src/scss/tui-jumbotron.scss'
                }
            },
            tui_pagination: {
                options: {
                    style: 'expanded'
                },
                files: {
                    'dist/css/tui-pagination.css': 'src/scss/tui-pagination.scss'
                }
            },
            tui_listgroup: {
                options: {
                    style: 'expanded'
                },
                files: {
                    'dist/css/tui-listgroup.css': 'src/scss/tui-listgroup.scss'
                }
            },
            tui_nav: {
                options: {
                    style: 'expanded'
                },
                files: {
                    'dist/css/tui-nav.css': 'src/scss/tui-nav.scss'
                }
            },
            tui_component: {
                options: {
                    style: 'expanded'
                },
                files: {
                    'dist/css/tui-component.css': 'src/scss/tui-component.scss'
                }
            },
            tui: {
                options: {
                    style: 'expanded'
                },
                files: {
                    'dist/css/tui.css': 'src/scss/tui.scss'
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
            tui_table: {
                options: {
                    map: true
                },
                src: 'dist/css/tui-table.css'
            },
            tui_button: {
                options: {
                    map: true
                },
                src: 'dist/css/tui-button.css'
            },
            tui_form: {
                options: {
                    map: true
                },
                src: 'dist/css/tui-form.css'
            },
            tui_badge: {
                options: {
                    map: true
                },
                src: 'dist/css/tui-badge.css'
            },
            tui_breadcrumb: {
                options: {
                    map: true
                },
                src: 'dist/css/tui-breadcrumb.css'
            },
            tui_card: {
                options: {
                    map: true
                },
                src: 'dist/css/tui-card.css'
            },
            tui_jumbotron: {
                options: {
                    map: true
                },
                src: 'dist/css/tui-jumbotron.css'
            },
            tui_pagination: {
                options: {
                    map: true
                },
                src: 'dist/css/tui-pagination.css'
            },
            tui_listgroup: {
                options: {
                    map: true
                },
                src: 'dist/css/tui-listgroup.css'
            },
            tui_nav: {
                options: {
                    map: true
                },
                src: 'dist/css/tui-nav.css'
            },
            tui_component: {
                options: {
                    map: true
                },
                src: 'dist/css/tui-component.css'
            },
            tui: {
                options: {
                    map: true
                },
                src: 'dist/css/tui.css'
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
            tui_table: {
                expand: true,
                cwd: 'dist/css/',
                src: 'tui-table.css',
                dest: 'dist/css/'
            },
            tui_button: {
                expand: true,
                cwd: 'dist/css/',
                src: 'tui-button.css',
                dest: 'dist/css/'
            },
            tui_form: {
                expand: true,
                cwd: 'dist/css/',
                src: 'tui-form.css',
                dest: 'dist/css/'
            },
            tui_badge: {
                expand: true,
                cwd: 'dist/css/',
                src: 'tui-badge.css',
                dest: 'dist/css/'
            },
            tui_breadcrumb: {
                expand: true,
                cwd: 'dist/css/',
                src: 'tui-breadcrumb.css',
                dest: 'dist/css/'
            },
            tui_card: {
                expand: true,
                cwd: 'dist/css/',
                src: 'tui-card.css',
                dest: 'dist/css/'
            },
            tui_jumbotron: {
                expand: true,
                cwd: 'dist/css/',
                src: 'tui-jumbotron.css',
                dest: 'dist/css/'
            },
            tui_pagination: {
                expand: true,
                cwd: 'dist/css/',
                src: 'tui-pagination.css',
                dest: 'dist/css/'
            },
            tui_listgroup: {
                expand: true,
                cwd: 'dist/css/',
                src: 'tui-listgroup.css',
                dest: 'dist/css/'
            },
            tui_nav: {
                expand: true,
                cwd: 'dist/css/',
                src: 'tui-nav.css',
                dest: 'dist/css/'
            },
            tui_component: {
                expand: true,
                cwd: 'dist/css/',
                src: 'tui-component.css',
                dest: 'dist/css/'
            },
            tui: {
                expand: true,
                cwd: 'dist/css/',
                src: 'tui.css',
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
            tui_table: {
                src: ['dist/css/tui-table.css'],
                dest: 'dist/css/tui-table.min.css'
            },
            tui_button: {
                src: ['dist/css/tui-button.css'],
                dest: 'dist/css/tui-button.min.css'
            },
            tui_form: {
                src: ['dist/css/tui-form.css'],
                dest: 'dist/css/tui-form.min.css'
            },
            tui_badge: {
                src: ['dist/css/tui-badge.css'],
                dest: 'dist/css/tui-badge.min.css'
            },
            tui_breadcrumb: {
                src: ['dist/css/tui-breadcrumb.css'],
                dest: 'dist/css/tui-breadcrumb.min.css'
            },
            tui_card: {
                src: ['dist/css/tui-card.css'],
                dest: 'dist/css/tui-card.min.css'
            },
            tui_jumbotron: {
                src: ['dist/css/tui-jumbotron.css'],
                dest: 'dist/css/tui-jumbotron.min.css'
            },
            tui_pagination: {
                src: ['dist/css/tui-pagination.css'],
                dest: 'dist/css/tui-pagination.min.css'
            },
            tui_listgroup: {
                src: ['dist/css/tui-listgroup.css'],
                dest: 'dist/css/tui-listgroup.min.css'
            },
            tui_nav: {
                src: ['dist/css/tui-nav.css'],
                dest: 'dist/css/tui-nav.min.css'
            },
            tui_component: {
                src: ['dist/css/tui-component.css'],
                dest: 'dist/css/tui-component.min.css'
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
        'sass:tui_table', 'autoprefixer:tui_table', 'csscomb:tui_table', 'cssmin:tui_table',
        'sass:tui_button', 'autoprefixer:tui_button', 'csscomb:tui_button', 'cssmin:tui_button',
        'sass:tui_form', 'autoprefixer:tui_form', 'csscomb:tui_form', 'cssmin:tui_form',
        'sass:tui_badge', 'autoprefixer:tui_badge', 'csscomb:tui_badge', 'cssmin:tui_badge',
        'sass:tui_card', 'autoprefixer:tui_card', 'csscomb:tui_card', 'cssmin:tui_card',
        'sass:tui_jumbotron', 'autoprefixer:tui_jumbotron', 'csscomb:tui_jumbotron', 'cssmin:tui_jumbotron',
        'sass:tui_pagination', 'autoprefixer:tui_pagination', 'csscomb:tui_pagination', 'cssmin:tui_pagination',
        'sass:tui_listgroup', 'autoprefixer:tui_listgroup', 'csscomb:tui_listgroup', 'cssmin:tui_listgroup',
        'sass:tui_nav', 'autoprefixer:tui_nav', 'csscomb:tui_nav', 'cssmin:tui_nav',

        'sass:tui_component', 'autoprefixer:tui_component', 'csscomb:tui_component', 'cssmin:tui_component',

        'sass:tui', 'autoprefixer:tui', 'csscomb:tui', 'cssmin:tui',
        'sass:doc', 'autoprefixer:doc', 'csscomb:doc', 'cssmin:doc',
        'copy:release'
    ]);
};