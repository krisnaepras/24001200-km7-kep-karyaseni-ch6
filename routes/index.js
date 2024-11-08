const router = require("express").Router();
const ImageController = require("../controllers/imageController");
const multer = require("../libs/multer");

router.post("/imagekit", multer.single("file"), ImageController.imagekitUpload);
router.post(
    "/imagekit-array",
    multer.array("files", 12),
    ImageController.imagekitUpload
);

router.get("/get-all-gambar", ImageController.getAllGambar);
router.get("/get-gambar", ImageController.getDetailGambar);

router.delete("/delete-gambar", ImageController.deleteGambar);

router.put("/update-gambar", ImageController.updateDetailsGambar);

module.exports = router;
