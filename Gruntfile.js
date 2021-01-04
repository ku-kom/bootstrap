/*!
 * Bootstrap's Gruntfile
 * http://getbootstrap.com
 * Copyright 2013-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

module.exports = function (grunt) {
  'use strict';

  // Force use of Unix newlines
  grunt.util.linefeed = '\n';

  RegExp.quote = function (string) {
    return string.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
  };

  var fs = require('fs');
  var path = require('path');
  var generateGlyphiconsData = require('./grunt/bs-glyphicons-data-generator.js');
  var BsLessdocParser = require('./grunt/bs-lessdoc-parser.js');
  var getLessVarsData = function () {
    var filePath = path.join(__dirname, 'less/variables.less');
    var fileContent = fs.readFileSync(filePath, { encoding: 'utf8' });
    var parser = new BsLessdocParser(fileContent);
    return { sections: parser.parseFile() };
  };
  var generateRawFiles = require('./grunt/bs-raw-files-generator.js');
  var generateCommonJSModule = require('./grunt/bs-commonjs-generator.js');
  var configBridge = grunt.file.readJSON('./grunt/configBridge.json', { encoding: 'utf8' });

  Object.keys(configBridge.paths).forEach(function (key) {
    configBridge.paths[key].forEach(function (val, i, arr) {
      arr[i] = path.join('./docs/assets', val);
    });
  });

  // Project configuration.
  grunt.initConfig({

    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*!\n' +
            ' * Bootstrap v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
            ' * Copyright 2011-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
            ' * Licensed under the <%= pkg.license %> license\n' +
            ' */\n',
    jqueryCheck: configBridge.config.jqueryCheck.join('\n'),
    jqueryVersionCheck: configBridge.config.jqueryVersionCheck.join('\n'),

    // Task configuration.
    clean: {
      dist: 'dist',
      docs: 'docs/dist'
    },

    jshint: {
      options: {
        jshintrc: 'js/.jshintrc'
      },
      grunt: {
        options: {
          jshintrc: 'grunt/.jshintrc'
        },
        src: ['Gruntfile.js', 'package.js', 'grunt/*.js']
      },
      core: {
        src: [
          'js/ku-custom.js',
          'js/ku-global-footer.js'
        ]
      },
      assets: {
        src: [
          'docs/assets/js/src/*.js',
          'docs/assets/js/video-controls/*.js',
          'docs/assets/js/social-feeds/*.js',
          'docs/assets/js/scroll-progress/*.js',
          'docs/assets/js/cookie/*.js',
          'docs/assets/js/videoControls/*.js',
          'docs/assets/js/phonebook/*.js',
          'docs/assets/js/ku-frontpge/*.js',
          'docs/assets/js/slider/slickslider-config.js',
          '!docs/assets/js/*.min.js'
        ]
      }
    },

    eslint: {
      options: {
        configFile: 'js/eslint.json'
      },
      grunt: {
        src: '<%= jshint.grunt.src %>'
      },
      core: {
        src: '<%= jshint.core.src %>'
      },
      test: {
        src: '<%= jshint.test.src %>'
      },
      assets: {
        src: '<%= jshint.assets.src %>'
      }
    },

    concat: {
      options: {
        banner: '<%= banner %>\n<%= jqueryCheck %>\n<%= jqueryVersionCheck %>',
        stripBanners: false
      },
      bootstrap: {
        src: [
          'js/ku-global-footer.js',
          'js/transition.js',
          'js/alert.js',
          'js/button.js',
          //'js/carousel.js',
          'js/collapse.js',
          'js/dropdown.js',
          'js/modal.js',
          'js/tooltip.js',
          'js/popover.js',
          //'js/scrollspy.js',
          'js/tab.js',
          //'js/affix.js',
          'js/ku-custom.js'
        ],
        dest: 'dist/js/<%= pkg.name %>.js'
      }
    },

    uglify: {
      options: {
        compress: {
          warnings: false
        },
        sourceMap: true,
        mangle: true,
        preserveComments: /^!|@preserve|@license|@cc_on/i
      },
      core: {
        src: '<%= concat.bootstrap.dest %>',
        dest: 'dist/js/<%= pkg.name %>.min.js'
      },
      docsJs: {
        src: configBridge.paths.docsJs,
        dest: 'docs/assets/js/docs.min.js'
      },
      slider: {
        src: 'docs/assets/js/slider/slick.js',
        dest: 'docs/assets/js/slider/slick.min.js'
      },
      custom: {
        files: [
          {
            expand: true,
            src: [
              'docs/assets/js/datatables/datatables.js',
              'docs/assets/js/multiple-select/multiple-select.js',
              'docs/assets/js/datetimepicker/bootstrap-datetimepicker.js',
              'docs/assets/js/social-feeds/instagram/instagramByAccount.js',
              'docs/assets/js/social-feeds/instagram/instagramByHashtag.js',
              'docs/assets/js/social-feeds/twitter/twitterByAccount.js',
              'docs/assets/js/slider/slickslider-config.js',
              'docs/assets/js/videoControls/videoControls.js',
              'docs/assets/js/cookie/cookie.js',
              'docs/assets/js/scroll-progress/scroll-progress.js',
              'docs/assets/js/parallax/jarallax.js',
              'docs/assets/js/parallax/jarallax-video.js',
              'docs/assets/js/canvasjs/canvasjs.js',
              'docs/assets/js/phonebook/*.js',
              'docs/assets/js/ku-frontpage/*.js'
            ],
            dest: 'dist/js/',
            ext: '.min.js',
            flatten: true
        }
      ]
    }
    },

    less: {
      compileCore: {
        options: {
          strictMath: true,
          sourceMap: false,
          outputSourceFiles: false,
          sourceMapURL: '<%= pkg.name %>.css.map',
          sourceMapFilename: 'dist/css/<%= pkg.name %>.css.map'
        },
        src: 'less/bootstrap.less',
        dest: 'dist/css/<%= pkg.name %>.css'
      },
      compileCustom: {
        src: 'less/ku-gridboxes-bootstrap.less',
        dest: 'dist/css/ku-gridboxes.css'
      },
      videoplayer: {
        src: 'less/ku-videoplayer.less',
        dest: 'dist/css/ku-videoplayer.min.css'
      },
      compileCustomElements: {
        files: [
          {
            expand: true,
            cwd: 'docs/assets/css/content-elements/',
            src: ['**/*.less'],
            dest: 'dist/css/content-elements/',
            ext: '.css',
            flatten: true
          }
        ]
      },
      compileFacultyStyles: {
        files: [
          {
            expand: true,
            cwd: 'less/faculties/',
            src: ['**/*.less'],
            dest: 'dist/css/faculties/',
            ext: '.css',
            flatten: true
          }
        ]
    },
    compileCParallax: {
      files: [
        {
          expand: true,
          cwd: 'docs/assets/css/parallax/',
          src: ['**/*.less'],
          dest: 'dist/css/parallax/',
          ext: '.css',
          flatten: true
        }
      ]
    },
    compileNeutralStyles: {
      files: [
        {
          expand: true,
          cwd: 'docs/assets/css/ku-neutral/',
          src: ['**/*.less'],
          dest: 'dist/css/ku-neutral/',
          ext: '.css',
          flatten: true
        }
      ]
    }
    },

    autoprefixer: {
      options: {
        browsers: configBridge.config.autoprefixerBrowsers,
        cascade: false
      },
      core: {
        options: {
          map: false
        },
        src: 'dist/css/<%= pkg.name %>.css'
      },
      custom: {
        src: [
          'dist/css/ku-gridboxes.css',
          'docs/assets/css/datatables/datatables.css',
          'docs/assets/css/multiple-select/multiple-select.css',
          'docs/assets/css/social-feeds/instagram.css',
          'docs/assets/css/social-feeds/twitter.css',
          'docs/assets/css/ku-dk-frontpage/ku-dk-frontpage.css',
          'docs/assets/css/obvius-admin/admin.css',
          'docs/assets/css/tinymce/tiny-overrides.css'
          //'dist/css/faculties/*.css'
        ]
      },
      docs: {
        src: ['docs/assets/css/src/docs.css']
      },
      videoplayer: {
        src: ['dist/css/ku-videoplayer.min.css']
      },
      doctypes: {
        expand: true,
        cwd: 'docs/assets/css/doctypes/',
        src: ['**/*.css'],
        dest: 'dist/css/doctypes/',
        flatten: true
      },
      fakulteter: {
        expand: true,
        cwd: 'dist/css/faculties/',
        src: ['*.css', '!*.min.css'],
        dest: 'dist/css/faculties/'
      },
      content: {
        expand: true,
        cwd: 'dist/css/content-elements/',
        src: ['*.css', '!*.min.css'],
        dest: 'dist/css/content-elements/'
      },
      parallax: {
        expand: true,
        cwd: 'dist/css/parallax/',
        src: ['*.css', '!*.min.css'],
        dest: 'dist/css/parallax/'
      },
      neutral: {
        expand: true,
        cwd: 'dist/css/ku-neutral/',
        src: ['*.css', '!*.min.css'],
        dest: 'dist/css/ku-neutral/'
      },
      examples: {
        expand: true,
        cwd: 'docs/examples/',
        src: ['**/*.css'],
        dest: 'docs/examples/'
      },
      legacy: {
        src: [
          'docs/legacy/css/styles.css',
          'docs/legacy/css/responsive.css',
          'docs/legacy/css/print.css',
        ]
      },
    },

    stylelint: {
      options: {
        configFile: 'less/.stylelintrc',
        formatter: 'string',
        ignoreDisables: false,
        failOnError: true,
        outputFile: '',
        reportNeedlessDisables: false,
        syntax: ''
      },
      dist: {
        src: [
          'dist/css/bootstrap.css',
          'dist/css/ku-gridboxes.css'
        ]
      },
      examples: {
        src: 'docs/examples/**/*.css'
      },
      docs: {
        src: 'docs/assets/css/src/docs.css'
      },
      legacy: {
        src: [
          'docs/legacy/css/styles.css',
          'docs/legacy/css/responsive.css',
          'docs/legacy/css/print.css',
        ]
      },
    },

    cssmin: {
      options: {
        // TODO: disable `zeroUnits` optimization once clean-css 3.2 is released
        //    and then simplify the fix for https://github.com/twbs/bootstrap/issues/14837 accordingly
        compatibility: 'ie8',
        keepSpecialComments: '*',
        sourceMap: false,
        sourceMapInlineSources: false,
        advanced: false
      },
      minifyCore: {
        src: 'dist/css/<%= pkg.name %>.css',
        dest: 'dist/css/<%= pkg.name %>.min.css'
      },
      minifyCustom: {
        expand: true,
        src: [
          'docs/assets/css/print/print.css',
          'dist/css/ku-gridboxes.css',
          'docs/assets/css/social-feeds/instagram.css',
          'docs/assets/css/social-feeds/twitter.css',
          'docs/assets/css/datatables/datatables.css',
          'docs/assets/css/multiple-select/multiple-select.css',
          'docs/assets/css/ku-dk-frontpage/ku-dk-frontpage.css'
        ],
        dest: 'dist/css/',
        ext: '.min.css',
        flatten: true
      },
      print: {
        src: 'docs/assets/css/print/print.css',
        dest: 'dist/css/print.min.css'
      },
      videoplayer: {
        src: 'dist/css/ku-videoplayer.min.css',
        dest: 'dist/css/ku-videoplayer.min.css'
      },
      minifyFAK: {
        expand: true,
        cwd: 'dist/css/faculties/',
        src: ['*.css', '!*.min.css'],
        dest: 'dist/css/faculties/'
      },
      content: {
        expand: true,
        cwd: 'dist/css/content-elements/',
        src: ['*.css', '!*.min.css'],
        dest: 'dist/css/content-elements/',
        ext: '.min.css'
      },
      parallax: {
        expand: true,
        cwd: 'dist/css/parallax/',
        src: ['*.css', '!*.min.css'],
        dest: 'dist/css/parallax/',
        ext: '.min.css'
      },
      minifyDoctypes: {
        options: {
          // TODO: disable `zeroUnits` optimization once clean-css 3.2 is released
          //    and then simplify the fix for https://github.com/twbs/bootstrap/issues/14837 accordingly
        },
        expand: true,
        cwd: 'dist/css/doctypes/',
        src: ['*.css', '!*.min.css'],
        dest: 'dist/css/doctypes/'
      },
      docs: {
        src: [
          'docs/assets/css/src/ie10-viewport-bug-workaround.css',
          'docs/assets/css/src/pygments-manni.css',
          'docs/assets/css/src/docs.css'
        ],
        dest: 'docs/assets/css/docs.min.css',
        flatten: true
      }
    },

    csscomb: {
      options: {
        config: 'less/.csscomb.json'
      },
      dist: {
        expand: true,
        cwd: 'dist/css/',
        src: ['*.css', '!*.min.css'],
        dest: 'dist/css/'
      },
      examples: {
        expand: true,
        cwd: 'docs/examples/',
        src: '**/*.css',
        dest: 'docs/examples/'
      },
      docs: {
        src: 'docs/assets/css/src/docs.css',
        dest: 'docs/assets/css/src/docs.css'
      }
    },

    copy: {
      fonts: {
        expand: true,
        src: 'fonts/**',
        dest: 'dist/'
      },
      docs: {
        expand: true,
        cwd: 'dist/',
        src: [
          '**/*'
        ],
        dest: 'docs/dist/'
      }
    },

    connect: {
      server: {
        options: {
          port: 3000,
          base: '.'
        }
      }
    },

    jekyll: {
      options: {
        bundleExec: true,
        config: '_config.yml',
        incremental: false
      },
      docs: {},
      github: {
        options: {
          raw: 'github: true'
        }
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          conservativeCollapse: true,
          decodeEntities: false,
          minifyCSS: {
            compatibility: 'ie8',
            keepSpecialComments: 0
          },
          minifyJS: true,
          minifyURLs: false,
          processConditionalComments: true,
          removeAttributeQuotes: true,
          removeComments: true,
          removeOptionalAttributes: true,
          removeOptionalTags: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          removeTagWhitespace: false,
          sortAttributes: true,
          sortClassName: true
        },
        expand: true,
        cwd: '_gh_pages',
        dest: '_gh_pages',
        src: [
          '**/*.html',
          '!examples/**/*.html'
        ]
      }
    },
    htmllint: {
      options: {
        ignore: [
          'Attribute "autocomplete" not allowed on element "button" at this point.',
          'Attribute "autocomplete" is only allowed when the input type is "color", "date", "datetime", "datetime-local", "email", "hidden", "month", "number", "password", "range", "search", "tel", "text", "time", "url", or "week".',
          'Element "img" is missing required attribute "src".',
          'Possible misuse of “aria-label”. (If you disagree with this warning, file an issue report or send e-mail to www-validator@w3.org.)'
        ]
      },
      src: '_gh_pages/**/*.html'
    },

    watch: {
      src: {
        files: '<%= jshint.core.src %>',
        tasks: ['jshint:core', 'concat']
      },
      less: {
        files: 'less/**/*.less',
        tasks: 'less'
      }
    },
    exec: {
      npmUpdate: {
        command: 'npm update'
      }
    },

    compress: {
      main: {
        options: {
          archive: 'bootstrap-<%= pkg.version %>-dist.zip',
          mode: 'zip',
          level: 9,
          pretty: true
        },
        files: [
          {
            expand: true,
            cwd: 'dist/',
            src: ['**'],
            dest: 'bootstrap-<%= pkg.version %>-dist'
          }
        ]
      }
    }

  });


  // These plugins provide necessary tasks.
  require('load-grunt-tasks')(grunt, { scope: 'devDependencies' });
  require('time-grunt')(grunt);

  // Docs HTML validation task
  grunt.registerTask('validate-html', ['jekyll:docs', 'htmllint']);

  var runSubset = function (subset) {
    return !process.env.TWBS_TEST || process.env.TWBS_TEST === subset;
  };
  var isUndefOrNonZero = function (val) {
    return val === undefined || val !== '0';
  };

  // Test task.
  var testSubtasks = [];
  // Skip core tests if running a different subset of the test suite
  if (runSubset('core') &&
      // Skip core tests if this is a Savage build
      process.env.TRAVIS_REPO_SLUG !== 'twbs-savage/bootstrap') {
    testSubtasks = testSubtasks.concat(['dist-css', 'dist-js', 'stylelint:dist', 'stylelint:legacy', 'test-js', 'docs']);
  }
  // Skip HTML validation if running a different subset of the test suite
  if (runSubset('validate-html') &&
      // Skip HTML5 validator on Travis when [skip validator] is in the commit message
      isUndefOrNonZero(process.env.TWBS_DO_VALIDATOR)) {
    testSubtasks.push('validate-html');
  }

  grunt.registerTask('test', testSubtasks);
  grunt.registerTask('test-js', ['jshint:core', 'jshint:grunt', 'eslint:core', 'eslint:grunt']);

  // JS distribution task.
  grunt.registerTask('dist-js', ['concat', 'uglify:core', 'commonjs', 'uglify:custom', 'uglify:slider']);

  // CSS distribution task.
  grunt.registerTask('less-compile', ['less:compileCore', 'less:compileCustom', 'less:compileCustomElements', 'less:compileFacultyStyles', 'less:compileNeutralStyles', 'less:compileCParallax', 'less:videoplayer']);
  grunt.registerTask('dist-css', ['less-compile', 'autoprefixer:core', 'autoprefixer:custom', 'autoprefixer:fakulteter', 'autoprefixer:doctypes', 'autoprefixer:neutral', 'autoprefixer:videoplayer', 'autoprefixer:parallax', 'csscomb:dist', 'cssmin:minifyCore', 'cssmin:minifyCustom', 'cssmin:minifyFAK', 'cssmin:minifyDoctypes', 'cssmin:content', 'cssmin:parallax', 'cssmin:print', 'cssmin:videoplayer', 'autoprefixer:legacy']);

  // Full distribution task.
  grunt.registerTask('dist', ['clean:dist', 'dist-css', 'copy:fonts', 'dist-js']);

  // Default task.
  grunt.registerTask('default', ['clean:dist', 'copy:fonts', 'test']);
  grunt.registerTask('build-glyphicons-data', function () { generateGlyphiconsData.call(this, grunt); });

  grunt.registerTask('commonjs', 'Generate CommonJS entrypoint module in dist dir.', function () {
    var srcFiles = grunt.config.get('concat.bootstrap.src');
    var destFilepath = 'dist/js/npm.js';
    generateCommonJSModule(grunt, srcFiles, destFilepath);
  });

  // Docs task.
  grunt.registerTask('docs-css', ['autoprefixer:docs', 'autoprefixer:examples', 'csscomb:docs', 'csscomb:examples', 'cssmin:docs']);
  grunt.registerTask('lint-docs-css', ['stylelint:docs', 'stylelint:examples']);
  grunt.registerTask('docs-js', ['uglify:docsJs']);
  grunt.registerTask('lint-docs-js', ['jshint:assets', 'eslint:assets']);
  grunt.registerTask('docs', ['docs-css', 'lint-docs-css', 'docs-js', 'lint-docs-js', 'clean:docs', 'copy:docs', 'build-glyphicons-data']);
  grunt.registerTask('docs-github', ['jekyll:github', 'htmlmin']);
  grunt.registerTask('prep-release', ['dist', 'docs', 'docs-github', 'compress']);
};
