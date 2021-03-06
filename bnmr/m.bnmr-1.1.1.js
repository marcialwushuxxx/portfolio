// JavaScript Document
var $$ = function(sel) {
    var el = sel || 'body',
        _this = [],
        i,

        addCSS,
        ajax,
        contains,
        getParam,
        isMobile,
        load,
        loadAsset,
        log,
        preload,
        preloadAsset,
        setProp;

    el.slice(0, 1) == '#' ? _this = document.querySelector(el) : _this = document.querySelectorAll(el);
    (typeof _this == 'object' && _this.length == 1) ? _this = _this[0]: null;

    setProp = function (prop, val) {
        if (_this.length) {
            for (i = 0; i < _this.length; i++) {
                _this[i].style[prop] = val;
            }
        } else {
            _this.style[prop] = val;
        }
    }

    preloadAsset = function (asset) {
        var ext = asset.split('.')[asset.split('.').length - 1].toLowerCase();

        switch (ext) {
            case 'jpg':
            case 'jpeg':
            case 'gif':
            case 'png':
                new Image().src = asset;
                break;

            case 'mp4':
            case 'ogv':
            case 'webm':
                var newVid = document.createElement('video');
                newVid.src = asset;
                newVid.load();
                break;
        }
    }

    loadAsset = function (asset) {
        var ext = asset.split('.')[asset.split('.').length - 1].toLowerCase();

        switch (ext) {
            case 'css':
                var link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = asset;

                var head = document.getElementsByTagName('head')[0];
                head.appendChild(link);
                break;

            case 'js':
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.async = 'true';
                script.src = asset;

                document.body.appendChild(script);
                break;
        }
    }

    ajax = function(options, callback, params) {
        var xhr = new XMLHttpRequest(),
            type = options.type || 'ajax',
            method = options.method || 'GET',
            url = options.url || '',
            isAsync = options.async || true;

        xhr.open(method, url, isAsync);

        if (type == 'upload') {
    			xhr.setRequestHeader('X_FILENAME', params.name);
        }

        if (params) {
            xhr.send(params);
        } else {
            xhr.send();
        }

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
              let data;

              switch (type) {
                case 'json':
                  data = JSON.parse(xhr.responseText);
                break;

                default:
                  data = xhr.responseText;
                break;
              }

              if (callback) {
                callback(data);
              }

              return data;
            }
        };
    };

    log = function (msg, type) {
      var logType = type || 'log',
          err = new Error(),
          stack = err.stack,
          caller = stack.split('at ')[err.stack.split('at ').length - 1];

      if (window.console.dir && typeof msg != 'string') {
        console[logType](caller + ':');
        console.dir(msg);
      } else {
        console[logType](caller + ':\n' + msg);
      }
    };

    preload = function(assets) {
        if (assets instanceof Array) {
            for (i = 0; i < assets.length; i++) {
                preloadAsset(assets[i]);
            }
        } else {
            preloadAsset(assets);
        }
    };

    load = function(assets, callback) {
        if (assets instanceof Array) {
            for (i = 0; i < assets.length; i++) {
                loadAsset(assets[i]);
            }
        } else {
            loadAsset(assets);
        }

        if (callback) {
            callback();
        }
    };

    contains = function(string, substring) {
        return string.indexOf(substring) > -1;
    };

    addCSS = function(el, prop, val) {
        var ss = document.styleSheets[document.styleSheets.length - 1];

        if (ss) {
            var sslen = ss.cssRules ? ss.cssRules.length : ss.rules.length;
            ss.insertRule(el + ' {' + prop + ': ' + val + '; }', sslen);
        } else if (document.getElementsByTagName('style').length) {
            var styleTag = document.getElementsByTagName('style')[document.getElementsByTagName('style').length - 1];
            styleTag.innerHTML += ' \r' + el + '{' + prop + ':' + val + '}';
        } else {
            var styleTag = document.createElement('style');
            styleTag.innerHTML = el + '{' + prop + ':' + val + '}';
        }
    };

    getParam = function(key) {
        var params = String(window.location).split('?')[1];

        if (params && params !== null && params !== undefined && params !== '') {
            var pairs = params.split('&');

            for (var i = 0; i < pairs.length; i++) {
                if (pairs[i].split('=')[0] == key) {
                    return pairs[i].split('=')[1];
                }
            }
        }
    };

    isMobile = function() {
        return (/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i).test(navigator.userAgent);
    };

    function evalTouch(dir, fn) {
        var startTouch, endTouch;

        _this.listener('touchstart', function(e) {
            e.preventDefault();
            startTouch = {
                'x': e.touches[0].clientX,
                'y': e.touches[0].clientY
            };
        });

        _this.listener('touchend', function(e) {
            e.preventDefault();
            endTouch = {
                'x': e.changedTouches[0].clientX,
                'y': e.changedTouches[0].clientY
            };

            switch (dir) {
                case 'tap':
                    if (Math.abs(startTouch.x - endTouch.x) < 100 && Math.abs(startTouch.y - endTouch.y) < 100) {
                        fn();
                    }
                    break;

                case 'left':
                    if (Math.abs(startTouch.x - endTouch.x) > 100 && startTouch.x > endTouch.x) {
                        fn();
                    }
                    break;

                case 'right':
                    if (Math.abs(startTouch.x - endTouch.x) > 100 && startTouch.x < endTouch.x) {
                        fn();
                    }
                    break;

                case 'up':
                    if (Math.abs(startTouch.y - endTouch.y) > 100 && startTouch.y > endTouch.y) {
                        fn();
                    }
                    break;

                case 'down':
                    if (Math.abs(startTouch.y - endTouch.y) > 100 && startTouch.y < endTouch.y) {
                        fn();
                    }
                    break;
            }
        });

    };

    _this.on = function(evt, fn) {
        switch (evt) {
            case 'swipeleft':
                evalTouch('left', fn);
                break;

            case 'swiperight':
                evalTouch('right', fn);
                break;

            case 'swipeup':
                evalTouch('up', fn);
                break;

            case 'swipedown':
                evalTouch('down', fn);
                break;

            case 'tap':
                evalTouch('tap', fn);
                break;

            case 'click':
            case 'mouseover':
            case 'mouseout':
                break;
        }
    };

    _this.css = function(prop, val, del) {
        var delay = del || 0;
        setTimeout(setProp, delay, prop, val);
    };

    _this.animate = function(props, dur, del, eas) {
        var transitionStyle = '';
        var options = {};
        var counter = 0;
        options.properties = props;
        options.duration = dur || '500';
        options.delay = del || '0';
        options.ease = eas || 'ease';

        for (var i in options.properties) {
            counter++;
        }

        for (var key in options.properties) {
            var property = key;
            var value = options.properties[key];
            counter--;

            if (counter > 0) {
                transitionStyle += property + ' ' + options.duration + 'ms ' + options.ease + ', ';
            } else {
                transitionStyle += property + ' ' + options.duration + 'ms ' + options.ease;
            }

            _this.css(property, value, options.delay);
        }

        if (_this.length) {
            for (i = 0; i < _this.length; i++) {
                if (_this[i].style.transition !== "" || _this[i].style.webkitTransform !== "") {
                    transitionStyle = ', ' + transitionStyle;
                }
                _this[i].style.webkitTransition += transitionStyle;
                _this[i].style.transition += transitionStyle;
            }
        } else {
            if (_this.style.transition !== "" || _this.style.webkitTransform !== "") {
                transitionStyle = ', ' + transitionStyle;
            }
            _this.style.webkitTransition += transitionStyle;
            _this.style.transition += transitionStyle;
        }
    };

    _this.listener = function(evt, fn) {
        for (i = 0; i < _this.length; i++) {
            if (window.attachEvent) {
                _this[i].attachEvent('on' + evt, fn);
            } else if (window.addEventListener) {
                _this[i].addEventListener(evt, fn);
            } else {
                console.error('No Attach Event Found');
            }
        }
    };

  	_this.addClass = function (cName, delay) {
  		setTimeout(function () {
  			if (document.body.classList) {
  				_this.classList.add(cName);
  			} else {
  				_this.className += ' ' + cName;
  			}
  		}, delay || 0);
  	};

  	_this.removeClass = function (cName, delay) {
  		setTimeout(function () {
  			if (document.body.classList) {
  				_this.classList.remove(cName);
  			} else {
  				_this.className = _this.className.replace(' ' + cName, '');
  			}
  		}, delay || 0);
  	};

  	_this.replaceClass = function (cName1, Name2, delay)  {
  		setTimeout(function () {
  			_this.className = _this.className.relace(cName1, cName2);
  		}, delay || 0);
  	};

    _this.toggleClass = function (cName, delay) {
      setTimeout(function () {
        if (_this.className.indexOf(cName) == -1) {
          _this.addClass(cName);
        } else {
          _this.removeClass(cName);
        }
      }, delay || 0);
    };

    $$.addCSS = addCSS;
    $$.ajax = ajax;
    $$.contains = contains;
    $$.getParam = getParam;
    $$.isMobile = isMobile;
    $$.load = load;
    $$.log = log;
    $$.preload = preload;

    return _this;
};

(function() {
    $$();
}());
