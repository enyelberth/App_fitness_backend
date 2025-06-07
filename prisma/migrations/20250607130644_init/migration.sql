-- CreateTable
CREATE TABLE "Cliente" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT,
    "fecha_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rutina" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "cliente_id" INTEGER,

    CONSTRAINT "Rutina_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ejercicio" (
    "id" BIGSERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "Ejercicio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RutinaEjercicio" (
    "id" SERIAL NOT NULL,
    "rutina_id" INTEGER,
    "ejercicio_id" BIGINT,
    "repeticiones" INTEGER,
    "series" INTEGER,

    CONSTRAINT "RutinaEjercicio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Musculo" (
    "id" BIGSERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Musculo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EjercicioMusculo" (
    "id" BIGSERIAL NOT NULL,
    "ejercicio_id" BIGINT,
    "musculo_id" BIGINT,

    CONSTRAINT "EjercicioMusculo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Progreso" (
    "id" BIGSERIAL NOT NULL,
    "cliente_id" INTEGER,
    "ejercicio_id" BIGINT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "repeticiones" INTEGER,
    "peso" DECIMAL(65,30),
    "comentarios" TEXT,

    CONSTRAINT "Progreso_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_email_key" ON "Cliente"("email");

-- AddForeignKey
ALTER TABLE "Rutina" ADD CONSTRAINT "Rutina_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "Cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RutinaEjercicio" ADD CONSTRAINT "RutinaEjercicio_rutina_id_fkey" FOREIGN KEY ("rutina_id") REFERENCES "Rutina"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RutinaEjercicio" ADD CONSTRAINT "RutinaEjercicio_ejercicio_id_fkey" FOREIGN KEY ("ejercicio_id") REFERENCES "Ejercicio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EjercicioMusculo" ADD CONSTRAINT "EjercicioMusculo_ejercicio_id_fkey" FOREIGN KEY ("ejercicio_id") REFERENCES "Ejercicio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EjercicioMusculo" ADD CONSTRAINT "EjercicioMusculo_musculo_id_fkey" FOREIGN KEY ("musculo_id") REFERENCES "Musculo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Progreso" ADD CONSTRAINT "Progreso_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "Cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Progreso" ADD CONSTRAINT "Progreso_ejercicio_id_fkey" FOREIGN KEY ("ejercicio_id") REFERENCES "Ejercicio"("id") ON DELETE SET NULL ON UPDATE CASCADE;
