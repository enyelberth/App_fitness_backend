/**
 * Entity: MuscleGroup (Grupo muscular)
 * Tabla: fitness_muscle_groups
 */
export class MuscleGroupEntity {
  id: string;
  name: string; // CHEST, BACK, LEGS, SHOULDERS, ARMS, ABS
  description?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
