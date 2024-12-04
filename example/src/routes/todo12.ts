interface Env {
    DB: D1Database;
}

export interface Todo {
    id?: number;
    title: string;
    content: string;
    public: number;
    food_orange: number;
    food_apple: number;
    food_banana: number;
    pub_date: string;
    qty1: string;
    qty2: string;
    qty3: string;
    created_at?: string;
    updated_at?: string;
}


export async function todo12Router(
    corsHeaders:any, request: any, env: any, Response:any  
): Promise<Response>
{    
  const url = new URL(request.url);
  const path = url.pathname;
console.log("url=", url);
console.log("path=", path);
  // 検索エンドポイント
  //todo12
  if (path === '/api/todo12') {
    if (request.method === 'GET') {
      const searchQuery = url.searchParams.get('search') || '';
      const todos = await env.DB.prepare(`
        SELECT * FROM todo12 
        WHERE title LIKE ?
        OR content LIKE ?
        ORDER BY created_at DESC
      `)
      .bind(`%${searchQuery}%`, `%${searchQuery}%`)
      .all();
      console.log(todos.results);
      return { data:JSON.stringify(todos.results), status: 200 , ret: true}
      //return new Response(JSON.stringify(todos.results), {
      //  headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      //  status: 200
      //});
    }
  }
  if (path === '/api/todo12') {
    if (request.method === 'POST') {
      try {
        const data: Todo = await request.json();
        
        const result = await env.DB.prepare(`
            INSERT INTO todo12 (
                title, content, public, 
                food_orange, food_apple, food_banana,
                pub_date, qty1, qty2, qty3
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
            data.title,
            data.content,
            data.public,
            data.food_orange,
            data.food_apple,
            data.food_banana,
            data.pub_date,
            data.qty1,
            data.qty2,
            data.qty3
        ).run();
        return { data:JSON.stringify(data), status: 200 , ret: true}
        //return new Response(JSON.stringify(data), {
        //  headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        //  status: 201
        //});
      } catch (error) {
          //return json({ error: 'Failed to create todo' }, { status: 500 });
          return new Response('Failed to create todo', {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
          });
      }        

    }
  }  
  const idMatch = path.match(/\/api\/todo12\/(\d+)/);
  if (idMatch) {
    if (request.method === 'DELETE') {
      const id = parseInt(idMatch[1]);
      try {
        const result = await env.DB.prepare('DELETE FROM todo12 WHERE id = ?')
            .bind(id)
            .run();
            
        if (result.changes === 0) {
          return { data: null, status: 404 , ret: true}
          //  return new Response(null, {
          //    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          //    status: 404
          //  });
        }
        return { data: null, status: 200 , ret: true}
        //return new Response(null, {
        //  headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        //  status: 200
        //});
      } catch (error) {
        return { data: null, status: 500 , ret: true}
        //  return new Response('Not Found', {
        //    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        //    status: 500,
        //  });
      }
    }
    //PUT
    if (request.method === 'PUT') {
      const id = parseInt(idMatch[1]);
      try {
        const data: Todo = await request.json();
        console.log(data);
        
        const result = await env.DB.prepare(`
            UPDATE todo12 SET 
                title = ?, 
                content = ?, 
                public = ?,
                food_orange = ?,
                food_apple = ?,
                food_banana = ?,
                pub_date = ?,
                qty1 = ?,
                qty2 = ?,
                qty3 = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).bind(
            data.title,
            data.content,
            data.public,
            data.food_orange,
            data.food_apple,
            data.food_banana,
            data.pub_date,
            data.qty1,
            data.qty2,
            data.qty3,
            id
        ).run();
        
        if (result.changes === 0) {
          return { data: null, status: 404 , ret: true}
          //  return new Response(null, {
          //    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          //    status: 404
          //  });
        }
        
        const updatedTodo = await env.DB.prepare('SELECT * FROM todo12 WHERE id = ?')
            .bind(id)
            .first();
        return { data:JSON.stringify(updatedTodo), status: 200 , ret: true}
        //return new Response(JSON.stringify(updatedTodo), {
        //  headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        //  status: 200
        //});
      } catch (error) {
        return { data: null, status: 500 , ret: true}
        //return new Response(null, {
        //  headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        //  status: 500
        //});
      }        
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