// wrangler.toml の設定例
/*
name = "todo-crud-api"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[[d1_databases]]
binding = "DB"
database_name = "todo-db"
database_id = "your-database-id"
*/

// types.ts
interface Todo {
  id?: number;
  title: string;
  content: string;
  public: boolean;
  foodOrange: boolean;
  foodApple: boolean;
  foodBanana: boolean;
  pubDate: string;
  qty1: string;
  qty2: string;
  qty3: string;
  createdAt?: string;
  updatedAt?: string;
}

// migrations/0000_initial.sql
/*
CREATE TABLE IF NOT EXISTS todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  public BOOLEAN NOT NULL DEFAULT false,
  foodOrange BOOLEAN NOT NULL DEFAULT false,
  foodApple BOOLEAN NOT NULL DEFAULT false,
  foodBanana BOOLEAN NOT NULL DEFAULT false,
  pubDate TEXT NOT NULL,
  qty1 TEXT NOT NULL,
  qty2 TEXT NOT NULL,
  qty3 TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_todos_title ON todos(title);
*/

// src/index.ts
interface Env {
  DB: D1Database;
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
        const searchTerm = url.searchParams.get('q') || '';
        const todos = await searchTodos(env.DB, searchTerm);
        return jsonResponse(todos, corsHeaders);
      }

      // CRUD エンドポイント
      if (path === '/api/todos') {
        switch (request.method) {
          case 'GET':
            const todos = await getAllTodos(env.DB);
            return jsonResponse(todos, corsHeaders);

          case 'POST':
            const newTodo = await request.json() as Todo;
            const created = await createTodo(env.DB, newTodo);
            return jsonResponse(created, corsHeaders, 201);

          default:
            return new Response('Method not allowed', { status: 405, headers: corsHeaders });
        }
      }

      // 個別のTodo操作
      const todoIdMatch = path.match(/^\/api\/todos\/(\d+)$/);
      if (todoIdMatch) {
        const todoId = parseInt(todoIdMatch[1]);

        switch (request.method) {
          case 'GET':
            const todo = await getTodoById(env.DB, todoId);
            return todo 
              ? jsonResponse(todo, corsHeaders)
              : new Response('Not found', { status: 404, headers: corsHeaders });

          case 'PUT':
            const updateData = await request.json() as Todo;
            const updated = await updateTodo(env.DB, todoId, updateData);
            return updated
              ? jsonResponse(updated, corsHeaders)
              : new Response('Not found', { status: 404, headers: corsHeaders });

          case 'DELETE':
            const deleted = await deleteTodo(env.DB, todoId);
            return deleted
              ? new Response(null, { status: 204, headers: corsHeaders })
              : new Response('Not found', { status: 404, headers: corsHeaders });

          default:
            return new Response('Method not allowed', { status: 405, headers: corsHeaders });
        }
      }

      return new Response('Not found', { status: 404, headers: corsHeaders });
    } catch (error) {
      console.error('Error:', error);
      return new Response('Internal Server Error', { status: 500, headers: corsHeaders });
    }
  },
};

// データベース操作関数
async function getAllTodos(db: D1Database): Promise<Todo[]> {
  const { results } = await db
    .prepare('SELECT * FROM todos ORDER BY createdAt DESC')
    .all();
  return results as Todo[];
}

async function searchTodos(db: D1Database, searchTerm: string): Promise<Todo[]> {
  const { results } = await db
    .prepare('SELECT * FROM todos WHERE title LIKE ? OR content LIKE ? ORDER BY createdAt DESC')
    .bind(`%${searchTerm}%`, `%${searchTerm}%`)
    .all();
  return results as Todo[];
}

async function getTodoById(db: D1Database, id: number): Promise<Todo | null> {
  const result = await db
    .prepare('SELECT * FROM todos WHERE id = ?')
    .bind(id)
    .first();
  return result as Todo | null;
}

async function createTodo(db: D1Database, todo: Todo): Promise<Todo> {
  const result = await db
    .prepare(`
      INSERT INTO todos (
        title, content, public, foodOrange, foodApple, foodBanana,
        pubDate, qty1, qty2, qty3
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      RETURNING *
    `)
    .bind(
      todo.title,
      todo.content,
      todo.public ? 1 : 0,
      todo.foodOrange ? 1 : 0,
      todo.foodApple ? 1 : 0,
      todo.foodBanana ? 1 : 0,
      todo.pubDate,
      todo.qty1,
      todo.qty2,
      todo.qty3
    )
    .first();
  return result as Todo;
}

async function updateTodo(db: D1Database, id: number, todo: Todo): Promise<Todo | null> {
  const result = await db
    .prepare(`
      UPDATE todos SET
        title = ?,
        content = ?,
        public = ?,
        foodOrange = ?,
        foodApple = ?,
        foodBanana = ?,
        pubDate = ?,
        qty1 = ?,
        qty2 = ?,
        qty3 = ?,
        updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
      RETURNING *
    `)
    .bind(
      todo.title,
      todo.content,
      todo.public ? 1 : 0,
      todo.foodOrange ? 1 : 0,
      todo.foodApple ? 1 : 0,
      todo.foodBanana ? 1 : 0,
      todo.pubDate,
      todo.qty1,
      todo.qty2,
      todo.qty3,
      id
    )
    .first();
  return result as Todo | null;
}

async function deleteTodo(db: D1Database, id: number): Promise<boolean> {
  const result = await db
    .prepare('DELETE FROM todos WHERE id = ?')
    .bind(id)
    .run();
  return result.changes > 0;
}

// ユーティリティ関数
function jsonResponse(data: any, headers: HeadersInit, status = 200): Response {
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    status,
  });
}
