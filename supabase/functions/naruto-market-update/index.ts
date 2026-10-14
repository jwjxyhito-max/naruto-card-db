import {createHandler} from "./handler.mjs";
Deno.serve(createHandler(key => Deno.env.get(key)));
