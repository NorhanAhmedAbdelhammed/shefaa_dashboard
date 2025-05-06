import { Button, Input, InputImage } from '@UI/index';
import pharmaciesService from '@app/api/services/pharmacies.service';
import { dataToFormHandler } from '@app/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { ICreatePharmacy } from '@servicesTypes/pharmacies.types';
import { Modal } from 'flowbite-react';
import { useState } from 'react';
import { SubmitErrorHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const AddPharmacyModal: React.FC<{ isOpen: boolean; onClose: () => void }> = function ({
  onClose,
  isOpen,
}) {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [errorList, setErrorList] = useState([]);
  const [createdPharmacy, setCreatedPharmacy] = useState<Omit<ICreatePharmacy, 'password'>>();

  const { register, handleSubmit, control, reset, watch, setValue } = useForm({
    resolver: yupResolver(pharmaciesService.createSchema),
    mode: 'onBlur',
  });

  const onSubmit = (data: any) => {
    setLoading(true);
    setErrorList([]);

    const formData = dataToFormHandler(data);

    pharmaciesService
      .create(formData as any)
      .then((data) => {
        toast.success(t('Pharmacy Added!'));
        setCreatedPharmacy(data);
        // handleModalClose();
        reset();
      })
      .catch((error) => {
        if (error?.response?.data?.messages) {
          setErrorList(error.response.data.messages);
        } else {
          toast.error(t('Something went wrong!'));
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onReject: SubmitErrorHandler<ICreatePharmacy> = (errorObject) => {
    console.log(errorObject);
  };

  const handleModalClose = () => {
    onClose();
    reset();
    setCreatedPharmacy({} as any);
  };

  return (
    <Modal onClose={handleModalClose} show={isOpen} dismissible className="!h-full !pb-8">
      <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
        <strong>Add pharmacy</strong>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit, onReject)} noValidate>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {pharmaciesService.createFormFields.map(
              ({ placeholder, wrapperClassName, title, ...input }) => (
                <Input
                  key={input.name}
                  label={t(title)}
                  className={wrapperClassName}
                  placeholder={t(placeholder) ?? ''}
                  control={control}
                  register={register(input.name, { shouldUnregister: false })}
                  {...input}
                />
              )
            )}
          </div>
          <div className="col-span-2 my-3">
            <InputImage
              control={control}
              label="Contract Images"
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
          {!!Object.keys(createdPharmacy ?? {}).length && (
            <div className="mt-5 w-full rounded-md border p-5 shadow-inner">
              <h4 className="text-xl font-semibold">{t('Pharmacy Details')}</h4>
              <div className="mt-3 flex flex-col gap-3 text-lg">
                <div className="flex flex-row gap-2">
                  <span className="w-40">{t('username')}:</span>
                  <span className="font-semibold">{createdPharmacy?.username}</span>
                </div>
                <div className="flex flex-row gap-2">
                  <span className="w-40">{t('email')}:</span>
                  <span className="font-semibold">{createdPharmacy?.email}</span>
                </div>
                <div className="flex flex-row gap-2">
                  <span className="w-40">{t('Name in English')}:</span>
                  <span className="font-semibold">{createdPharmacy?.nameEn}</span>
                </div>
                <div className="flex flex-row gap-2">
                  <span className="w-40">{t('Name In Arabic')}:</span>
                  <span className="font-semibold">{createdPharmacy?.nameAr}</span>
                </div>
              </div>
            </div>
          )}

          {!!errorList.length && (
            <div className="mt-5 w-full rounded-md border border-danger/20 p-3">
              <ul className="flex list-inside list-disc flex-col gap-1">
                {Array.isArray(errorList) ? (
                  errorList.map((error) => (
                    <li className="text-danger/75" key={error}>
                      {error}
                    </li>
                  ))
                ) : (
                  <li className="text-danger/75">{errorList}</li>
                )}
              </ul>
            </div>
          )}

          <Button type="submit" className="mt-6" loading={loading}>
            Add Pharmacy
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  );
};
export default AddPharmacyModal;
