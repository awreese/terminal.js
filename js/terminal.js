// The MIT License (MIT)

// terminal.js Copyright 2016 Andrew Reese, All rights reserved.

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

var keySound1;
var keySound2;
var keySound3;

function preload() {
    keySound1 = loadSound('sound/keyboard_key.mp3');
    keySound2 = loadSound('sound/keyboard_key.mp3');
    keySound3 = loadSound('sound/enter_key.mp3');
}

function setup() {
    /*
    For some reason these aren't getting set properly here,
    setting manually in each call in code.
    Not ideal, but works.
    */ 
    // keySound1.setVolume(0.25);
    // keySound1.playMode('sustain');

    // keySound2.setVolume(0.25);
    // keySound2.playMode('restart');

    // keySound3.setVolume(0.25);
    // keySound3.playMode('sustain');
}

function executeCommand(el, options) {
    el.terminal(options);
}

function displayResult(el, options) {
    var result = $('<div></div>');
    result.text(options.result);
    el.find(".terminal-window").append(result);
    options.callback();
}

function clearTerminal(el) {
    el.find(".terminal-window").empty();
}

! function($) {

    "use strict";

    var Terminal = function(el, options) {

        // chosen element to manipulate text
        this.el = $(el).find(".terminal-window");

        // options
        this.options = $.extend({}, $.fn.terminal.defaults, options);

        // Text Input
        this.strings = this.options.strings;
        this.stringsElement = this.options.stringsElement;

        // Terminal Prompt
        this.showCursor = this.options.showCursor;
        this.cursorChar = this.options.cursorChar;
        this.promptString = this.options.promptString;

        // Speed Control
        this.typeSpeed = this.options.typeSpeed;
        this.startDelay = this.options.startDelay;
        this.backSpeed = this.options.backSpeed;
        this.backDelay = this.options.backDelay;
        this.executeDelay = this.options.executeDelay;

        // Sounds
        this.soundOn = this.options.soundOn

        this.onNormalKey = this.soundOn ? this.options.onNormalKey : $.noop;
        this.onBackspaceKey = this.soundOn ? this.options.onBackspaceKey : $.noop;
        this.onEnterKey = this.soundOn ? this.options.onEnterKey : $.noop;

        this.callback = this.options.callback;

        // All systems go!
        this.build();
    };

    Terminal.prototype = {

        constructor: Terminal,

        init: function() {
            var self = this;

            /*
            read as:
            if (strings is defined AND NOT just [""])
            or more sussinctly
            if (NOT ([] AND [""]))

            This allows strings input [] and [""] to be treated the same
            */
            if (self.strings.length && !(self.strings.length === 1 && self.strings[0] === "")) {

                for (var i = 0; i < self.strings.length; i++) {
                    if (self.strings[i] === undefined) {
                        self.strings[i] = "";
                    }    
                }
                self.el.find(".bash-element").last().typed({
                    // user defined parameters
                    strings:            this.strings,
                    stringsElement:     this.stringsElement,

                    // Speed Control
                    typeSpeed:          this.typeSpeed,
                    startDelay:         this.startDelay,
                    backSpeed:          this.backSpeed,
                    backDelay:          this.backDelay,
                    executeDelay:       this.executeDelay,

                    // Terminal Prompt
                    showCursor:         this.showCursor,
                    cursorChar:         this.cursorChar,
                    
                    // Sound
                    onNormalKey:        this.onNormalKey,
                    onBackspaceKey:     this.onBackspaceKey,
                    onEnterKey:         this.onEnterKey,

                    // Callbacks
                    executeCallback:    Terminal.prototype.execute,
                    callback:           this.callback
                });
            } else {
                self.el.find(".bash-element").last().typed({
                    // user defined parameters
                    strings:            [""],                   // so no error thrown in type.js!
                    stringsElement:     this.stringsElement,

                    // Speed Control
                    typeSpeed:          this.typeSpeed,
                    startDelay:         this.startDelay,
                    backSpeed:          this.backSpeed,
                    backDelay:          this.backDelay,
                    executeDelay:       0,                      // ***

                    // Terminal Prompt
                    showCursor:         this.showCursor,
                    cursorChar:         this.cursorChar,
                    
                    // Sound
                    onNormalKey:        this.onNormalKey,
                    onBackspaceKey:     this.onBackspaceKey,
                    onEnterKey:         $.noop,                 // ***

                    // Callbacks
                    executeCallback:    $.noop,                 // ***
                    callback:           this.callback

                    //      *** - overrides anything set by user in the case 
                    //            empty or undefined strings are passed in
                });
            }
            
        },

        build: function() {
            var self = this;

            var prompt = $('<div></div>');
            prompt.text(self.promptString);
            prompt.append($('<span class="bash-element"></span>'));
            self.el.append(prompt);
            
            this.init();
        },

        execute: function() {
            $(".typed-cursor").remove();
        },

        normalKeyHit: function() {
            if (keySound1.isLoaded()) {
                var variantRate = 0.5 + noise(random(100));
            keySound1.rate(variantRate);
            keySound1.setVolume(0.25);
            // keySound1.playMode('sustain'); // <-- default value
            keySound1.play();
            }
        },

        backspaceKeyHit: function() {
            if (keySound2.isLoaded()) {
                var variantRate = random(0.65, 0.8);
                keySound2.rate(variantRate);
                keySound2.setVolume(0.25);
                keySound2.playMode('restart');
                keySound2.play();
            }
        },

        enterKeyHit: function() {
            if (keySound3.isLoaded()) {
                keySound3.setVolume(0.25);
                // keySound3.playMode('sustain'); // <-- default value
                keySound3.play();
            }
        }

    };

    $.fn.terminal = function(option) {
        var $this = $(this), options = typeof option == 'object' && option;
        new Terminal(this, options);
    };

    $.fn.terminal.defaults = {
        strings:            ["These are the default values...", "You know what you should do?", "Use your own!", "Have a great day!"],
        stringsElement:     null,

        // Terminal Speed Control
        typeSpeed:          60,     // typing speed
        startDelay:         2000,   // time before typing starts
        backDelay:          500,    // time before backspacing
        backSpeed:          30,     // backspacing speed
        executeDelay:       2000,   // time after typing ends

        // Terminal Prompt
        showCursor:         true,          // show cursor
        cursorChar:         "_",           // character for cursor
        promptString:       "bash:~$ ",    // default terminal prompt

        // Terminal Callbacks - think long & hard before changing these
        onNormalKey:        Terminal.prototype.normalKeyHit,    // normal key stroke callback
        onBackspaceKey:     Terminal.prototype.backspaceKeyHit, // backspace key stroke callback
        onEnterKey:         Terminal.prototype.enterKeyHit,     // enter key stroke callback

        callback:           $.noop,  // function to call after typing completes

        // Terminal Sound
        soundOn:            true,

        // Type.js General Settings
        shuffle:            false,  // shuffle the strings
        loop:               false,  // loop
        loopCount:          false,  // false = infinite
        attr:               null,   // attribute to type (null == text)
        contentType:        'html', // either html or text
    };

}(window.jQuery);
