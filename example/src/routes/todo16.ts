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

export async function todo16Router(
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
  if (path === '/api/todo16' && request.method === 'POST') {
    console.log("#Create /api/todo16")
    const body = await request.json();
    const { results } = await env.DB.prepare(
      `INSERT INTO todo16 (
        title, content, content_type, public_type,
        food_orange, food_apple, food_banana, food_melon, food_grape,
        category_food, category_drink, category_gadget, category_sport, category_government, category_internet, category_smartphone,
        country_jp, country_en, prefecture_jp, prefecture_en, post_no_jp, post_no_en,
        address_1_jp, address_1_en, address_2_jp, address_2_en, address_other_jp, address_other_en,
        pub_date1, pub_date2, pub_date3, pub_date4, pub_date5, pub_date6,
        qty1, qty2, qty3, qty4, qty5, qty6
        ) VALUES (
          ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?
      ) RETURNING *`
      ).bind(
      body.title, body.content, body.content_type, body.public_type,
      body.food_orange, body.food_apple, body.food_banana, body.food_melon, body.food_grape,
      body.category_food, body.category_drink, body.category_gadget, body.category_sport, body.category_government, body.category_internet, body.category_smartphone,
      body.country_jp, body.country_en, body.prefecture_jp, body.prefecture_en, body.post_no_jp, body.post_no_en,
      body.address_1_jp, body.address_1_en, body.address_2_jp, body.address_2_en, body.address_other_jp, body.address_other_en,
      body.pub_date1, body.pub_date2, body.pub_date3, body.pub_date4, body.pub_date5, body.pub_date6,
      body.qty1, body.qty2, body.qty3, body.qty4, body.qty5, body.qty6,
    ).all();
      //return new Response(JSON.stringify(results[0]), {
      //    headers: { "Content-Type": "application/json" },
      //    status: 201,
      //});    
    return { data: JSON.stringify(results[0]), status: 200 , ret: true}
  }
  // Read TODOs (with search)
  if (path === '/api/todo16' && request.method === 'GET') {
    console.log("# /api/todo16");
    //const searchTerm = url.searchParams.get('search') || '';
    const query = url.searchParams.get('query');
    let results;

    if (query) {
        const sqlQuery = `
            SELECT * FROM todo16 
            WHERE 
              title LIKE '%' || ? || '%' OR
              content LIKE '%' || ? || '%' OR
              content_type LIKE '%' || ? || '%' OR
              country_jp LIKE '%' || ? || '%' OR
              country_en LIKE '%' || ? || '%' OR
              prefecture_jp LIKE '%' || ? || '%' OR
              prefecture_en LIKE '%' || ? || '%' OR
              post_no_jp LIKE '%' || ? || '%' OR
              post_no_en LIKE '%' || ? || '%' OR
              address_1_jp LIKE '%' || ? || '%' OR
              address_1_en LIKE '%' || ? || '%' OR
              address_2_jp LIKE '%' || ? || '%' OR
              address_2_en LIKE '%' || ? || '%' OR
              address_other_jp LIKE '%' || ? || '%' OR
              address_other_en LIKE '%' || ? || '%'
            `;
        results = await env.DB.prepare(sqlQuery)
            .bind(query, query, query, query, query, query, query, query, query, query, query, query, query, query, query)
            .all();
    } else {
        results = await env.DB.prepare("SELECT * FROM todo16").all();
    }
    //return new Response(JSON.stringify(results.results), {
    //  headers: { "Content-Type": "application/json" },
    //});
    //const { results } = await env.DB.prepare('SELECT * FROM todo16').all();
    return { data:JSON.stringify(results.results), status: 200 , ret: true}

  }  

  // Update TODO
  //if (path.match(/\/api\/todo15\/\d+/) && request.method === 'PUT') {
  if (request.method === 'PUT') {
    const body = await request.json();
    console.log(body);
    const id = parseInt(path.split("/").pop(), 10);
    console.log("id=", id);

    const { results } = await env.DB.prepare(
      `UPDATE todo16 SET
      title = ?, content = ?, content_type = ?, public_type = ?,
      food_orange = ?, food_apple = ?, food_banana = ?, food_melon = ?, food_grape = ?,
      category_food = ?, category_drink = ?, category_gadget = ?, category_sport = ?, category_government = ?, category_internet = ?, category_smartphone = ?,
      country_jp = ?, country_en = ?, prefecture_jp = ?, prefecture_en = ?, post_no_jp = ?, post_no_en = ?,
      address_1_jp = ?, address_1_en = ?, address_2_jp = ?, address_2_en = ?, address_other_jp = ?, address_other_en = ?,
      pub_date1 = ?, pub_date2 = ?, pub_date3 = ?, pub_date4 = ?, pub_date5 = ?, pub_date6 = ?,
      qty1 = ?, qty2 = ?, qty3 = ?, qty4 = ?, qty5 = ?, qty6 = ?
      WHERE id = ? RETURNING *`
    ).bind(
        body.title, body.content, body.content_type, body.public_type,
        body.food_orange, body.food_apple, body.food_banana, body.food_melon, body.food_grape,
        body.category_food, body.category_drink, body.category_gadget, body.category_sport, body.category_government, body.category_internet, body.category_smartphone,
        body.country_jp, body.country_en, body.prefecture_jp, body.prefecture_en, body.post_no_jp, body.post_no_en,
        body.address_1_jp, body.address_1_en, body.address_2_jp, body.address_2_en, body.address_other_jp, body.address_other_en,
        body.pub_date1, body.pub_date2, body.pub_date3, body.pub_date4, body.pub_date5, body.pub_date6,
        body.qty1, body.qty2, body.qty3, body.qty4, body.qty5, body.qty6,
        id
    ).all();

    if (results.length === 0) {
        //return new Response("Not found", { status: 404 });
        return { data: null, status: 404 , ret: false}
    }

    //return new Response(JSON.stringify(results[0]), {
    //    headers: { "Content-Type": "application/json" },
    //})
    return { data:JSON.stringify(results[0]), status: 200 , ret: true}
  }    
  // Delete TODO
  //if (path.match(/\/api\/todo15\/\d+/) && request.method === 'DELETE') {
  if (request.method === 'DELETE') {
    const id = parseInt(path.split("/").pop(), 10);
    console.log(id);
    //const id = url.searchParams.get('id');
    console.log("#delete /api/todo16 =", id);
    const { success } = await env.DB.prepare("DELETE FROM todo16 WHERE id = ?").bind(id).run();

    if(success){
      //return new Response(null, { status: 204 });
      return { data: null, status: 204 , ret: true}
    }else{
      //return new Response("Not found", { status: 404 });
      return { data: null, status: 404 , ret: true}
    }

    //return { data: JSON.stringify(result), status: 200 , ret: true}
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
