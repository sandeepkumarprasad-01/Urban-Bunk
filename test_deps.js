const dependencies = [
  'express',
  'mongoose',
  'method-override',
  'express-session',
  'connect-mongo',
  'passport',
  'connect-flash',
  'bcryptjs',
  'ejs',
  'dotenv',
  'passport-local'
];
for (const name of dependencies) {
  try {
    require(name);
  } catch (err) {
    console.log(`Missing module: ${name}`);
  }
}
