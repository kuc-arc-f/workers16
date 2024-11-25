interface Todo {
    id?: number;
    title: string;
    description?: string;
    completed: boolean;
    created_at?: string;
    updated_at?: string;
  }
  
  export async function todo5Router(
      corsHeaders:any, request: any, env: any, Response:any  
  ): Promise<Response>
  {    
    const url = new URL(request.url);
    const path = url.pathname;
    //console.log("url=", url);
  console.log("path=", path);
    // TODOの一覧取得 (検索機能付き)
    if (path === '/api/todo5' && request.method === 'GET') {
      const searchParams = new URLSearchParams(url.search);
      const searchTerm = searchParams.get('search') || '';
      
      let query = 'SELECT * FROM todo5';
      let params: any[] = [];
      
      if (searchTerm) {
        query += ' WHERE title LIKE ? OR content LIKE ?';
        params = [`%${searchTerm}%`, `%${searchTerm}%`];
      }
      
      query += ' ORDER BY createdAt DESC';
      
      const todos = await env.DB.prepare(query)
        .bind(...params)
        .all();
      return { data:JSON.stringify(todos.results), status: 200 , ret: true}
      //return new Response(JSON.stringify(todos.results), {
      //  headers: {
      //    'Content-Type': 'application/json',
      //    'Access-Control-Allow-Origin': '*',
      //  },
      //});
    }

    // TODOの取得（単一）
    if (path.match(/^\/api\/todo5\/\d+$/) && request.method === 'GET') {
      const id = path.split('/').pop();
      const todo = await env.DB.prepare(
        'SELECT * FROM todo5 WHERE id = ?'
      )
        .bind(id)
        .first();

      if (!todo) {
        return new Response('Todo not found', { status: 404 });
      }
      return { data:JSON.stringify(todo), status: 200 , ret: true}
      //return new Response(JSON.stringify(todo), {
      //  headers: {
      //    'Content-Type': 'application/json',
      //    'Access-Control-Allow-Origin': '*',
      //  },
      //});
    }

    // TODOの作成
    if (path === '/api/todo5' && request.method === 'POST') {
      const data: Todo = await request.json();
      const now = new Date().toISOString();

      const result = await env.DB.prepare(`
        INSERT INTO todo5 (
          title, content, public, 
          foodOrange, foodApple, foodBanana,
          pubDate, qty1, qty2, qty3,
          createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        data.title,
        data.content,
        data.public ? 1 : 0,
        data.foodOrange ? 1 : 0,
        data.foodApple ? 1 : 0,
        data.foodBanana ? 1 : 0,
        data.pubDate,
        data.qty1,
        data.qty2,
        data.qty3,
        now,
        now
      ).run();
      return { data:JSON.stringify(todo), status: 200 , ret: true}
      //return new Response(JSON.stringify({ success: true, id: result.lastRowId }), {
      //  headers: {
      //    'Content-Type': 'application/json',
      //   'Access-Control-Allow-Origin': '*',
      //  },
      //});
    }

    // TODOの更新
    if (path.match(/^\/api\/todo5\/\d+$/) && request.method === 'PUT') {
      const id = path.split('/').pop();
      const data: Todo = await request.json();
      const now = new Date().toISOString();

      const result = await env.DB.prepare(`
        UPDATE todo5 SET 
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
          updatedAt = ?
        WHERE id = ?
      `).bind(
        data.title,
        data.content,
        data.public ? 1 : 0,
        data.foodOrange ? 1 : 0,
        data.foodApple ? 1 : 0,
        data.foodBanana ? 1 : 0,
        data.pubDate,
        data.qty1,
        data.qty2,
        data.qty3,
        now,
        id
      ).run();

      if (result.changes === 0) {
        return new Response('Todo not found', { status: 404 });
      }
      return { data: null, status: 200 , ret: true}
      //return new Response(JSON.stringify({ success: true }), {
      //  headers: {
      //    'Content-Type': 'application/json',
      //    'Access-Control-Allow-Origin': '*',
      //  },
      //});
    }

    // TODOの削除
    if (path.match(/^\/api\/todo5\/\d+$/) && request.method === 'DELETE') {
      const id = path.split('/').pop();
      
      const result = await env.DB.prepare('DELETE FROM todo5 WHERE id = ?')
        .bind(id)
        .run();

      if (result.changes === 0) {
        return new Response('Todo not found', { status: 404 });
      }
      return { data: null, status: 200 , ret: true}
      //return new Response(JSON.stringify({ success: true }), {
      //  headers: {
      //    'Content-Type': 'application/json',
      //    'Access-Control-Allow-Origin': '*',
      //  },
      //});
    }

    return { data: null, status: 0, ret: false };
    //return new Response('Not Found', { status: 404 });
  } 
  
