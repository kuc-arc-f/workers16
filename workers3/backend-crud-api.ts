// wrangler.toml
/*
name = "crud-api"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[[d1_databases]]
binding = "DB"
database_name = "crud-db"
database_id = "your-database-id"
*/

// schema.sql
/*
CREATE TABLE IF NOT EXISTS todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT,
  contentType TEXT,
  age TEXT,
  public BOOLEAN DEFAULT false,
  foodOrange BOOLEAN DEFAULT false,
  foodApple BOOLEAN DEFAULT false,
  foodBanana BOOLEAN DEFAULT false,
  foodMelon BOOLEAN DEFAULT false,
  foodGrape BOOLEAN DEFAULT false,
  datePublish TEXT,
  dateUpdate TEXT,
  postNumber TEXT,
  addressCountry TEXT,
  addressPref TEXT,
  addressCity TEXT,
  address1 TEXT,
  address2 TEXT,
  textOption1 TEXT,
  textOption2 TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
*/

// src/index.ts
interface Env {
  DB: D1Database;
}

interface Todo {
  id?: number;
  title: string;
  content?: string;
  contentType?: string;
  age?: string;
  public?: boolean;
  foodOrange?: boolean;
  foodApple?: boolean;
  foodBanana?: boolean;
  foodMelon?: boolean;
  foodGrape?: boolean;
  datePublish?: string;
  dateUpdate?: string;
  postNumber?: string;
  addressCountry?: string;
  addressPref?: string;
  addressCity?: string;
  address1?: string;
  address2?: string;
  textOption1?: string;
  textOption2?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const cors = {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    };

    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, cors);
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // Create TODO
      if (request.method === 'POST' && path === '/api/todos') {
        const todo: Todo = await request.json();
        const result = await env.DB.prepare(`
          INSERT INTO todos (
            title, content, contentType, age, public,
            foodOrange, foodApple, foodBanana, foodMelon, foodGrape,
            datePublish, dateUpdate, postNumber,
            addressCountry, addressPref, addressCity, address1, address2,
            textOption1, textOption2
          ) VALUES (
            ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?,
            ?, ?, ?,
            ?, ?, ?, ?, ?,
            ?, ?
          )
        `).bind(
          todo.title, todo.content, todo.contentType, todo.age, todo.public,
          todo.foodOrange, todo.foodApple, todo.foodBanana, todo.foodMelon, todo.foodGrape,
          todo.datePublish, todo.dateUpdate, todo.postNumber,
          todo.addressCountry, todo.addressPref, todo.addressCity, todo.address1, todo.address2,
          todo.textOption1, todo.textOption2
        ).run();

        return new Response(JSON.stringify(result), { ...cors, status: 201 });
      }

      // Read TODOs (with search)
      if (request.method === 'GET' && path === '/api/todos') {
        const searchQuery = url.searchParams.get('search') || '';
        let sql = 'SELECT * FROM todos';
        let params: any[] = [];

        if (searchQuery) {
          sql += ` WHERE title LIKE ? OR content LIKE ? OR addressCity LIKE ?`;
          const searchParam = `%${searchQuery}%`;
          params = [searchParam, searchParam, searchParam];
        }

        sql += ' ORDER BY created_at DESC';
        
        const result = await env.DB.prepare(sql).bind(...params).all();
        return new Response(JSON.stringify(result.results), cors);
      }

      // Read single TODO
      if (request.method === 'GET' && path.match(/\/api\/todos\/\d+/)) {
        const id = path.split('/').pop();
        const result = await env.DB.prepare('SELECT * FROM todos WHERE id = ?').bind(id).first();
        return new Response(JSON.stringify(result), cors);
      }

      // Update TODO
      if (request.method === 'PUT' && path.match(/\/api\/todos\/\d+/)) {
        const id = path.split('/').pop();
        const todo: Todo = await request.json();
        const result = await env.DB.prepare(`
          UPDATE todos SET
            title = ?, content = ?, contentType = ?, age = ?, public = ?,
            foodOrange = ?, foodApple = ?, foodBanana = ?, foodMelon = ?, foodGrape = ?,
            datePublish = ?, dateUpdate = ?, postNumber = ?,
            addressCountry = ?, addressPref = ?, addressCity = ?, address1 = ?, address2 = ?,
            textOption1 = ?, textOption2 = ?,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `).bind(
          todo.title, todo.content, todo.contentType, todo.age, todo.public,
          todo.foodOrange, todo.foodApple, todo.foodBanana, todo.foodMelon, todo.foodGrape,
          todo.datePublish, todo.dateUpdate, todo.postNumber,
          todo.addressCountry, todo.addressPref, todo.addressCity, todo.address1, todo.address2,
          todo.textOption1, todo.textOption2,
          id
        ).run();

        return new Response(JSON.stringify(result), cors);
      }

      // Delete TODO
      if (request.method === 'DELETE' && path.match(/\/api\/todos\/\d+/)) {
        const id = path.split('/').pop();
        const result = await env.DB.prepare('DELETE FROM todos WHERE id = ?').bind(id).run();
        return new Response(JSON.stringify(result), cors);
      }

      // 404 for all other routes
      return new Response('Not Found', { status: 404, ...cors });

    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500, ...cors });
    }
  },
};
