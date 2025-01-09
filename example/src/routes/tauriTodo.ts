
export async function tauriTodoRouter(
  corsHeaders:any, request: any, env: any, Response:any  
): Promise<Response>
{
  
    const url = new URL(request.url);
    const path = url.pathname;
//console.log("url=", url);
//console.log("path=", path);
///api/tauri_todo
    if (path === '/api/todos/search' && request.method === 'GET') {
      const query = url.searchParams.get('q') || '';
      const todos = await env.DB.prepare(
        `SELECT * FROM todos WHERE title LIKE ? OR description LIKE ?`
      )
        .bind(`%${query}%`, `%${query}%`)
        .all();
      return { data:JSON.stringify(todos.results), status: 200, ret: true}
    }

    // TODOの一覧取得
    if (path === '/api/tauri_todo_list' && request.method === 'POST') {
//console.log("/api/todos, start");
      const todos = await env.DB.prepare('SELECT * FROM todos ORDER BY created_at DESC').all();
      //console.log(todos);
      return { data: JSON.stringify(todos.results), status: 200 , ret: true}
    }

    // TODOの追加
    if (path === '/api/tauri_todo_create' && request.method === 'POST') {
      const { title, description } = await request.json();
    //const debug = { title, description };
      const now = new Date().toISOString();
      const descValue = "";
      const result = await env.DB.prepare(
        `INSERT INTO todos (title, description, completed, created_at, updated_at) 
         VALUES (?, ?, 0, ?, ?)`
      )
        .bind(title, descValue, now, now)
        .run();
      return { data: JSON.stringify({ id: result.meta.last_row_id }), status: 201, ret: true}
    }

    // TODOの更新
//    if (path.match(/^\/api\/todos\/\d+$/) && request.method === 'PUT') {
    if (path === '/api/tauri_todo_update' && request.method === 'POST') {
      //const id = parseInt(path.split('/').pop()!);
      const {id, title, description, completed } = await request.json();
      const now = new Date().toISOString();

      await env.DB.prepare(
        `UPDATE todos 
         SET title = ?, description = ?, completed = ?, updated_at = ? 
         WHERE id = ?`
      )
        .bind(title, description, completed ? 1 : 0, now, id)
        .run();
      return { data: null, status: 204, ret: true}
    }

    // TODOの削除
    //if (path.match(/^\/api\/todos\/\d+$/) && request.method === 'DELETE') {
    if (path === '/api/tauri_todo_delete' && request.method === 'POST') {
        const body = await request.json();
      
      await env.DB.prepare('DELETE FROM todos WHERE id = ?')
        .bind(body.id)
        .run();
      return { data: null, status: 204, ret: true}
    }
    return { data: null, status: 0, ret: false };
} 
