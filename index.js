var Popover = require('popover');

var Tip = function(options){
  _.bindAll(this, 'hide', 'show');

  this.target = $(options.target);

  if( options.el ) {
    this.el = options.el;
  }
  else {
    this.el = $('<div class="tip" />');
    this.setContent(options.content);
  }

  if( options.classes ) {
    this.el.addClass(options.classes);
  }

  if( options.align ) {
    this.el.css('text-align', options.align);
  }

  // fixed tip width
  if( options.width ) {
    this.el.css('width', options.width);
  }

  this.popover = new Popover({
    el: this.el,
    target: this.target,
    position: options.position
  });

  this.isVisible = false;
};

Tip.create = function(options){

  options = _.defaults(options || {}, {
    selector: '.js-tooltip',
    context: null
  });

  $(options.selector, options.context).each(function(){
    if(this.hasAttribute('data-tip-loaded') === true) return;
    this.setAttribute('data-tip-loaded', true);

    var $this = $(this);
    var content = $this.find('.js-tooltip-content');
    var text = content.html();
    var position = this.getAttribute('data-tip-position') || 'south';
    var width = this.getAttribute('data-tip-width') || 250;
    var classes = this.getAttribute('data-tip-class') || options.classes;

    var tip = new Tip({
      position: position,
      width: width,
      content: text,
      target: this,
      classes: classes
    });

    content.remove();

    $this.hover(function(){
      tip.show();
    }, function(){
      tip.hide();
    });

  });
};

_.extend(Tip.prototype, Backbone.Events, {

  dispose: function(){
    this.hide();
    this.el.remove();
    this.off();
  },

  hide: function(){
    this.popover.hide();
    this.el.removeClass('is-visible');
    this.isVisible = false;
  },

  show: function(){
    this.popover.show();
    this.el.addClass('is-visible');
    this.isVisible = true;
  },

  setContent: function(val){
    this.el.html(val);
  }

});

module.exports = Tip;
