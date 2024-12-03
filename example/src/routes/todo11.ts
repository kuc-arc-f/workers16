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

export async function todo11Router(
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
      //return new Response(JSON.stringify(todos.results), {
      //    headers: {
      //        'Content-Type': 'application/json',
      //        ...corsHeaders
      //    },
      //});
    }
  }
  // 一般的なCRUD操作
  if (path === '/api/todo11') {
    //console.log("# /api/todo11");
    // 全件取得
    if (request.method === 'GET') {
        const todos = await env.DB.prepare(
            'SELECT * FROM todo11 ORDER BY created_at DESC'
        ).all();
        return { data:JSON.stringify(todos.results), status: 200 , ret: true}
        //return new Response(JSON.stringify(todos.results), {
        //    headers: {
        //        'Content-Type': 'application/json',
        //        ...corsHeaders
        //    },
        //});
    }

    // 新規作成
    if (request.method === 'POST') {
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
        //return new Response(JSON.stringify(result.results[0]), {
        //    headers: {
        //        'Content-Type': 'application/json',
        //        ...corsHeaders
        //    },
        //});
    }
  }

  // ID指定の操作
  const idMatch = path.match(/\/api\/todo11\/(\d+)/);
  if (idMatch) {
    const id = parseInt(idMatch[1]);

    // 更新
    if (request.method === 'PUT') {
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
      .bind(todo.title, todo.description || '', todo.completed || false, id)
      .all();

      if (!result.results.length) {
          return new Response('Todo not found', { status: 404 });
      }
      return { data: JSON.stringify(result.results[0]), status: 200, ret: true}
      //return new Response(JSON.stringify(result.results[0]), {
      //    headers: {
      //        'Content-Type': 'application/json',
      //        ...corsHeaders
      //    },
      //});
    }

    // 削除
    if (request.method === 'DELETE') {
      const result = await env.DB.prepare(
          'DELETE FROM todo11 WHERE id = ? RETURNING *'
      )
      .bind(id)
      .all();

      if (!result.results.length) {
          return new Response('Todo not found', { status: 404 });
      }
      return { data: JSON.stringify(result.results[0]), status: 200, ret: true}
      //return new Response(JSON.stringify(result.results[0]), {
      //    headers: {
      //        'Content-Type': 'application/json',
      //        ...corsHeaders
      //    },
      //});
    }
  }  


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