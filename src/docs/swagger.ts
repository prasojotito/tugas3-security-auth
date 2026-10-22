import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: { title: 'Review Kantin API', version: '1.0.0' },
  servers: [{ url: 'http://localhost:3000' }],
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
      $userId: 12,
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
      $ownerId: 2,
      $name: 'Warung Baru',
      category: 'Nasi',
      location: 'Kantin FK',
      description: 'Deskripsi warung',
    },
  },
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./src/index.ts'];

swaggerAutogen()(outputFile, endpointsFiles, doc);
