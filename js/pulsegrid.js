var NK = {};
var PULSE_GRID_TYPE = "varied";
var PULSE_TRANSITION = "slidein";
var PULSE_TYPE = "random";

var landingPageInit = function() {
  if(Modernizr.touch) {
    $('a').on('touchstart',function(){
      $(this).addClass('touch-active');
    }).on('touchend',function(){
      $(this).removeClass('touch-active');
    });
  }
  
  $(window).on('keyup',function(e){
    if(e.keyCode === 27 && $('.pulse-overlay').hasClass('is-active')) {
      $('.pulse-overlay').toggleClass('is-offstage is-translucent is-active');
    }
  });
  
  // $(".carousel").each(function(){
  //       if ($(this).data('stop-old-carousel')) {
  //           return;
  //       }
  //   $(this).carousel({
  //     startPage: $(this).data('carousel-start') || 0,
  //     afterMove: function(){
  //       var $nav = this.closest('.carousel-parent').find('.carousel-nav');
  //       $nav.find('.toc li')
  //         .eq(arguments[0])
  //           .addClass('is-active').siblings()
  //             .removeClass('is-active')
  //           .end()
  //         .end()
  //       .end().find('.prev')
  //         .toggleClass('is-inactive',arguments[0] === 0)
  //       .end().find('.next')
  //         .toggleClass('is-inactive',arguments[0] === arguments[1]);
  //     }
  //   });
  // });
  
  $(".pulse-section").on('click', '#pulse-grid a, .pulse-overlay .close',function(e){
    $('.pulse-overlay').toggleClass('is-offstage is-translucent is-active');
  });
  
  $('.carousel-nav').on('click','.prev',function(e){
  
      $(this).closest('.carousel-parent').find('.carousel').trigger('goToPage','-');
        e.stopPropagation();
      
  }).on('click','.next',function(e){
  
      $(this).closest('.carousel-parent').find('.carousel').trigger('goToPage','+');
        e.stopPropagation();
      
  }).on('click','.toc button',function(){
    var i = $(this).parent().index();
    $(this).closest('.carousel-parent').find('.carousel').trigger('goToPage',i);
  });
  
  $(window).resize(function() {
    (function(){
      $('.carousel-parent').each(function(){
        var $self = $(this);
        var $container = $self.find('.carousel-container');
        var $carousel = $self.find('.carousel');
        var $toc = $self.find('.toc');
        var $o = $('<li><button></button></li>');
        var x = ($carousel.children().length*$carousel.children().outerWidth())/$container.outerWidth();
        if(!$container.length || !$toc.length){ return;}
        if($toc.children().length != x) {
          $toc.empty();
          if(x > 1) {
            for (var i = 0; i < x; i++) {
              $o.clone().find('button').html(i+1).end().appendTo($toc);
            }
            $toc.children().eq(0).addClass('is-active');
          }
          $toc.children().eq(0).addClass('is-active');
          $carousel.trigger('goToPage',$carousel.data('carousel-start') || 0);
        } 
      });
    }).call();
  });
  
  (function(){
    $('.carousel-parent').each(function(){
      var $self = $(this);
      var $container = $self.find('.carousel-container');
      var $carousel = $self.find('.carousel');
      var $toc = $self.find('.toc');
      var $o = $('<li><button></button></li>');
      var x = ($carousel.children().length*$carousel.children().outerWidth())/$container.outerWidth();
      if(!$container.length || !$toc.length){ return;}
      if($toc.children().length != x) {
        $toc.empty();
        if(x > 1) {
          for (var i = 0; i < x; i++) {
            $o.clone().find('button').html(i+1).end().appendTo($toc);
          }
          $toc.children().eq(0).addClass('is-active');
        }
        $toc.children().eq(0).addClass('is-active');
        $carousel.trigger('goToPage',$carousel.data('carousel-start') || 0);
      } 
    });
  }).call();
  
  var $spinner = $('.spinner'),
    token = 0;
  
  setInterval(function(){
    $spinner.html(token%8);
    token++;
  }, 100);
  
  $('.btn-more').on('click',function(){
    var $btn = $(this);
    if($btn.hasClass('loading')){ return}
    $btn.addClass('loading');
    (function($obj){
      setTimeout(function(){
        var $grid = $btn.closest('section').find($btn.data('target'));
        if(!$grid.data('oHeight')){
          $grid.data('oHeight',$grid.height());
        }
        var startHeight = ($btn.hasClass('is-active'))?'nHeight':'oHeight';
        var endHeight = ($btn.hasClass('is-active'))?'oHeight':'nHeight';
        
        $grid.css({'height':'auto','max-height':'none'}).data('nHeight',$grid.height()).height($grid.data(startHeight)).stop().animate({height: $grid.data(endHeight)},400,function(){
            $btn.removeClass('loading').toggleClass('is-active', !$btn.hasClass('is-active')).find('.text').html(function(){
              return ($btn.hasClass('is-active'))?'Less':'More';
            }).attr('data-glyph',function(){
              return ($btn.hasClass('is-active'))?'D':'C';
            });
            if($btn.hasClass('is-active')){$grid.css({'height':'auto','max-height':'none'});}
            $('html,body').animate({
              scrollTop: ($grid.offset().top-$('#gnav').height())
            },400);
          }
        );
      }, 250);
    })($(this));
  });
  
  $('.filter-type').on('click','a',function(){
    var $parent = $(this).parent(),
      type = $(this).parent().data('type'),
      $target = $($(this).closest('.filter-type').data('affects'));
      
    $(this).parent().addClass('is-active').siblings().removeClass('is-active');
    if($target.length) {
      if(!type) {
        $target.find('> [data-type]').fadeIn();
      } else {
        $target.find('> [data-type]').not('[data-type="'+type+'"]').fadeOut().end().filter('[data-type="'+type+'"]').fadeIn();
      }
    }
  });
  
  NK.DynCard = (function(){
    function card(elem){
      if(!elem) return;
      
      this.el = $(elem);

      this.card_types = {
        'hflip':{
          views:2
        },
        'cube':{
          views:4
        },
        'slidein':{
          views:2
        }
      };
      //this.type = this.el.data('cardeffect');
      //this.el.addClass(this.type);
      this.type = PULSE_TRANSITION;
      this.el.addClass(this.type);
      this.interval = 5000;
      this.switched = false;
      this.active = false;
      this.intVal = null;
      this.currentView = 1;
      this.currentViewClass = 'view-1';
      
      this.container = this.el.find('.card-container');
      this.cards = this.container.find('.card');
      this.width = this.el.width();
      this.height = this.el.height();
      this.initDOM();
      this.bindObservers();
      this.run();
    } 

    card.prototype = {
      initDOM: function() {
        switch(this.type) {
          case 'slidein': 
            this.initSlide();
            break;
          case 'cube':
            this.initCube();
            break;
          case 'hflip':
            this.initFlip();
            break;
          default:
            break;
        }

      },
      initCube: function() {
        var outgoing = this.container.find('.outgoing');
        var incoming = this.container.find('.incoming');

        var item3 = outgoing.clone();
        item3.addClass('item-3');

        var item4 = incoming.clone();
        item4.addClass('item-4');

        outgoing.addClass('item-1');
        incoming.addClass('item-2');

        this.container.append(item3);
        this.container.append(item4);
        
      },
      initSlide: function() {
      },
      initFlip: function() {
      },
      bindObservers: function() {
        this.el.on({
          'mouseenter':$.proxy(this.onMouseEnter, this),
          'mouseleave':$.proxy(this.onMouseLeave, this),
        });
        this.container.on('webkitTransitionEnd', $.proxy(this.onTransitionEnd, this));
      },
      switchView: function(){
        if (this.active) {return;}

        this.currentView = this.currentView + 1;

        if (this.type === 'cube') {
          var rotation = (this.currentView * 90) - 90;
          this.container[0].style.webkitTransform = 'translate3d(0,0,-'+this.width/2+'px) rotateY(-'+rotation+'deg)';
        } else if (this.type === 'hflip') {
          var rotation = (this.currentView * 180) - 180;
          this.container[0].style.webkitTransform = 'translate3d(0,0,0) rotateY(-'+rotation+'deg)';
        } else if (this.type === 'slidein') {
          this.container[0].style.webkitTransform = 'translate3d('+this.width+'px,0,0)';
        }

        //var new_view = this.currentView + 1;
        //if (new_view > this.card_types[this.type]['views']) {
        //  new_view = 1; 
        //  this.el.addClass('no-transition');
        //}

        //this.el.addClass('view-'+new_view).removeClass(this.currentViewClass);

        //this.currentView = new_view;
        //this.currentViewClass = 'view-'+this.currentView;

        //this.el.removeClass('no-transition');

        //this.el.toggleClass('switched');
        //this.el.addClass('switched');
        //this.switched = (!this.switched) ? true : false;
        
        //if(!this.switched){
        //  //  this.stop();
        //}
      },
      run: function(){
        var me = this;
        //this.intVal = setInterval(function(){
        //  me.switchView();
        //}, me.interval);
      },
      stop: function(){
        //clearInterval(this.intVal);
        //this.intVal = null;
      },
      onMouseEnter: function() {
        this.active = true;
      },
      onMouseLeave: function() {
        var that = this;
        setTimeout(function() {
         that.active = false; 
        }, 500);
      },
      onTransitionEnd: function() {
        if (this.active) {return;}
        switch(this.type) {
          case 'slidein': 
            this.afterSlide();
            break;
          case 'cube':
            this.afterCube();
            break;
          case 'hflip':
            this.afterFlip();
            break;
          default:
            break;
        }
      },
      removeTransitions:function() {
         this.container[0].style.webkitTransition = '0ms';
      },
      addTransitions:function() {
         this.container[0].style.webkitTransition = null;
      },
      afterSlide:function() {
        var that = this;

        this.removeTransitions();
        var outgoing = this.container.find('.outgoing');
        var incoming = this.container.find('.incoming');

        this.container[0].style.webkitTransform = '';

        outgoing.addClass('incoming').removeClass('outgoing');
        incoming.addClass('outgoing').removeClass('incoming');



        setTimeout(function() { that.addTransitions(); }, 100);
      },
      afterCube:function() {
      },
      afterFlip:function() {
      }
    }
    return card; 
  }());
  
  if (PULSE_GRID_TYPE === 'varied') {
  }

  var dyncards = [];
  $('.dyn-card').each(function(i, elem){
    dyncards.push(new NK.DynCard(elem));
  });

  (function() {
    var interval = 8000,
        len = dyncards.length;

    if (PULSE_TYPE === 'random') {
      var lastChangedIndex = null;

      var timer = setInterval(function() {
        var rand = Math.floor(Math.random()*len)
        if (lastChangedIndex !== null && lastChangedIndex === rand) {
          arguments.callee.call();
          return;
        }
        lastChangedIndex = rand;
        dyncards[rand].switchView();
      }, 2000);
    } else if (PULSE_TYPE === 'wave') {
      var timer = setInterval(function() {

        var count = 0;
        var doSwitch = setTimeout(function() {
          if (count === len) {return;}
          dyncards[count].switchView();
          count = count + 1;
          setTimeout(arguments.callee, 100);
        }, 100);
      }, interval);
    }
  })();
  
    // NK.Stream.fire("landing_page:inited");
};

$(document).ready(function(){
  landingPageInit();  
});



$(document).ready(function(){

});



