import bcrypt from 'bcryptjs';

const password = 'admin123';
bcrypt.genSalt(10, (err, salt) => {
  if (err) throw err;
  bcrypt.hash(password, salt, (err, hash) => {
    if (err) throw err;
    console.log('Hash para admin123:', hash);
  });
});
