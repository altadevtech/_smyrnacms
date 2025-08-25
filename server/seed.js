import Database from './database.js';

const db = Database.getDb();

function seed() {
  // Categorias exemplo
  db.run(`INSERT OR IGNORE INTO categories (id, name, slug, color, type, sort_order) VALUES
    (1, 'Serviços', 'servicos', '#6366f1', 'pages', 1),
    (2, 'Sobre', 'sobre', '#60a5fa', 'pages', 2),
    (3, 'Blog', 'blog', '#f59e42', 'blog', 1)
  `);

  // Usuário admin exemplo
  db.run(`INSERT OR IGNORE INTO users (id, name, email, password, role) VALUES
    (1, 'Administrador', 'admin@demo.com', '$2b$10$Qw8Qw8Qw8Qw8Qw8Qw8Qw8eQw8Qw8Qw8Qw8Qw8Qw8Qw8Qw8Qw8Qw8', 'admin')
  `);

  // Página exemplo
  db.run(`INSERT OR IGNORE INTO pages (id, title, slug, summary, content, status, author_id, category_id, template_id) VALUES
    (1, 'Serviços', 'servicos', 'Página de serviços', '<p>Exemplo de conteúdo de serviços.</p>', 'published', 1, 1, 1),
    (2, 'Sobre', 'sobre', 'Página sobre a empresa', '<p>Exemplo de conteúdo sobre.</p>', 'published', 1, 2, 1)
  `);

  // Post exemplo
  db.run(`INSERT OR IGNORE INTO posts (id, title, slug, summary, content, status, author_id, category_id) VALUES
    (1, 'Primeiro Post', 'primeiro-post', 'Resumo do post', '<p>Conteúdo do post de exemplo.</p>', 'published', 1, 3)
  `);
}

export default seed;
