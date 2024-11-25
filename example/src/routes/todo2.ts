
export async function todo2Router(
    corsHeaders:any, request: any, env: any, Response:any  
): Promise<Response>
{    
  const url = new URL(request.url);
  const path = url.pathname;
//console.log("url=", url);
//console.log("path=", path);
  // 検索エンドポイント
  if (path === '/api/todo2/search' && request.method === 'GET') {
    const searchTerm = url.searchParams.get('q') || '';
    const todos = await searchTodos(env.DB, searchTerm);
    return { data:JSON.stringify(todos), status: 200 , ret: true}
  }

  // CRUD エンドポイント
  if (path === '/api/todo2') {
    switch (request.method) {
      case 'GET':
        const todos = await getAllTodos(env.DB);
        return { data:JSON.stringify(todos), status: 200, ret: true}
//            return jsonResponse(todos, corsHeaders);

      case 'POST':
        const newTodo = await request.json() as Todo;
        const created = await createTodo(env.DB, newTodo);
        return { data: created, status: 201, ret: true}
        //return jsonResponse(created, corsHeaders, 201);

      default:
        return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }
  }

  // 個別のTodo操作
  const todoIdMatch = path.match(/^\/api\/todo2\/(\d+)$/);
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
        //return { data: null, status: 204}
        return updated
          ? { data: null, status: 204, ret: true}
          : new Response('Not found', { status: 404, headers: corsHeaders });
        //return updated
        //? jsonResponse(updated, corsHeaders)
        //: new Response('Not found', { status: 404, headers: corsHeaders });

      case 'DELETE':
        const deleted = await deleteTodo(env.DB, todoId);
        return deleted
          ? { data: null, status: 204, ret: true}
          : new Response('Not found', { status: 404, headers: corsHeaders });
        //return deleted
        //  ? new Response(null, { status: 204, headers: corsHeaders })
        //  : new Response('Not found', { status: 404, headers: corsHeaders });

      default:
        return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }
  }
  return { data: null, status: 0, ret: false };
} 

// データベース操作関数
async function getAllTodos(db: D1Database): Promise<Todo[]> {
  const { results } = await db
    .prepare('SELECT * FROM todo2 ORDER BY createdAt DESC')
    .all();
  return results as Todo[];
}

async function searchTodos(db: D1Database, searchTerm: string): Promise<Todo[]> {
  const { results } = await db
    .prepare('SELECT * FROM todo2 WHERE title LIKE ? OR content LIKE ? ORDER BY createdAt DESC')
    .bind(`%${searchTerm}%`, `%${searchTerm}%`)
    .all();
  return results as Todo[];
}

async function getTodoById(db: D1Database, id: number): Promise<Todo | null> {
  const result = await db
    .prepare('SELECT * FROM todo2 WHERE id = ?')
    .bind(id)
    .first();
  return result as Todo | null;
}

async function createTodo(db: D1Database, todo: Todo): Promise<Todo> {
  const result = await db
    .prepare(`
      INSERT INTO todo2 (
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
      UPDATE todo2 SET
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
    .prepare('DELETE FROM todo2 WHERE id = ?')
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