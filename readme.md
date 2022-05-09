Here is short description how to write MVP (Minimum Viable Product) functionality to be integrated to `planner5d.com`.

# Quick-start

* Install `NodeJs`
* Install dependencies: `npm install`
* Build: `npm run build`
* Start development server: `npm run dev-server`

# Process of building and launching MVP

1. Someone from `Planner 5D team` orders an MVP
2. `Planner 5D delivery team` is informed that MVP is being developed and given contacts of `Developer` who is doing MVP
3. `Developer` creates the MVP and sends it as `.gitbundle` to `Planner 5D delivery team` 
4. `Planner 5D delivery team` creates a task in `Jira` to deploy the MVP
5. `Planner 5D developers` finish developing and deploy the MVP on `https://planner5d.com/[name]`
6. All done

# Requirements

* Continue working on this Git repository - commit to it locally
* Follow file structure as described in `Structure` section

#### Writing code

* Write `TypeScript` code for scripts (do not write `JavaScript` code)
  * See example and comments in `/assets/typescript/bootstrap.ts` how it is done there and follow that
  * If you need some functionality provided from `Planner 5D` then you should add it to `RequiredApi` as methods with 
    a clear and detailed comment near each method of what you need there
  * Avoid using dynamic types as much as possible (`any`, `unknown`, ...)
  * Recommendation is to use best practices (`STUPID`, `KISS`, `SOLID`, `SoC`, `design patterns`, ...)
* Write `HTML` in a *single and static* `/public/index.html`
* Write `SCSS` code for styles (do not write raw `CSS`)
* Add your `images` - it is best to use `.jpg`, if not possible then `.png`
  * If very critical you can use `.webp`, just make sure it has correct fallback setup 

#### Do not

* Do not write code in other languages, like `Python`, `Java`, `PHP`, ...
  * Do not use servers for your MVP, like `Tomcat`, `nginx`, ... - it should be just a single page `HTML` app
* Do not add more `HTML` files or generate `HTML` dynamically using `React`, `.tsx` or similar
* Do not write third party applications, for example `Slack`, `Discord`, `Intercom` custom application
  * If it is critical to MVP - first confirm with `Planner 5D` team
* Do not use any big frameworks like `Vue`, `Angular`, `React`
* Do not use external libraries
  * If it is critical to MVP - first confirm with `Planner 5D` team and then make sure that library and 
    **all it's dependencies** are using one of those licenses: `MIT`, `Apache` or `BSD`

## Structure

* `/assets/typescript` - add your `TypeScript` code here
* `/assets/scss` - add your `SCSS` code here
* `/package.json` - `Node`, `webpack`, `TypeScript` dependencies are here (avoid adding any dependencies)
* `/public/index.html` - add your `HTML` code
* `/public/images` - add your `images` here
* `/public/js/build` - built `JavaScript` files will be here
* `/public/css/build` - built `CSS` files will be here

# How we will integrate everything

Shortly how we will integrate your written code, it might help you understand how to better structure it.

1. We will take your `HTML` and create a page where we will put it, for example `https://planner5d.com/skeleton`
2. We will take your `CSS` and put it to our website so that it can be used by your page
3. We will implement functionality you need in `RequiredApi`