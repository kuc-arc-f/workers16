interface Todo {
  id?: number;
  title: string;
  description?: string;
  completed: boolean;
  created_at?: string;
  updated_at?: string;
}

export async function todo4Router(
    corsHeaders:any, request: any, env: any, Response:any  
): Promise<Response>
{    
  const url = new URL(request.url);
  const path = url.pathname;
  //console.log("url=", url);
console.log("path=", path);
  // ルーティング
  if (path === '/api/todo4' && request.method === 'GET') {
    return await handleGetTodos(request, env);
  } else if (path === '/api/todo4/search' && request.method === 'GET') {
    return await handleSearchTodos(request, env);
  } else if (path === '/api/todo4' && request.method === 'POST') {
    return await handleCreateTodo(request, env);
  } else if (path.match(/^\/api\/todo4\/\d+$/) && request.method === 'PUT') {
    return await handleUpdateTodo(request, env);
  } else if (path.match(/^\/api\/todo4\/\d+$/) && request.method === 'DELETE') {
    return await handleDeleteTodo(request, env);
  }
  // 404 for all other routes
  return { data: null, status: 0, ret: false };
  //return new Response('Not Found', { status: 404 });
} 

// TODO一覧取得
async function handleGetTodos(request: Request, env: Env): Promise<Response> {
  const { results } = await env.DB.prepare(
    'SELECT * FROM todo4 ORDER BY created_at DESC'
  ).all();
  //console.log(results);
  return { data: JSON.stringify(results), status: 200, ret: true}
  //return new Response(JSON.stringify(results), {
  //  headers: { 'Content-Type': 'application/json' },
  //});
}

// TODO検索
async function handleSearchTodos(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const query = url.searchParams.get('q') || '';

  const { results } = await env.DB.prepare(
    `SELECT * FROM todo4 
     WHERE title LIKE ? OR description LIKE ?
     ORDER BY created_at DESC`
  )
    .bind(`%${query}%`, `%${query}%`)
    .all();
  return { data: JSON.stringify(results), status: 200, ret: true}
  //return new Response(JSON.stringify(results), {
  //  headers: { 'Content-Type': 'application/json' },
  //});
}

// TODO作成
async function handleCreateTodo(request: Request, env: Env): Promise<Response> {
  const todo: Todo = await request.json();

  if (!todo.title) {
    return new Response('Title is required', { status: 400 });
  }

  const { success } = await env.DB.prepare(
    `INSERT INTO todo4 (title, description, completed)
     VALUES (?, ?, ?)`
  )
    .bind(todo.title, todo.description || '', todo.completed || false)
    .run();

  if (!success) {
    return new Response('Failed to create todo', { status: 500 });
  }
  return { data: null, status: 201, ret: true}
  //return new Response('Created', { status: 201 });
}

// TODO更新
async function handleUpdateTodo(request: Request, env: Env): Promise<Response> {
  const id = parseInt(new URL(request.url).pathname.split('/').pop() || '');
  const todo: Todo = await request.json();

  if (!todo.title) {
    return new Response('Title is required', { status: 400 });
  }

  const { success } = await env.DB.prepare(
    `UPDATE todo4 
     SET title = ?, description = ?, completed = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`
  )
    .bind(todo.title, todo.description || '', todo.completed, id)
    .run();

  if (!success) {
    return new Response('Todo not found', { status: 404 });
  }
  return { data: null, status: 200, ret: true}
  //return new Response('Updated', { status: 200 });
}

// TODO削除
async function handleDeleteTodo(request: Request, env: Env): Promise<Response> {
  const id = parseInt(new URL(request.url).pathname.split('/').pop() || '');

  const { success } = await env.DB.prepare('DELETE FROM todo4 WHERE id = ?')
    .bind(id)
    .run();

  if (!success) {
    return new Response('Todo not found', { status: 404 });
  }
  return { data: null, status: 200, ret: true}
  //return new Response('Deleted', { status: 200 });
}