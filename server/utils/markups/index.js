const host = process.env.ENVIRONMENT === 'development' ? 'http://localhost:3000/' : 'https://authorshaven.herokuapp.com/';
export default host;
