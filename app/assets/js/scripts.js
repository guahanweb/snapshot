/*!
 * boilerplate
 * Boilerplate Test
 * http://www.guahanweb.com
 * @author Guahan Web
 * @version 0.1.0
 * Copyright 2015. MIT licensed.
 */
(function (Webcam, window, document, undefined) {
    'use strict';

    var imageHolder;
    var trigger;
    var counter;
    var flash;

    var imgHeight = 400;
    var imgWidth  = 532;

    var logDelay = 3000;
    var logTimeout = null;

    var App = {
        init: function () {
            imageHolder = document.getElementById('snapshots');
            trigger = document.getElementById('ss-trigger');
            counter = document.getElementById('counter-wrapper');
            flash = document.querySelector('#webcam .flash');

            App.setup();
            App.listen();
        },

        setup: function () {
            Webcam.set({
                image_format: 'jpeg',
                jpeg_quality: 65,
                height: imgHeight,
                width: imgWidth
            });
            Webcam.attach('#viewport');
        },

        listen: function () {
            Webcam.on('live', function () {
                // start monitoring
                App.startLog();
            });

            trigger.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                App.snap();
            });
        },

        snap: function () {
            App.countdown(5, function () {
                // Have to step our flash with timeouts for the render stack
                setTimeout(function () {
                    flash.classList.remove('fading');
                    flash.classList.remove('off');
                    setTimeout(function () {
                        flash.classList.add('fading');
                        flash.classList.add('off');
                    }, 10);
                }, 10);

                Webcam.snap(App.appendSnapshot);
            });
        },

        countdown: function (seconds, cb) {
            // Display first
            counter.querySelector('span.digit').innerHTML = seconds;
            counter.classList.remove('hidden');
            if (seconds === 0) {
                counter.classList.add('hidden');
                cb();
            } else {
                setTimeout(function () {
                    App.countdown(seconds - 1, cb);
                }, 1000);
            }
        },

        appendSnapshot: function (data_uri) {
            var el = document.createElement('IMG');
            el.setAttribute('src', data_uri);
            el.setAttribute('height', imgHeight / 2);
            el.setAttribute('width', imgWidth / 2);
            imageHolder.appendChild(el);
        },

        startLog: function () {
            logTimeout = setTimeout(function () {
                Webcam.snap(function (data_uri) {
                    Webcam.upload(data_uri, 'log.php', function (code) {
                        if (code === 200) {
                            // Successfully logged
                        } else {
                            // Failed to log
                        }
                    });
                });
            }, logDelay);
        },

        stopLog: function () {
            clearTimeout(logTimeout);
        }
    };

    App.init();
})(Webcam, window, document);
