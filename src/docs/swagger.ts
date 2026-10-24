import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: { title: 'Review Kantin API', version: '1.0.0' },
  servers: [{ url: 'http://localhost:3000' }],
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
      description: 'Isi dengan: Bearer <token>',
    },
  },
  definitions: {
    UserInput: {
      $name: 'Nama Pengguna',
      $email: 'user@example.test',
      $passwordHash: 'hash-password',
      $role: 'customer',
    },
    MenuItemInput: {
      $stallId: 1,
      $name: 'Nasi Goreng',
      $price: 15000,
      isAvailable: true,
    },
    ReviewInput: {
      $stallId: 1,
      $userId: 12,
      $rating: 5,
      comment: 'Enak!',
    },
    LikeInput: {
      $reviewId: 1,
    },
    FlagStatusInput: {
      $status: 'resolved',
    },
    AuditLogInput: {
      $userId: 1,
      $action: 'UPDATE',
      $targetTable: 'FLAGS',
      $targetId: 1,
      metadata: '{"status":"resolved"}',
    },
    StallInput: {
      $name: 'Warung Baru',
      category: 'Nasi',
      location: 'Kantin FK',
      description: 'Deskripsi warung',
    },
    RegisterInput: {
      $name: 'Budi Santoso',
      $email: 'budi@example.com',
      $password: 'rahasia123',
    },
    LoginInput: {
      $email: 'admin@kantin.test',
      $password: 'Password123!',
    },
    StallReviewInput: {
      $rating: 5,
      comment: 'Enak!',
    },
  },
};

const outputFile = './src/docs/swagger-output.json';
const endpointsFiles = ['./src/index.ts'];

swaggerAutogen()(outputFile, endpointsFiles, doc);
