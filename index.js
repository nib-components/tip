var Popover = require('popover'),
  emitter = require('emitter');

var Tip = function(options){
  this.hide = this.hide.bind(this);
  this.show = this.show.bind(this);
  this.target = options.target;

  if( options.el ) {
    this.el = options.el;
  }
  else {
    this.el = document.createElement('div');
    this.el.classList.add('tip');
    this.setContent(options.content);
  }

  if( options.classes ) {
    this.el.classList.add(options.classes);
  }

  if( options.align ) {
    this.el.style.textAlign = options.align;
  }

  // fixed tip width
  if( options.width ) {
    this.el.style.width = options.width;
  }

  this.popover = new Popover({
    el: this.el,
    target: this.target,
    position: options.position
  });

  this.isVisible = false;
};

/**
 + * Allow the Tip to trigger events
 + */
emitter(Tip.prototype);

Tip.prototype.dispose = function(){
  this.hide();
  this.el.remove();
  this.off();
  this.emit('tooltip disposed');
};

Tip.prototype.hide = function(){
  this.popover.hide();
  this.el.classList.remove('is-visible');
  this.isVisible = false;
  this.emit('tooltip hidden');
};

Tip.prototype.show = function(){
  this.popover.show();
  this.el.classList.add('is-visible');
  this.isVisible = true;
  this.emit('tooltip visible');
};

Tip.prototype.setContent = function(val){
  this.el.innerHTML = val;
};

// Create a tooltip
Tip.create = function(options){
  this.options = options || {};
  this.selector = options.selector || '.js-tooltip';
  this.context = options.context || null;
  this.classes = options.classes || null;

  var tips = document.querySelectorAll(this.selector);

  [].forEach.call(tips, function(el){

    el.addEventListener('mouseover', function(){
       tip.show();
    });

    el.addEventListener('mouseout', function(){
       tip.hide();
    });

    if(el.hasAttribute('data-tip-loaded') === true) return;
    el.setAttribute('data-tip-loaded', true);

    var content = el.querySelector('.js-tooltip-content'),
      text = content.innerHTML,
      position = el.getAttribute('data-tip-position') || 'south',
      width = el.getAttribute('data-tip-width') || 250,
      classes = el.getAttribute('data-tip-class') || this.classes;

    var tip = new Tip({
      position: position,
      width: width,
      content: text,
      target: el,
      classes: classes
    });

    content.classList.add('is-hidden');
  });
};

module.exports = Tip;