import { Router } from "express";
import * as Yonetici from "../denetleyiciler/yoneticiDenetleyici.js";

const router = Router();

// ✅ Sağlık kontrolü
router.get("/saglik", Yonetici.saglik);

// ✅ Bekleyen öğrencileri getir
router.get("/ogrenciler", Yonetici.listeleOgrenciler);

// ✅ Öğrenciyi onayla
router.post("/onayla", Yonetici.onaylaOgrenci);

export default router;
