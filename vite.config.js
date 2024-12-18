import { defineConfig ,loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';


// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode,process.cwd())
  return {
    server: {
      host: '0.0.0.0',
      // 应用端口 (默认:3000)
      port: Number(env.VITE_APP_PORT),
      // 运行是否自动打开浏览器
      open: true,
      proxy: {
        /** 代理前缀为 /dev-api 的请求  */
       
        [env.VITE_APP_BASE_API]: {
          changeOrigin: true,
          // 接口地址
          target: env.VITE_APP_API_URL,
          rewrite: (path) =>
            path.replace(new RegExp("^" + env.VITE_APP_BASE_API), ""),
        }
      }
    },
    plugins: [vue()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname,'src')
        }
    }
  }
})
