# express-typescript-template

This is a template project for creating a brand new project of the Express with TypeScript, you don't need to create a project from scratch.

## Technical Stack

- Express
- TypeScript
- ESLint
- Prettier
- Husky
- lint-staged
- Dotenv
- Nodemon

## Environment Variables

This template uses the Dotenv package to load the `.env` file in the root, you can copy the `.env.template` as `.env` and put required variable into `.env` file.

## Linting

This template uses the Prettier package, the Husky package, and the lint-staged package to format the code automatically before committing.

## Scripts

### dev

`npm run dev`  
Start the development server and watch the changes of the files.

### start

`npm run start`  
Start the development server, but don't watch the changes of the files.

### build

`npm run build`  
Build the project.

## License

MIT
