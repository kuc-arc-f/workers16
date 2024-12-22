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


export async function todo21Router(
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
  if (path === '/api/todo21' && request.method === 'POST') {
    console.log("# /api/todo21")
    const todo = await request.json();

    if (!todo || !todo.title) {
      return { data: null, status: 400 , ret: false}
    }
  
    const { title } = todo;
    const result = await env.DB.prepare("INSERT INTO todo21 (title) VALUES (?) RETURNING *")
      .bind(title)
      .first();
  
    return { data: JSON.stringify(result), status: 200 , ret: true}
  }
  // Read TODOs (with search)
  if (path === '/api/todo21' && request.method === 'GET') {
    console.log("# /api/todo21");
    const searchTerm = url.searchParams.get('search') || '';
    let query = 'SELECT * FROM todo21';
    
    if (searchTerm) {
        query += ` WHERE title LIKE ? OR content LIKE ?`;
        const searchPattern = `%${searchTerm}%`;
        const results = await env.DB.prepare(query)
            .bind(searchPattern, searchPattern)
            .all();
        return { data:JSON.stringify(results), status: 200 , ret: true}
    }

    const results = await env.DB.prepare(query).all();
    //console.log(results);
    return { data:JSON.stringify(results), status: 200 , ret: true}
  }  

  // Update TODO
  //   if (path.match(/\/api\/todo21\/\d+/) && request.method === 'PUT') {
  if (path === '/api/todo21' && request.method === 'PUT') {
    //const id = path.split('/').pop();
    const todo: Todo = await request.json();
    console.log(todo);
    const id = todo.id;
    if (!id || !todo) {
      return { data: null, status: 400 , ret: true}
    }
  
    const { title, completed } = todo;
    const updatedTodo = await env.DB.prepare("UPDATE todo21 SET title = ?, completed = ? WHERE id = ? RETURNING *")
      .bind(title, completed ? 1 : 0, id)
      .first();
  
    if (!updatedTodo) {
      return { data: null, status: 400 , ret: true}
    }

    return { data:JSON.stringify(updatedTodo), status: 200 , ret: true}
  }    
  // Delete TODO
  if (path.match(/\/api\/todo21\/\d+/) && request.method === 'DELETE') {
    const id = path.split('/').pop();
    const result = await env.DB.prepare('DELETE FROM todo21 WHERE id = ?')
        .bind(id)
        .run();
    return { data:JSON.stringify(result), status: 200 , ret: true}
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
