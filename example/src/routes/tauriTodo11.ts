interface Env {
  DB: D1Database;
}

interface Todo {
  id?: number;
  title: string;
  description?: string;
  completed?: boolean;
  created_at?: string;
  updated_at?: string;
}

export async function tauriTodo11Router(
  corsHeaders:any, request: any, env: any, Response:any  
): Promise<Response>
{    
const url = new URL(request.url);
const path = url.pathname;
console.log("url=", url);
console.log("path=", path);
  // 検索エンドポイント
  if (path === '/api/todo11/search') {
    if (request.method === 'GET') {
      const { searchParams } = url;
      const query = searchParams.get('q');
      
      if (!query) {
          return new Response('Search query is required', { status: 400 });
      }

      const todos = await env.DB.prepare(
          `SELECT * FROM todo11 WHERE title LIKE ? OR description LIKE ?`
      )
      .bind(`%${query}%`, `%${query}%`)
      .all();
      return { data: JSON.stringify(todos), status: 200 , ret: true}
    }
  }
  // 一般的なCRUD操作
  //tauri_todo11_create
  //tauri_todo11_list
  if (path === '/api/tauri_todo11_create') {
    const todo: Todo = await request.json();
        
    if (!todo.title) {
        return new Response('Title is required', { status: 400 });
    }

    const result = await env.DB.prepare(
        `INSERT INTO todo11 (title, description, completed) 
          VALUES (?, ?, ?) 
          RETURNING *`
    )
    .bind(todo.title, todo.description || '', todo.completed || false)
    .all();
    return { data: JSON.stringify(result.results[0]), status: 200, ret: true}
  }
  if (path === '/api/tauri_todo11_list') {
    //console.log("# /api/todo11");
    // 全件取得
    const todos = await env.DB.prepare(
      'SELECT * FROM todo11 ORDER BY created_at DESC'
    ).all();
    return { data:JSON.stringify(todos.results), status: 200 , ret: true}

    //if (request.method === 'GET') {
    //}
  }
  if (path === '/api/tauri_todo11_delete') {
    const todo: Todo = await request.json();
    const result = await env.DB.prepare(
      'DELETE FROM todo11 WHERE id = ? RETURNING *'
    )
    .bind(todo.id)
    .all();

    if (!result.results.length) {
        return new Response('Todo not found', { status: 404 });
    }
    return { data: JSON.stringify(result.results[0]), status: 200, ret: true}

  }

  if (path === '/api/tauri_todo11_update') {
    const todo: Todo = await request.json();
    if (!todo.title) {
      return new Response('Title is required', { status: 400 });
    }

    const result = await env.DB.prepare(
        `UPDATE todo11 
          SET title = ?, description = ?, completed = ?, 
              updated_at = CURRENT_TIMESTAMP 
          WHERE id = ? 
          RETURNING *`
    )
    .bind(todo.title, todo.description || '', todo.completed || false, todo.id)
    .all();

    if (!result.results.length) {
        return new Response('Todo not found', { status: 404 });
    }
    return { data: JSON.stringify(result.results[0]), status: 200, ret: true}

  }
  /*
  const idMatch = path.match(/\/api\/todo11\/(\d+)/);
  if (idMatch) {
    const id = parseInt(idMatch[1]);
    if (request.method === 'PUT') {
      const todo: Todo = await request.json();
    }
  }  
  */

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