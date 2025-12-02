// Script para abas interativas
  const buttons = document.querySelectorAll('.tab-button');
  const contents = document.querySelectorAll('.tab-content');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active das abas e botões
      buttons.forEach(b => b.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));

      // Ativa a aba clicada
      btn.classList.add('active');
      document.getElementById(btn.dataset.target).classList.add('active');
    });
  });