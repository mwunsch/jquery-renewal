/**
 * jquery.renewal.js
 * Copyright (c) 2011 Mark Wunsch (markwunsch.com)
 * https://github.com/mwunsch/jquery-renewal
 */

(function ($) {
  var VERSION = '0.0.0',
      DEFAULT_ACCESSOR = 'carousel',
      DEFAULT_WRAPPER_CLASSNAME = 'renewal-carousel-container';

  function Renewal(element, configuration) {
    var conf = {
          accessor: DEFAULT_ACCESSOR,
          start: 1,
          vertical: false,
          visible: 1,
          wrapperClass: DEFAULT_WRAPPER_CLASSNAME,
        },
        items = element.children(),
        wrapper = element.parent(),
        currentPosition = 0,
        self = this;

    function getItemWidth(upTo) {
      var width = 0;
      items.each(function (i, el) {
        if ((!upTo && upTo !== 0) || upTo >= i + 1) {
          width += calculateElementWidth($(el));
        }
      });
      return width;
    };

    function calculateElementWidth(el) {
      var marginLeft = parseInt(el.css('marginLeft'), 10),
          marginRight = parseInt(el.css('marginRight'), 10);
      return el.outerWidth() + marginLeft + marginRight;
    };

    element.css({
      'position': 'relative',
      'width': getItemWidth(),
      'left': -getItemWidth(conf.start - 1)
    });

    wrapper.addClass(conf.wrapperClass);
    wrapper.css({
      'overflow': 'hidden'
    });
    if (conf.visible) {
      wrapper.css('width', getItemWidth(conf.visible));
    }

    self.moveTo = function moveTo(position) {
      if (position >= 0 && position < self.length) {
        currentPosition = position;
        element.css({
          'left': '-' + getItemWidth(position) + 'px'
        });
      }
      return self;
    }

    self.VERSION = VERSION;
    self.length = items.size();
    self.getPosition = function () {
      return currentPosition;
    };
  };

  Renewal.prototype.size = function size() {
    return this.length;
  };

  Renewal.prototype.advance = function advance(step) {
    var nextPosition,
        currentPosition = this.getPosition();
    if (step > this.length) {
      nextPosition = this.length - 1;
    } else {
      nextPosition = currentPosition + (step || 1);
    }
    this.moveTo(nextPosition < 0 ? 0 : nextPosition);
    return this;
  };

  Renewal.prototype.regress = function (index) {
    
  };

  $.fn.renewal = function (config) {
    var carousel = new Renewal(this, config);
    return this.data((config || {}).accessor || DEFAULT_ACCESSOR, carousel);
  };

})(jQuery);
