// script.js

document.addEventListener('DOMContentLoaded', () => {

    // --- CONFIGURACIÓN Y ESTADO INICIAL ---
    // LA VARIABLE 'API_KEY' AHORA VIENE DEL ARCHIVO config.js
    const API_BASE_URL = 'https://api.themoviedb.org/3';
    const IMG_BASE_URL = 'https://image.tmdb.org/t/p/';

    const SCREENS = {
        plans: document.getElementById('plan-selection-screen'),
        payment: document.getElementById('payment-screen'),
        profiles: document.getElementById('profile-selection-screen'),
        main: document.getElementById('main-app-screen'),
    };

    const PAGES = {
        home: document.getElementById('home-page'),
        catalog: document.getElementById('catalog-page'),
        myList: document.getElementById('my-list-page'),
        settings: document.getElementById('settings-page')
    };

    const detailModal = new bootstrap.Modal(document.getElementById('detail-modal'));

    let appState = {
        subscription: { plan: null, price: null, active: false },
        profiles: [
            { id: 1, name: 'Anakin', avatar: 'https://i.pravatar.cc/150?u=anakin' },
            { id: 2, name: 'Leia', avatar: 'https://i.pravatar.cc/150?u=leia' },
            { id: 3, name: 'Niños', avatar: 'https://i.pravatar.cc/150?u=kids' },
        ],
        activeProfile: null,
        myList: [],
        likes: [],
        filters: { genre: '', year: '', type: 'movie', page: 1 }
    };

    // --- MANEJO DEL ESTADO (localStorage) ---
    function loadState() { try { const savedState = localStorage.getItem('netfluxState'); if (savedState) { appState = JSON.parse(savedState); } } catch (error) { console.error("Error al cargar estado:", error); } }
    function saveState() { try { localStorage.setItem('netfluxState', JSON.stringify(appState)); } catch (error) { console.error("Error al guardar estado:", error); } }

    // --- NAVEGACIÓN Y ROUTING SIMULADO ---
    function showScreen(screenName) { Object.values(SCREENS).forEach(screen => screen.classList.add('d-none')); if (SCREENS[screenName]) { SCREENS[screenName].classList.remove('d-none'); } }
    function showPage(pageName) { Object.values(PAGES).forEach(page => page.classList.add('d-none')); if (PAGES[pageName]) { PAGES[pageName].classList.remove('d-none'); } document.querySelectorAll('.navbar-nav .nav-link').forEach(link => { link.classList.remove('active'); if(link.dataset.page === pageName || (pageName === 'home' && link.textContent === 'Inicio')) { link.classList.add('active'); } }); }

    // --- LÓGICA DE LA API TMDB ---
    async function fetchTMDB(endpoint, params = {}) {
        const url = new URL(`${API_BASE_URL}/${endpoint}`);
        url.searchParams.append('api_key', API_KEY);
        url.searchParams.append('language', 'es-ES');
        // ✅ AHORA PEDIMOS LOS VIDEOS EN INGLÉS COMO RESPALDO SI NO HAY EN ESPAÑOL
        url.searchParams.append('include_video_language', 'es,en');
        for (const key in params) { url.searchParams.append(key, params[key]); }
        try { const response = await fetch(url); if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`); return await response.json(); } catch (error) { console.error(`Error fetching ${endpoint}:`, error); return null; }
    }
    
    // --- RENDERIZADO DE COMPONENTES ---
    function renderPlanSelection() { const planCards = document.querySelectorAll('.plan-card'); const chooseBtn = document.getElementById('choose-plan-btn'); planCards.forEach(card => { card.addEventListener('click', () => { planCards.forEach(c => c.classList.remove('selected')); card.classList.add('selected'); appState.subscription.plan = card.dataset.plan; appState.subscription.price = card.dataset.price; chooseBtn.disabled = false; }); }); chooseBtn.addEventListener('click', () => { if (appState.subscription.plan) { saveState(); showScreen('payment'); } }); }
    function renderPayment() { document.getElementById('payment-form').addEventListener('submit', (e) => { e.preventDefault(); const btn = e.target.querySelector('button[type="submit"]'); btn.disabled = true; btn.innerHTML = `<span class="spinner-border spinner-border-sm"></span> Procesando...`; setTimeout(() => { appState.subscription.active = true; saveState(); renderProfileSelection(); showScreen('profiles'); }, 1500); }); }
    function renderProfileSelection() { const container = document.getElementById('profiles-container'); container.innerHTML = ''; appState.profiles.forEach(profile => { const profileEl = document.createElement('div'); profileEl.className = 'profile-card'; profileEl.innerHTML = `<img src="${profile.avatar}" alt="${profile.name}" class="profile-avatar"><p class="profile-name">${profile.name}</p>`; profileEl.addEventListener('click', () => { appState.activeProfile = profile; saveState(); initializeAppInterface(); showScreen('main'); }); container.appendChild(profileEl); }); if (appState.profiles.length < 5) { const addProfileEl = document.createElement('div'); addProfileEl.className = 'profile-card add-profile-card'; addProfileEl.innerHTML = `<div class="profile-avatar">+</div><p class="profile-name">Añadir perfil</p>`; addProfileEl.addEventListener('click', () => { const name = prompt("Nombre del nuevo perfil:"); if (name) { const newProfile = { id: Date.now(), name, avatar: `https://i.pravatar.cc/150?u=${Date.now()}` }; appState.profiles.push(newProfile); saveState(); renderProfileSelection(); } }); container.appendChild(addProfileEl); } }
    async function initializeAppInterface() { document.getElementById('profile-avatar-nav').src = appState.activeProfile.avatar; const navbar = document.getElementById('navbar'); window.onscroll = () => { window.scrollY > 50 ? navbar.classList.add('navbar-scrolled') : navbar.classList.remove('navbar-scrolled'); }; await Promise.all([ renderHero(), renderCarousels(), renderGenresDropdown(), renderCatalogFilters() ]); setupEventListeners(); }
    function createSkeletonCards(count = 10) { let skeletons = ''; for (let i = 0; i < count; i++) { skeletons += `<div class="movie-card"><div class="skeleton skeleton-card"></div></div>`; } return `<div class="movie-carousel">${skeletons}</div>`; }
    async function renderHero() { const heroSection = document.getElementById('hero-section'); const heroContent = heroSection.querySelector('.hero-content-wrapper'); const skeleton = heroSection.querySelector('.skeleton-hero'); const data = await fetchTMDB('trending/all/week'); if (!data || !data.results.length) return; const featured = data.results[0]; skeleton.classList.add('d-none'); heroContent.classList.remove('d-none'); heroSection.style.backgroundImage = `url(${IMG_BASE_URL}original${featured.backdrop_path})`; document.getElementById('hero-title').textContent = featured.title || featured.name; document.getElementById('hero-description').textContent = featured.overview.length > 200 ? featured.overview.substring(0, 200) + '...' : featured.overview; document.getElementById('hero-rating').innerHTML = `<i class="bi bi-star-fill text-warning"></i> ${featured.vote_average.toFixed(1)}`; const heroInfoBtn = document.getElementById('hero-info-btn'); heroInfoBtn.dataset.mediaId = featured.id; heroInfoBtn.dataset.mediaType = featured.media_type; document.getElementById('hero-play-btn').onclick = () => openDetailModal(featured.id, featured.media_type, true); }
    function createMovieCard(item) { const isInList = appState.myList.some(m => m.id === item.id); const isLiked = appState.likes.some(m => m.id === item.id); const mediaType = item.media_type || (item.title ? 'movie' : 'tv'); return `
                <div class="movie-card" data-media-id="${item.id}" data-media-type="${mediaType}">
                    <img src="${item.poster_path ? IMG_BASE_URL + 'w500' + item.poster_path : 'https://via.placeholder.com/200x300'}" alt="${item.title || item.name}" loading="lazy">
                    <div class="movie-card-info">
                        <h6 class="text-white text-truncate">${item.title || item.name}</h6>
                        <div class="d-flex justify-content-between align-items-center"><small class="text-muted">${(item.release_date || item.first_air_date || '').substring(0, 4)}</small><small><i class="bi bi-star-fill text-warning"></i> ${item.vote_average.toFixed(1)}</small></div>
                        <div class="card-buttons d-flex gap-2 mt-2">
                           <button class="btn btn-sm" data-action="play" title="Reproducir"><i class="bi bi-play-fill"></i></button>
                           <button class="btn btn-sm" data-action="add-list" title="Añadir a Mi Lista"><i class="bi ${isInList ? 'bi-check-lg' : 'bi-plus-lg'}"></i></button>
                           <button class="btn btn-sm" data-action="like" title="Me gusta"><i class="bi ${isLiked ? 'bi-heart-fill text-danger' : 'bi-heart'}"></i></button>
                           <button class="btn btn-sm" data-action="details" title="Más información"><i class="bi bi-info-circle"></i></button>
                        </div>
                    </div>
                </div>`; }
    async function renderCarousels() { const container = document.getElementById('category-sections'); container.innerHTML = ''; const categories = [ { title: 'Populares en Cineflix', endpoint: 'movie/popular' }, { title: 'Series de TV Aclamadas', endpoint: 'tv/top_rated' }, { title: 'Próximos Estrenos', endpoint: 'movie/upcoming' }, { title: 'Tendencias de la Semana', endpoint: 'trending/all/week' }]; for (const category of categories) { const row = document.createElement('div'); row.className = 'category-row'; row.innerHTML = `<h3 class="category-title">${category.title}</h3>`; const carouselContainer = document.createElement('div'); carouselContainer.innerHTML = createSkeletonCards(); row.appendChild(carouselContainer); container.appendChild(row); const data = await fetchTMDB(category.endpoint); if (data && data.results) { const carousel = document.createElement('div'); carousel.className = 'movie-carousel'; carousel.innerHTML = data.results.map(createMovieCard).join(''); carouselContainer.innerHTML = ''; carouselContainer.appendChild(carousel); } } }
    async function renderGenresDropdown() { const dropdown = document.getElementById('genres-dropdown'); const data = await fetchTMDB('genre/movie/list'); if(data && data.genres) { dropdown.innerHTML = data.genres.map(genre => `<li><a class="dropdown-item" href="#" data-page="catalog" data-filter="genre" data-genre-id="${genre.id}">${genre.name}</a></li>`).join(''); } }
    
    // ✅ FUNCIÓN DE MODAL ARREGLADA Y MEJORADA
    async function openDetailModal(mediaId, mediaType, play = false) {
        const loader = document.getElementById('modal-content-loader');
        const contentContainer = document.getElementById('modal-content-container');
        
        loader.classList.remove('d-none');
        contentContainer.classList.add('d-none');
        detailModal.show();
        
        // Hacemos dos llamadas: una para los detalles, otra para los videos. Es más fiable.
        const [details, videosResponse] = await Promise.all([
            fetchTMDB(`${mediaType}/${mediaId}`),
            fetchTMDB(`${mediaType}/${mediaId}/videos`)
        ]);

        if (!details) {
            detailModal.hide();
            return;
        }

        const videos = videosResponse?.results || [];
        
        // Búsqueda de tráiler más insistente
        const trailer = 
            videos.find(v => v.type === 'Trailer' && v.iso_639_1 === 'es' && v.site === 'YouTube') || // Trailer oficial en español
            videos.find(v => v.type === 'Trailer' && v.site === 'YouTube') || // Trailer oficial en cualquier idioma
            videos.find(v => v.type === 'Teaser' && v.site === 'YouTube') || // Teaser si no hay trailer
            videos.find(v => v.site === 'YouTube'); // Cualquier video de YouTube si no hay nada más

        document.getElementById('modal-backdrop').src = details.backdrop_path ? `${IMG_BASE_URL}original${details.backdrop_path}` : 'https://via.placeholder.com/800x450';
        document.getElementById('modal-title').textContent = details.title || details.name;
        document.getElementById('modal-overview').textContent = details.overview || "No hay sinopsis disponible.";
        document.getElementById('modal-year').textContent = (details.release_date || details.first_air_date || 'N/A').substring(0, 4);
        document.getElementById('modal-runtime').textContent = details.runtime ? `${details.runtime} min` : (details.number_of_seasons ? `${details.number_of_seasons} temp.` : 'N/A');
        document.getElementById('modal-language').textContent = details.original_language.toUpperCase();
        document.getElementById('modal-genres').innerHTML = details.genres.map(g => `<span class="badge bg-danger">${g.name}</span>`).join(' ');

        const trailerContainer = document.getElementById('modal-trailer-container');
        if (trailer) {
            trailerContainer.innerHTML = `<iframe src="https://www.youtube.com/embed/${trailer.key}?autoplay=${play ? 1 : 0}&controls=1&rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
            trailerContainer.style.display = 'block';
        } else {
            // Si después de todo no se encuentra, busca en YouTube con el título
            const youtubeSearchUrl = `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(details.title || details.name + ' trailer español')}`;
            trailerContainer.innerHTML = `<iframe src="${youtubeSearchUrl}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
            trailerContainer.style.display = 'block';
            console.log(`No se encontró tráiler oficial, mostrando búsqueda en YouTube para: "${details.title || details.name}"`);
        }
        
        const addListBtn = document.getElementById('modal-add-list-btn');
        const likeBtn = document.getElementById('modal-like-btn');
        addListBtn.dataset.mediaId = details.id;
        addListBtn.dataset.mediaType = mediaType;
        likeBtn.dataset.mediaId = details.id;
        likeBtn.dataset.mediaType = mediaType;

        updateActionButtons(details.id, addListBtn, likeBtn);

        loader.classList.add('d-none');
        contentContainer.classList.remove('d-none');
        
        document.getElementById('detail-modal').addEventListener('hidden.bs.modal', () => {
             trailerContainer.innerHTML = '';
        }, { once: true });
    }

    async function renderCatalog(page = 1) { const grid = document.getElementById('catalog-grid'); grid.innerHTML = createSkeletonCards(20); appState.filters.page = page; const params = { page: appState.filters.page }; if (appState.filters.genre) params.with_genres = appState.filters.genre; if (appState.filters.year) params.primary_release_year = appState.filters.year; const data = await fetchTMDB(`discover/${appState.filters.type}`, params); if (data && data.results) { grid.innerHTML = data.results.map(createMovieCard).join(''); renderPagination(data.page, data.total_pages); } else { grid.innerHTML = '<p class="text-center">No se encontraron resultados.</p>'; } saveState(); }
    function renderPagination(currentPage, totalPages) { const container = document.getElementById('catalog-pagination'); container.innerHTML = ''; const maxPagesToShow = 5; let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2)); let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1); if(endPage - startPage < maxPagesToShow - 1) { startPage = Math.max(1, endPage - maxPagesToShow + 1); } const ul = document.createElement('ul'); ul.className = 'pagination'; ul.innerHTML += `<li class="page-item ${currentPage === 1 ? 'disabled' : ''}"><a class="page-link" href="#" data-page="${currentPage - 1}">Anterior</a></li>`; for (let i = startPage; i <= endPage; i++) { ul.innerHTML += `<li class="page-item ${i === currentPage ? 'active' : ''}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`; } ul.innerHTML += `<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}"><a class="page-link" href="#" data-page="${currentPage + 1}">Siguiente</a></li>`; container.appendChild(ul); }
    async function renderCatalogFilters() { const genreSelect = document.getElementById('catalog-genre-filter'); const genreData = await fetchTMDB(`genre/${appState.filters.type}/list`); genreSelect.innerHTML = '<option value="">Todos los géneros</option>'; if(genreData && genreData.genres) { genreSelect.innerHTML += genreData.genres.map(g => `<option value="${g.id}">${g.name}</option>`).join(''); } genreSelect.value = appState.filters.genre; const yearSelect = document.getElementById('catalog-year-filter'); const currentYear = new Date().getFullYear(); yearSelect.innerHTML = '<option value="">Todos los años</option>'; for(let y = currentYear; y >= 1950; y--) { yearSelect.innerHTML += `<option value="${y}">${y}</option>`; } yearSelect.value = appState.filters.year; document.getElementById('catalog-type-filter').value = appState.filters.type; }
    function renderMyListPage() { const grid = document.getElementById('my-list-grid'); if (appState.myList.length > 0) { grid.innerHTML = appState.myList.map(createMovieCard).join(''); } else { grid.innerHTML = '<p class="text-center col-12">Tu lista está vacía.</p>'; } }
    function renderSettingsPage() { document.getElementById('settings-email').textContent = `${appState.activeProfile.name.toLowerCase().replace(/\s/g, '')}@cineflix.demo`; document.getElementById('settings-plan').textContent = `${appState.subscription.plan} (${appState.subscription.price} €/mes)`; const container = document.getElementById('settings-profiles-container'); container.innerHTML = appState.profiles.map(profile => `<div class="card bg-dark border-secondary"><div class="card-body d-flex align-items-center justify-content-between"><div class="d-flex align-items-center gap-3"><img src="${profile.avatar}" class="rounded" width="60" height="60" style="object-fit: cover;"> <h5 class="mb-0">${profile.name}</h5></div><div><button class="btn btn-sm btn-outline-primary" onclick="alert('Función de editar no implementada.')">Editar</button> <button class="btn btn-sm btn-outline-danger" onclick="alert('Función de eliminar no implementada.')">Eliminar</button></div></div></div>`).join(''); }
    let searchTimeout; async function handleSearch(query) { const resultsContainer = document.getElementById('search-results'); if (query.length < 3) { resultsContainer.innerHTML = ''; return; } const data = await fetchTMDB('search/multi', { query }); if (data && data.results) { resultsContainer.innerHTML = data.results.filter(r => r.media_type !== 'person' && r.poster_path).slice(0, 5).map(item => `<a href="#" class="list-group-item list-group-item-action d-flex gap-3 py-2 search-result-item" data-media-id="${item.id}" data-media-type="${item.media_type}"><img src="${IMG_BASE_URL}w92${item.poster_path}" width="40" height="60" class="rounded-1" alt="..."><div class="d-flex gap-2 w-100 justify-content-between"><div><h6 class="mb-0">${item.title || item.name}</h6><p class="mb-0 opacity-75">${(item.release_date || item.first_air_date || '').substring(0, 4)}</p></div></div></a>`).join(''); } }
    function setupEventListeners() { document.getElementById('main-app-screen').addEventListener('click', (e) => { const target = e.target; const card = target.closest('.movie-card'); const actionBtn = target.closest('[data-action]'); const pageLink = target.closest('[data-page]'); const searchResult = target.closest('.search-result-item'); const paginationLink = target.closest('.page-link[data-page]'); if (actionBtn) { e.stopPropagation(); const action = actionBtn.dataset.action; const mediaId = parseInt(card.dataset.mediaId); const mediaType = card.dataset.mediaType; switch (action) { case 'play': openDetailModal(mediaId, mediaType, true); break; case 'add-list': case 'like': toggleListItem(mediaId, action === 'like' ? 'likes' : 'myList', actionBtn.querySelector('i')); break; case 'details': openDetailModal(mediaId, mediaType); break; } } else if (card) { openDetailModal(parseInt(card.dataset.mediaId), card.dataset.mediaType); } if (pageLink) { e.preventDefault(); const page = pageLink.dataset.page; if (page === 'catalog') { const filter = pageLink.dataset.filter; if (filter === 'genre') { appState.filters.genre = pageLink.dataset.genreId; document.getElementById('catalog-genre-filter').value = appState.filters.genre; } renderCatalog(1); showPage('catalog'); } else if (page === 'my-list') { renderMyListPage(); showPage('myList'); } else if (page === 'home') { showPage('home'); } } if (searchResult) { e.preventDefault(); openDetailModal(parseInt(searchResult.dataset.mediaId), searchResult.dataset.mediaType); document.getElementById('search-input').value = ''; document.getElementById('search-results').innerHTML = ''; } if (paginationLink && !paginationLink.parentElement.classList.contains('disabled')) { e.preventDefault(); renderCatalog(parseInt(paginationLink.dataset.page)); } }); document.getElementById('hero-info-btn').addEventListener('click', function() { const mediaId = this.dataset.mediaId; const mediaType = this.dataset.mediaType; if (mediaId && mediaType) { openDetailModal(parseInt(mediaId), mediaType); } }); document.getElementById('modal-add-list-btn').addEventListener('click', function() { toggleListItem(parseInt(this.dataset.mediaId), 'myList', this); }); document.getElementById('modal-like-btn').addEventListener('click', function() { toggleListItem(parseInt(this.dataset.mediaId), 'likes', this); }); document.getElementById('logout-btn').addEventListener('click', (e) => { e.preventDefault(); appState.activeProfile = null; saveState(); renderProfileSelection(); showScreen('profiles'); }); document.getElementById('settings-link').addEventListener('click', (e) => { e.preventDefault(); renderSettingsPage(); showPage('settings'); }); const searchInput = document.getElementById('search-input'); searchInput.addEventListener('input', () => { clearTimeout(searchTimeout); searchTimeout = setTimeout(() => { handleSearch(searchInput.value); }, 300); }); document.getElementById('catalog-genre-filter').addEventListener('change', (e) => { appState.filters.genre = e.target.value; renderCatalog(1); }); document.getElementById('catalog-year-filter').addEventListener('change', (e) => { appState.filters.year = e.target.value; renderCatalog(1); }); document.getElementById('catalog-type-filter').addEventListener('change', async (e) => { appState.filters.type = e.target.value; await renderCatalogFilters(); renderCatalog(1); }); document.getElementById('reset-filters-btn').addEventListener('click', () => { appState.filters.genre = ''; appState.filters.year = ''; appState.filters.type = 'movie'; renderCatalogFilters(); renderCatalog(1); }); }
    async function toggleListItem(mediaId, listType, button) { const list = appState[listType]; const itemIndex = list.findIndex(item => item.id === mediaId); if (itemIndex > -1) { list.splice(itemIndex, 1); } else { const mediaType = button.dataset.mediaType || (await findMediaType(mediaId)); if (mediaType) { const details = await fetchTMDB(`${mediaType}/${mediaId}`); if (details) { list.push({ id: details.id, poster_path: details.poster_path, title: details.title || details.name, name: details.name, vote_average: details.vote_average, release_date: details.release_date || details.first_air_date, media_type: mediaType }); } } } saveState(); if(button.tagName.toLowerCase() === 'button') { updateActionButtons(mediaId, listType === 'myList' ? button : document.querySelector(`#modal-add-list-btn[data-media-id="${mediaId}"]`), listType === 'likes' ? button : document.querySelector(`#modal-like-btn[data-media-id="${mediaId}"]`) ); } else { const isInList = appState.myList.some(m => m.id === mediaId); const isLiked = appState.likes.some(m => m.id === mediaId); const addListIcon = document.querySelector(`.movie-card[data-media-id="${mediaId}"] [data-action="add-list"] i`); if(addListIcon) addListIcon.className = `bi ${isInList ? 'bi-check-lg' : 'bi-plus-lg'}`; const likeIcon = document.querySelector(`.movie-card[data-media-id="${mediaId}"] [data-action="like"] i`); if(likeIcon) likeIcon.className = `bi ${isLiked ? 'bi-heart-fill text-danger' : 'bi-heart'}`; } }
    async function findMediaType(mediaId) { let details = await fetchTMDB(`movie/${mediaId}`); if (details && details.id) return 'movie'; details = await fetchTMDB(`tv/${mediaId}`); if (details && details.id) return 'tv'; return null; }
    function updateActionButtons(mediaId, addListBtn, likeBtn) { if (!addListBtn || !likeBtn) return; const isInList = appState.myList.some(m => m.id === mediaId); const isLiked = appState.likes.some(m => m.id === mediaId); addListBtn.innerHTML = `<i class="bi ${isInList ? 'bi-check-lg' : 'bi-plus-lg'}"></i>`; likeBtn.innerHTML = `<i class="bi ${isLiked ? 'bi-heart-fill text-danger' : 'bi-heart'}"></i>`; }
    
    function init() {
        loadState();
        if (!appState.subscription.active) {
            renderPlanSelection();
            renderPayment();
            showScreen('plans');
        } else if (!appState.activeProfile) {
            renderProfileSelection();
            showScreen('profiles');
        } else {
            initializeAppInterface();
            showScreen('main');
            showPage('home');
        }
    }

    init();
});