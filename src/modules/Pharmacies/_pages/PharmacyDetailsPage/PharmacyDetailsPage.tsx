import MainBreadCrumb from '@UI/MainBreadCrumb/MainBreadCrumb';
import { envConfig } from '@app/config';
import { ReactComponent as PharmacyPlaceholder } from '@assets/placeholders/pharmacy-placholder.svg';
import pharmaciesService from '@services/pharmacies.service';
import { EPHARMACY_STATUS, EPICKUP_METHOD } from '@servicesTypes/pharmacies.types';
import classNames from 'classnames';
import L from 'leaflet';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconMarker from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { HiShoppingCart, HiTruck } from 'react-icons/hi';
import { HiBuildingStorefront } from 'react-icons/hi2';
import { IoIosContact, IoLogoWhatsapp, IoMdBusiness, IoMdCall } from 'react-icons/io';
import { IoCalendar, IoLocationSharp, IoMapSharp } from 'react-icons/io5';
import { Marker as LeafletMarker, MapContainer, Popup } from 'react-leaflet';
import ReactLeafletGoogleLayer from 'react-leaflet-google-layer';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import { EditPharmacyModal, ResetLocationModal } from '../../_components';
import ContractImagePlaceholder from '../../_components/ContractImagePlaceholder';
import RenewContraclModal from '../../_components/modals/RenewContractModal';
import SuspendPharmacyModal from '../../_components/modals/SuspendPharmacyModal';
import ErrorComponent from '@/shared/Layouts/ErrorComponent';

if (import.meta.env.PROD) {
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: iconRetina,
    iconUrl: iconMarker,
    shadowUrl: iconShadow,
  });
}

const Section: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <section className="flex flex-col flex-wrap gap-4 rounded-[inherit] p-3 shadow-sm shadow-light md:flex-row">
    {children}
  </section>
);

const PharmacyDetailsPage: React.FC = () => {
  const { pharmacyId } = useParams();
  const { t } = useTranslation();

  const {
    data: pharmacy,
    isLoading,
    mutate,
    error,
  } = useSWR(['pharmacy', pharmacyId], async () => pharmaciesService.get(pharmacyId ?? ''), {});

  if (isLoading) return <div> Loading ...</div>;
  if (error) return <ErrorComponent />;
  if (!pharmacy) return <ErrorComponent error="not-found" />;

  const defaultCenter = {
    lat: +(pharmacy.latitude ?? 0),
    lng: +(pharmacy.longitude ?? 0),
  };

  return (
    <div className="mt-3 flex flex-col gap-3">
      <MainBreadCrumb
        list={[
          { title: 'pharmacies', link: '..' },
          { title: pharmacy.nameEn, link: '#' },
        ]}
      />
      <main
        className={classNames('flex min-h-[80vh] w-full flex-col gap-4 rounded-md p-3 shadow', {
          'bg-dark/5': !pharmacy.hasCompeletedProfile,
        })}>
        <Section>
          <div
            className={classNames(
              'aspect-video w-80 max-w-full overflow-hidden rounded-lg shadow-md md:min-w-[20rem]',
              {
                'shadow-danger/50': pharmacy.status === EPHARMACY_STATUS.SUSPENDED,
                'shadow-success/50': pharmacy.status === EPHARMACY_STATUS.ACTIVE,
              }
            )}>
            {pharmacy.imageLink ? (
              <img className="h-full w-full object-cover" src={pharmacy.imageLink} loading="lazy" />
            ) : (
              <PharmacyPlaceholder className="flex h-full w-full items-center justify-center fill-current p-5 text-dark" />
            )}
          </div>

          <div className="mr-auto flex min-w-[200px] flex-col gap-1 text-ellipsis">
            <h2 className="flex max-w-full flex-row flex-wrap items-center overflow-hidden text-ellipsis whitespace-nowrap text-2xl font-bold">
              {pharmacy.nameEn}
              <span
                className={classNames(
                  {
                    'border-danger bg-danger/10 text-danger dark:text-danger':
                      pharmacy.status === EPHARMACY_STATUS.SUSPENDED,
                    'border-success bg-success/10 text-success dark:text-success':
                      pharmacy.status === EPHARMACY_STATUS.ACTIVE,
                  },
                  'ml-2 rounded border px-2 text-xs font-medium  dark:bg-gray-700 '
                )}>
                {pharmacy.status}
              </span>
              <div className="ml-2 rounded border border-black/90 bg-gray-100 px-2  text-xs font-medium text-black dark:bg-gray-700 dark:text-white">
                {pharmacy.pickupMethod === EPICKUP_METHOD.PICKUP ? (
                  <span className="flex flex-row items-center gap-2 capitalize">
                    <HiBuildingStorefront className="text-xs" />
                    <span className="text-xs">{t('pickup')}</span>
                  </span>
                ) : pharmacy.pickupMethod === EPICKUP_METHOD.DELIVERY ? (
                  <span className="flex flex-row items-center gap-2 capitalize">
                    <HiTruck className="text-xs" />
                    <span className="text-xs">{t('delivery')}</span>
                  </span>
                ) : (
                  <span className="flex flex-row items-center gap-2 capitalize">
                    <HiShoppingCart className="text-xs" />
                    <span className="text-xs">{t('both')}</span>
                  </span>
                )}
              </div>
            </h2>

            <h3 className="overflow-hidden text-ellipsis whitespace-nowrap text-xl font-semibold leading-6 text-black/80">
              {pharmacy.nameAr}
            </h3>
            <p className="mb-1 flex flex-row items-center gap-3">{pharmacy.description}</p>
            <p className="flex flex-row items-center gap-3">
              <IoMdCall className="w-9 text-2xl text-primary" />
              <span>{pharmacy.hotline ?? '--- --- ---'}</span>
              <span className="text-sm font-semibold">(hotline)</span>
            </p>
            <p className="flex flex-row items-center gap-3">
              <IoIosContact className="w-9 text-2xl text-primary" />
              <span>{pharmacy.ownerPhoneNumber ?? '--- --- ---'}</span>
              <span className="text-sm font-semibold">(owner)</span>
            </p>
            <p className="flex flex-row items-center gap-3">
              <IoLogoWhatsapp className="w-9 text-2xl text-primary" />
              <span>{pharmacy.whatsAppNumber ?? '--- --- ---'}</span>
              <span className="text-sm font-semibold">(whatsapp)</span>
            </p>
            <p className="flex flex-row items-center gap-3">
              <IoCalendar className="w-9 text-2xl text-primary" />
              <span>
                {moment(pharmacy.startOfContract).format('DD / MM / YYYY') ?? '--- --- ---'}
              </span>{' '}
              -{' '}
              <span>
                {moment(pharmacy.endOfContract).format('DD / MM / YYYY') ?? '--- --- ---'}
              </span>
            </p>
          </div>

          <div className="flex max-w-[200px] flex-col gap-3">
            <EditPharmacyModal pharmacy={pharmacy} refetch={mutate} />
            <ResetLocationModal pharmacy={pharmacy} refetch={mutate} />
            <RenewContraclModal pharmacy={pharmacy} refetch={mutate} />
            <SuspendPharmacyModal
              pharmacy={pharmacy}
              refetch={mutate}
              action={
                pharmacy.status === EPHARMACY_STATUS.ACTIVE
                  ? EPHARMACY_STATUS.SUSPENDED
                  : EPHARMACY_STATUS.ACTIVE
              }
            />
          </div>
        </Section>
        <Section>
          <div className="flex flex-col space-y-4">
            <h3 className="mb-3 text-2xl font-semibold">Address</h3>
            <p className="flex flex-row items-center gap-3">
              <IoLocationSharp className="w-9 text-2xl text-primary" />
              <span>{pharmacy.building ?? '___'}</span> ,{' '}
              <span>{pharmacy.streetName ?? '___'}</span> ,{' '}
              <span>{pharmacy.subAdministrativeArea ?? '___'}</span>
            </p>{' '}
            <p className="flex flex-row items-center gap-3">
              <IoMdBusiness className="w-9 text-2xl text-primary" />
              <span>{pharmacy.landmark ?? '___'}</span>
            </p>
            <p className="flex flex-row items-center gap-3">
              <IoMapSharp className="w-9 text-2xl text-primary" />
              <span>{pharmacy.city?.nameEn ?? '___'} / </span>
              <span>{pharmacy.city?.nameAr ?? '___'}</span>
            </p>
          </div>
        </Section>
        <Section>
          <div className="flex w-full flex-col space-y-4">
            <h3 className="mb-3 block text-2xl font-semibold">Location</h3>

            <MapContainer
              className="z-0 mx-auto rounded-md shadow"
              style={{ height: '15rem', width: '80%' }}
              center={[defaultCenter.lat, defaultCenter.lng]}
              zoom={15}
              maxZoom={18}
              dragging={false}
              attributionControl={false}
              fadeAnimation
              scrollWheelZoom={false}>
              <ReactLeafletGoogleLayer
                useGoogMapsLoader
                googleMapsLoaderConf={{
                  libraries: ['places'],
                  apiKey: envConfig.google_map_key,
                  id: 'location-map',
                }}
                type="roadmap"
              />
              <LeafletMarker position={[defaultCenter.lat, defaultCenter.lng]}>
                <Popup>
                  <p>
                    {pharmacy?.nameAr} | {pharmacy?.nameEn}
                  </p>
                </Popup>
              </LeafletMarker>
            </MapContainer>
          </div>
        </Section>

        <Section>
          <div>
            <h3 className="mb-3 text-2xl font-semibold">Contract Images</h3>
            <div className="flex flex-row gap-4">
              <div className="flex flex-row flex-wrap gap-5 py-4">
                {pharmacy?.contractImagesLink?.length ? (
                  pharmacy.contractImagesLink.map((img) => (
                    <ContractImagePlaceholder key={img} img={img} />
                  ))
                ) : (
                  <ContractImagePlaceholder />
                )}
              </div>
            </div>
          </div>
        </Section>
      </main>
    </div>
  );
};

export default PharmacyDetailsPage;
