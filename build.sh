#tsc && node ./bin/rs-ssg.js  && cd playground && pnpm install && npm run build


rm -rf my-app && pnpm remove -g rs-ssg && pnpm link && rs-ssg init my-app && pnpm install