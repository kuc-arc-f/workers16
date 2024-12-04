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


export async function todo13Router(
  corsHeaders:any, request: any, env: any, Response:any  
): Promise<Response>
{    
const url = new URL(request.url);
const path = url.pathname;
//console.log("url=", url);
console.log("path=", path);
// 検索エンドポイント

  // Create TODO
  if (path === '/api/todo13' && request.method === 'POST') {
    const todo: Todo = await request.json();
    console.log(todo);
    const result = await env.DB.prepare(`
        INSERT INTO todo13 (
            title, content, content_type, is_public,
            food_orange, food_apple, food_banana, food_melon, food_grape,
            pub_date1, pub_date2, pub_date3, pub_date4, pub_date5, pub_date6,
            qty1, qty2, qty3, qty4, qty5, qty6
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
        todo.title, todo.content, todo.content_type, todo.is_public,
        todo.food_orange, todo.food_apple, todo.food_banana, todo.food_melon, todo.food_grape,
        todo.pub_date1, todo.pub_date2, todo.pub_date3, todo.pub_date4, todo.pub_date5, todo.pub_date6,
        todo.qty1, todo.qty2, todo.qty3, todo.qty4, todo.qty5, todo.qty6
    ).run();
    return { data: JSON.stringify(result), status: 200 , ret: true}
    //return new Response(JSON.stringify(result), {
    //    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    //});
  }
  // Read TODOs (with search)
  if (path === '/api/todo13' && request.method === 'GET') {
    const searchTerm = url.searchParams.get('search') || '';
    let query = 'SELECT * FROM todo13';
    
    if (searchTerm) {
        query += ` WHERE title LIKE ? OR content LIKE ?`;
        const searchPattern = `%${searchTerm}%`;
        const results = await env.DB.prepare(query)
            .bind(searchPattern, searchPattern)
            .all();
        return { data:JSON.stringify(results), status: 200 , ret: true}
        //return new Response(JSON.stringify(results), {
        //    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        //});
    }

    const results = await env.DB.prepare(query).all();
    return { data:JSON.stringify(results), status: 200 , ret: true}
    //return new Response(JSON.stringify(results), {
    //    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    //    status: 200,
    //});
  }  

  // Update TODO
  if (path.match(/\/api\/todo13\/\d+/) && request.method === 'PUT') {
    const id = path.split('/').pop();
    const todo: Todo = await request.json();
    
    const result = await env.DB.prepare(`
        UPDATE todo13 SET
            title = ?, content = ?, content_type = ?, is_public = ?,
            food_orange = ?, food_apple = ?, food_banana = ?, food_melon = ?, food_grape = ?,
            pub_date1 = ?, pub_date2 = ?, pub_date3 = ?, pub_date4 = ?, pub_date5 = ?, pub_date6 = ?,
            qty1 = ?, qty2 = ?, qty3 = ?, qty4 = ?, qty5 = ?, qty6 = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `).bind(
        todo.title, todo.content, todo.content_type, todo.is_public,
        todo.food_orange, todo.food_apple, todo.food_banana, todo.food_melon, todo.food_grape,
        todo.pub_date1, todo.pub_date2, todo.pub_date3, todo.pub_date4, todo.pub_date5, todo.pub_date6,
        todo.qty1, todo.qty2, todo.qty3, todo.qty4, todo.qty5, todo.qty6,
        id
    ).run();
    return { data:JSON.stringify(result), status: 200 , ret: true}
    //return new Response(JSON.stringify(result), {
    //    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    //});
  }    
  // Delete TODO
  if (path.match(/\/api\/todo13\/\d+/) && request.method === 'DELETE') {
    const id = path.split('/').pop();
    const result = await env.DB.prepare('DELETE FROM todo13 WHERE id = ?')
        .bind(id)
        .run();
    return { data:JSON.stringify(result), status: 200 , ret: true}
    //return new Response(JSON.stringify(result), {
    //    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    //});
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