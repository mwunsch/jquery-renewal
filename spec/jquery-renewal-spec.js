describe('jquery-renewal', function () {
  var
    calculateElementWidth = function (el) {
      var marginLeft = parseInt(el.css('marginLeft'), 10),
          marginRight = parseInt(el.css('marginRight'), 10);
      return el.outerWidth() + marginLeft + marginRight;
    };

  describe('Default configuration', function () {

    describe('jQuery element', function () {
      beforeEach(function () {
        loadFixtures('fixture.html');
        this.element = $('#carousel');
        this.element.renewal();
      });

      it('should reference one DOM element', function () {
        expect(this.element.length).toBe(1);
      });

      it('should have a carousel data key', function () {
        expect(this.element).toHaveData('carousel');
      });

      it('should have the carousel object in data', function () {
        var carousel = this.element.data('carousel');
        expect(typeof carousel).toBe('object');
      });

      it('should establish the parent element as a wrapper', function () {
        var defaultWrapperClass = 'renewal-carousel-container',
            wrapper = this.element.parent();
        expect(wrapper).toHaveClass(defaultWrapperClass);
      });

      it('should constrain the width of the wrapper', function () {
        var firstItem = this.element.children(':first'),
            wrapper = this.element.parent(),
            firstItemWidth = calculateElementWidth(firstItem);
        expect(wrapper.width()).toEqual(firstItemWidth);
      });

      it('should change the width of the element', function () {
        var items = this.element.children(),
            itemWidth = 0;
        items.each(function (i, el) {
          itemWidth += calculateElementWidth($(el));
        });
        expect(this.element.width()).toEqual(itemWidth);
      });

      it('should set the position of the element to relative', function () {
        expect(this.element.css('position')).toEqual('relative');
      });

      it('should set the left position to the starting point', function () {
        expect(this.element.css('left')).toEqual('0px');
      });

      describe('Events', function () {
        beforeEach(function () {
          this.carousel = this.element.data('carousel');
          this.EVENT_ADVANCE = 'renewal.advance';
          this.EVENT_MOVE = 'renewal.move';
          this.EVENT_REVERSE = 'renewal.reverse';
        });

        it('should advance when triggered', function () {
          spyOn(this.carousel, 'advance');
          this.element.trigger(this.EVENT_ADVANCE);
          expect(this.carousel.advance).toHaveBeenCalled();
        });

        it('should reverse when triggered', function () {
          spyOn(this.carousel, 'reverse');
          this.element.trigger(this.EVENT_REVERSE);
          expect(this.carousel.reverse).toHaveBeenCalled();
        });

        it('should be trivial to bind to an event', function () {
          var el;
          spyOn(this.carousel, 'advance');
          this.element.bind(this.EVENT_ADVANCE, function (e) {
            el = $(e.target);
          });
          this.element.trigger(this.EVENT_ADVANCE);
          expect(el).toBe(this.element);
        });

        it('should trigger movement', function () {
          var el;
          this.element.bind(this.EVENT_MOVE, function (e) {
            el = $(e.target);
          });
          this.carousel.moveTo(1, 0);
          expect(el).toBe(this.element);
        });

      });

      describe('Renewal', function () {
        beforeEach(function () {
          this.carousel = this.element.data('carousel');
          this.carousel.moveTo(0, 0);
          this.element.clearQueue()
        });

        it('should get the configuration', function () {
          expect(this.carousel.getConfig()).toBeDefined();
        });

        it("should have a length equal to the element's children", function () {
          expect(this.carousel.length).toEqual(this.element.children().length);
        });

        it('should have a size method that returns the length', function () {
          expect(this.carousel.size()).toEqual(this.element.children().length);
        });

        it('should know the current position of the carousel', function () {
          expect(this.carousel.getPosition()).toEqual(0);
        });

        it('should get the element in the current position', function () {
          var item = this.carousel.getCurrentItem();
          expect(item).toEqual(this.element.children().eq(0));
        });

        describe('#moveTo', function () {
          it('should move to a specific position', function () {
            var renewal = this.carousel.moveTo(1, 0)
            expect(renewal.getPosition()).toEqual(1);
          });

          it('should move the left position of the element', function () {
            this.carousel.moveTo(2, 0);
            expect(this.element.css('left')).toEqual('-140px');
          });

          it('should be chaninable', function () {
            expect(this.carousel.moveTo(1, 0)).toEqual(this.carousel);
          });

          it('should not move beyond the lower boundary of the list', function () {
            var movement = this.carousel.moveTo(-2, 0);
            expect(movement.getPosition()).not.toEqual(-2);
          });

          it('should not move beyond the upper boundary of the list', function () {
            var movement = this.carousel.moveTo(5, 0);
            expect(movement.getPosition()).not.toEqual(5);
          });

          it('should move at any speed it would like to', function () {
            var movement = this.carousel.moveTo(1, 500);
            waits(505)
            runs(function () {
              expect(this.element.css('left')).toEqual('-70px');
            });
          });
        });

        describe('#advance', function () {
          beforeEach(function () {
            this.carousel.moveTo(0, 0);
            this.DEFAULT_SPEED = 165;
          });

          it('should update the position of the carousel by one item', function () {
            this.carousel.advance();
            waits(this.DEFAULT_SPEED);
            runs(function () {
              expect(this.carousel.getPosition()).toEqual(1);
            });
          });

          it('should update the left position of the element', function () {
            var firstItem = this.element.children(':first'),
                firstItemWidth = calculateElementWidth(firstItem);
            this.carousel.advance();
            waits(this.DEFAULT_SPEED);
            runs(function () {
              expect(this.element.css('left')).toEqual('-' + firstItemWidth + 'px');
            });
          });

          it('should advance two positions', function () {
            this.carousel.advance(2);
            waits(this.DEFAULT_SPEED);
            runs(function () {
              expect(this.carousel.getPosition()).toEqual(2);
            });
          });

          it('should advance the left position by two item widths', function () {
            var firstItem = this.element.children(':first'),
                secondItem = this.element.children().eq(1),
                firstItemWidth = calculateElementWidth(firstItem);
                secondItemWidth = calculateElementWidth(secondItem);
            this.carousel.advance(2);
            waits(this.DEFAULT_SPEED);
            runs(function () {
              expect(this.element.css('left')).toEqual('-' + (firstItemWidth + secondItemWidth) + 'px');
            });
          });

          it('should not advance beyond the upper boundary', function () {
            this.carousel.advance(5);
            waits(this.DEFAULT_SPEED);
            runs(function () {
              expect(this.carousel.getPosition()).toEqual(2);
            });
          });

          it('should move backwards when given a negative step', function () {
            this.carousel.advance(2);
            this.carousel.advance(-1);
            waits(this.DEFAULT_SPEED);
            runs(function () {
              expect(this.carousel.getPosition()).toEqual(1);
            });
          });

          it('should not move beyond the lower boundary', function () {
            this.carousel.advance(2);
            this.carousel.advance(-5);
            waits(this.DEFAULT_SPEED);
            runs(function () {
              expect(this.carousel.getPosition()).toEqual(0);
            });
          });

          it('should be chaninable', function () {
            waits(this.DEFAULT_SPEED);
            runs(function () {
              expect(this.carousel.advance()).toEqual(this.carousel);
            });
          });

        });

        describe('#reverse', function () {
          beforeEach(function () {
            this.carousel.moveTo(2, 0);
            this.DEFAULT_SPEED = 165;
          });

          it('should move backwards by one item', function () {
            this.carousel.reverse();
            waits(this.DEFAULT_SPEED);
            runs(function () {
              expect(this.carousel.getPosition()).toEqual(1);
            });
          });

          it('should update the left position to move backwards', function () {
            var lastItem = this.element.children(':last'),
                secondItem = this.element.children().eq(1),
                lastItemWidth = calculateElementWidth(lastItem),
                secondItemWidth = calculateElementWidth(secondItem);
            waits(this.DEFAULT_SPEED);
            runs(function () {
              this.carousel.reverse();
            });
            expect(this.element.css('left')).toEqual('-' + (lastItemWidth + secondItemWidth) + 'px');
          });

          it('should move backwards by two items', function () {
            this.carousel.reverse(2);
            waits(this.DEFAULT_SPEED);
            runs(function () {
              expect(this.carousel.getPosition()).toEqual(0);
            });
          });

          it('should not reverse beyond the lower boundary', function () {
            this.carousel.reverse(5);
            waits(this.DEFAULT_SPEED);
            runs(function () {
              expect(this.carousel.getPosition()).toEqual(0);
            });
          });

          it('should move forwards when given a negative step', function () {
            this.carousel.reverse(1);
            this.carousel.reverse(-1);
            waits(this.DEFAULT_SPEED);
            runs(function () {
              expect(this.carousel.getPosition()).toEqual(2);
            });
          });

          it('should not reverse beyond the upper boundary', function () {
            this.carousel.reverse();
            this.carousel.reverse(-2);
            waits(this.DEFAULT_SPEED);
            runs(function () {
              expect(this.carousel.getPosition()).toEqual(2);
            });
          });

          it('should be chaninable', function () {
            waits(this.DEFAULT_SPEED);
            runs(function () {
              expect(this.carousel.reverse()).toEqual(this.carousel);
            });
          });
        });

      });

    });

  });

  describe('Overriding configuration', function () {
    beforeEach(function () {
      loadFixtures('fixture.html');
      this.element = $('#carousel');
      this.element.renewal({
        speed: 0,
        visible: null
      });
      this.carousel = this.element.data('carousel');
    });

    it('should have overwritten the speed default', function () {
      var config = this.carousel.getConfig();
      expect(config.speed).toEqual(0);
    });

    it('should have overwritten the visible default', function () {
      var config = this.carousel.getConfig();
      expect(config.visible).toBeNull();
    });
  });

  describe('Different start point', function () {
    beforeEach(function () {
      loadFixtures('fixture.html');
      this.element = $('#carousel');
      this.element.renewal({
        start: 1,
        speed: 0
      });
      this.carousel = this.element.data('carousel');
    });

    it('should have a different position from the outset', function () {
      expect(this.carousel.getPosition()).toEqual(1);
    });

    it('should start the carousel at that point', function () {
      expect(this.element.css('left')).toEqual('-70px');
    });
  });

  describe('Circular slideshow', function () {
    beforeEach(function () {
      loadFixtures('fixture.html');
      this.element = $('#carousel');
      this.element.renewal({
        speed: 0,
        circular: true
      });
      this.carousel = this.element.data('carousel');
    });

    it('should have a position at the end after reverse is called when index is 1', function () {
      this.carousel.reverse();
      waits(this.DEFAULT_SPEED);
      runs(function () {
        expect(this.carousel.getPosition()).toEqual(this.carousel.length-1);
      });
    });

    it('should advance one position, even when circular is true', function () {
      this.carousel.moveTo(0, 0);
      waits(this.DEFAULT_SPEED);
      this.carousel.advance();
      waits(this.DEFAULT_SPEED);
      runs(function () {
        expect(this.carousel.getPosition()).toEqual(1);
      });
    });

    it('should reverse one position, even when circular is true', function () {
      this.carousel.moveTo(this.carousel.length-1, 0);
      waits(this.DEFAULT_SPEED);
      this.carousel.reverse();
      waits(this.DEFAULT_SPEED);
      runs(function () {
        expect(this.carousel.getPosition()).toEqual(this.carousel.length-2);
      });
    });

    it('should have a position at the beginning after advance is called when index is at end', function () {
      this.carousel.moveTo(this.carousel.length-1, 0);
      waits(this.DEFAULT_SPEED);
      this.carousel.advance();
      waits(this.DEFAULT_SPEED);
      runs(function () {
        expect(this.carousel.getPosition()).toEqual(0);
      });
    });

  });

  describe('Circular, more than one visible', function () {
    beforeEach(function () {
      loadFixtures('fixture-30.html');
      this.element = $('#carousel');
      this.element.renewal({
        speed: 0,
        circular: true,
        visible: 5
      });
      this.carousel = this.element.data('carousel');
    });

    it('should have a position at the end after reverse is called when index is 1', function () {
      this.carousel.reverse();
      waits(this.DEFAULT_SPEED);
      runs(function () {
        expect(this.carousel.getPosition()).toEqual(this.carousel.length-5);
      });
    });

    it('should have a position at the beginning after advance is called when index is at end', function () {
      this.carousel.moveTo(this.carousel.length-5, 0);
      waits(this.DEFAULT_SPEED);
      this.carousel.advance();
      waits(this.DEFAULT_SPEED);
      runs(function () {
        expect(this.carousel.getPosition()).toEqual(0);
      });
    });

  });


  describe('Renewal possible in carousel', function () {
    beforeEach(function () {
      loadFixtures('fixture-30.html');
      this.element = $('#carousel');
      this.element.renewal({
        speed: 0,
        circular: true
      });
      this.carousel = this.element.data('carousel');
    });

      it('should achieve renewal when advance is called when current position == 29', function () {
        this.carousel.moveTo(29, 0);
        waits(this.DEFAULT_SPEED);
        this.carousel.advance();
        runs(function () {
          expect(this.carousel.getPosition()).toEqual(0);
        });
      });

  });

});
