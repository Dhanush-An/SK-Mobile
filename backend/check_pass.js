const bcrypt = require('bcryptjs');

const check = async () => {
    const pass = 'Admin@123';
    const hash = '$2a$10$AvcYSbdsLT1lpumNzGNpqOMQ5HyKFFKjxFZD8hYyYY6FkOUGRG7RW';
    const isMatch = await bcrypt.compare(pass, hash);
    console.log('Password match:', isMatch);
};

check();
