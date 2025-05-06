import ErrorListMessage from '@UI/ErrorListMessage/ErrorListMessage';
import { Button, Input, InputImage, MainModal } from '@UI/index';
import { envConfig } from '@app/config';
import { dataToFormHandler } from '@app/utils';
import { useAppSelector } from '@hooks';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import pharmaciesService from '@services/pharmacies.service';
import { ERole } from '@servicesTypes/auth.types';
import { IPharmacy } from '@servicesTypes/pharmacies.types';
import classNames from 'classnames';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { HiMapPin } from 'react-icons/hi2';
import AsyncSelect from 'react-select/async';
import { toast } from 'react-toastify';
import { KeyedMutator } from 'swr';
import { selectAuth } from '@/store/slices/auth.slice';

const mapLibs = ['places'];
const ResetLocationModal: React.FC<{ refetch: KeyedMutator<any>; pharmacy: IPharmacy }> =
  function ({ refetch, pharmacy }) {
    const initialPharmacyCenter = {
      lat: +(pharmacy.latitude ?? 0),
      lng: +(pharmacy.longitude ?? 0),
    };

    const mapRef = useRef<any>();

    const [isOpen, setOpen] = useState(false);
    const [errorList, setErrorList] = useState([]);
    const [center, setCenter] = useState(initialPharmacyCenter);
    const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);

    const auth = useAppSelector(selectAuth);
    const { t } = useTranslation();

    const { register, control, reset, setValue, getValues, watch } = useForm({ mode: 'onBlur' });
    const { isLoaded } = useLoadScript({
      googleMapsApiKey: envConfig.google_map_key,
      libraries: mapLibs as any[],
      id: 'location-map',
    });

    const handlePharmacyLocationReset = () => {
      setErrorList([]);
      const { password, reason, images } = getValues();

      const formData = dataToFormHandler({
        longitude: center.lng,
        latitude: center.lat,
        password,
        reason,
        images,
      });

      pharmaciesService
        .resetLocation(pharmacy.id, formData)
        .then(() => {
          toast.success('Location updated successfully!');
          handleCloseModal();
          refetch();
        })
        .catch((error) => {
          if (error?.response?.data?.messages) {
            setErrorList(error.response.data.messages);
          } else {
            toast.error(t('Something went wrong!'));
          }
        });
    };

    const loadOptions = (inputValue: string, callback: (options: any[]) => void) => {
      if (!mapRef.current) return;

      const service = new google.maps.places.AutocompleteService();

      service.getPlacePredictions({ input: inputValue }, (results) => {
        callback(
          results?.map((item) => ({ ...item, label: item.description, value: item.place_id })) ?? []
        );
      });
    };

    const fetchPlaceDetails = async (placeId: string) => {
      const service = new google.maps.places.PlacesService(mapRef.current);
      return new Promise((resolve) => {
        service.getDetails({ placeId }, (result) => {
          resolve(result);
        });
      });
    };

    const handleSelectLocation = (selectedOption: any) => {
      if (selectedOption) {
        // Fetch details for the selected place using Google Maps Places service
        fetchPlaceDetails(selectedOption.value).then((placeDetails: any) => {
          const newLocation = {
            lat: placeDetails?.geometry?.location.lat(),
            lng: placeDetails?.geometry?.location.lng(),
          };
          setCenter(newLocation);
          setSelectedPlace(placeDetails as any);
        });
      } else {
        setSelectedPlace(null);
      }
    };

    const handleCloseModal = () => {
      setOpen(false);
      setCenter(initialPharmacyCenter);
      setErrorList([]);
      reset();
    };

    return (
      <MainModal
        show={isOpen}
        onClose={handleCloseModal}
        trigger={
          <Button
            className="flex flex-row flex-nowrap justify-between"
            onClick={() => setOpen(!isOpen)}>
            Reset Location
            <HiMapPin className="text-lg" />
          </Button>
        }
        body={
          <div className="text-center">
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Reset phramacy&apos;s location
            </h3>

            {(isLoaded && (
              <form autoComplete="off" className="flex flex-col gap-4">
                <AsyncSelect
                  cacheOptions
                  loadOptions={loadOptions}
                  defaultOptions
                  onChange={handleSelectLocation}
                  placeholder="Enter the new location ..."
                  isClearable
                />
                <GoogleMap
                  id={`${pharmacy.id}-location-find`}
                  center={center}
                  onLoad={(map) => {
                    mapRef.current = map;
                  }}
                  mapContainerStyle={{
                    height: '200px',
                    width: '100%',
                  }}
                  mapContainerClassName="rounded-md shadow"
                  options={{
                    streetViewControl: false,
                    maxZoom: 18,
                    minZoom: 15,
                    zoom: 16,
                    fullscreenControl: false,
                    rotateControl: false,
                    mapTypeControl: false,
                  }}>
                  {selectedPlace && <Marker position={center} />}
                </GoogleMap>

                <div className="space-y-4 text-start">
                  {pharmaciesService.resetLocationFormFields.slice(0, -1).map((input, index) => {
                    const { pattern, wrapperClassName, title, type, ...rest } = input;
                    // suspendFormArray[index]; // extract pattern to outer
                    if (auth.role !== ERole.SUPERADMIN && input.name === 'password')
                      return (
                        <span className="font-light">
                          <b>*</b> An update request will be sent to the super admin to approve
                        </span>
                      );

                    return (
                      <Input
                        type={type}
                        label={title}
                        key={input.id}
                        control={control}
                        className={wrapperClassName}
                        register={register(input.name, { shouldUnregister: false, ...rest })}
                        {...rest}
                      />
                    );
                  })}

                  <div className="col-span-2">
                    <InputImage
                      control={control}
                      label="Helping Imagess"
                      register={register('images', { shouldUnregister: false })}
                      files={watch('images')} // Use watch function to get the current value of the "images" field
                      onChange={(fileItems) => {
                        setValue(
                          'images',
                          fileItems.map((fileItem) => fileItem.file)
                        );
                      }}
                    />
                  </div>
                  {pharmaciesService.resetLocationFormFields.slice(-1).map((input) => {
                    const { pattern, wrapperClassName, title, type, ...rest } = input;
                    // suspendFormArray[index]; // extract pattern to outer
                    if (auth.role !== ERole.SUPERADMIN && input.name === 'password')
                      return (
                        <span className="font-light">
                          <b>*</b> An update request will be sent to the super admin to approve
                        </span>
                      );

                    return (
                      <Input
                        type={type}
                        label={title}
                        key={input.id}
                        control={control}
                        className={wrapperClassName}
                        register={register(input.name, { shouldUnregister: false, ...rest })}
                        {...rest}
                      />
                    );
                  })}
                </div>

                <ErrorListMessage errorList={errorList} />
              </form>
            )) || <div>Loading...</div>}
          </div>
        }
        footer={
          <>
            <Button
              className={classNames('bg-success/70 hover:bg-success/80 active:bg-success')}
              onClick={handlePharmacyLocationReset}>
              Yes, I&apos;m sure
            </Button>
            <Button onClick={() => setOpen(false)}>No, cancel</Button>
          </>
        }
      />
    );
  };

export default ResetLocationModal;
