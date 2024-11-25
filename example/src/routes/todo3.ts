interface Todo {
  id?: number;
  title: string;
  content?: string;
  contentType?: string;
  age?: string;
  public?: boolean;
  foodOrange?: boolean;
  foodApple?: boolean;
  foodBanana?: boolean;
  foodMelon?: boolean;
  foodGrape?: boolean;
  datePublish?: string;
  dateUpdate?: string;
  postNumber?: string;
  addressCountry?: string;
  addressPref?: string;
  addressCity?: string;
  address1?: string;
  address2?: string;
  textOption1?: string;
  textOption2?: string;
}

export async function todo3Router(
    corsHeaders:any, request: any, env: any, Response:any  
): Promise<Response>
{    
  const url = new URL(request.url);
  const path = url.pathname;
//console.log("url=", url);
//console.log("path=", path);
  // Create TODO
  if (request.method === 'POST' && path === '/api/todo3') {
    console.log("POST, /api/todo3");
    const todo: Todo = await request.json();
    console.log(todo);
//return new Response('Not Found', { status: 404, ...cors });
    const result = await env.DB.prepare(`
      INSERT INTO todo3 (
        title, content, contentType, age, public,
        foodOrange, foodApple, foodBanana, foodMelon, foodGrape,
        datePublish, dateUpdate, postNumber,
        addressCountry, addressPref, addressCity, address1, address2,
        textOption1, textOption2
      ) VALUES (
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?
      )
    `).bind(
      todo.title, todo.content, todo.contentType, todo.age, todo.public,
      todo.foodOrange, todo.foodApple, todo.foodBanana, todo.foodMelon, todo.foodGrape,
      todo.datePublish, todo.dateUpdate, todo.postNumber,
      todo.addressCountry, todo.addressPref, todo.addressCity, todo.address1, todo.address2,
      todo.textOption1, todo.textOption2
    ).run();
    return { data:JSON.stringify(result), status: 201 , ret: true}
    //return new Response(JSON.stringify(result), { ...cors, status: 201 });
  }

  // Read TODOs (with search)
  if (request.method === 'GET' && path === '/api/todo3') {
    //console.log("GET, /api/todo3");
    const searchQuery = url.searchParams.get('search') || '';
    let sql = 'SELECT * FROM todo3';
    let params: any[] = [];
    //console.log("sql="+ sql);

    if (searchQuery) {
      sql += ` WHERE title LIKE ? OR content LIKE ? OR addressCity LIKE ?`;
      const searchParam = `%${searchQuery}%`;
      params = [searchParam, searchParam, searchParam];
    }

    sql += ' ORDER BY created_at DESC';
    //console.log("sql="+ sql);
    const result = await env.DB.prepare(sql).bind(...params).all();
    //console.log(result.results);
    return { data:JSON.stringify(result.results), status: 201 , ret: true}
    //return new Response(JSON.stringify(result.results), cors);
  }

  // Read single TODO
  if (request.method === 'GET' && path.match(/\/api\/todo3\/\d+/)) {
    const id = path.split('/').pop();
    const result = await env.DB.prepare('SELECT * FROM todo3 WHERE id = ?').bind(id).first();
    return { data:JSON.stringify(result ), status: 200 , ret: true}
    //return new Response(JSON.stringify(result), cors);
  }

  // Update TODO
  if (request.method === 'PUT' && path.match(/\/api\/todo3\/\d+/)) {
    const id = path.split('/').pop();
    const todo: Todo = await request.json();
    const result = await env.DB.prepare(`
      UPDATE todo3 SET
        title = ?, content = ?, contentType = ?, age = ?, public = ?,
        foodOrange = ?, foodApple = ?, foodBanana = ?, foodMelon = ?, foodGrape = ?,
        datePublish = ?, dateUpdate = ?, postNumber = ?,
        addressCountry = ?, addressPref = ?, addressCity = ?, address1 = ?, address2 = ?,
        textOption1 = ?, textOption2 = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      todo.title, todo.content, todo.contentType, todo.age, todo.public,
      todo.foodOrange, todo.foodApple, todo.foodBanana, todo.foodMelon, todo.foodGrape,
      todo.datePublish, todo.dateUpdate, todo.postNumber,
      todo.addressCountry, todo.addressPref, todo.addressCity, todo.address1, todo.address2,
      todo.textOption1, todo.textOption2,
      id
    ).run();
    return { data:JSON.stringify(result ), status: 200 , ret: true}
    //return new Response(JSON.stringify(result), cors);
  }

  // Delete TODO
  if (request.method === 'DELETE' && path.match(/\/api\/todo3\/\d+/)) {
    const id = path.split('/').pop();
    const result = await env.DB.prepare('DELETE FROM todo3 WHERE id = ?').bind(id).run();
    return { data:JSON.stringify(result ), status: 200 , ret: true}
    //return new Response(JSON.stringify(result), cors);
  }

  // 404 for all other routes
  return { data: null, status: 0, ret: false };
  //return new Response('Not Found', { status: 404, ...cors });
} 
