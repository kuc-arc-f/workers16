
export async function todoRouter(
  corsHeaders:any, request: any, env: any, Response:any  
): Promise<Response>
{
  
    const url = new URL(request.url);
    const path = url.pathname;
//console.log("url=", url);
//console.log("path=", path);
    if (path === '/api/todos/search' && request.method === 'GET') {
      const query = url.searchParams.get('q') || '';
      const todos = await env.DB.prepare(
        `SELECT * FROM todos WHERE title LIKE ? OR description LIKE ?`
      )
        .bind(`%${query}%`, `%${query}%`)
        .all();
      return { data:JSON.stringify(todos.results), status: 200, ret: true}
      //return new Response(JSON.stringify(todos.results), {
      //  headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      //});
    }

    // TODOの一覧取得
    if (path === '/api/todos' && request.method === 'GET') {
//console.log("/api/todos, start");
      const todos = await env.DB.prepare('SELECT * FROM todos ORDER BY created_at DESC').all();
      //console.log(todos);
      return { data: JSON.stringify(todos.results), status: 200 , ret: true}
      //return new Response(JSON.stringify(todos.results), {
      //  headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      //});
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
      return { data: JSON.stringify({ id: result.meta.last_row_id }), status: 201, ret: true}
      //return new Response(JSON.stringify({ id: result.meta.last_row_id }), {
      //  headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      //  status: 201,
      //});
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
      return { data: null, status: 204, ret: true}
      //return new Response(null, {
      //  headers: corsHeaders,
      //  status: 204,
      //});
    }

    // TODOの削除
    if (path.match(/^\/api\/todos\/\d+$/) && request.method === 'DELETE') {
      const id = parseInt(path.split('/').pop()!);
      
      await env.DB.prepare('DELETE FROM todos WHERE id = ?')
        .bind(id)
        .run();
      return { data: null, status: 204, ret: true}
      //return new Response(null, {
      //  headers: corsHeaders,
      //  status: 204,
      //});
    }
    return { data: null, status: 0, ret: false };
    /*
    return new Response('Not Found', {
      headers: corsHeaders,
      status: 404,
    });
    */

} 