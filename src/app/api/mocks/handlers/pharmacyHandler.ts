import envConfig from '@app/config/envConfig';
import { rest } from 'msw';

const baseURL = envConfig.base_url;

export const getPharmacy = rest.get(`${baseURL}pharmacies/pharmacy-details/12`, (req, res, ctx) => {
  const obj = {
    success: true,
    data: {
      isMSW: true,
      id: 12,
      email: 'dr.osama@hsi-eg.co',
      username: 'DrOsama_P1679915957474',
      nameEn: 'Dr Osama (TEST)',
      nameAr: 'صيدلية د أسامة',
      cityId: 1,
      streetName: 'El Galaa Street',
      subAdministrativeArea: 'Montaza district',
      building: '35',
      landmark: 'Victoria Hospital ',
      ownerPhoneNumber: '+201000063118',
      whatsAppNumber: '+201000063118',
      hotline: '+20+212045',
      description: 'Pharmacy',
      latitude: '31.215822',
      longitude: '29.945785',
      hasCompeletedProfile: true,
      hasChangedPassword: true,
      status: 'ACTIVE',
      pointsNumber: 20,
      pickupMethod: 'BOTH',
      imagePath: 'uploadedImage-96a67e9a-6822-48eb-aa76-3b1453c14043',
      imageLink:
        'https://firebasestorage.googleapis.com/v0/b/shefaa-dev.appspot.com/o/uploadedImage-96a67e9a-6822-48eb-aa76-3b1453c14043?alt=media&token=96a67e9a-6822-48eb-aa76-3b1453c14043',
      startOfContract: '2023-08-31T00:00:00.000Z',
      endOfContract: '2022-10-31T00:00:00.000Z',
      contractImagesLink: [
        'https://eforms.com/images/2019/08/Service-Contract-Template.png',
        'https://firebasestorage.googleapis.com/v0/b/shefaa-dev.appspot.com/o/uploadedImage-66fb99b9-f29f-47cb-b3be-cc865e1b9ef5?alt=media&token=66fb99b9-f29f-47cb-b3be-cc865e1b9ef5',
        'https://firebasestorage.googleapis.com/v0/b/shefaa-dev.appspot.com/o/uploadedImage-e3fcc97f-fe5e-4a0a-93c4-190198dffb64?alt=media&token=e3fcc97f-fe5e-4a0a-93c4-190198dffb64',
      ],
      contractImagesPath: [
        'uploadedImage-66fb99b9-f29f-47cb-b3be-cc865e1b9ef5',
        'uploadedImage-e3fcc97f-fe5e-4a0a-93c4-190198dffb64',
      ],
      createdAt: '2023-03-27T11:19:17.478Z',
      city: {
        id: 1,
        nameEn: 'Alexandria',
        nameAr: 'الإسكندرية',
        latitude: '31.2000924',
        longitude: '29.9187387',
        createdAt: '2023-03-09T12:44:16.550Z',
      },
    },
  };

  return res(
    // Respond with a 200 status code and JSON data
    ctx.delay(2000),
    ctx.status(200),
    ctx.json(obj)
  );
});
