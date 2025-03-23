document.addEventListener("DOMContentLoaded", function () {
  let startX = 0;
  let currentX = 0;
  let isSwiping = false;
  let isActive = false;
  let currentIndex = 0;

  const windowWidth = window.innerWidth;
  const carousel = document.querySelector("#concert .carousel");
  const carouselItems = document.querySelectorAll("#concert .carouselItem");
  const lastItem = carouselItems.length - 1;

  const titleContainer = document.querySelector("#concert .titleContainer");
  const titleCarousel = document.querySelector("#concert .titleCarousel");

  const itemPadding = ((windowWidth - 100) - (0.8 * windowWidth - 100)) / 2;
  const currentItemWidth = windowWidth - 100;
  const itemWidth = (windowWidth * 0.8) - 100;

  updateCurrentSlide();

  function updateCurrentSlide() {
    carousel.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
    titleCarousel.style.top = `-${currentIndex * 6}rem`;

    carouselItems.forEach((item, index) => {
      if (index === currentIndex) {
        item.style.width = `${currentItemWidth}px`;
        item.style.padding = `0 20px`;
      } else {
        item.style.width = `${itemWidth}px`;
        item.style.padding = `${itemPadding}px 20px`;
      }
    });
  }

  function deactivateCurrent() {
    const currentSlide = carouselItems[currentIndex];
    carousel.classList.remove("active");
    titleContainer.classList.remove("active");

    currentSlide.classList.remove("active");
    currentSlide.style.width = `${currentItemWidth}px`;
    currentSlide.style.padding = "0 20px";

    const subtitle = document.querySelectorAll("#concert .subtitle h3");
    subtitle.forEach(sub => {
      sub.style.top = `0rem`;
    })
    titleContainer.style.top = "";

    isActive = false;
  }

  function activateCurrent() {
    const currentSlide = carouselItems[currentIndex];
    carousel.classList.add("active");
    titleContainer.classList.add("active");

    currentSlide.classList.add("active");
    currentSlide.style.width = "100%";
    currentSlide.style.padding = "0";

    if (currentIndex != 0) {
      carousel.style.transform = `translateX(-${(currentIndex * itemWidth) + 50}px)`;
    } else {
      carousel.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
    }

    const subtitle = document.querySelectorAll("#concert .subtitle h3");
    subtitle.forEach(sub => {
      sub.style.top = `-1.2rem`;
    })
    setTimeout(() => {
      titleContainer.style.top = `${document.querySelector("#concert .carouselItem.active .thumbnail").offsetHeight+20}px`;
    }, 300);

    isActive = true;
  }

  function pauseTransition() {
    carousel.style.transition = "none";
    titleContainer.style.transition = "none";
    titleCarousel.style.transition = "none";
    carouselItems.forEach(item => item.style.transition = "none");
  }

  function resumeTransition() {
    setTimeout(() => {
      carousel.style.transition = "";
      titleContainer.style.transition = "";
      titleCarousel.style.transition = "";
      carouselItems.forEach(item => item.style.transition = "");
    }, 100);
  }

  function updateCurrentList() {
    const listItems = document.querySelectorAll("#concert .list li");
    listItems.forEach(li => li.classList.remove("active"));

    listItems.forEach(li => {
      if (parseInt(li.getAttribute("data-index")) === currentIndex) {
        li.classList.add("active");
      }
    });
  }
  
  function resetCarousel() {
    currentIndex = 0;
    carousel.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
  }
  
  menuBtns.forEach(menu => {
    menu.addEventListener("click", () => {
      deactivateCurrent();
      resetCarousel();
      updateCurrentSlide();
    });
  });

  carousel.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    isSwiping = true;
    currentX = NaN;
  });

  carousel.addEventListener("touchmove", (e) => {
    if (!isSwiping || isActive) return;
    currentX = e.touches[0].clientX;
  }, { passive: false });

  carousel.addEventListener("touchend", () => {
    if (isActive || !isSwiping) return;

    const deltaX = currentX - startX;

    if (deltaX < -50 && currentIndex < lastItem) {
      currentIndex++;
    } else if (deltaX > 50 && currentIndex > 0) {
      currentIndex--;
    }

    updateCurrentSlide();
    isSwiping = false;
  }, { passive: false });

  const thumbnails = document.querySelectorAll("#concert .thumbnail");
  thumbnails.forEach((thumbnail) => {
    thumbnail.addEventListener("click", () => {
      if (carousel.classList.contains("active")) {
        deactivateCurrent();
        updateCurrentSlide();
      } else {
        activateCurrent();
        updateCurrentList();
      }
    });
  });

  const listItems = document.querySelectorAll("#concert .list li");
  listItems.forEach(item => {
    item.addEventListener("click", function () {
      pauseTransition();

      carousel.scrollIntoView({ behavior: "smooth" });
      
      const listIndex = parseInt(this.getAttribute("data-index"));

      deactivateCurrent();
      currentIndex = listIndex;

      updateCurrentSlide();
      activateCurrent();
      updateCurrentList();
      resumeTransition();
    });
  });
});
