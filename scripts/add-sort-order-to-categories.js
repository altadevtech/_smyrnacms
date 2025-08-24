// Script para adicionar o campo sort_order na tabela categories
import Database from '../server/database.js'

async function addSortOrderToCategories() {
  await Database.init();
  const db = Database.getDb();
  db.serialize(() => {
    db.run('ALTER TABLE categories ADD COLUMN sort_order INTEGER DEFAULT 0', (err) => {
      if (err && !err.message.includes('duplicate column')) {
        console.error('Erro ao adicionar coluna sort_order:', err.message)
      } else {
        console.log('Coluna sort_order adicionada (ou já existia)')
      }
    })
  })
}

addSortOrderToCategories()
