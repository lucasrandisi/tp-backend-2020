const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

function createToken(user, SECRET_KEY, expiresIn) {
	const { id, username, email } = user;
	const payload = {
		id,
		username,
		email,
	};
	return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

async function register(input, db) {
	const { username, password, email } = input;

	const findEmail = await db.user.findOne({ where: { email } });
	const findUsername = await db.user.findOne({ where: { username } });

	if (findEmail) throw new Error('Email is already taken');
	if (findUsername) throw new Error('Username is already taken');

	// encripto contraseña
	const salt = await bcryptjs.genSaltSync(10);
	const passwordCript = await bcryptjs.hash(password, salt);

	try {
		return db.user.create({
			username: username.toLowerCase(),
			password: passwordCript,
			email: email.toLowerCase(),
		});
	} catch (error) {
		throw new Error(error.message);
	}
}

async function login(input, db) {
	const { email, password } = input;

	const findUser = await db.user.findOne({
		where: { email: email.toLowerCase() },
	});

	if (!findUser) throw new Error('Email or password incorrect');

	const pswSucess = await bcryptjs.compare(password, findUser.password);

	if (!pswSucess) throw new Error('Email or password incorrect');

	return {
		token: createToken(findUser, process.env.SECRET_KEY, '24h'),
	};
}

module.exports = {
	register,
	login,
};
