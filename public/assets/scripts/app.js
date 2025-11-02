// Dados internos (array de objetos) - você pediu para manter no app.js
const artistas = [
  {
    id: 1,
    nome: "Vincent van Gogh",
    descricao: "Conhecido por suas pinceladas expressivas e cores vibrantes.",
    imagem: "images/Vincent_van_Gogh.jpg",
    obras: [
      { titulo: "Noite Estrelada", imagem: "images/Starry_Night_.jpg" },
      { titulo: "Girassóis", imagem: "images/girassois.jpg" },
      { titulo: "Quarto em Arles", imagem: "images/quarto-arles.jpg" }
    ],
    descricaoCompleta: `Vincent van Gogh (1853–1890) foi um dos pintores mais influentes da história da arte ocidental.
    Nascido na Holanda, produziu mais de 2.000 obras em menos de dez anos, incluindo cerca de 900 pinturas.
    Conhecido por suas cores vibrantes e pinceladas intensas, obras como "Noite Estrelada" e
    "Os Girassóis" refletem sua genialidade e emoção. Apesar de enfrentar dificuldades pessoais e financeiras,
    sua obra se tornou referência e inspiração mundial após sua morte.`
  },
  {
    id: 2,
    nome: "Frida Kahlo",
    descricao: "Sua arte é marcada por cores intensas e autorretratos.",
    imagem: "images/Frida-Kahlo.jpg",
    obras: [
      { titulo: "Autorretrato com Colar de Espinhos", imagem: "images/frida_kahlo.jpg" },
      { titulo: "As Duas Fridas", imagem: "images/as-duas-fridas.jpg" },
      { titulo: "O Veado Ferido", imagem: "images/O_veado_ferido.jpg" }
    ],
    descricaoCompleta: `Frida Kahlo (1907–1954) foi uma das artistas mais icônicas do México.
    Sua obra é autobiográfica e profundamente simbólica, marcada por cores vibrantes, dor física e emocional.
    Após um acidente grave, Frida transformou seu sofrimento em arte e em lírica visual, explorando identidade,
    gênero e cultura mexicana. Tornou-se símbolo de força e autenticidade.`
  },
  {
    id: 3,
    nome: "Leonardo da Vinci",
    descricao: "Um gênio renascentista, criador da icônica Mona Lisa.",
    imagem: "images/leonardo-da-vinci.jpg",
    obras: [
      { titulo: "Mona Lisa", imagem: "images/mona-lisa.jpg" },
      { titulo: "A Última Ceia", imagem: "images/ultima-ceia.jpg" },
      { titulo: "Homem Vitruviano", imagem: "images/homem-vitruviano.jpg" }
    ],
    descricaoCompleta: `Leonardo da Vinci (1452–1519) foi o maior expoente do Renascimento italiano,
    notável por combinar arte e ciência. Pintor, inventor, engenheiro e anatomista, suas pinturas
    (como "Mona Lisa" e "A Última Ceia") e seus cadernos de estudo influenciam até hoje pelas técnicas
    e pela visão interdisciplinar da criação.`
  }
];

// Aguarda DOM carregado
document.addEventListener("DOMContentLoaded", () => {
  initIndex();   // tenta montar elementos da index (se estiver)
  initDetails(); // tenta montar detalhes (se estiver)
});

/* 
   Funções para index.html
  */

// Gera slider se existir container
function initIndex() {
  renderSlider();
  renderThumbnails();
  renderCards();
}

function renderSlider() {
  const sliderContainer = document.getElementById("sliderArtistas");
  if (!sliderContainer) return;

  sliderContainer.innerHTML = ""; // limpar antes
  artistas.forEach((artista, index) => {
    const slide = document.createElement("div");
    slide.className = `carousel-item ${index === 0 ? "active" : ""}`;
    slide.innerHTML = `
      <img src="${artista.imagem}" class="d-block w-100 rounded" alt="${escapeHtml(artista.nome)}">
      <div class="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded p-3">
        <h5>${escapeHtml(artista.nome)}</h5>
        <p class="mb-2">${escapeHtml(artista.descricao)}</p>
        <a href="detalhes.html?id=${artista.id}" class="btn btn-warning btn-sm">Ver Detalhes</a>
      </div>
    `;
    sliderContainer.appendChild(slide);
  });

  // Reinicia o carousel (caso seja necessário)
  const el = document.getElementById("carouselDestaque");
  if (el && window.bootstrap) {
    // eslint-disable-next-line no-undef
    new bootstrap.Carousel(el, { interval: 5000, ride: "carousel" });
  }
}

function renderThumbnails() {
  const miniaturasContainer = document.getElementById("miniaturasSlider");
  if (!miniaturasContainer) return;

  miniaturasContainer.innerHTML = "";
  artistas.forEach((artista, index) => {
    const thumb = document.createElement("img");
    thumb.src = artista.imagem;
    thumb.alt = artista.nome;
    thumb.className = "thumb-slide";
    thumb.width = 88;
    thumb.height = 60;
    thumb.style.cursor = "pointer";
    thumb.addEventListener("click", () => {
      const carouselEl = document.getElementById("carouselDestaque");
      if (carouselEl && window.bootstrap) {
        // eslint-disable-next-line no-undef
        const carousel = new bootstrap.Carousel(carouselEl);
        carousel.to(index);
      }
      // pequena rolagem para visibilidade do carousel em mobile
      const carouselTop = document.getElementById("carouselDestaque");
      if (carouselTop) carouselTop.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    miniaturasContainer.appendChild(thumb);
  });
}

function renderCards() {
  const cardsContainer = document.getElementById("cardsArtistas");
  if (!cardsContainer) return;

  cardsContainer.innerHTML = "";
  artistas.forEach(artista => {
    const col = document.createElement("div");
    col.className = "col-md-4 mb-4";
    col.innerHTML = `
      <div class="card h-100 shadow-sm hover-card">
        <img src="${artista.imagem}" class="card-img-top" alt="${escapeHtml(artista.nome)}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${escapeHtml(artista.nome)}</h5>
          <p class="card-text">${escapeHtml(artista.descricao)}</p>
          <a href="detalhes.html?id=${artista.id}" class="btn btn-warning mt-auto">Ver Detalhes</a>
        </div>
      </div>
    `;
    cardsContainer.appendChild(col);
  });
}

/* 
 Funções para detalhes.html
*/

function initDetails() {
  // só roda se estivermos na página de detalhes (detalhesArtista existe)
  const detalhesContainer = document.getElementById("detalhesArtista");
  if (!detalhesContainer) return;

  const galeriaContainer = document.getElementById("galeriaObras");
  if (!galeriaContainer) return;

  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"), 10);
  if (isNaN(id)) {
    detalhesContainer.innerHTML = `<p class="text-danger">ID do artista inválido.</p>`;
    return;
  }

  const artista = artistas.find(a => a.id === id);
  if (!artista) {
    detalhesContainer.innerHTML = `<p class="text-warning">Artista não encontrado.</p>`;
    return;
  }

  // Preenche informações do artista
  detalhesContainer.innerHTML = `
    <div class="row align-items-center">
      <div class="col-md-4 text-center mb-3">
        <img src="${artista.imagem}" alt="${escapeHtml(artista.nome)}" class="img-fluid rounded shadow-sm" style="max-width:320px;">
      </div>
      <div class="col-md-8">
        <h2>${escapeHtml(artista.nome)}</h2>
        <p>${escapeHtml(artista.descricaoCompleta || artista.descricao)}</p>
        <ul>
          <li><strong>Total de Obras:</strong> ${artista.obras.length}</li>
        </ul>
      </div>
    </div>
  `;

  // Preenche galeria de obras
  galeriaContainer.innerHTML = "";
  artista.obras.forEach(obra => {
    const col = document.createElement("div");
    col.className = "col-md-4 mb-3";
    col.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${obra.imagem}" class="card-img-top" alt="${escapeHtml(obra.titulo)}">
        <div class="card-body text-center">
          <h5 class="card-title">${escapeHtml(obra.titulo)}</h5>
        </div>
      </div>
    `;
    galeriaContainer.appendChild(col);
  });
}
function escapeHtml(text) {
  if (!text && text !== 0) return "";
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}