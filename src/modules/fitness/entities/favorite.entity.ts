/**
 * Entity: Favorite (Favoritos)
 * Tabla: fitness_favorites
 */
export class FavoriteEntity {
  id: string;
  userId: string;
  type: string; // EXERCISE, WORKOUT
  targetId: string;
  createdAt: Date;
}
