/* diretorio carousel JS simples e robusto */
/* seleciona container e cards */
const carousel = document.querySelector('.carousel');
const cardsNode = Array.from(carousel.querySelectorAll('.card'));
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

/* índice do card central: para três cards, vamos forçar o do meio (índice 1) como central
   se quiser que outro card seja central, altere para o índice desejado */
let centerIndex = Math.floor(cardsNode.length / 2); // para 3 cards = 1

// inicializa (coloca classes)
function render() {
  const total = cardsNode.length;

  // limpa estados
  cardsNode.forEach(c => {
    c.classList.remove('prev', 'active', 'next', 'extra-left', 'extra-right');
  });

  // Calcula índices relativos
  const prevIndex = (centerIndex - 1 + total) % total;
  const nextIndex = (centerIndex + 1) % total;

  // marca active/prev/next
  cardsNode[centerIndex].classList.add('active');
  cardsNode[prevIndex].classList.add('prev');
  cardsNode[nextIndex].classList.add('next');

  // marca extras (opcional) se houver mais de 3 cards
  if (total > 3) {
    let left2 = (centerIndex - 2 + total) % total;
    let right2 = (centerIndex + 2) % total;
    cardsNode[left2].classList.add('extra-left');
    cardsNode[right2].classList.add('extra-right');
  }
}

/* navegação */
function goNext() {
  centerIndex = (centerIndex + 1) % cardsNode.length;
  render();
}
function goPrev() {
  centerIndex = (centerIndex - 1 + cardsNode.length) % cardsNode.length;
  render();
}

/* eventos */
nextBtn.addEventListener('click', goNext);
prevBtn.addEventListener('click', goPrev);

/* Ativa keyboard arrows */
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') goNext();
  if (e.key === 'ArrowLeft') goPrev();
});

/* iniciar */
render();

// ---------------------- Conselheiros --------------------- //

// Seleciona todas as colunas
    const columns = document.querySelectorAll('.column');

    // Tenta carregar estado salvo no localStorage
    let state = {};
    try {
      const raw = localStorage.getItem('colsOpenState');
      state = raw ? JSON.parse(raw) : {};
    } catch (e) {
      state = {};
    }

    // Função para abrir/fechar com cálculo de altura para animação suave
    function setOpen(col, open) {
      const btn = col.querySelector('.toggle-btn');
      const wrap = col.querySelector('.list-wrap');

      if (open) {
        col.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        wrap.setAttribute('aria-hidden', 'false');

        // calcula a altura real do conteúdo (scrollHeight) e aplica
        const full = wrap.scrollHeight;
        wrap.style.maxHeight = full + 'px';
      } else {
        col.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        wrap.setAttribute('aria-hidden', 'true');

        // recolhe suavemente
        wrap.style.maxHeight = '0px';
      }
    }

    // Inicializa com estado salvo (se houver)
    columns.forEach(col => {
      const key = col.dataset.key;
      const btn = col.querySelector('.toggle-btn');
      const wrap = col.querySelector('.list-wrap');

      // aplica estado salvo
      const open = !!state[key];
      // Forçar recalcular depois de small delay (para garantir layout pronto)
      if (open) {
        // precisamos esperar o layout para que scrollHeight seja correto
        requestAnimationFrame(() => setOpen(col, true));
      } else {
        setOpen(col, false);
      }

      // listener do botão
      btn.addEventListener('click', () => {
        const isOpen = col.classList.toggle('open'); // toggle class
        setOpen(col, isOpen);

        // atualiza texto do botão opcionalmente (mantive texto fixo, pois vc quer o nome dentro do botão)
        // btn.textContent = isOpen ? 'Ocultar nomes' : 'Ver nomes';

        // salva estado
        state[key] = isOpen;
        try {
          localStorage.setItem('colsOpenState', JSON.stringify(state));
        } catch (e) {
          console.warn('Erro salvando localStorage', e);
        }

        // pequena correção: se abriu, redefine maxHeight para o valor real após transição (ajusta caso conteúdo mude)
        if (isOpen) {
          // após animação, remove maxHeight para permitir crescimento natural (opcional)
          setTimeout(() => {
            wrap.style.maxHeight = wrap.scrollHeight + 'px';
          }, 400);
        }
      });

      // Se a lista for redimensionada (ex: imagens carregam), atualizamos a altura se estiver aberta
      const ro = new ResizeObserver(() => {
        if (col.classList.contains('open')) {
          const wrap = col.querySelector('.list-wrap');
          wrap.style.maxHeight = wrap.scrollHeight + 'px';
        }
      });
      ro.observe(wrap);
    });

    