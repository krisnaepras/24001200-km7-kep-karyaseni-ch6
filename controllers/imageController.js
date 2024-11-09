const imagekit = require("../libs/imagekit");
const prisma = require("../models/prismaClients");

class ImageController {
    static async imagekitUpload(req, res) {
        try {
            const files = req.files || [req.file];

            if (!files || files.length === 0) {
                return res.status(400).json({
                    status: false,
                    message: "No files uploaded",
                });
            }

            const results = [];
            for (const file of files) {
                const stringFile = file.buffer.toString("base64");

                const uploadFile = await imagekit.upload({
                    fileName: file.originalname,
                    file: stringFile,
                });

                const uploadedFileId = uploadFile.fileId;

                try {
                    const uploadGambar = await prisma.gambar.create({
                        data: {
                            judul: file.originalname,
                            deskripsi: req.body.deskripsi || null,
                            urlGambar: uploadFile.url,
                            fileId: uploadedFileId, 
                        },
                    });

                    results.push({
                        id: uploadGambar.id,
                        name: uploadGambar.judul,
                        url: uploadGambar.urlGambar,
                        type: uploadFile.fileType,
                    });
                } catch (gambarError) {
                    await imagekit.deleteFile(uploadedFileId);
                    return res.status(500).json({
                        status: false,
                        message: "Error uploading gambar, file has been deleted",
                        error: gambarError.message,
                    });
                }
            }

            return res.json({
                status: true,
                message: "success",
                data: results,
            });
        } catch (err) {
            return res.status(500).json({
                status: false,
                message: "Error uploading files",
                error: err.message,
            });
        } finally {
            await prisma.$disconnect();
        }
    }

    static async getAllGambar(req, res) {
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        try {
            const files = await prisma.gambar.findMany({
                take: parseInt(limit, 10) || undefined,
                skip: parseInt(skip, 10) || undefined,
            });

            return res.json({
                status: true,
                message: "Files fetched successfully",
                data: files,
            });
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: "Error fetching files",
                error: error.message,
            });
        } finally {
            await prisma.$disconnect();
        }
    }

    static async getDetailGambar(req, res) {
        const { id } = req.query;
        try {
            const file = await prisma.gambar.findUnique({
                where: { id: parseInt(id, 10) },
            });

            if (!file) {
                return res.status(404).json({
                    status: false,
                    message: "File not found",
                });
            }

            return res.json({
                status: true,
                message: "File fetched successfully",
                data: file,
            });
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: "Error fetching file",
                error: error.message,
            });
        } finally {
            await prisma.$disconnect();
        }
    }

    static async deleteGambar(req, res) {
        const { id } = req.query;
        try {
            const file = await prisma.gambar.findUnique({
                where: { id: parseInt(id, 10) },
            });

            if (!file) {
                return res.status(404).json({
                    status: false,
                    message: "File not found",
                });
            }

            await imagekit.deleteFile(file.fileId);

            await prisma.gambar.delete({ where: { id: parseInt(id, 10) } });

            return res.json({
                status: true,
                file: file.judul,
                message: "File deleted successfully",
            });
            
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: "Error deleting file",
                error: error.message,
            });
        } finally {
            await prisma.$disconnect();
        }
    }

    static async updateDetailsGambar(req, res) {
        const { id, judul, deskripsi } = req.query;
        try {
            const file = await prisma.gambar.update({
                where: { id: parseInt(id , 10) },
                data: {
                    judul: judul || null,
                    deskripsi: deskripsi || null,
                },
            });

            if (!file) {
                return res.status(404).json({
                    status: false,
                    message: "File not found",
                });
            }
            return res.json({
                status: true,
                message: "File updated successfully",
                data: file,
            });
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: "Error updating file",
                error: error.message,
            });
        } finally {
            await prisma.$disconnect();
        }
    }
}

module.exports = ImageController;