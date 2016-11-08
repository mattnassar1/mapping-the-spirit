// Generated by CoffeeScript 1.10.0
(function() {
  $(function() {
    var $body, $collection, $grid, $header, $main, $pageTitle, $secondary, $single, $table, $window, createSingle, dragAndDrop, holdOn, horzScroll, init, loadSingle, lookAt, lookAway, pickUp, putDown, resizeGrid, resizeSects, scrolls, tableScroll, transEnd, vertScroll;
    $window = $(window);
    $body = $('body');
    $main = $('main');
    $header = $('header');
    $grid = $('.grid');
    $pageTitle = $header.find('.pageTitle span');
    $secondary = $header.find('.secondary');
    $table = $('#table');
    $single = $('#single');
    $collection = $('#collection');
    transEnd = 'transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd';
    init = function() {
      dragAndDrop();
      $body.on('mousewheel', '.horzScroll', function(event) {
        return horzScroll(this, event);
      });
      $body.scroll(function(event) {
        return vertScroll(this, event);
      });
      $table.scroll(function() {
        return tableScroll(this);
      });
      $body.on('click', '.item.click', function() {
        return pickUp(this);
      });
      $body.on('mouseover', '.item.click', function() {
        return lookAt(this);
      });
      $body.on('mouseleave', '.item.click', function() {
        return lookAway(this);
      });
      $body.on('click', 'header .close', function() {
        return putDown();
      });
      if ($body.is('.looking')) {
        loadSingle();
      }
      $grid.imagesLoaded(function() {
        return resizeGrid();
      });
      return $(window).resize(function() {
        resizeSects();
        resizeGrid();
        return vertScroll();
      });
    };
    resizeGrid = function() {
      var gutter;
      gutter = $grid.find('.gutter').innerWidth();
      $grid.isotope({
        layoutMode: 'masonryHorizontal',
        itemSelector: '.item',
        percentPosition: false,
        gutter: gutter,
        transitionDuration: 0,
        masonryHorizontal: {
          rowHeight: '.sizer',
          gutter: gutter,
          percentPosition: true,
          transitionDuration: 0
        },
        animationOptions: {
          duration: 0
        }
      });
      $grid.find('.item').each(function() {
        var $item, height;
        $item = $(this);
        if ($item.is('.large')) {
          height = $table.innerHeight() - gutter * 2;
        } else {
          height = $table.innerHeight() / 2 - gutter * 1.5;
        }
        $item.css({
          height: height
        });
        return $item.find('img').css({
          height: height
        });
      });
      $grid.isotope();
      return $grid.addClass('loaded');
    };
    vertScroll = function(self, event) {
      var $section, paddingTop, sectionTop, vertScrollTop;
      vertScrollTop = $main.scrollTop();
      $section = $header.parents('section');
      if (!$section.length) {
        return;
      }
      sectionTop = $section.offset().top;
      if (sectionTop <= 0) {
        $header.addClass('fixed');
        paddingTop = $header.innerHeight();
      } else {
        $header.removeClass('fixed');
        paddingTop = 0;
      }
      return $section.css({
        paddingTop: paddingTop
      });
    };
    horzScroll = function(self, event) {
      var delta;
      delta = event.deltaY;
      if (delta !== 0) {
        event.preventDefault();
        return self.scrollLeft -= delta;
      }
    };
    tableScroll = function(self) {
      var $bigTitle, scrollLeft, titleRight;
      scrollLeft = $(self).scrollLeft();
      $bigTitle = $('#title');
      titleRight = $pageTitle.innerWidth() - scrollLeft;
      if (titleRight <= 0) {
        titleRight = 0;
      }
      return $pageTitle.css({
        x: titleRight + 'px'
      });
    };
    dragAndDrop = function() {
      var gutter;
      gutter = $grid.find('.gutter').innerWidth();
      $grid.find('.item').draggable({
        containment: 'body',
        helper: 'clone',
        snap: '#collection',
        snapMode: 'inner',
        snapTolerance: 0,
        appendTo: 'body',
        scroll: false,
        cursorAt: {
          left: 0,
          top: 0
        },
        start: function(event, ui) {
          var $helper;
          $helper = $(ui.helper);
          return $grid.addClass('dragging');
        },
        drag: function(event, ui) {
          var $helper, collectionTop, itemTop;
          $helper = $(ui.helper);
          itemTop = ui.offset.top;
          collectionTop = $collection.find('.items').offset().top;
          if (itemTop >= collectionTop - 1) {
            return $helper.addClass('over');
          } else {
            return $helper.removeClass('over');
          }
        },
        stop: function(event, ui) {
          return $grid.removeClass('dragging');
        }
      });
      $collection.droppable({
        accept: '.item.droppable',
        drop: function(event, ui) {
          var $item;
          $(this).removeClass('over');
          $item = $(ui.draggable[0]).clone();
          $item.removeClass('droppable');
          return holdOn($item);
        },
        over: function(event, ui) {
          return $collection.addClass('over');
        },
        out: function(event, ui) {
          return $collection.removeClass('over');
        }
      });
      return $collection.find('.items').sortable({
        items: '> .item',
        containment: 'body',
        helper: 'clone',
        axis: 'x',
        snap: '#collection .items',
        snapMode: 'inner',
        snapTolerance: 0,
        scroll: false,
        placeholder: 'placeholder',
        forcePlaceholderSize: true,
        cursorAt: {
          left: 0,
          top: 0
        },
        start: function(event, ui) {
          return $collection.addClass('sorting');
        },
        stop: function(event, ui) {
          return $collection.removeClass('sorting');
        }
      });
    };
    holdOn = function(item) {
      var $item, slug;
      $item = $(item);
      $item.attr('style', '');
      $item.find('img').attr('style', '');
      slug = $item.data('slug');
      if (($collection.find('[data-slug="' + slug + '"]').length)) {
        return;
      }
      $collection.removeClass('empty');
      return $collection.find('.items').append($item);
    };
    pickUp = function(self) {
      var $collected, $item, index, slug, storySlug, type, url;
      $item = $(self);
      index = $item.attr('data-index');
      type = $item.attr('data-type');
      slug = $item.attr('data-slug');
      url = $item.attr('data-url');
      storySlug = $item.attr('data-story');
      $collected = $('#collection .item[data-index="' + index + '"]');
      $collected.addClass('selected');
      $body.addClass('looking');
      $single.addClass('open');
      setTimeout(function() {
        return $single.addClass('show');
      }, 10);
      return $.ajax({
        url: url,
        dataType: 'html',
        error: function(jqXHR, status, err) {
          console.log(jqXHR);
          console.log(status);
          return console.error(err);
        },
        success: function(response, status, jqXHR) {
          history.pushState('data', '', url);
          $pageTitle.transition({
            x: 0
          }, 500, 'easeInOutCubic');
          $single.addClass(type).attr('data-item', slug);
          if ($single.html()) {
            $single.on(transEnd, function() {
              $single.off(transEnd);
              return createSingle(response);
            });
            return $single.addClass('replacing');
          } else {
            return createSingle(response);
          }
        }
      });
    };
    createSingle = function(html) {
      return $single.on(transEnd, function() {
        var $data, slug, title, url;
        $data = $($(html)[0]);
        title = $data.data('title');
        slug = $data.data('slug');
        url = $data.data('url');
        $single.data('title', title).data('slug', slug).data('url', url);
        $secondary.find('.title a').html(title).attr('href', url);
        $single.off(transEnd);
        $single.html(html);
        loadSingle();
        return $single.removeClass('replacing');
      });
    };
    loadSingle = function() {
      $pageTitle.css({
        x: 0
      });
      return $single.find('section img').eq(0).imagesLoaded(function() {
        $single.addClass('loaded');
        imagesLoaded($single).on('progress', function(inst, image) {
          var $item;
          $item = $(image.img).parents('.item');
          return $item.addClass('loaded');
        });
        return $('section#left').resizable({
          handles: 'e',
          resize: function() {
            return resizeSects();
          }
        });
      });
    };
    putDown = function() {
      var $collected, itemSlug, pageTitleRight, pageTitleWidth, scrollLeft, url;
      itemSlug = $single.attr('data-item');
      url = window.location.href.replace(itemSlug, '');
      history.replaceState({}, '', url);
      $collected = $('#collection .item.selected').removeClass('selected');
      $body.removeClass('looking folder');
      scrollLeft = $table.scrollLeft();
      pageTitleWidth = $pageTitle.innerWidth();
      pageTitleRight = pageTitleWidth - scrollLeft;
      if (pageTitleRight <= 0) {
        pageTitleRight = 0;
      }
      $pageTitle.transition({
        x: pageTitleRight
      }, 500, 'easeInOutQuint');
      $single.on(transEnd, function() {
        $single.off(transEnd);
        $single.removeClass('');
        $single.attr('class', '');
        return $single.html('');
      });
      return $single.removeClass('show');
    };
    scrolls = {
      left: {
        top: 0,
        height: 0
      },
      right: {
        top: 0,
        height: 0
      }
    };
    resizeSects = function() {
      var $leftSect, $rightSect, fontFactor, leftWidth, rightWidth, windowWidth;
      $leftSect = $single.find('section#left');
      $rightSect = $single.find('section#right');
      windowWidth = $window.innerWidth();
      leftWidth = $leftSect.innerWidth();
      rightWidth = windowWidth - leftWidth;
      $rightSect.css({
        width: rightWidth
      });
      fontFactor = windowWidth * 2 * 19;
      return $single.find('section').each(function(i, sect) {
        var $inner, $sect, fontSize, sectWidth;
        $sect = $(sect);
        $inner = $sect.find('.inner');
        sectWidth = $sect.innerWidth();
        fontSize = sectWidth / windowWidth * 2 * 19;
        if (fontSize <= 25 && fontSize >= 9) {
          return $sect.find('.text').css({
            fontSize: fontSize + 'px'
          });
        }
      });
    };
    lookAt = function(self) {
      var $collected, $item, index;
      if ($grid.is('.dragging') || $collection.is('.sorting')) {
        return;
      }
      index = $(self).data('index');
      $item = $('.grid .item[data-index="' + index + '"]');
      $collected = $('#collection .item[data-index="' + index + '"]');
      $collected.addClass('looking');
      return $item.addClass('looking');
    };
    lookAway = function(self) {
      var $collected, $item, index;
      index = $(self).data('index');
      $item = $('.grid .item[data-index="' + index + '"]');
      $collected = $('#collection .item[data-index="' + index + '"]');
      $collected.removeClass('looking');
      return $item.removeClass('looking');
    };
    return init();
  });

}).call(this);
