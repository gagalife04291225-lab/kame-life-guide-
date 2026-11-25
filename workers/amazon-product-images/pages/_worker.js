import {serve} from '../src/index.mjs';
export default {
  fetch(request, env) {
    return serve(request, env, Date.now(), true);
  }
};
