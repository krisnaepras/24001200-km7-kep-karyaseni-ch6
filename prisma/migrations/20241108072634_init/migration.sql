-- CreateTable
CREATE TABLE "Gambar" (
    "id" SERIAL NOT NULL,
    "judul" TEXT NOT NULL,
    "deskripsi" TEXT,
    "urlGambar" TEXT NOT NULL,

    CONSTRAINT "Gambar_pkey" PRIMARY KEY ("id")
);
