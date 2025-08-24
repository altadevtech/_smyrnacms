import express from 'express'
import Database from '../database.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Buscar post público por SLUG
router.get('/public/slug/:slug', (req, res) => {
  const { slug } = req.params;
  const db = Database.getDb();
  db.get(
    `SELECT p.*, u.name as author_name, c.name as category_name, c.slug as category_slug, c.color as category_color 
     FROM posts p 
     JOIN users u ON p.author_id = u.id 
     LEFT JOIN categories c ON p.category_id = c.id 
     WHERE p.slug = ? AND p.status = 'published'`,
    [slug],
    (err, post) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao buscar post por slug' });
      }
      if (!post) {
        return res.status(404).json({ message: 'Post não encontrado' });
      }
      console.log('🔎 [GET /public/slug/:slug] Conteúdo retornado:', { slug, content: post.content });
      res.json(post);
    }
  );
});

// Listar posts públicos (sem autenticação)
router.get('/public', (req, res) => {
  const db = Database.getDb()
  
  db.all(
    `SELECT p.id, p.title, p.slug, p.summary, p.content, p.featured_image, p.created_at, p.updated_at, 
            u.name as author_name, c.name as category_name, c.slug as category_slug, c.color as category_color 
     FROM posts p 
     JOIN users u ON p.author_id = u.id 
     LEFT JOIN categories c ON p.category_id = c.id 
     WHERE p.status = 'published' 
     ORDER BY p.created_at DESC 
     LIMIT 10`,
    (err, posts) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao buscar posts' })
      }
      res.json(posts)
    }
  )
})

// Buscar post público por ID (temporário - sem funcionalidade de slug)
router.get('/public/:id', (req, res) => {
  const { id } = req.params
  const db = Database.getDb()
  
  // Buscar apenas por ID (funcionalidade temporária sem slug)
  db.get(
    `SELECT p.*, u.name as author_name, c.name as category_name, c.slug as category_slug, c.color as category_color 
     FROM posts p 
     JOIN users u ON p.author_id = u.id 
     LEFT JOIN categories c ON p.category_id = c.id 
     WHERE p.id = ? AND p.status = 'published'`,
    [id],
    (err, post) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao buscar post' })
      }
      
      if (!post) {
        return res.status(404).json({ message: 'Post não encontrado' })
      }
      
      res.json(post)
    }
  )
})

// Endpoint público para posts recentes
router.get('/recent', (req, res) => {
  const db = Database.getDb()
  const { limit = 10 } = req.query
  
  db.all(
    `SELECT p.id, p.title, p.slug, p.summary, p.featured_image, p.created_at, p.updated_at, 
            u.name as author_name, c.name as category_name, c.slug as category_slug, c.color as category_color 
     FROM posts p 
     JOIN users u ON p.author_id = u.id 
     LEFT JOIN categories c ON p.category_id = c.id AND c.type = 'blog'
     WHERE p.status = 'published' 
     ORDER BY p.created_at DESC 
     LIMIT ?`,
    [parseInt(limit)],
    (err, posts) => {
      if (err) {
        console.error('Erro ao buscar posts recentes:', err)
        return res.status(500).json({ message: 'Erro ao buscar posts recentes' })
      }
      res.json(posts)
    }
  )
})

// Todas as rotas abaixo necessitam autenticação
router.use(authenticateToken)

// Listar posts (admin/editor)
router.get('/', (req, res) => {
  const db = Database.getDb()
  
  db.all(
    `SELECT p.id, p.title, p.content, p.status, p.created_at, p.updated_at, 
            u.name as author_name, c.name as category_name, c.slug as category_slug, c.color as category_color 
     FROM posts p 
     JOIN users u ON p.author_id = u.id 
     LEFT JOIN categories c ON p.category_id = c.id 
     ORDER BY p.created_at DESC`,
    (err, posts) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao buscar posts' })
      }
      res.json(posts)
    }
  )
})

// Buscar post específico
router.get('/:id', (req, res) => {
  const { id } = req.params
  const db = Database.getDb()
  
  db.get(
    `SELECT p.*, u.name as author_name, c.name as category_name, c.slug as category_slug, c.color as category_color 
     FROM posts p 
     JOIN users u ON p.author_id = u.id 
     LEFT JOIN categories c ON p.category_id = c.id 
     WHERE p.id = ?`,
    [id],
    (err, post) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao buscar post' })
      }
      
      if (!post) {
        return res.status(404).json({ message: 'Post não encontrado' })
      }
      
      res.json(post)
    }
  )
})

// Criar post
router.post('/', (req, res) => {
  console.log('📝 Tentativa de criar post:', req.body)
  console.log('👤 Usuário autenticado:', req.user)
  
  const { title, slug, summary, content, status = 'draft', category_id, featured_image } = req.body

  console.log('📝 [POST /posts] Conteúdo recebido:', { slug, content });

  if (!title || !content) {
    console.log('❌ Erro: Título ou conteúdo faltando')
    return res.status(400).json({ message: 'Título e conteúdo são obrigatórios' })
  }

  if (!slug || !slug.trim()) {
    return res.status(400).json({ message: 'Slug é obrigatório' })
  }
})

// Excluir post
router.delete('/:id', (req, res) => {
  const { id } = req.params
  const db = Database.getDb()
  
  // Verificar se o usuário pode excluir este post
  db.get('SELECT author_id FROM posts WHERE id = ?', [id], (err, post) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao buscar post' })
    }

    if (!post) {
      return res.status(404).json({ message: 'Post não encontrado' })
    }

    // Admin pode excluir qualquer post, editor só seus próprios
    if (req.user.role !== 'admin' && post.author_id !== req.user.id) {
      return res.status(403).json({ message: 'Sem permissão para excluir este post' })
    }

    db.run('DELETE FROM posts WHERE id = ?', [id], function(err) {
      if (err) {
        return res.status(500).json({ message: 'Erro ao excluir post' })
      }

      res.json({ message: 'Post excluído com sucesso' })
    })
  })
})

export default router
