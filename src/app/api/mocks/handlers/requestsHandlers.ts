import envConfig from '@app/config/envConfig';
import { faker } from '@faker-js/faker';
import { rest } from 'msw';

const baseURL = envConfig.base_url;

interface Pharmacy {
  id: number | string;
  // Add other properties as needed
  nameEn: string;
}

interface Admin {
  id: number | string;
  // Add other properties as needed
}

interface Contract {
  id: number | string;
  // Add other properties as needed
}

interface Reason {
  id: number | string;
  // Add other properties as needed
}

interface Request {
  id: number | string;
  pharmacy: Pharmacy;
  admin: Admin;
  email?: string;
  nameEn?: string;
  nameAr?: string;
  cityId?: number;
  latitude?: number;
  longitude?: number;
  streetName?: string;
  subAdministrativeArea?: string;
  building?: string;
  landmark?: string;
  contract?: Contract;
  contractId?: number;
  status?: string;
  reason?: string;
  reasonId?: number;
  approval: string;
  approvedAt?: Date;
  createdAt: Date;
}

// ...

// Generate a random request object
function generateRequest(): Request {
  const request: Request = {
    id: faker.number.int(),
    pharmacy: {
      id: faker.number.int(),
      nameEn: faker.company.name(),
    },
    admin: {
      id: faker.number.int(),
    },
    email: faker.internet.email(),
    nameEn: faker.name.fullName(),
    nameAr: faker.name.fullName(),
    cityId: faker.number.int(),
    latitude: faker.location.latitude(),
    longitude: faker.location.longitude(),
    streetName: faker.location.streetAddress(),
    subAdministrativeArea: faker.location.city(),
    building: faker.location.buildingNumber(),
    landmark: faker.location.secondaryAddress(),
    contract: {
      id: faker.number.int(),
    },
    contractId: faker.number.int(),
    status: faker.helpers.arrayElement(['ACTIVATE', 'SUSPENDED']),
    reason: faker.lorem.paragraph(3),
    reasonId: faker.number.int(),
    approval: faker.random.word(),
    approvedAt: faker.date.past(),
    createdAt: faker.date.past(),
  };

  return request;
}

function generateRequestList(count: number): Request[] {
  const requests: Request[] = [];
  for (let i = 0; i < count; i++) {
    requests.push(generateRequest());
  }
  return requests;
}

export const requestsList = rest.get(`${baseURL}pharmacies/requests-list/`, (req, res, ctx) => {
  const obj = {
    success: true,
    data: { requests: generateRequestList(15) },
  };

  return res(
    // Respond with a 200 status code and JSON data
    ctx.delay(2000),
    ctx.status(200),
    ctx.json(obj)
  );
});
