import {
  StallRepository,
  type CreateStallInput,
  type FindAllParams,
  type UpdateStallInput,
} from '../repositories/stallRepository.ts';
import { MenuItemRepository } from '../repositories/menuItemRepository.ts';
import { ApiRepository } from '../repositories/apiRepository.ts';
import type { MenuItemDto, StallResponseDto } from '../dtos/stallDto.ts';
import type { CreateReviewBody } from '../schemas/stall.schema.ts';
import type { Role } from '../utils/jwt.ts';
import { AppError } from '../errors/AppError.ts';

type StallRow = NonNullable<Awaited<ReturnType<StallRepository['findById']>>>;

const STALL_NOT_FOUND_MESSAGE = 'Data warung tidak ditemukan';

export class StallService {
  private stallRepository: StallRepository;
  private menuItemRepository: MenuItemRepository;
  private apiRepository: ApiRepository;

  constructor(
    stallRepository: StallRepository = new StallRepository(),
    menuItemRepository: MenuItemRepository = new MenuItemRepository(),
    apiRepository: ApiRepository = new ApiRepository(),
  ) {
    this.stallRepository = stallRepository;
    this.menuItemRepository = menuItemRepository;
    this.apiRepository = apiRepository;
  }

  // Mapping row DB -> DTO API (sekaligus logika bisnis isPopular).
  private toDto(row: StallRow): StallResponseDto {
    const avgRating = Number(row.avgRating);
    return {
      id: row.id,
      ownerId: row.ownerId,
      name: row.name,
      category: row.category,
      location: row.location,
      description: row.description,
      avgRating,
      reviewCount: row.reviewCount,
      isPopular: avgRating >= 4.7,
    };
  }

  async getAllStalls(params: FindAllParams) {
    const { rows, total } = await this.stallRepository.findAll(params);
    return { data: rows.map((row) => this.toDto(row)), total };
  }

  async getStallById(id: number): Promise<StallResponseDto> {
    const row = await this.stallRepository.findById(id);
    if (!row) throw new AppError(404, STALL_NOT_FOUND_MESSAGE);
    return this.toDto(row);
  }

  async getStallMenus(id: number): Promise<MenuItemDto[]> {
    const row = await this.stallRepository.findById(id);
    if (!row) throw new AppError(404, STALL_NOT_FOUND_MESSAGE);
    return this.menuItemRepository.findByStallId(id);
  }

  async createStall(input: CreateStallInput): Promise<StallResponseDto> {
    const row = await this.stallRepository.create(input);
    if (!row) throw new AppError(500, 'Gagal membuat data warung');
    return this.toDto(row);
  }

  async updateStall(
    id: number,
    input: UpdateStallInput,
    actor: { id: number; role: Role },
  ): Promise<StallResponseDto> {
    const existing = await this.stallRepository.findById(id);
    if (!existing) throw new AppError(404, STALL_NOT_FOUND_MESSAGE);

    // Owner hanya boleh mengubah warung miliknya; admin boleh semua.
    if (actor.role === 'owner' && existing.ownerId !== actor.id) {
      throw new AppError(403, 'Anda hanya boleh mengubah warung milik sendiri');
    }

    const row = await this.stallRepository.update(id, input);
    if (!row) throw new AppError(404, STALL_NOT_FOUND_MESSAGE);
    return this.toDto(row);
  }

  async deleteStall(id: number): Promise<StallResponseDto> {
    const row = await this.stallRepository.remove(id);
    if (!row) throw new AppError(404, STALL_NOT_FOUND_MESSAGE);
    return this.toDto(row);
  }

  async createReview(stallId: number, userId: number, input: CreateReviewBody) {
    const stall = await this.stallRepository.findById(stallId);
    if (!stall) throw new AppError(404, STALL_NOT_FOUND_MESSAGE);

    const review = await this.apiRepository.createReview({
      stallId,
      userId,
      rating: input.rating,
      comment: input.comment ?? null,
    });
    if (!review) throw new AppError(500, 'Gagal menambahkan review');
    return review;
  }
}