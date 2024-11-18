import express from "express";
import { connectToDatabase } from '../lib/db.js';
import verifyToken from '../middleware/verifyToken.js';


const router = express.Router();
  
router.get('/findjob',verifyToken, async (req, res) => {
  const userId = req.userId;  //  obtener el ID del usuario desde el token de sesión o JWT
  try {
      const db = await connectToDatabase();
      const [profileData] = await db.query(`
          SELECT * FROM perfil WHERE username_id = ?
      `, [userId]);

      if (profileData.length > 0) {
          res.json(profileData[0]); // Enviar datos existentes si ya existen
      } else {
          res.json({ message: "No profile data" }); // Indica que no hay datos
      }
  } catch (error) {
      res.status(500).json({ error: "Error fetching profile data" });
  }
});
  

  export default router;
