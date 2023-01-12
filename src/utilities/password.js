import bcrypt from "bcrypt";

export async function verifyPassword(profile, password) {
  return bcrypt.compareSync(password, profile.password);
}

export async function generateHash(password) {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = await bcrypt.hash(password, salt);

  return { hash, salt };
}
