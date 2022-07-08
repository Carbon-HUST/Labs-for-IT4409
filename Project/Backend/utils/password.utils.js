const bcryptjs = require('bcryptjs');

const hashPassword = async (password, saltRound = 10) => {
    const salt = await bcryptjs.genSalt(saltRound);
    const hashedPassword = await bcryptjs.hash(password, salt);
    return {
        salt,
        hashedPassword
    }
}

const comparePassword = async (candidatePassword, realHashedPassword) => {
    return await bcryptjs.compare(candidatePassword, realHashedPassword);
}

module.exports = {
    hashPassword,
    comparePassword
}