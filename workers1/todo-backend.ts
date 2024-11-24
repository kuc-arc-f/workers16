// src/index.ts

interface Env {
  DB: D1Database;
}

interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // CORS プリフライトリクエストの処理
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders,
      });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // 検索エンドポイント
      if (path === '/api/todos/search' && request.method === 'GET') {
        const query = url.searchParams.get('q') || '';
        const todos = await env.DB.prepare(
          `SELECT * FROM todos WHERE title LIKE ? OR description LIKE ?`
        )
          .bind(`%${query}%`, `%${query}%`)
          .all();
        
        return new Response(JSON.stringify(todos.results), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // TODOの一覧取得
      if (path === '/api/todos' && request.method === 'GET') {
        const todos = await env.DB.prepare('SELECT * FROM todos ORDER BY created_at DESC').all();
        return new Response(JSON.stringify(todos.results), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // TODOの追加
      if (path === '/api/todos' && request.method === 'POST') {
        const { title, description } = await request.json();
        const now = new Date().toISOString();

        const result = await env.DB.prepare(
          `INSERT INTO todos (title, description, completed, created_at, updated_at) 
           VALUES (?, ?, 0, ?, ?)`
        )
          .bind(title, description, now, now)
          .run();

        return new Response(JSON.stringify({ id: result.meta.last_row_id }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 201,
        });
      }

      // TODOの更新
      if (path.match(/^\/api\/todos\/\d+$/) && request.method === 'PUT') {
        const id = parseInt(path.split('/').pop()!);
        const { title, description, completed } = await request.json();
        const now = new Date().toISOString();

        await env.DB.prepare(
          `UPDATE todos 
           SET title = ?, description = ?, completed = ?, updated_at = ? 
           WHERE id = ?`
        )
          .bind(title, description, completed ? 1 : 0, now, id)
          .run();

        return new Response(null, {
          headers: corsHeaders,
          status: 204,
        });
      }

      // TODOの削除
      if (path.match(/^\/api\/todos\/\d+$/) && request.method === 'DELETE') {
        const id = parseInt(path.split('/').pop()!);
        
        await env.DB.prepare('DELETE FROM todos WHERE id = ?')
          .bind(id)
          .run();

        return new Response(null, {
          headers: corsHeaders,
          status: 204,
        });
      }

      return new Response('Not Found', {
        headers: corsHeaders,
        status: 404,
      });
    } catch (error) {
      console.error('Error:', error);
      return new Response('Internal Server Error', {
        headers: corsHeaders,
        status: 500,
      });
    }
  },
};
