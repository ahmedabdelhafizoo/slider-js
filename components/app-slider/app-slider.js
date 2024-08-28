import styles from "./app-slider.scss?inline";
import htmlTemplate from "./app-slider.html?raw";

// TODO: Handle touch and mouse events 
class AppSLider extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({
            mode: "open",
        });
        this.slidesPerView = parseInt(this.getAttribute("slides-per-view")) || 1;
        this.autoPlay = this.getAttribute("autoplay") === "true";
        this.autoPlaySpeed = parseInt(this.getAttribute("autoplay-speed")) || 3000;
        this.autoPlayTimer;
        this.activeIndex = 0;
        this.sliderContainerWidth = 0;
        this.slideWidth = 0;
        this.sliderContainer;
        this.slides
        this.slidesCount = 0;
        this.bulletsContainer
        this.prevButton
        this.nextButton
    }

    /**
     * Render the component
     * @returns {void}
     */
    render() {
        this.shadowRoot.innerHTML = `
            <style>
                ${styles}
            </style>
            
            ${htmlTemplate}
            `;
    }

    /**
     * Initialize the slider bullets
     * @returns {void}
     */
    initSliderBullets() {
        this.bulletsContainer = this.shadowRoot.querySelector(".slider__bullets");
        this.bulletsContainer.innerHTML = "";

        // Create bullets based on the number of slides
        for (let i = 0; i < this.slidesCount; i++) {
            const bullet = document.createElement("button");
            bullet.className = `slider__bullets__item`;
            bullet.setAttribute("part", "bullet");
            bullet.classList.toggle("active", i === this.activeIndex);
            bullet.addEventListener("click", () => this.goToSlide(i));
            this.bulletsContainer.appendChild(bullet);
        }

    }

    /**
     * Set the active bullet
     * @returns {void}
     */
    setActiveBullet() {
        const bullets = this.shadowRoot.querySelectorAll(".slider__bullets .slider__bullets__item");
        bullets.forEach((bullet, index) => {
            bullet.classList.toggle("active", index === this.activeIndex);
        });
    }

    /**
     * Set the active slide
     * @returns {void}
     */
    setActiveSlide() {
        // Move the slider container to the correct position based on the active index and slide width 
        this.sliderContainer.style.transform = `translateX(-${this.activeIndex * (this.slideWidth * this.slidesPerView)}px)`;

        this.setActiveBullet()
        this.initAutoplay();
    }

    /**
     * Go to the next slide
     * @returns {void}
     */
    goToNextSlide() {
        // If we're on the last slide, go to the first slide
        this.activeIndex = this.slidesCount > this.activeIndex + 1 ? this.activeIndex + 1 : 0;
        this.setActiveSlide();
    }

    /**
     * Go to the previous slide
     * @returns {void}
     */
    goToPrevSlide() {
        // If we're on the first slide, go to the last slide
        this.activeIndex = this.activeIndex > 0 ? this.activeIndex - 1 : this.slidesCount - 1;
        this.setActiveSlide();
    }

    /**
     * Go to a specific slide
     * @param {number} index - The index of the slide to go to
     */
    goToSlide(index) {
        this.activeIndex = index;
        this.setActiveSlide();
    }

    /**
     * Start the autoplay
     * @returns {void}
     */
    startAutoplay() {
        this.autoplayTimer && clearInterval(this.autoplayTimer); // Clear the previous timer if it exists
        this.autoplayTimer = setInterval(() => {
            this.goToNextSlide();
        }, this.autoPlaySpeed);
    }

    /**
     * Initialize the autoplay
     * @returns {void}
     */
    initAutoplay() {
        if (!this.autoPlay) return; // If autoplay is not enabled, return
        this.startAutoplay();
    }

    /**
     * Update the slide width
     * @returns {void}
     */
    updateSlideWidth() {
        this.sliderContainerWidth = this.sliderContainer.clientWidth;
        // Calculate the slide width based on the slider container width and the number of slides per view
        this.slideWidth = this.sliderContainerWidth / this.slidesPerView;
        this.slides.forEach((slide) => {
            slide.style.width = `${this.slideWidth}px`;
        })
        this.setActiveSlide();
    }

    /**
     * Initialize the slider
     * @returns {void}
     */
    initSlider() {
        // init the slider elements
        this.sliderContainer = this.shadowRoot.querySelector(".slider__slides");
        this.slides = this.sliderContainer.querySelector("& > slot").assignedElements();
        this.prevButton = this.shadowRoot.querySelector("slot[name=prev-button]");
        this.nextButton = this.shadowRoot.querySelector("slot[name=next-button]");
        this.slidesCount = Math.ceil(this.slides.length / this.slidesPerView);


        // run init methods
        this.updateSlideWidth();
        this.setActiveSlide();
        this.initSliderBullets();
        this.initAutoplay();

        // add event listeners
        this.nextButton.addEventListener("click", this.goToNextSlide.bind(this));
        this.prevButton.addEventListener("click", this.goToPrevSlide.bind(this));
    }

    /**
     * connectedCallback - called when the component is added to the DOM
     * @returns {void}
     */
    connectedCallback() {
        this.render();
        this.initSlider();

        // make the slides width responsive
        window.addEventListener("resize", this.updateSlideWidth.bind(this));
    }


    /**
     * disconnectedCallback - called when the component is removed from the DOM
     * @returns {void}
     */
    disconnectedCallback() {
        // clean up event listeners
        this.prevButton.removeEventListener("click", this.goToPrevSlide);
        this.nextButton.removeEventListener("click", this.goToNextSlide);
        window.removeEventListener("resize", this.updateSlideWidth.bind(this));
    }
}

customElements.define("app-slider", AppSLider);