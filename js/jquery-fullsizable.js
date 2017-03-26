// Generated by CoffeeScript 1.12.4

/*
jQuery fullsizable plugin v2.1.0
  - take full available browser space to show images

(c) 2011-2015 Matthias Schmidt <http://m-schmidt.eu/>

Example Usage:
  $('a.fullsizable').fullsizable();

Options:
  **detach_id** (optional, defaults to null) - id of an element that will temporarely be set to ``display: none`` after the curtain loaded.
  **navigation** (optional, defaults to true) - show next and previous links when working with a set of images.
  **closeButton** (optional, defaults to true) - show a close link.
  **fullscreenButton** (optional, defaults to true) - show full screen button for native HTML5 fullscreen support in supported browsers.
  **openOnClick** (optional, defaults to true) - set to false to disable default behavior which fullsizes an image when clicking on a thumb.
  **clickBehaviour** (optional, 'next' or 'close', defaults to 'close') - whether a click on an opened image should close the viewer or open the next image.
  **preload** (optional, defaults to true) - lookup selector on initialization, set only to false in combination with ``reloadOnOpen: true`` or ``fullsizable:reload`` event.
  **reloadOnOpen** (optional, defaults to false) - lookup selector every time the viewer opens.
  **loop** (optional, defaults to false) - don't hide prev/next button on first/last image, so images are looped
  **caption** (optional, defaults to false) - displays a caption at the bottom of the image. Caption can be set using ``title`` and ``alt`` attributes of the thumbnail.
 */

(function() {
  var $, $caption_holder, $image_holder, bindCurtainEvents, closeFullscreen, closeViewer, close_id, container_id, current_image, fullscreen_id, hasFullscreenSupport, hideChrome, image_holder_id, images, keyPressed, makeFullsizable, mouseMovement, mouseStart, nextImage, next_id, openViewer, options, preloadImage, prepareCurtain, prevImage, prev_id, resizeImage, showChrome, showImage, spinner_class, stored_scroll_position, toggleFullscreen, unbindCurtainEvents;

  $ = jQuery;

  container_id = '#jquery-fullsizable';

  image_holder_id = '#fullsized_image_holder';

  next_id = '#fullsized_go_next';

  prev_id = '#fullsized_go_prev';

  close_id = '#fullsized_close';

  fullscreen_id = '#fullsized_fullscreen';

  spinner_class = 'fullsized_spinner';

  $image_holder = $('<div id="jquery-fullsizable"><div id="fullsized_wrapper"><div id="fullsized_holder"><div id="fullsized_image_holder"></div></div></div></div>');

  $caption_holder = $('<div id="fullsized_caption_holder"></div>');

  images = [];

  current_image = 0;

  options = null;

  stored_scroll_position = null;

  resizeImage = function() {
    var image;
    image = images[current_image];
    if (image.ratio == null) {
      image.ratio = (image.naturalHeight / image.naturalWidth).toFixed(2);
    }
    if ($(window).height() / image.ratio > $(window).width()) {
      $(image).width($(window).width());
      $(image).height($(window).width() * image.ratio);
      return $(image).css('margin-top', ($(window).height() - $(image).height()) / 2);
    } else {
      $(image).height($(window).height());
      $(image).width($(window).height() / image.ratio);
      return $(image).css('margin-top', 0);
    }
  };

  keyPressed = function(e) {
    if (e.keyCode === 27) {
      closeViewer();
    }
    if (options.navigation) {
      if (e.keyCode === 37) {
        prevImage(true);
      }
      if (e.keyCode === 39) {
        return nextImage(true);
      }
    }
  };

  prevImage = function(shouldHideChrome) {
    if (shouldHideChrome == null) {
      shouldHideChrome = false;
    }
    if (current_image > 0) {
      return showImage(images[current_image - 1], -1, shouldHideChrome);
    } else if (options.loop) {
      return showImage(images[images.length - 1], -1, shouldHideChrome);
    }
  };

  nextImage = function(shouldHideChrome) {
    if (shouldHideChrome == null) {
      shouldHideChrome = false;
    }
    if (current_image < images.length - 1) {
      return showImage(images[current_image + 1], 1, shouldHideChrome);
    } else if (options.loop) {
      return showImage(images[0], 1, shouldHideChrome);
    }
  };

  showImage = function(image, direction, shouldHideChrome) {
    if (direction == null) {
      direction = 1;
    }
    if (shouldHideChrome == null) {
      shouldHideChrome = false;
    }
    current_image = image.index;
    $(image_holder_id).hide();
    $(image_holder_id).html(image);
    if (options.caption) {
      if (image.caption) {
        $caption_holder.html(image.caption);
        $caption_holder.css({
          visibility: 'visible'
        });
      } else {
        $caption_holder.css({
          visibility: 'hidden'
        });
      }
    }
    if (options.navigation) {
      if (shouldHideChrome === true) {
        hideChrome();
      } else {
        showChrome();
      }
    }
    if (image.loaded != null) {
      $(container_id).removeClass(spinner_class);
      resizeImage();
      $(image_holder_id).fadeIn('fast');
      return preloadImage(direction);
    } else {
      $(container_id).addClass(spinner_class);
      image.onload = function() {
        resizeImage();
        $(image_holder_id).fadeIn('slow', function() {
          return $(container_id).removeClass(spinner_class);
        });
        this.loaded = true;
        return preloadImage(direction);
      };
      return image.src = image.buffer_src;
    }
  };

  preloadImage = function(direction) {
    var preload_image;
    if (direction === 1 && current_image < images.length - 1) {
      preload_image = images[current_image + 1];
    } else if ((direction === -1 || current_image === (images.length - 1)) && current_image > 0) {
      preload_image = images[current_image - 1];
    } else {
      return;
    }
    preload_image.onload = function() {
      return this.loaded = true;
    };
    if (preload_image.src === '') {
      return preload_image.src = preload_image.buffer_src;
    }
  };

  openViewer = function(image, opening_selector) {
    $('body').append($image_holder);
    $(window).bind('resize', resizeImage);
    showImage(image);
    return $(container_id).hide().fadeIn(function() {
      if (options.detach_id != null) {
        stored_scroll_position = $(window).scrollTop();
        $('#' + options.detach_id).css('display', 'none');
        resizeImage();
      }
      bindCurtainEvents();
      return $(document).trigger('fullsizable:opened', opening_selector);
    });
  };

  closeViewer = function() {
    if (options.detach_id != null) {
      $('#' + options.detach_id).css('display', 'block');
      $(window).scrollTop(stored_scroll_position);
    }
    $(container_id).fadeOut(function() {
      return $image_holder.remove();
    });
    closeFullscreen();
    $(container_id).removeClass(spinner_class);
    unbindCurtainEvents();
    return $(window).unbind('resize', resizeImage);
  };

  makeFullsizable = function() {
    images.length = 0;
    return $(options.selector).each(function() {
      var $imageElement, $this, image;
      image = new Image;
      $this = $(this);
      $imageElement = $this.children('img:first');
      image.buffer_src = $this.attr('href');
      image.index = images.length;
      if (options.caption) {
        image.caption = '';
        if (!!$imageElement.attr('title')) {
          image.caption += '<b>' + $imageElement.attr('title') + '</b><br>';
        }
        if (!!$imageElement.attr('alt')) {
          image.caption += $imageElement.attr('alt');
        }
      }
      images.push(image);
      if (options.openOnClick) {
        return $this.unbind("click").click(function(e) {
          e.preventDefault();
          if (options.reloadOnOpen) {
            makeFullsizable();
          }
          return openViewer(image, this);
        });
      }
    });
  };

  prepareCurtain = function() {
    if (options.navigation && $image_holder.find(prev_id).length === 0) {
      $image_holder.append('<button id="fullsized_go_prev" type="button" title="Previous"></button><button id="fullsized_go_next" type="button" title="Next"></button>');
      $(document).on('click', prev_id, function(e) {
        e.preventDefault();
        e.stopPropagation();
        return prevImage();
      });
      $(document).on('click', next_id, function(e) {
        e.preventDefault();
        e.stopPropagation();
        return nextImage();
      });
    }
    if (options.closeButton && $image_holder.find(close_id).length === 0) {
      $image_holder.append('<button id="fullsized_close" type="button" title="Close"></button>');
      $(document).on('click', close_id, function(e) {
        e.preventDefault();
        e.stopPropagation();
        return closeViewer();
      });
    }
    if (options.fullscreenButton && hasFullscreenSupport() && $image_holder.find(fullscreen_id).length === 0) {
      $image_holder.append('<button id="fullsized_fullscreen" type="button" title="Toggle fullscreen"></button>');
      $(document).on('click', fullscreen_id, function(e) {
        e.preventDefault();
        e.stopPropagation();
        return toggleFullscreen();
      });
    }
    if (options.caption) {
      $image_holder.find('#fullsized_holder').append($caption_holder);
    }
    switch (options.clickBehaviour) {
      case 'close':
        return $(document).on('click', container_id, closeViewer);
      case 'next':
        return $(document).on('click', container_id, function() {
          return nextImage(true);
        });
      default:
        return $(document).on('click', container_id, options.clickBehaviour);
    }
  };

  bindCurtainEvents = function() {
    $(document).bind('keydown', keyPressed);
    if (options.navigation) {
      $(document).bind('fullsizable:next', function() {
        return nextImage(true);
      });
      $(document).bind('fullsizable:prev', function() {
        return prevImage(true);
      });
    }
    return $(document).bind('fullsizable:close', closeViewer);
  };

  unbindCurtainEvents = function() {
    $(document).unbind('keydown', keyPressed);
    if (options.navigation) {
      $(document).unbind('fullsizable:next');
      $(document).unbind('fullsizable:prev');
    }
    return $(document).unbind('fullsizable:close');
  };

  hideChrome = function() {
    var $chrome;
    $caption_holder.toggle(false);
    $chrome = $image_holder.find('button');
    if ($chrome.is(':visible') === true) {
      $chrome.toggle(false);
      return $image_holder.bind('mousemove', mouseMovement);
    }
  };

  mouseStart = null;

  mouseMovement = function(event) {
    var distance;
    if (mouseStart === null) {
      mouseStart = [event.clientX, event.clientY];
    }
    distance = Math.round(Math.sqrt(Math.pow(mouseStart[1] - event.clientY, 2) + Math.pow(mouseStart[0] - event.clientX, 2)));
    if (distance >= 10) {
      $image_holder.unbind('mousemove', mouseMovement);
      mouseStart = null;
      return showChrome();
    }
  };

  showChrome = function() {
    $caption_holder.toggle(true);
    $(close_id + ',' + fullscreen_id).toggle(true);
    if (options.loop) {
      $(prev_id).show();
      return $(next_id).show();
    } else {
      $(prev_id).toggle(current_image !== 0);
      return $(next_id).toggle(current_image !== images.length - 1);
    }
  };

  $.fn.fullsizable = function(opts) {
    options = $.extend({
      selector: this.selector,
      detach_id: null,
      navigation: true,
      closeButton: true,
      fullscreenButton: true,
      openOnClick: true,
      clickBehaviour: 'close',
      preload: true,
      reloadOnOpen: false,
      loop: false,
      caption: false
    }, opts || {});
    prepareCurtain();
    if (options.preload) {
      makeFullsizable();
    }
    $(document).bind('fullsizable:reload', makeFullsizable);
    $(document).bind('fullsizable:open', function(e, target) {
      var i, image, len, results;
      if (options.reloadOnOpen) {
        makeFullsizable();
      }
      results = [];
      for (i = 0, len = images.length; i < len; i++) {
        image = images[i];
        if (image.buffer_src === $(target).attr('href')) {
          results.push(openViewer(image, target));
        } else {
          results.push(void 0);
        }
      }
      return results;
    });
    return this;
  };

  hasFullscreenSupport = function() {
    var fs_dom;
    fs_dom = $image_holder.get(0);
    if (fs_dom.requestFullScreen || fs_dom.webkitRequestFullScreen || fs_dom.mozRequestFullScreen) {
      return true;
    } else {
      return false;
    }
  };

  closeFullscreen = function() {
    return toggleFullscreen(true);
  };

  toggleFullscreen = function(force_close) {
    var fs_dom;
    fs_dom = $image_holder.get(0);
    if (fs_dom.requestFullScreen) {
      if (document.fullScreen || force_close) {
        return document.exitFullScreen();
      } else {
        return fs_dom.requestFullScreen();
      }
    } else if (fs_dom.webkitRequestFullScreen) {
      if (document.webkitIsFullScreen || force_close) {
        return document.webkitCancelFullScreen();
      } else {
        return fs_dom.webkitRequestFullScreen();
      }
    } else if (fs_dom.mozRequestFullScreen) {
      if (document.mozFullScreen || force_close) {
        return document.mozCancelFullScreen();
      } else {
        return fs_dom.mozRequestFullScreen();
      }
    }
  };

}).call(this);
