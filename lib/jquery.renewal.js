/**
 * jquery.renewal.js
 * Copyright (c) 2011 Mark Wunsch (markwunsch.com)
 * https://github.com/mwunsch/jquery-renewal
 * Licensed under the MIT License
 */
/*jshint eqnull: true */

(function ($) {
  var VERSION = '0.1.0',
      DEFAULTS = {
        accessor: 'carousel',
        EVENTS: {
          advance: 'renewal.advance',
          afterMove: 'renewal.moved',
          beforeMove: 'renewal.moving',
          move: 'renewal.move',
          reverse: 'renewal.reverse'
        },
        wrapperClassName: 'renewal-carousel-container'
      };

  function Renewal(element, configuration) {
    var defaults = {
          accessor: DEFAULTS.accessor,
          easing: null,
          eventAdvance: DEFAULTS.EVENTS.advance,
          eventAfterMove: DEFAULTS.EVENTS.afterMove,
          eventBeforeMove: DEFAULTS.EVENTS.beforeMove,
          eventMove: DEFAULTS.EVENTS.move,
          eventReverse: DEFAULTS.EVENTS.reverse,
          speed: 150,
          start: 0,
          vertical: false,
          visible: 1,
          wrapperClass: DEFAULTS.wrapperClassName,
          circular: false
        },
        items = element.children(),
        wrapper = element.parent(),
        conf = $.extend({}, defaults, configuration || {}),
        currentPosition = Math.abs(conf.start) || 0,
        self = this;

    function calculateElementWidth(el) {
      var marginLeft = parseInt(el.css('marginLeft'), 10),
          marginRight = parseInt(el.css('marginRight'), 10);
      return el.outerWidth() + marginLeft + marginRight;
    }

    function getItemWidth(upTo) {
      var width = 0;
      items.each(function (i, el) {
        if ((!upTo && upTo !== 0) || upTo >= i + 1) {
          width += calculateElementWidth($(el));
        }
      });
      return width;
    }

    element.css({
      'position': 'relative',
      'width': getItemWidth(),
      'left': -getItemWidth(Math.abs(conf.start))
    });

    wrapper.addClass(conf.wrapperClass);
    wrapper.css({
      'overflow-x': 'hidden'
    });
    if (conf.visible) {
      wrapper.css('width', getItemWidth(conf.visible));
    }

    self.moveTo = function moveTo(position, speed, easing) {
      var style = {},
          duration = speed != null ? speed : conf.speed;

      if (position >= 0 && position < self.length) {
        currentPosition = position;
        style.left = '-' + getItemWidth(position) + 'px';
        element.trigger(conf.eventBeforeMove);
        if (duration) {
          element.animate(style, duration, easing || conf.easing);
        } else {
          element.css(style);
        }
        element.trigger(conf.eventAfterMove);
        element.trigger(conf.eventMove);
      }
      return self;
    };

    element.bind(conf.eventAdvance, function (e) {
      self.advance();
    });

    element.bind(conf.eventReverse, function (e) {
      self.reverse();
    });

    self.VERSION = VERSION;
    self.length = items.size();
    self.getPosition = function getPosition() {
      return currentPosition;
    };
    self.getCurrentItem = function getCurrentItem() {
      return items.eq(currentPosition);
    };
    self.getConfig = function getConfig() {
      return conf;
    };
  }

  Renewal.prototype.size = function size() {
    return this.length;
  };

  Renewal.prototype.advance = function advance(step) {
    var pos = this.getPosition(),
        config = this.getConfig(),
        step = step ? step : config.visible || 1
        nextPosition = pos + step;
    if (step >= this.length) {
      nextPosition = this.length - 1;
    } else if (config.circular && nextPosition > this.length - 1) {
      nextPosition = 0;
    }
    this.moveTo(nextPosition < 0 ? 0 : nextPosition);
    return this;
  };

  Renewal.prototype.reverse = function reverse(step) {
    var pos = this.getPosition(),
        config = this.getConfig(),
        step = step ? step : config.visible || 1
        previousPosition = pos - step;
    if (previousPosition >= this.length || (config.circular && previousPosition < 0)) {
      previousPosition = this.length - config.visible || 1;
    }
    this.moveTo(previousPosition < 0 ? 0 : previousPosition);
    return this;
  };

  $.fn.renewal = function (config) {
    var carousel = new Renewal(this, config);
    return this.data((config || {}).accessor || DEFAULTS.accessor, carousel);
  };

})(jQuery);
