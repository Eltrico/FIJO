const slides = document.querySelectorAll(".slide");
const slidesContainer = document.querySelector(".slides");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");
const dots = document.querySelectorAll(".dot");

let index = 0;
let intervalTime = 5000;
let autoSlide;
  
function showSlide(i) {
  index = (i + slides.length) % slides.length;
  slidesContainer.style.transform = `translateX(-${index * 100}%)`;

  // Atualiza as bolinhas
  dots.forEach(dot => dot.classList.remove("active"));
  dots[index].classList.add("active");
}

nextBtn.addEventListener("click", () => {
  showSlide(index + 1);
  resetAutoSlide();
});

prevBtn.addEventListener("click", () => {
  showSlide(index - 1);
  resetAutoSlide();
});

// Clique direto nas bolinhas
dots.forEach(dot =>
  dot.addEventListener("click", () => {
    const slideIndex = Number(dot.dataset.index);
    showSlide(slideIndex);
    resetAutoSlide();
  })
);

function startAutoSlide() {
  autoSlide = setInterval(() => {
    showSlide(index + 1);
  }, intervalTime);
}

function resetAutoSlide() {
  clearInterval(autoSlide);
  startAutoSlide();
}

startAutoSlide();


