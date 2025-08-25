import Database from './database.js';

const db = Database.getDb();

function seed() {
  // Categorias exemplo
  db.run(`INSERT OR IGNORE INTO categories (id, name, slug, color, type, sort_order) VALUES
    (1, 'Serviços', 'servicos', '#6366f1', 'pages', 1),
    (2, 'Sobre', 'sobre', '#60a5fa', 'pages', 2),
    (3, 'Blog', 'blog', '#f59e42', 'blog', 1)
  `);

  // Usuário admin exemplo (senha: admin123)
  db.run(`INSERT OR IGNORE INTO users (id, name, email, password, role) VALUES
    (1, 'Administrador', 'admin@demo.com', '$2a$10$MtEaOWWElBOuBjkpdfSmyOafzb3IheF4Slmr3L9pw6Oty2xeRhL5.', 'admin')
  `);

  // Página exemplo
  db.run(`INSERT OR IGNORE INTO pages (id, title, slug, summary, content, status, author_id, category_id, template_id) VALUES
    (1, 'Serviços', 'servicos', 'Conheça os serviços do SmyrnaCMS', '<p>O <b>SmyrnaCMS</b> oferece uma plataforma moderna, flexível e minimalista para gerenciar conteúdos, páginas e blogs de forma simples e eficiente.</p>', 'published', 1, 1, 1),
    (2, 'Sobre', 'sobre', 'Sobre o SmyrnaCMS', '<p>O <b>SmyrnaCMS</b> é um CMS open source focado em produtividade, experiência de edição e facilidade de customização. Ideal para sites institucionais, blogs e portais de conteúdo.</p>', 'published', 1, 2, 1)
  `);

  // Post exemplo
  db.run(`INSERT OR IGNORE INTO posts (id, title, slug, summary, content, status, author_id, category_id) VALUES
    (1, 'Bem-vindo ao SmyrnaCMS', 'bem-vindo-smyrnacms', 'Primeiro post do SmyrnaCMS', '<p>Este é um post de exemplo criado automaticamente para demonstração do <b>SmyrnaCMS</b>. Edite, exclua ou crie novos conteúdos pelo painel administrativo.</p>', 'published', 1, 3)
  `);
}

export default seed;
