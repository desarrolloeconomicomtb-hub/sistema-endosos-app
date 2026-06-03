-- CreateTable
CREATE TABLE "Evento" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "codigo" TEXT,
    "nombre" TEXT NOT NULL,
    "fechas" TEXT NOT NULL,
    "ubicacion" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Categoria" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Endoso" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "controlNumber" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "address" TEXT,
    "representante" TEXT,
    "telefono" TEXT,
    "email" TEXT,
    "descripcion" TEXT,
    "fechasEvento" TEXT NOT NULL,
    "ubicacion" TEXT NOT NULL,
    "tarima" TEXT,
    "reciboPatente" TEXT,
    "reciboAmbulante" TEXT,
    "reciboBebidas" TEXT,
    "exentoPago" BOOLEAN NOT NULL DEFAULT false,
    "exentoRazon" TEXT,
    "visitedAt" DATETIME,
    "issueDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eventoId" TEXT NOT NULL,
    "categoriaId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Emitido',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Endoso_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Endoso_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Evento_codigo_key" ON "Evento"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Endoso_controlNumber_key" ON "Endoso"("controlNumber");

