
function PublicPages() {
  const [pages, setPages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    fetchCategories();
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchPages();
    // eslint-disable-next-line
  }, [searchTerm, selectedCategory, tagFilter]);

  async function fetchCategories() {
    try {
      const response = await api.get('/categories?type=page');
      setCategories(response.data);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  }

  async function fetchPages() {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory) params.append('category', selectedCategory);
      if (tagFilter) params.append('tag', tagFilter);
      const response = await api.get(`/pages/public?${params.toString()}`);
      setPages(response.data);
    } catch (error) {
      console.error('Erro ao carregar páginas:', error);
    }
    setLoading(false);
  }

  function generateSlug(title, id) {
    return (
      title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        + '-' + id
    );
  }

  const hasActiveFilters = searchTerm || selectedCategory || tagFilter;

  if (loading) {
    return (
      <div className="public-pages-loading">
        <div className="public-pages-loading-box">
          <div className="public-pages-spinner"></div>
          <p className="public-pages-loading-text">Carregando páginas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="public-pages-container">
      <div className="public-pages-header">
        <h1 className="public-pages-title">
          <BookOpen className="public-pages-title-icon" size={isMobile ? 40 : 56} />
          Páginas
        </h1>
        <p className="public-pages-subtitle">Base de conhecimento e documentação</p>
        <Link to="/" className="public-pages-back-btn">
          <ArrowRight size={18} className="public-pages-back-icon" />
          Voltar ao início
        </Link>
      </div>
      <div className="public-pages-filters">
        <div className="public-pages-searchbar">
          <Search size={20} className="public-pages-search-icon" />
          <input
            type="text"
            placeholder="Buscar por título ou conteúdo..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="public-pages-search-input"
          />
        </div>
        <div className="public-pages-filters-bar">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`public-pages-toggle-filters${showFilters ? ' active' : ''}`}
          >
            <Filter size={16} />
            {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
          </button>
          {hasActiveFilters && (
            <button onClick={() => { setSearchTerm(''); setSelectedCategory(''); setTagFilter(''); }} className="public-pages-clear-filters">
              <X size={16} />
              Limpar Filtros
            </button>
          )}
        </div>
        {showFilters && (
          <div className="public-pages-filters-grid">
            <div>
              <label className="public-pages-filter-label">Categoria</label>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="public-pages-category-select"
              >
                <option value="">Todas as categorias</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <label className="public-pages-filter-label" style={{marginTop: '1rem'}}>Tag</label>
              <div style={{ position: 'relative' }}>
                <Tag size={16} className="public-pages-search-icon" />
                <input
                  type="text"
                  placeholder="Digite uma tag..."
                  value={tagFilter}
                  onChange={e => setTagFilter(e.target.value)}
                  className="public-pages-tag-input"
                />
              </div>
            </div>
          </div>
        )}
        {hasActiveFilters && (
          <div className="public-pages-active-filters">
            <div className="public-pages-active-filters-title">Filtros ativos:</div>
            <div className="public-pages-active-filters-list">
              {searchTerm && <span className="public-pages-active-filter">Busca: "{searchTerm}"</span>}
              {selectedCategory && <span className="public-pages-active-filter">Categoria: {categories.find(c => c.id == selectedCategory)?.name}</span>}
              {tagFilter && <span className="public-pages-active-filter">Tag: #{tagFilter}</span>}
            </div>
          </div>
        )}
      </div>
      {pages.length > 0 && (
        <div className="public-pages-results-counter">
          <strong>{pages.length}</strong> {pages.length === 1 ? 'página encontrada' : 'páginas encontradas'}
          {hasActiveFilters && ' com os filtros aplicados'}
        </div>
      )}
      <main className="public-pages-main">
        {pages.length > 0 ? (
          <div className="public-pages-grid">
            {pages.map(page => (
              <article key={page.id} className="public-pages-article">
                {page.category_name && (
                  <div className="public-pages-category-badge">
                    <span>{page.category_name}</span>
                  </div>
                )}
                <h2 className="public-pages-article-title">
                  <Link to={`/${page.slug || generateSlug(page.title, page.id)}`} className="public-pages-article-link">
                    {page.title}
                  </Link>
                </h2>
                <p className="public-pages-article-summary">
                  {getDisplaySummary(page.summary, page.content, 250)}
                </p>
                {page.tags && (
                  <div className="public-pages-tags">
                    {page.tags.split(',').map((tag, index) => (
                      <span key={index} className="public-pages-tag">#{tag.trim()}</span>
                    ))}
                  </div>
                )}
                <Link to={`/${page.slug || generateSlug(page.title, page.id)}`} className="public-pages-read-btn">
                  <BookOpen size={16} />
                  Ler página completa
                </Link>
                <div className="public-pages-article-meta">
                  <span className="public-pages-article-author">
                    <User size={14} className="public-pages-author-icon" />
                    {page.author_name}
                  </span>
                  <span className="public-pages-article-date">
                    <Calendar size={14} className="public-pages-date-icon" />
                    {new Date(page.updated_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="public-pages-empty">
            <FileText size={64} className="public-pages-empty-icon" />
            <h2 className="public-pages-empty-title">
              {hasActiveFilters ? 'Nenhuma página encontrada' : 'Nenhuma página disponível'}
            </h2>
            <p className="public-pages-empty-text">
              {hasActiveFilters
                ? 'Tente ajustar os filtros de busca para encontrar mais resultados.'
                : 'Ainda não há páginas publicadas.'}
            </p>
            {hasActiveFilters && (
              <button onClick={() => { setSearchTerm(''); setSelectedCategory(''); setTagFilter(''); }} className="public-pages-empty-clear-btn">
                Limpar todos os filtros
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default PublicPages;
