> Capricorn 15's. Born 2244. Enter the Carousel. This is the time of renewal. Be strong and you will be renewed. 

If I am going to make a Carousel plugin for jQuery, it had better make reference to [Logan's Run](http://en.wikipedia.org/wiki/Logan%27s_Run_%28film%29).

jquery-renewal is a jQuery plugin that makes a carousel. It works kind of like this:


    +---------------------------------------------------+
    |\          \                                       |
    | \          \                                      |
    |  +----------+                                     |
    |  |          |                                     |
    |  |          |                                     |
    |  |          |                                     |
    +--|----------|-------------------------------------+
     \ |        \ | 
      \|         \| 
       +----------+

The element in front acts as a window to an element positioned "behind" it. The element can move behind it, by using a couple of methods.

    -----------------------------------+
      \          \                     |
       \          \           <-       |
        +----------+                   |
        |          |                   |
        |          |          <-       |
        |          |                   |
    ----|----------|-------------------+
      \ |        \ | 
       \|         \| 
        +----------+

## Why yet another jQuery carousel plugin?

Here are some of the goals of this project:

1. _Good test coverage_. Because we're all professionals here. Specs are written with [Jasmine](http://pivotal.github.com/jasmine/) and [Jamine-jQuery](https://github.com/velesin/jasmine-jquery).
2. _Few opinions_. Most carousel plugins do a lot of mucking about on element styles that I think you should handle on your own.
3. _It doesn't have to be a list_. Any element with children can effectively become a carousel.
4. _Have an API_. That's really important.

## Usage

Here's how your HTML should be structured:

    .a_wrapper
      .the_carousel
        .child
        .child
        .child
        .child
        and so forth

You call it like this:

```javascript
$('.the_carousel').renewal();
```

### Under the Hood

`.a_wrapper` effectively becomes the foreground "window" element in the above illustration. `.a_wrapper` gets an additional class name and `overflow-x: hidden;` and the `width` is restricted to how many elements you want visible.

`.the_carousel` becomes the carousel, with styles that look like this:

```css
.the_carousel {
  position: relative;
  width: (the total width of the children of .the_carousel);
  left: 0;
}
```

And that's all that happens in terms of styling.

### API

```javascript
  var element  = $('.the_carousel').renewal(),
      carousel = element.data('carousel');
```

`carousel` is a Renewal object and you can call methods on it:

    carousel.size()
      How many elements are in the carousel
    carousel.getPosition()
      What is the current position of the carousel (0 indexed)
    carousel.getCurrentItem()
      Get the jQuery element at the current position
    carousel.getConfig()
      Get the configuration for this particular carousel
    carousel.advance([step])
      Advance the carousel
    carousel.reverse([step])
      Move backwards through the carousel
    carousel.moveTo(position, [speed, easing])
      Lower level method to move to a certain position in the carousel

### But how do I actually move the thing?

Other carousel plugins set up next and previous buttons for you and maybe even position indicators. jquery-renewal does not do this, you should do this.

Beyond calling the methods on the Renewal object itself, you have access to some events:

    'renewal.advance'
      Triggering will call Renewal#advance
    'renewal.reverse'
      Triggering will call Renewal#reverse
    'renewal.move'
      This is triggered in the call to Renewal#moveTo
    'renewal.moving'
      This is triggered before the carousel begins moving
    'renewal.moved'
      This is triggered after the carousel has finished it's movement

#### In practice

```javascript
$('button.next').click(function (e) {
  $('.carousel').trigger('renewal.advance')
});

$('button.previous').click(function (e) {
  $('.carousel').trigger('renewal.reverse');
});

$('.carousel').bind('renewal.move', function (e) {
  // The carousel has moved!
});
```

## Configuration

jquery-renewal has a few defaults. Overwrite them simply:

```javascript
$('.carousel').renewal({
  accessor: 'carousel',                      // The key to access the Renewal object on the element
  easing: null,                              // String name of an easing function
  eventAdvance: 'renewal.advance',           // The event for advancement
  eventMove: 'renewal.move',                 // The event for movement
  eventReverse: 'renewal.reverse',           // The event for reversal
  speed: 150,                                // The duration of animation
  start: 0,                                  // The starting position of the carousel
  visible: 1,                                // How many elements should be visible at one time
  wrapperClass: 'renewal-carousel-container' // The class name given to the wrapper
});
```

If `visible` is falsy, the width of the wrapper (`$('.a_wrapper')`), is not affected at all.


## TODO

* Make better examples
* Add an option to make carousels circular (infinitly repeating)
* Add an option to make a vertical carousel
* More events?

