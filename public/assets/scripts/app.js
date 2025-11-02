// URL base da API JSON Server
const API_BASE = "http://localhost:3000";
const RESOURCE = "artists"; // endpoint: /artists

document.addEventListener("DOMContentLoaded", () => {
  // Inicializa conforme os elementos presentes na página
  if (document.getElementById("sliderArtistas")) initIndex();
  if (document.getElementById("detalhesArtista")) initDetails();
  if (document.getElementById("formCadastro")) initCadastro();
});

/* ---------------------------
   Funções para index.html
   --------------------------- */
async function initIndex() {
  try {
    const artistas = await apiGetAll();
    renderSlider(artistas);
    renderThumbnails(artistas);
    renderCards(artistas);
  } catch (err) {
    console.error("Erro ao carregar artistas:", err);
    const container = document.getElementById("cardsArtistas");
    if (container) container.innerHTML = `<p class="text-danger">Erro ao carregar dados. Verifique se o JSON Server está rodando.</p>`;
  }
}

function renderSlider(artistas) {
  const sliderContainer = document.getElementById("sliderArtistas");
  if (!sliderContainer) return;
  sliderContainer.innerHTML = "";
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

  const el = document.getElementById("carouselDestaque");
  if (el && window.bootstrap) {
    // eslint-disable-next-line no-undef
    new bootstrap.Carousel(el, { interval: 5000, ride: "carousel" });
  }
}

function renderThumbnails(artistas) {
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
      const carouselTop = document.getElementById("carouselDestaque");
      if (carouselTop) carouselTop.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    miniaturasContainer.appendChild(thumb);
  });
}

function renderCards(artistas) {
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

/* ---------------------------
   Funções para detalhes.html
   --------------------------- */
async function initDetails() {
  const detalhesContainer = document.getElementById("detalhesArtista");
  if (!detalhesContainer) return;

  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"), 10);
  if (isNaN(id)) {
    detalhesContainer.innerHTML = `<p class="text-danger">ID do artista inválido.</p>`;
    return;
  }

  try {
    const artista = await apiGetById(id);
    if (!artista) {
      detalhesContainer.innerHTML = `<p class="text-warning">Artista não encontrado.</p>`;
      return;
    }
    renderDetalhes(artista);
    renderGaleria(artista);
  } catch (err) {
    console.error(err);
    detalhesContainer.innerHTML = `<p class="text-danger">Erro ao buscar detalhes. Verifique o servidor.</p>`;
  }
}

function renderDetalhes(artista) {
  const detalhesContainer = document.getElementById("detalhesArtista");
  detalhesContainer.innerHTML = `
    <div class="row align-items-center">
      <div class="col-md-4 text-center mb-3">
        <img src="${artista.imagem}" alt="${escapeHtml(artista.nome)}" class="img-fluid rounded shadow-sm" style="max-width:320px;">
      </div>
      <div class="col-md-8">
        <h2 id="nomeArtista">${escapeHtml(artista.nome)}</h2>
        <p id="descricaoCompleta">${escapeHtml(artista.descricaoCompleta || artista.descricao)}</p>
        <ul>
          <li><strong>Total de Obras:</strong> ${artista.obras ? artista.obras.length : 0}</li>
        </ul>

        <div class="mt-3">
          <button id="btnEditar" class="btn btn-outline-primary btn-sm me-2">Editar</button>
          <button id="btnExcluir" class="btn btn-outline-danger btn-sm">Excluir</button>
          <a href="cadastro_artista.html" class="btn btn-success btn-sm ms-2">+ Novo Artista</a>
        </div>

        <div id="editArea" class="mt-3" style="display:none;">
          <h5>Editar artista</h5>
          <form id="formEditar">
            <div class="mb-2">
              <input id="editNome" class="form-control" required />
            </div>
            <div class="mb-2">
              <input id="editDescricao" class="form-control" required />
            </div>
            <div class="mb-2">
              <input id="editImagem" class="form-control" required />
            </div>
            <div class="mb-2">
              <textarea id="editDescricaoCompleta" class="form-control" rows="3"></textarea>
            </div>
            <div class="d-flex gap-2">
              <button type="submit" class="btn btn-primary btn-sm">Salvar</button>
              <button id="cancelEdit" type="button" class="btn btn-secondary btn-sm">Cancelar</button>
            </div>
          </form>
          <div id="editFeedback" class="mt-2"></div>
        </div>

      </div>
    </div>
  `;

  // eventos de editar/excluir
  document.getElementById("btnEditar").addEventListener("click", () => {
    toggleEditForm(true, artista);
  });
  document.getElementById("btnExcluir").addEventListener("click", () => {
    if (confirm(`Deseja realmente excluir "${artista.nome}"?`)) {
      apiDelete(artista.id).then(() => {
        alert("Artista excluído. Voltando para a home.");
        window.location.href = "index.html";
      }).catch(err => {
        console.error(err);
        alert("Erro ao excluir. Veja console.");
      });
    }
  });
}

function renderGaleria(artista) {
  const galeriaContainer = document.getElementById("galeriaObras");
  if (!galeriaContainer) return;
  galeriaContainer.innerHTML = "";
  const obras = artista.obras || [];
  obras.forEach(obra => {
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

/* Edit form handlers */
function toggleEditForm(show, artista) {
  const area = document.getElementById("editArea");
  if (!area) return;
  area.style.display = show ? "block" : "none";
  if (!show) return;

  // preencher campos
  document.getElementById("editNome").value = artista.nome || "";
  document.getElementById("editDescricao").value = artista.descricao || "";
  document.getElementById("editImagem").value = artista.imagem || "";
  document.getElementById("editDescricaoCompleta").value = artista.descricaoCompleta || "";

  document.getElementById("cancelEdit").onclick = () => toggleEditForm(false);

  document.getElementById("formEditar").onsubmit = async (e) => {
    e.preventDefault();
    const updated = {
      ...artista,
      nome: document.getElementById("editNome").value.trim(),
      descricao: document.getElementById("editDescricao").value.trim(),
      imagem: document.getElementById("editImagem").value.trim(),
      descricaoCompleta: document.getElementById("editDescricaoCompleta").value.trim()
    };
    try {
      await apiPut(artista.id, updated);
      document.getElementById("editFeedback").innerHTML = `<div class="text-success">Alterado com sucesso. Recarregando...</div>`;
      setTimeout(() => window.location.reload(), 800);
    } catch (err) {
      console.error(err);
      document.getElementById("editFeedback").innerHTML = `<div class="text-danger">Erro ao salvar.</div>`;
    }
  };
}

/* ---------------------------
   Funções para cadastro
   --------------------------- */
function initCadastro() {
  const form = document.getElementById("formCadastro");
  const feedback = document.getElementById("feedback");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nome = document.getElementById("nome").value.trim();
    const descricao = document.getElementById("descricao").value.trim();
    const imagem = document.getElementById("imagem").value.trim();
    const descricaoCompleta = document.getElementById("descricaoCompleta").value.trim();
    const obrasText = document.getElementById("obras").value.trim();

    // validação simples
    if (!nome || !descricao || !imagem) {
      feedback.innerHTML = `<div class="text-danger">Preencha nome, descrição e imagem.</div>`;
      return;
    }

    const obras = parseObrasText(obrasText);

    const novo = { nome, descricao, imagem, descricaoCompleta, obras };

    try {
      const created = await apiPost(novo);
      feedback.innerHTML = `<div class="text-success">Artista cadastrado com sucesso! Redirecionando...</div>`;
      setTimeout(() => window.location.href = `detalhes.html?id=${created.id}`, 900);
    } catch (err) {
      console.error(err);
      feedback.innerHTML = `<div class="text-danger">Erro ao cadastrar. Verifique o servidor.</div>`;
    }
  });
}

function parseObrasText(text) {
  if (!text) return [];
  return text.split("\n")
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      const parts = line.split("|").map(p => p.trim());
      return { titulo: parts[0] || "Untitled", imagem: parts[1] || "images/placeholder.jpg" };
    });
}

/* ---------------------------
   Funções HTTP (Fetch wrappers)
   --------------------------- */

async function apiGetAll() {
  const res = await fetch(`${API_BASE}/${RESOURCE}`);
  if (!res.ok) throw new Error("GET all falhou");
  return res.json();
}

async function apiGetById(id) {
  const res = await fetch(`${API_BASE}/${RESOURCE}/${id}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("GET by id falhou");
  return res.json();
}

async function apiPost(payload) {
  const res = await fetch(`${API_BASE}/${RESOURCE}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("POST falhou");
  return res.json();
}

async function apiPut(id, payload) {
  const res = await fetch(`${API_BASE}/${RESOURCE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("PUT falhou");
  return res.json();
}

async function apiDelete(id) {
  const res = await fetch(`${API_BASE}/${RESOURCE}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("DELETE falhou");
  return true;
}

/* ---------------------------
   Utilitários
   --------------------------- */
function escapeHtml(text) {
  if (!text && text !== 0) return "";
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}