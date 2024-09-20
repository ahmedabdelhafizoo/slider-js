import styles from "./app-slider.scss?inline";
import htmlTemplate from "./app-slider.html?raw";

/**
 * TODO:
 * 1. Handle touch and mouse events 
 * 2. handle slides loop based on slides per view
 */
class AppSLider extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({
            mode: "open",
        });
        this.slidesPerView = parseInt(this.getAttribute("slides-per-view")) || 1;
        this.autoPlay = this.getAttribute("autoplay") === "true";
        this.autoPlaySpeed = parseInt(this.getAttribute("autoplay-speed")) || 3000;
        this.loop = this.getAttribute("loop") === "true";
        this.navigationSpeed = parseInt(this.getAttribute("navigation-speed")) || 500;
        this.isNavigationActive = false;
        this.autoPlayTimer;
        this.activeIndex = 0;
        this.sliderContainerWidth = 0;
        this.slideWidth = 0;
        this.sliderContainer;
        this.slides;
        this.slidesCount = 0;
        this.bulletsContainer
        this.prevButton;
        this.nextButton;
        this.navigationTimer;
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
    setActiveBullet(targetIndex = this.activeIndex) {
        const bullets = this.shadowRoot.querySelectorAll(".slider__bullets .slider__bullets__item");
        bullets.forEach((bullet, index) => {
            bullet.classList.toggle("active", index === targetIndex);
        });
    }

    /**
     * Set the active slide
     * @returns {void}
     */
    setActiveSlide() {
        // Move the slider container to the correct position based on the active index and slide width 
        this.sliderContainer.style.transform = `translateX(${this.activeIndex < 0 ? '' : '-'}${Math.abs(this.activeIndex) * (this.slideWidth * this.slidesPerView)}px)`;

        this.setActiveBullet()
        this.initAutoplay();
    }

    /**
     * Set the slider transition duration based on the speed
     * @param {number} speed - The speed of the slider in milliseconds
     * @returns {void}
     */
    setSliderTransitionDuration(speed) {
        this.sliderContainer.style.transitionDuration = `${speed / 1000}s`;
    }

    /**
     * Handle the next navigation
     * @returns {void}
     */
    handleNextNavigation() {
        // if the current slide is not the last slide
        this.activeIndex += 1;
        this.setActiveSlide();
        this.isNavigationActive = true
        setTimeout(() => this.isNavigationActive = false, this.navigationSpeed)
    }

    /**
     * Handle the next navigation loop
     * @returns {void}
     */
    handleNextNavigationLoop() {
        // default behavior
        if (!this.loop) {
            this.activeIndex = 0;
            this.setActiveSlide();
            return;
        };

        this.isNavigationActive = true
        // Move to the cloned first slide and add it to the end
        this.activeIndex += 1;
        const firstSLideCopy = this.slides[0].cloneNode(true);
        this.slides[this.slides.length - 1].after(firstSLideCopy);
        this.setActiveSlide();
        this.setActiveBullet(this.activeIndex % this.slidesCount);
        if (this.navigationTimer) clearTimeout(this.navigationTimer);
        this.navigationTimer = setTimeout(() => {
            // goto first slide
            this.setSliderTransitionDuration(0);
            this.activeIndex = 0;
            this.setActiveSlide();
            firstSLideCopy.remove()
            this.sliderContainer.offsetHeight; // Force reflow to apply transition
            this.setSliderTransitionDuration(this.navigationSpeed);
            this.isNavigationActive = false
        }, this.navigationSpeed);
    }

    /**
     * Go to the next slide
     * @returns {void}
     */
    goToNextSlide() {
        if (this.isNavigationActive) return
        this.activeIndex < this.slidesCount - 1 ? this.handleNextNavigation() : this.handleNextNavigationLoop();
    }

    /**
     * Handle the prev navigation
     * @returns {void}
     */
    handlePrevNavigation() {
        // if the current slide is not the first slide
        this.activeIndex -= 1;
        this.setActiveSlide();
        this.isNavigationActive = true
        setTimeout(() => this.isNavigationActive = false, this.navigationSpeed)
    }


    /**
     * Handle the prev navigation loop
     * @returns {void}
     */
    handlePrevNavigationLoop() {
        // default behavior
        if (!this.loop) {
            this.activeIndex = this.slidesCount - 1;
            this.setActiveSlide();
            return;
        };

        this.isNavigationActive = true
        // Move to the cloned last slide and add it to the beginning
        this.activeIndex -= 1;
        this.setActiveBullet(Math.abs(this.activeIndex) % this.slidesCount);
        const lastSlideCopy = this.slides[Math.abs(this.activeIndex)].cloneNode(true);
        this.slides[0].before(lastSlideCopy);
        this.setActiveSlide();
        this.sliderContainer.style.marginLeft = `-${this.slideWidth * this.slidesPerView}px`;
        if (this.navigationTimer) clearTimeout(this.navigationTimer);
        this.navigationTimer = setTimeout(() => {
            // goto last slide
            this.sliderContainer.style.marginLeft = '0px';
            this.setSliderTransitionDuration(0);
            this.activeIndex = this.slidesCount - 1;
            this.setActiveSlide();
            lastSlideCopy.remove();
            this.sliderContainer.offsetHeight; // Force reflow to apply transition
            this.setSliderTransitionDuration(this.navigationSpeed);
            this.isNavigationActive = false
        }, this.navigationSpeed);
    }

    /**
     * Go to the previous slide
     * @returns {void}
     */
    goToPrevSlide() {
        if (this.isNavigationActive) return
        this.activeIndex > 0 ? this.handlePrevNavigation() : this.handlePrevNavigationLoop();
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
        this.sliderContainer.style.transitionDuration = `${this.navigationSpeed / 1000}s`;
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

        // clear the autoplay timer
        this.autoplayTimer && clearInterval(this.autoplayTimer);
    }
}

customElements.define("app-slider", AppSLider);