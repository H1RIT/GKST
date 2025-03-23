document.addEventListener("DOMContentLoaded", function () {
  let startX = 0;
  let currentX = 0;
  let isSwiping = false;
  let isActive = false;
  let currentIndex = 0;

  const windowWidth = window.innerWidth;
  const carousel = document.querySelector("#discography .carousel");
  const carouselItems = document.querySelectorAll("#discography .carouselItem");
  const lastItem = carouselItems.length - 1;

  const titleContainer = document.querySelector("#discography .titleContainer");
  const titleCarousel = document.querySelector("#discography .titleCarousel");

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

    isActive = true;
  }

  function pauseTransition() {
    carousel.style.transition = "none";
    titleCarousel.style.transition = "none";
    carouselItems.forEach(item => item.style.transition = "none");
  }

  function resumeTransition() {
    setTimeout(() => {
      carousel.style.transition = "";
      titleCarousel.style.transition = "";
      carouselItems.forEach(item => item.style.transition = "");
    }, 100);
  }

  function updateCurrentList() {
    const listItems = document.querySelectorAll("#discography .list li");
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

  const thumbnails = document.querySelectorAll("#discography .thumbnail");
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

  const streamBtn = document.querySelectorAll("#discography .streamIcons .tab")
  streamBtn.forEach(button => {
    button.addEventListener("click", () => {
      button.style.opacity = 1;
      
      setTimeout(function() {
        button.style.opacity = 0;
      }, 300);
    });
  });

  const moreBtn = document.querySelectorAll("#discography .moreBtn");
  moreBtn.forEach(button => {
    button.addEventListener("click", () => {
      const textbox = button.nextElementSibling;
      const isOpen = textbox.classList.contains("active");
      const arrow = button.querySelector("img");
      const arrows = document.querySelectorAll("#discography .moreBtn img");
      const allTextboxes = document.querySelectorAll("#discography .textbox");

      arrows.forEach(arrow => {
        arrow.style.transform = "rotate(0)";
      });

      allTextboxes.forEach(box => {
        box.style.maxHeight = "0";
        box.style.padding = "0";
        box.classList.remove("active");
      });

      if (!isOpen) {
        textbox.classList.add("active");
        textbox.style.maxHeight = textbox.scrollHeight + 40 + "px";
        textbox.style.padding = "20px 0";
        arrow.style.transform = "rotate(180deg)";
      }
    });
  });

  const listItems = document.querySelectorAll("#discography .list li");
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
