
    /* ===== Filtros de categoria ===== */
    const cats = document.querySelectorAll('.cat');
    const cards = Array.from(document.querySelectorAll('.card'));
    function setActiveCat(el) {
      cats.forEach(c => c.classList.remove('active'));
      el.classList.add('active');
      filterCategory(el.dataset.cat);
    }

    function filterCategory(cat) {
      if (cat === 'all') {
        cards.forEach(c => c.style.display = '');
      } else {
        cards.forEach(c => {
          c.dataset.category === cat ? c.style.display = '' : c.style.display = 'none';
        });
      }
      // rolagem suave para grade
      document.getElementById('productGrid').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    document.getElementById('viewAll').addEventListener('click', () => {
      document.querySelector('.cat[data-cat="all"]').click();
    });

    /* ===== Busca simples (filtra por título) ===== */
    document.getElementById('searchInput').addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (!q) { cards.forEach(c => c.style.display = ''); return; }
      cards.forEach(c => {
        const title = c.dataset.title.toLowerCase();
        const desc = (c.dataset.desc || '').toLowerCase();
        const match = title.includes(q) || desc.includes(q);
        c.style.display = match ? '' : 'none';
      });
    });

    /* ===== Modal (zoom ao clicar) ===== */
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');
    const modalPrice = document.getElementById('modalPrice');
    const modalDesc = document.getElementById('modalDesc');

    function openModal(card) {
      const img = card.querySelector('.card-visual img').src;
      const title = card.dataset.title || card.querySelector('.product-title').innerText;
      const price = card.dataset.price || card.querySelector('.price').innerText;
      const desc = card.dataset.desc || card.querySelector('.product-desc').innerText;

      modalImg.src = img;
      modalTitle.textContent = title;
      modalPrice.textContent = price;
      modalDesc.textContent = desc;

      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');

      // fechar com ESC
      document.addEventListener('keydown', escClose);
    }
    function closeModal() {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.removeEventListener('keydown', escClose);
    }
    function escClose(e) { if (e.key === 'Escape') closeModal(); }

    // fechar ao clicar fora do card
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    /* ===== Funções demo ===== */
    function checkout() { alert('Simulação: levar para checkout'); }
    function share() { alert('Simulação: compartilhar produto'); }

    /* ===== Inicial: mostrar todos ===== */
    document.querySelector('.cat[data-cat="all"]').click();
