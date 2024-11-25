import { todoRouter } from './routes/todo';
import { todo2Router } from './routes/todo2';
import { todo3Router } from './routes/todo3';
import { todo4Router } from './routes/todo4';
import { todo5Router } from './routes/todo5';

interface Env {
  DB: D1Database;
}

interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // CORS プリフライトリクエストの処理
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders,
      });
    }  
    try{
      let res = {}
      res = await todoRouter(corsHeaders, request, env, Response);
      if(res.ret) {
        //console.log("todoRouter=F");
        return new Response(res.data, {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: res.status
        });
      }
      res = await todo2Router(corsHeaders, request, env, Response);
      if(res.ret) {
        return new Response(res.data, {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: res.status
        });
      }
      res = await todo3Router(corsHeaders, request, env, Response);
      if(res.ret) {
        return new Response(res.data, {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: res.status
        });
      }      
      res = await todo4Router(corsHeaders, request, env, Response);
      if(res.ret) {
        return new Response(res.data, {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: res.status
        });
      }
      res = await todo5Router(corsHeaders, request, env, Response);
      if(res.ret) {
        return new Response(res.data, {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: res.status
        });
      }

      return new Response('Not Found', {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      });
      /*
      return new Response(res.data, {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: res.status
      });
      */
    } catch (error) {
      console.error('Error:', error);
      return new Response('Internal Server Error', {
        headers: corsHeaders,
        status: 500,
      });
    }
  },
};
/*
*/
