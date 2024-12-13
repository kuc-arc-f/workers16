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

export async function todo17Router(
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
  if (path === '/api/todo17' && request.method === 'POST') {
    console.log("#Create /api/todo17")
    const body = await request.json();
    const {
        title,
        content,
        content_type,
        public_type,
        food_orange,
        food_apple,
        food_banana,
        food_melon,
        food_grape,
        category_food,
        category_drink,
        category_gadget,
        category_sport,
        category_government,
        category_internet,
        category_smartphone,
        country_jp,
        country_en,
        prefecture_jp,
        prefecture_en,
        post_no_jp,
        post_no_en,
        address_1_jp,
        address_1_en,
        address_2_jp,
        address_2_en,
        address_other_jp,
        address_other_en,
        pub_date1,
        pub_date2,
        pub_date3,
        pub_date4,
        pub_date5,
        pub_date6,
        qty1,
        qty2,
        qty3,
        qty4,
        qty5,
        qty6,
    } = body;
  
    const stmt = env.DB.prepare(
        `INSERT INTO todo17 (
            title, content, content_type, public_type,
            food_orange, food_apple, food_banana, food_melon, food_grape,
            category_food, category_drink, category_gadget, category_sport, category_government, category_internet, category_smartphone,
            country_jp, country_en, prefecture_jp, prefecture_en,
            post_no_jp, post_no_en, address_1_jp, address_1_en,
            address_2_jp, address_2_en, address_other_jp, address_other_en,
            pub_date1, pub_date2, pub_date3, pub_date4, pub_date5, pub_date6,
            qty1, qty2, qty3, qty4, qty5, qty6
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );
    
    const info = await stmt.bind(
      title,
      content,
      content_type,
      public_type,
      food_orange,
      food_apple,
      food_banana,
      food_melon,
      food_grape,
      category_food,
      category_drink,
      category_gadget,
      category_sport,
      category_government,
      category_internet,
      category_smartphone,
      country_jp,
      country_en,
      prefecture_jp,
      prefecture_en,
      post_no_jp,
      post_no_en,
      address_1_jp,
      address_1_en,
      address_2_jp,
      address_2_en,
      address_other_jp,
      address_other_en,
      pub_date1,
      pub_date2,
      pub_date3,
      pub_date4,
      pub_date5,
      pub_date6,
      qty1,
      qty2,
      qty3,
      qty4,
      qty5,
      qty6
    ).run();

    return { data: JSON.stringify({ id: info.lastRowId }), status: 200 , ret: true}
  }
  // Read TODOs (with search)
  if (path === '/api/todo17' && request.method === 'GET') {
    console.log("# /api/todo17");
    //const searchTerm = url.searchParams.get('search') || '';
    const query = url.searchParams.get('query');
    let stmt;

    if (query) {
      stmt = env.DB.prepare(`
        SELECT * FROM todo17
        WHERE title LIKE ? OR content LIKE ? OR content_type LIKE ?
      `).bind(`%${query}%`, `%${query}%`, `%${query}%`);
    } else {
      stmt = env.DB.prepare("SELECT * FROM todo17");
    }
    
    const { results } = await stmt.all();
    //return new Response(JSON.stringify(results), {
    //  headers: { ...corsHeaders, "Content-Type": "application/json" },
    //});
    return { data:JSON.stringify(results), status: 200 , ret: true}

  }  

  // Update TODO
  //if (path.match(/\/api\/todo17\/\d+/) && request.method === 'PUT') {
  if (request.method === 'PUT') {
    const body = await request.json();
    console.log(body);
    const {
        id,
        title,
        content,
        content_type,
        public_type,
        food_orange,
        food_apple,
        food_banana,
        food_melon,
        food_grape,
        category_food,
        category_drink,
        category_gadget,
        category_sport,
        category_government,
        category_internet,
        category_smartphone,
        country_jp,
        country_en,
        prefecture_jp,
        prefecture_en,
        post_no_jp,
        post_no_en,
        address_1_jp,
        address_1_en,
        address_2_jp,
        address_2_en,
        address_other_jp,
        address_other_en,
        pub_date1,
        pub_date2,
        pub_date3,
        pub_date4,
        pub_date5,
        pub_date6,
        qty1,
        qty2,
        qty3,
        qty4,
        qty5,
        qty6,
    } = body;
  
  
    const stmt = db.prepare(`
        UPDATE todo17 SET
            title = ?, content = ?, content_type = ?, public_type = ?,
            food_orange = ?, food_apple = ?, food_banana = ?, food_melon = ?, food_grape = ?,
            category_food = ?, category_drink = ?, category_gadget = ?, category_sport = ?, category_government = ?, category_internet = ?, category_smartphone = ?,
            country_jp = ?, country_en = ?, prefecture_jp = ?, prefecture_en = ?,
            post_no_jp = ?, post_no_en = ?, address_1_jp = ?, address_1_en = ?,
            address_2_jp = ?, address_2_en = ?, address_other_jp = ?, address_other_en = ?,
            pub_date1 = ?, pub_date2 = ?, pub_date3 = ?, pub_date4 = ?, pub_date5 = ?, pub_date6 = ?,
            qty1 = ?, qty2 = ?, qty3 = ?, qty4 = ?, qty5 = ?, qty6 = ?
        WHERE id = ?
    `);
  
  
    await stmt.bind(
        title,
        content,
        content_type,
        public_type,
        food_orange,
        food_apple,
        food_banana,
        food_melon,
        food_grape,
        category_food,
        category_drink,
        category_gadget,
        category_sport,
        category_government,
        category_internet,
        category_smartphone,
        country_jp,
        country_en,
        prefecture_jp,
        prefecture_en,
        post_no_jp,
        post_no_en,
        address_1_jp,
        address_1_en,
        address_2_jp,
        address_2_en,
        address_other_jp,
        address_other_en,
        pub_date1,
        pub_date2,
        pub_date3,
        pub_date4,
        pub_date5,
        pub_date6,
        qty1,
        qty2,
        qty3,
        qty4,
        qty5,
        qty6,
        id
    ).run();
    //return new Response(null, {
    //    status: 204,
    //    headers: corsHeaders,
    //});    
    return { data: null, status: 204 , ret: true}
  }    
  // Delete TODO
  if (request.method === 'DELETE') {
    //const id = parseInt(path.split("/").pop(), 10);
    const { id } = await request.json();
    console.log(id);
    const stmt = env.DB.prepare("DELETE FROM todo17 WHERE id = ?");
    await stmt.bind(id).run();
  
    //return new Response(null, {
    //    status: 204,
    //    headers: corsHeaders,
    //});
    console.log("#delete /api/todo17 =", id);
    return { data: null, status: 204 , ret: true}
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
