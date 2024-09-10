import cors from 'cors';

const corsOptions = {
  origin: function (origin, callback) {
    // Permitir qualquer origem durante o desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    // Adicione URLs específicas para produção
    const allowedOrigins = ['http://localhost:3001'];
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('Não permitido por CORS'), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

export default cors(corsOptions);
