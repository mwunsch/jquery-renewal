/**
 * jquery.renewal.js
 * Copyright (c) 2011 Mark Wunsch (markwunsch.com)
 * https://github.com/mwunsch/jquery-renewal
 */

(function ($) {
  var VERSION = '0.0.0';

  function Renewal(element, configuration) {
    var conf = {
        },
        items = element.children(),
        self = this;
    self.length = items.size();
    self.VERSION = VERSION;
  };

  Renewal.prototype.size = function () {
    return this.length;
  };

  $.fn.renewal = function (config) {
    var carousel = new Renewal(this, config);
    return this.data((config || {}).accessor || 'carousel', carousel);
  };

})(jQuery);
