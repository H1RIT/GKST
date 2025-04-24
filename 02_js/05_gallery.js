document.addEventListener("DOMContentLoaded", function () {
  const gallery = document.querySelector("#gallery");
  const carousels = document.querySelectorAll("#gallery .carousel");
  const carouselWrap = document.querySelector("#gallery .carouselWrap");
  const year = document.querySelectorAll("#gallery .year span");
  const carouselContainer = document.querySelector("#gallery .carouselContainer");
  const titleCarouselWrap = document.querySelector("#gallery .titleCarouselWrap");

  const windowWidth = window.innerWidth;
  const containerHeight = (windowWidth - 140) * 2 / 3;
  carouselContainer.style.height = `${containerHeight}px`;

  let isSwipingX, isSwipingY, isActive = false;
  let startX, startY, deltaX, deltaY;
  let currentX, currentY = NaN;
  let currentIndexes = Array.from(carousels, () => 0);
  let currentCarouselIndex = 0;
  let currentPhotoIndex = 0;

  function resetSlides() {
    carousels.forEach((carousel, index) => {
      simulateSwipe(carousel);
      
      const carouselItems = carousel.querySelectorAll(".carouselItem");
      const itemWidth = (windowWidth * 0.8) - 100;

      currentIndexes[index] = 0;

      carousel.style.transform = `translateX(0px)`;
      carouselItems.forEach((item, index) => {
        item.style.width = index === 0 ? `${windowWidth - 100}px` : `${itemWidth}px`;
        item.style.padding = index === 0 ? `0 20px` : `10px 20px`;
      });
    });

    updateTitle();
  };

  function updateTitle() {
    const titleCarousels = titleCarouselWrap.querySelectorAll(".titleCarousel");
  
    titleCarousels.forEach((titleCarousel, index) => {
      titleCarousel.style.top = `-${currentCarouselIndex * 6}rem`;
      titleCarousel.querySelectorAll(".title").forEach((title) => {
        title.style.top = `-${currentIndexes[index] * 6}rem`;
      });
    });
  };

  carousels.forEach((carousel, carouselIndex) => {
    const carouselItems = carousel.querySelectorAll(".carouselItem");
    const lastItem = carouselItems.length - 1;
    const itemWidth = (windowWidth * 0.8) - 100;
    const currentItemWidth = windowWidth - 100;

    function updateCurrentSlide() {
      const currentIndex = currentIndexes[carouselIndex];
      carousel.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
      carouselItems.forEach((item, index) => {
        if (index === currentIndex) {
          item.style.width = `${currentItemWidth}px`;
          item.style.padding = `0 20px`;
        } else {
          item.style.width = `${itemWidth}px`;
          item.style.padding = `10px 20px`;
        }
      });
    }

    carousel.addEventListener("mousedown", (e) => {
      startX = e.clientX;
      startY = e.clientY;
      isSwipingX = false;
    });

    carousel.addEventListener("mousemove", (e) => {
      currentX = e.clientX;
      currentY = e.clientY;

      deltaX = currentX - startX;
      deltaY = currentY - startY;

      if (Math.abs(deltaX) > 30 && Math.abs(deltaX) > Math.abs(deltaY)) {
        isSwipingX = true;
      }
    }, { passive: false });

    carousel.addEventListener("mouseup", (e) => {
      if (!isSwipingX) return;
      if (isActive) return;

      const currentIndex = currentIndexes[carouselIndex];

      if (deltaX < -30 && currentIndex < lastItem) {
        currentIndexes[carouselIndex]++;
      } else if (deltaX > 30 && currentIndex > 0) {
        currentIndexes[carouselIndex]--;
      }

      updateCurrentSlide();
      updateTitle();

      setTimeout(() => {
        isSwipingX = false;
      }, 300);
    });

    updateCurrentSlide();

    carouselItems.forEach(item => {
      const photoContainer = item.querySelector(".photoContainer");
      const photos = photoContainer.querySelectorAll("img");
      const scrollbar = item.querySelector(".scrollbar");

      function resetPhotos() {
        photos.forEach(photo => {
          photo.style.left = `-${currentPhotoIndex * windowWidth}px`
        })
      };

      function deactivateCurrent() {
        isActive = false;
        currentPhotoIndex = 0;
        resetPhotos();
        updateCurrentSlide();
        item.classList.remove("active");
        item.style.top = "";
        item.style.marginLeft = "";
        gallery.style.background = "";
        carouselContainer.style.aspectRatio = "auto";
        carouselContainer.style.height = `${containerHeight}px`;
        carouselContainer.style.top = "";
        carouselContainer.style.overflow = "hidden";
        carousels.forEach(otherCarousel => {
          otherCarousel.style.display = "";
        });
        carouselItems.forEach(otherItem => {
          otherItem.style.transition = "";
          otherItem.style.visibility = "";
          otherItem.style.opacity = "";
        });
        scrollbar.style.display = "none";
        titleCarouselWrap.style.visibility = "";
        titleCarouselWrap.style.opacity = "";
      };
    
      function activateCurrent() {
        isActive = true;
        carousels.forEach(otherCarousel => {
          if (otherCarousel !== carousel) {
            otherCarousel.style.display = "none";
          }
        });
        carouselItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.style.transition = "none";
            otherItem.style.visibility = "hidden";
            otherItem.style.opacity = "0";
          }
        });
        if (currentIndexes[carouselIndex] !== 0) {
          item.style.marginLeft = "-30px"
        }
        item.classList.add("active");
        item.style.width = "";
        item.style.padding = "";
        item.style.top = `${currentCarouselIndex * containerHeight}px`;
        gallery.style.background = "#000";
        carouselContainer.style.aspectRatio = "3/2";
        carouselContainer.style.height = "";      
        carouselContainer.style.top = "35%";
        carouselContainer.style.overflow = "visible";
        scrollbar.style.display = "flex";
        titleCarouselWrap.style.visibility = "hidden"
        titleCarouselWrap.style.opacity = "0";
      };
      
      function resetCarousel() {
        currentIndexes[carouselIndex] = 0;
        currentCarouselIndex = 0;
        carouselWrap.style.top = `-${currentCarouselIndex * containerHeight}px`;
      }
      
      menuBtns.forEach(menu => {
        menu.addEventListener("click", () => {
          resetCarousel();
          deactivateCurrent();
        });
      });

      item.addEventListener("click", () => {
        scrollbarUpdate();
        if (item.classList.contains("active")) {
          deactivateCurrent();
          turnBlack();
        } else {
          activateCurrent();
          turnWhite();
        }
      });

      item.addEventListener("mousedown", (e) => {
        startX = e.clientX;
      });
    
      item.addEventListener("mousemove", (e) => {
        currentX = e.clientX;
      }, { passive: false });
    
      item.addEventListener("mouseup", (e) => {
        if(!isActive) return;

        const totalPhotos = photos.length;
        
        if (currentX - startX < -30 && currentPhotoIndex < totalPhotos - 1) {
          currentPhotoIndex++;
        } else if (currentX - startX > 30 && currentPhotoIndex > 0) {
          currentPhotoIndex--;
        }
        resetPhotos();
        scrollbarUpdate();
      });

      function scrollbarUpdate() {
        const targetIndex = currentPhotoIndex * 6;
      
        scrollbar.querySelectorAll("span").forEach((span, index) => {
          if (index === targetIndex) {
            span.style.height = "40px";
          } else if (index === targetIndex - 1 || index === targetIndex + 1) {
            span.style.height = `${Math.floor(Math.random() * 11) + 20}px`;
          } else if (index === targetIndex - 2 || index === targetIndex + 2) {
            span.style.height = `${Math.floor(Math.random() * 11) + 15}px`;
          } else if (index === targetIndex - 3 || index === targetIndex + 3) {
            span.style.height = `${Math.floor(Math.random() * 11) + 10}px`;
          } else {
            span.style.height = `${Math.floor(Math.random() * 6) + 3}px`;
          }
        });
      }
    });
  });

  gallery.addEventListener("mousedown", (e) => {
    if (isSwipingX) return;

    startY = e.clientY;

    isSwipingY = false;
  });

  gallery.addEventListener("mousemove", (e) => {
    if (isSwipingX) return;

    currentY = e.clientY;

    if (Math.abs(deltaY) > 30 && Math.abs(deltaX) < Math.abs(deltaY)) {
      isSwipingY = true;
    }
  }, { passive: false });

  gallery.addEventListener("mouseup", (e) => {
    if (isSwipingX) return;
    if (!isSwipingY) return;
    if (isActive) return;

    const lastCarouselIndex = carousels.length - 1;

    if (deltaY < -30 && currentCarouselIndex < lastCarouselIndex) {
      currentCarouselIndex++;
    } else if (deltaY > 30 && currentCarouselIndex > 0) {
      currentCarouselIndex--;
    }

    if (currentCarouselIndex == 0) {
      document.querySelector(".arrow .up").style.opacity = "0";
      document.querySelector(".arrow .down").style.opacity = "1";
    } else if (currentCarouselIndex == lastCarouselIndex) {
      document.querySelector(".arrow .down").style.opacity = "0";
      document.querySelector(".arrow .up").style.opacity = "1";
    } else {
      document.querySelector(".arrow .down").style.opacity = "1";
      document.querySelector(".arrow .up").style.opacity = "1";
    }

    carouselWrap.style.top = `-${currentCarouselIndex * containerHeight}px`;
    year.forEach(span => {
      span.style.top = `-${currentCarouselIndex * 100}%`;
    });
  
    updateTitle();
    setTimeout(resetSlides, 300);
  });
});
