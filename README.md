
# Slider JS

This project is a JavaScript slider built with Vite. It provides customizable slides with navigation buttons, autoplay functionality.

## Features

- **Slides Looping**: The slider supports continuous looping of slides, making it seamless to navigate between the last and first slides.
- **Autoplay**: Automatic transitions between slides with a customizable speed.
- **Navigation**: Includes both bullets for slide indication and buttons for previous/next navigation.

## Usage

To use the slider component, you can add it to your HTML as follows:

```html
<app-slider class="home-slider" autoplay="true" autoplay-speed="5000">
  <div class="slide">
    <h3 class="slide__title">Slide Title</h3>
    <p class="slide__subtitle">Slide description goes here.</p>
  </div>
</app-slider>
```

### Attributes

- **`autoplay`**: Enables or disables autoplay (default: `false`).
- **`autoplay-speed`**: Controls the speed of autoplay in milliseconds (default: `3000`).
- **`slides-per-view`**: Number of slides visible at a time (default: `1`).
- **`loop`**: Enables or disables loop (default: `false`).

### Slots

- **`prev-button`**: Slot for the previous button.
- **`next-button`**: Slot for the next button.

## Slots Usage

To use the slider component with slots, you can add it to your HTML as follows:

```html
<app-slider class="home-slider" autoplay="true" autoplay-speed="5000">
  <div class="slide">
    <h3 class="slide__title">Slide Title</h3>
    <p class="slide__subtitle">Slide description goes here.</p>
  </div>

  <!-- slider slots -->
  <button slot="prev-button" class="slide__btn">
    &#8592;
  </button>

  <button slot="next-button" class="slide__btn">
    &#8594;
  </button>
  <!-- end slider slots -->
</app-slider>
```

## Events

The slider automatically handles navigation through next and previous buttons and also allows for autoplay when enabled.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

## Development Notes

The following TODOs outline potential improvements or features to be added:

1. Handle touch and mouse events to ensure smooth sliding on all devices.
2. Improve loop behavior when `slides-per-view` is greater than 1.
