import { todoRouter } from './routes/todo';
import { todo2Router } from './routes/todo2';
import { todo3Router } from './routes/todo3';
import { todo4Router } from './routes/todo4';
import { todo5Router } from './routes/todo5';
import { todo11Router } from './routes/todo11';
import { todo12Router } from './routes/todo12';
import { todo13Router } from './routes/todo13';
import { todo14Router } from './routes/todo14';
import { todo15Router } from './routes/todo15';
import { todo16Router } from './routes/todo16';
import { todo17Router } from './routes/todo17';
import { todo21Router } from './routes/todo21';
import { tauriTodoRouter }   from './routes/tauriTodo';
import { tauriTodo11Router } from './routes/tauriTodo11';
import { tauriTodo14Router } from './routes/tauriTodo14';

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
    const url = new URL(request.url);
    const path = url.pathname;
//console.log("url=", url);
console.log("path=", path);
    try{
      let res = {}
      if (path.startsWith('/api/tauri_todo11')) {
        res = await tauriTodo11Router(corsHeaders, request, env, Response);
        if(res.ret) {
          return new Response(res.data, {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: res.status
          });
        }
      }

      if (path.startsWith('/api/tauri_todo14')) {
        res = await tauriTodo14Router(corsHeaders, request, env, Response);
        if(res.ret) {
          return new Response(res.data, {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: res.status
          });
        }
      }
      if (path.startsWith('/api/tauri_todo')) {
        res = await tauriTodoRouter(corsHeaders, request, env, Response);
        if(res.ret) {
          return new Response(res.data, {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: res.status
          });
        }
      }

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
      //todo11
      if (path.startsWith('/api/todo11')) {
        res = await todo11Router(corsHeaders, request, env, Response);
        if(res.ret) {
          return new Response(res.data, {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: res.status
          });
        }
      }
      if (path.startsWith('/api/todo12')) {
        res = await todo12Router(corsHeaders, request, env, Response);
        if(res.ret) {
          return new Response(res.data, {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: res.status
          });
        }
      }
      if (path.startsWith('/api/todo13')) {
        res = await todo13Router(corsHeaders, request, env, Response);
        if(res.ret) {
          return new Response(res.data, {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: res.status
          });
        }
      }

      if (path.startsWith('/api/todo14')) {
        res = await todo14Router(corsHeaders, request, env, Response);
        if(res.ret) {
          return new Response(res.data, {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: res.status
          });
        }
      }
      if (path.startsWith('/api/todo15')) {
        res = await todo15Router(corsHeaders, request, env, Response);
        if(res.ret) {
          return new Response(res.data, {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: res.status
          });
        }
      }

      if (path.startsWith('/api/todo16')) {
        res = await todo16Router(corsHeaders, request, env, Response);
        if(res.ret) {
          return new Response(res.data, {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: res.status
          });
        }
      }
      
      if (path.startsWith('/api/todo17')) {
        res = await todo17Router(corsHeaders, request, env, Response);
        if(res.ret) {
          return new Response(res.data, {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: res.status
          });
        }
      }
      if (path.startsWith('/api/todo21')) {
        res = await todo21Router(corsHeaders, request, env, Response);
        if(res.ret) {
          return new Response(res.data, {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: res.status
          });
        }
      }


      return new Response('Not Found', {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      });
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
