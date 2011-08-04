describe('jquery-renewal', function () {

  describe('jQuery element', function () {
    beforeEach(function () {
      loadFixtures('fixture.html');
      this.element = $('#carousel');
      this.element.renewal();
    });

    it('should have a carousel data key', function () {
      expect(this.element).toHaveData('carousel');
    });

    it('should have the carousel object in data', function () {
      var carousel = this.element.data('carousel');
      expect(typeof carousel).toBe('object'); 
    });

    describe('Carousel object', function () {
      beforeEach(function () {
        this.carousel = this.element.data('carousel');
      });

      it("should have a length equal to the element's children", function () {
        expect(this.carousel.length).toEqual(this.element.children().length);
      });

      it('should have a size method that returns the length', function () {
        expect(this.carousel.size()).toEqual(this.element.children().length);
      });
    });
  });

});
