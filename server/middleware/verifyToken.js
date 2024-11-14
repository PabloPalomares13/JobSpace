import jwt from 'jsonwebtoken';

const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1]; // Token en formato "Bearer <token>"
        
        if (!token) {
            return res.status(403).json({ message: "No token provided" });
        }
        
        // Verificar y decodificar el token
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userId = decoded.id; // Adjuntar `userId` al objeto `req`
        console.log('User ID:', req.userId);
        next(); // Continuar con la ejecución de la ruta
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};

export default verifyToken;