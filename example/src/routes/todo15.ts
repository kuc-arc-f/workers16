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


export async function todo15Router(
  corsHeaders:any, request: any, env: any, Response:any  
): Promise<Response>
{    
const url = new URL(request.url);
const path = url.pathname;
//console.log("url=", url);
console.log("path=", path);
const method = request.method;
console.log("method=", method);


  // Create TODO
  if (path === '/api/todo15' && request.method === 'POST') {
    console.log("#Create /api/todo15")
    const body = await request.json();
    const { title, content, public_type, food_orange, food_apple, food_banana, pub_date1, pub_date2, pub_date3, qty1, qty2, qty3 } = body;
    
    const stmt = await env.DB.prepare(
      'INSERT INTO todo15 (title, content, public_type, food_orange, food_apple, food_banana, pub_date1, pub_date2, pub_date3, qty1, qty2, qty3) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).bind(title, content, public_type, food_orange, food_apple, food_banana, pub_date1, pub_date2, pub_date3, qty1, qty2, qty3).run();

    return { data: JSON.stringify({ success: true, id: stmt.lastRowId }), status: 200 , ret: true}
  }
  // Read TODOs (with search)
  if (path === '/api/todo15' && request.method === 'GET') {
    console.log("# /api/todo15");
    const searchTerm = url.searchParams.get('search') || '';
    let query = 'SELECT * FROM todo15';
    
    if (searchTerm) {
        query += ` WHERE title LIKE ? OR content LIKE ?`;
        const searchPattern = `%${searchTerm}%`;
        const results = await env.DB.prepare(query)
            .bind(searchPattern, searchPattern)
            .all();
        return { data:JSON.stringify(results), status: 200 , ret: true}
    }
    const { results } = await env.DB.prepare('SELECT * FROM todo15').all();
    return { data:JSON.stringify(results), status: 200 , ret: true}
  }  

  // Update TODO
  //if (path.match(/\/api\/todo15\/\d+/) && request.method === 'PUT') {
  if (request.method === 'PUT') {
    const body = await request.json();
    const { id, title, content, public_type, food_orange, food_apple, food_banana, pub_date1, pub_date2, pub_date3, qty1, qty2, qty3 } = body;

    if (!id) {
      return new Response("ID is required for update.", { status: 400 });
    }

    await env.DB.prepare(
      'UPDATE todo15 SET title = ?, content = ?, public_type = ?, food_orange = ?, food_apple = ?, food_banana = ?, pub_date1 = ?, pub_date2 = ?, pub_date3 = ?, qty1 = ?, qty2 = ?, qty3 = ? WHERE id = ?'
    ).bind(title, content, public_type, food_orange, food_apple, food_banana, pub_date1, pub_date2, pub_date3, qty1, qty2, qty3, id).run();

    // return new Response(JSON.stringify({ success: true }), {
    //    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    //  });
    return { data:JSON.stringify({ success: true }), status: 200 , ret: true}
  }    
  // Delete TODO
  //if (path.match(/\/api\/todo15\/\d+/) && request.method === 'DELETE') {
  if (request.method === 'DELETE') {
    const id = url.searchParams.get('id');
    console.log("#delete /api/todo15 =", id);
    const result = await env.DB.prepare('DELETE FROM todo15 WHERE id = ?')
        .bind(id)
        .run();
    return { data: JSON.stringify(result), status: 200 , ret: true}
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
