import './PublicPage.css';

const PublicPage = () => {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    fetchPage();
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [slug]);

  const fetchPage = async () => {
    try {
      const response = await api.get(`/pages/public/${slug}`);
      setPage(response.data);
    } catch (error) {
      setError('Página não encontrada');
      console.error('Erro ao carregar página:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="public-page-loading">
        <div className="public-page-loading-box">
          <div className="public-page-spinner"></div>
          <p className="public-page-loading-text">Carregando página...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="public-page-error">
        <div className="public-page-error-box">
          <div className="public-page-error-icon">📄</div>
          <h1 className="public-page-error-title">404 - Página não encontrada</h1>
          <p className="public-page-error-text">{error}. A página que você está procurando pode ter sido removida ou não existe.</p>
          <Link to="/" className="public-page-error-btn">
            <Home size={18} />
            Voltar ao início
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="public-page-wrapper">
      <header className="public-page-header">
        <nav className="public-page-breadcrumbs">
          <Link to="/" className="public-page-breadcrumb-link">
            <Home size={18} />
            Início
          </Link>
          <span className="public-page-breadcrumb-sep">•</span>
          <Link to="/pages" className="public-page-breadcrumb-link">
            Páginas
          </Link>
          <span className="public-page-breadcrumb-sep">•</span>
          <span className="public-page-breadcrumb-current">{page.title}</span>
        </nav>
      </header>
      <article className="public-page-article">
        <header className="public-page-article-header">
          <div className="public-page-category-badge">
            <Tag size={14} className="public-page-category-icon" />
            Páginas
          </div>
          <h1 className="public-page-title">{page.title}</h1>
          <div className="public-page-meta">
            <span className="public-page-meta-item">
              <User size={16} /> Por {page.author_name}
            </span>
            <span className="public-page-meta-item">
              <Calendar size={16} /> {new Date(page.updated_at).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <span className="public-page-meta-item">
              <BookOpen size={16} /> Página
            </span>
          </div>
        </header>
        <div className="public-page-content">
          <ContentRenderer content={page.content} />
        </div>
        <footer className="public-page-footer">
          <div className="public-page-footer-meta">
            <Clock size={16} /> Última atualização: {new Date(page.updated_at).toLocaleDateString('pt-BR')}
          </div>
          <Link to="/pages" className="public-page-footer-btn">
            <BookOpen size={16} />
            Ver todas as páginas
          </Link>
        </footer>
      </article>
    </div>
  );
};

export default PublicPage;
