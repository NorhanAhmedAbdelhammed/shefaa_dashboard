import ErrorListMessage from '@UI/ErrorListMessage/ErrorListMessage';
import { Button, Input, InputImage } from '@UI/index';
import pharmaciesService from '@app/api/services/pharmacies.service';
import { EPHARMACY_STATUS, IPharmacy } from '@app/api/types/pharmacies.types';
import { dataToFormHandler } from '@app/utils';
import { useAppSelector } from '@hooks';
import { ERole } from '@servicesTypes/auth.types';
import classNames from 'classnames';
import { Modal } from 'flowbite-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { HiExclamation, HiOutlineExclamationCircle } from 'react-icons/hi';
import { toast } from 'react-toastify';
import { KeyedMutator } from 'swr';
import { selectAuth } from '@/store/slices/auth.slice';

const SuspendPharmacyModal: React.FC<{
  pharmacy: IPharmacy;
  action: EPHARMACY_STATUS;
  refetch: KeyedMutator<any>;
}> = function ({ pharmacy, refetch, action }) {
  const [isOpen, setOpen] = useState(false);

  const auth = useAppSelector(selectAuth);
  const { t } = useTranslation();

  const { register, handleSubmit, control, reset, setValue, watch } = useForm({ mode: 'onBlur' });
  const [errorList, setErrorList] = useState([]);

  const handlePharmacyUpdate = (data: object) => {
    const formData = dataToFormHandler({ ...data, pharmacyStatus: action });

    pharmaciesService
      .updateStatus({ id: pharmacy.id, formData })
      .then(() => {
        toast.success(
          (action === EPHARMACY_STATUS.SUSPENDED ? 'Suspend' : 'Activate') + ' Successfully!'
        );
        handleModalClose();
        setTimeout(() => {
          refetch();
        }, 900);
      })
      .catch((error) => {
        if (error?.response?.data?.messages) {
          setErrorList(error.response.data.messages);
        } else {
          toast.error(t('Something went wrong!'));
        }
      });
  };

  const handleModalClose = () => {
    reset();
    setOpen(false);
  };

  return (
    <>
      <Button
        className={classNames('flex flex-row flex-nowrap justify-between', {
          'bg-warning/70 hover:bg-warning/90 active:bg-warning':
            action === EPHARMACY_STATUS.SUSPENDED,
          'bg-success/70 hover:bg-success/90 active:bg-success': action === EPHARMACY_STATUS.ACTIVE,
        })}
        onClick={() => setOpen(!isOpen)}>
        {action === EPHARMACY_STATUS.SUSPENDED ? 'Suspend' : 'Activate'}
        <HiExclamation className="text-lg" />
      </Button>
      {isOpen && (
        <Modal
          size="md"
          dismissible
          popup={true}
          onClose={handleModalClose}
          show={isOpen}
          className="!h-full pb-8">
          <Modal.Header />

          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Are you sure you want to{' '}
                {action === EPHARMACY_STATUS.SUSPENDED ? 'Suspend' : 'Activate'} this phramacy?
              </h3>
              <div>
                {' '}
                <form
                  noValidate
                  className="mt-5 flex flex-col gap-3"
                  onReset={() => reset()}
                  onSubmit={handleSubmit(handlePharmacyUpdate)}>
                  <div className="grid grid-cols-1 gap-6 text-start lg:grid-cols-2">
                    {pharmaciesService.suspendFormFields.slice(0, -1).map((input, index) => {
                      const { pattern, wrapperClassName, title, type, ...rest } = input;
                      // suspendFormArray[index]; // extract pattern to outer
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

                    {/* <-- == password == --> */}
                    {(auth.role === ERole.SUPERADMIN &&
                      pharmaciesService.suspendFormFields.slice(-1).map((input, index) => {
                        const { pattern, wrapperClassName, title, type, ...rest } = input;

                        // suspendFormArray[index]; // extract pattern to outer
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
                      })) || (
                      <p className="font-light">
                        <b>*</b> An update request will be sent to the super admin to approve
                      </p>
                    )}
                  </div>
                  <ErrorListMessage errorList={errorList} />

                  <div className="mt-4 flex justify-center gap-4">
                    <Button
                      variant={action === EPHARMACY_STATUS.SUSPENDED ? 'warning' : 'success'}
                      type="submit">
                      Yes, I&apos;m sure
                    </Button>
                    <Button
                      type="reset"
                      onClick={() => {
                        reset();
                        setOpen(false);
                      }}>
                      No, cancel
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default SuspendPharmacyModal;
