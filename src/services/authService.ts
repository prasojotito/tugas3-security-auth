import bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/userRepository.ts';
import { AppError } from '../errors/AppError.ts';
import { signToken } from '../utils/jwt.ts';

const BCRYPT_ROUNDS = 10;

type UserRow = NonNullable<Awaited<ReturnType<UserRepository['findById']>>>;

// Data user yang aman dikirim ke klien (tanpa passwordHash).
const toPublicUser = (row: UserRow) => ({
  id: row.id,
  name: row.name,
  email: row.email,
  role: row.role,
});

export class AuthService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository = new UserRepository()) {
    this.userRepository = userRepository;
  }

  async register(input: { name: string; email: string; password: string }) {
    const existing = await this.userRepository.findByEmail(input.email);
    if (existing) throw new AppError(409, 'Email sudah terdaftar');

    const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);
    const user = await this.userRepository.create({
      name: input.name,
      email: input.email,
      passwordHash,
      role: 'customer',
    });
    if (!user) throw new AppError(500, 'Gagal membuat akun');
    return toPublicUser(user);
  }

  async login(input: { email: string; password: string }) {
    const user = await this.userRepository.findByEmail(input.email);
    const passwordMatch = user ? await bcrypt.compare(input.password, user.passwordHash) : false;
    // Pesan sama untuk email salah maupun password salah.
    if (!user || !passwordMatch) throw new AppError(401, 'Email atau password salah');

    const token = signToken({ id: user.id, role: user.role });
    return { token, user: toPublicUser(user) };
  }

  async getProfile(id: number) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new AppError(401, 'Akun tidak ditemukan');
    return toPublicUser(user);
  }
}