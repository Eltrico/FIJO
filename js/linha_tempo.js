// Linha do Tempo 
(function() {
  // Seleciona as bolinhas (círculos) da timeline
  const timelineCircles = Array.from(document.querySelectorAll('.timeline .circle'));

  // Imagens demo (opcional) para trocar ao clicar - ajuste conforme desejar
  const demoImgs = [
    'https://via.placeholder.com/110/884400/ffffff?text=ALT1',
    'https://via.placeholder.com/110/004488/ffffff?text=ALT2',
    'https://via.placeholder.com/110/ccaa00/ffffff?text=ALT3'
  ];
  let demoIndex = 0;

  // Função pública chamada pelo onclick inline: openYear(year, element)
  window.openYear = function(year, clickedElement) {
    // Visual: destacar a bolinha clicada
    timelineCircles.forEach(c => c.classList.remove('active'));
    if (clickedElement) clickedElement.classList.add('active');

    // (Opcional) alterna a imagem de fundo do círculo como demonstração
    if (clickedElement && demoImgs.length) {
      clickedElement.style.backgroundImage = `url("${demoImgs[demoIndex % demoImgs.length]}")`;
      demoIndex++;
    }

    // Chama a função que navega o carrossel (definida no arquivo do carrossel).
    // Se navigateToYearHistory não existir, apenas logamos.
    if (typeof navigateToYearHistory === 'function') {
      navigateToYearHistory(Number(year));
    } else {
      console.warn('navigateToYearHistory(year) não encontrado. Verifique o script do carrossel.');
    }
  };

  // Também adicionamos listeners programáticos (redundante se você já usa onclick inline)
  timelineCircles.forEach(circle => {
    circle.addEventListener('click', () => {
      const y = Number(circle.getAttribute('data-year'));
      // chama a mesma função
      window.openYear(y, circle);
    });
  });
})();

// Linha do Tempo Carrossel

(function() {
  const carouselRoot = document.querySelector('.timeline-container');
  const carouselElement = document.querySelector('.timeline-carousel');
  const slides = Array.from(document.querySelectorAll('.timeline-carousel .slide'));
  const prevBtn = document.querySelector('.timeline-container .prev');
  const nextBtn = document.querySelector('.timeline-container .next');
  const mobileYearBox = document.querySelector('.mobile-year-box');

  if (!slides.length) {
    console.warn('Nenhum slide encontrado em .timeline-carousel .slide');
    return;
  }

  let currentIndex = 0;

  // Mostra o slide i (normaliza índice)
  function showSlide(i) {
    currentIndex = ((i % slides.length) + slides.length) % slides.length;

    slides.forEach((s, idx) => {
      if (idx === currentIndex) s.classList.add('active');
      else s.classList.remove('active');
    });

    if (mobileYearBox) {
      const yearText = slides[currentIndex].querySelector('.year').innerText;
      mobileYearBox.textContent = yearText;
    }

    // opcional: destacar o dot interno do slide
    const innerDots = document.querySelectorAll('.timeline-carousel .line-area .dot');
    innerDots.forEach((d, idx)=> {
      if (idx === currentIndex) d.classList.add('active');
      else d.classList.remove('active');
    });
  }

  // Prev / Next
  function goNext() { showSlide(currentIndex + 1); }
  function goPrev() { showSlide(currentIndex - 1); }

  if (nextBtn) nextBtn.addEventListener('click', goNext);
  if (prevBtn) prevBtn.addEventListener('click', goPrev);

  // Garante que strings com diferentes traços sejam normalizadas
  function normalizeRangeText(raw) {
    if (!raw) return '';
    // substitui en-dash/em-dash/minus por hífen simples, e remove espaços extras
    return raw.replace(/\u2013|\u2014|\u2212/g, '-').replace(/\s+/g, ' ').trim();
  }

  // Extrai números úteis de um texto (retorna NaN se não for número)
  function extractYearNumber(str) {
    if (!str) return NaN;
    const digits = str.replace(/[^\d]/g, '');
    return digits ? parseInt(digits, 10) : NaN;
  }

  // Função principal: navega para o slide que **começa** no ano pedido.
  // Lógica:
  // 1) tenta encontrar um slide cujo "startYear" === year (startYear = primeiro número no .year)
  // 2) se não encontrar, tenta slides cujo intervalo inclua o ano (start <= year <= end)
  // 3) se ainda não encontrar, escolhe o slide cujo startYear é o mais próximo acima do year
  // 4) fallback: slide 0
  window.navigateToYearHistory = function(year) {
    year = Number(year);
    if (isNaN(year)) {
      console.warn('navigateToYearHistory recebeu ano inválido:', year);
      return;
    }

    let candidateIndex = -1;
    let candidateRangeIndex = -1;
    let nearestAboveIndex = -1;
    let nearestAboveYear = Infinity;

    slides.forEach((slide, idx) => {
      const yearNode = slide.querySelector('.year');
      if (!yearNode) return;
      let raw = normalizeRangeText(yearNode.innerText);
      // Se existir um hífen -> é um intervalo
      if (raw.includes('-')) {
        const parts = raw.split('-').map(p => p.trim());
        const start = extractYearNumber(parts[0]);
        const end = extractYearNumber(parts[1]);
        if (!isNaN(start) && !isNaN(end)) {
          // 1) start === year?
          if (start === year && candidateIndex === -1) {
            candidateIndex = idx;
          }
          // 2) ano dentro do período?
          if (year >= start && year <= end && candidateRangeIndex === -1) {
            candidateRangeIndex = idx;
          }
          // 3) candidato para nearest above (start >= year)
          if (start >= year && start < nearestAboveYear) {
            nearestAboveYear = start;
            nearestAboveIndex = idx;
          }
        }
      } else {
        // ano único
        const only = extractYearNumber(raw);
        if (!isNaN(only)) {
          if (only === year && candidateIndex === -1) {
            candidateIndex = idx;
          }
          if (only >= year && only < nearestAboveYear) {
            nearestAboveYear = only;
            nearestAboveIndex = idx;
          }
        }
      }
    });

    // Decide qual índice usar (prioridade)
    let targetIndex = 0;
    if (candidateIndex !== -1) targetIndex = candidateIndex;
    else if (candidateRangeIndex !== -1) targetIndex = candidateRangeIndex;
    else if (nearestAboveIndex !== -1) targetIndex = nearestAboveIndex;
    else targetIndex = 0;

    // Mostra o slide encontrado
    showSlide(targetIndex);

    // Scroll suave para o carrossel
    if (carouselElement) {
      carouselElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Inicializa
  showSlide(currentIndex);

  // Navegação por teclado (opcional)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') goNext();
    if (e.key === 'ArrowLeft') goPrev();
  });
})();