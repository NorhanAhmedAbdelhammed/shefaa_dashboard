import ErrorListMessage from '@UI/ErrorListMessage/ErrorListMessage';
import { Button, Input, InputImage } from '@UI/index';
import pharmaciesService from '@app/api/services/pharmacies.service';
import { EPHARMACY_STATUS, IPharmacy } from '@app/api/types/pharmacies.types';
import { dataToFormHandler } from '@app/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAppSelector } from '@hooks';
import { ERole } from '@servicesTypes/auth.types';
import { Modal } from 'flowbite-react';
import moment from 'moment';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { HiCalendarDays } from 'react-icons/hi2';
import { toast } from 'react-toastify';
import { KeyedMutator } from 'swr';
import { selectAuth } from '@/store/slices/auth.slice';

const RenewContraclModal: React.FC<{
  pharmacy: IPharmacy;
  refetch: KeyedMutator<any>;
}> = function ({ pharmacy, refetch }) {
  const [errorList, setErrorList] = useState([]);
  const [isOpen, setOpen] = useState(false);
  const [isConfirmed, setConfirmed] = useState(false);

  const auth = useAppSelector(selectAuth);
  const { t } = useTranslation();
  const { register, handleSubmit, control, reset, setValue, watch } = useForm({
    resolver: yupResolver(pharmaciesService.renewContractSchema),
    mode: 'onBlur',
  });

  const isSuspended = pharmacy.status === EPHARMACY_STATUS.SUSPENDED;

  const canRenew = (isSuspended && isConfirmed) || !isSuspended;

  const handleRenewContract = (data: object) => {
    const formData = dataToFormHandler(data);
    setErrorList([]);

    pharmaciesService
      .renewContract(pharmacy.id, formData)
      .then(() => {
        toast.success('Contract updated successfully!');
        handleModalClose();
        refetch();
        setErrorList([]);
      })
      .catch((error) => {
        if (error?.response?.data?.messages) {
          setErrorList(error.response.data.messages);
        } else {
          toast.error(error.response.data.message ?? t('Something went wrong!'));
        }
      });
    /** */
  };
  const handleModalClose = () => {
    setConfirmed(false);
    setErrorList([]);
    setOpen(false);
    reset();
  };

  const RenderForm = useCallback(
    () => (
      <form
        noValidate
        className="mt-5 flex flex-col gap-3"
        onReset={() => reset()}
        onSubmit={handleSubmit(handleRenewContract)}>
        <div className="flex max-h-[60vh] flex-col gap-6 overflow-y-auto p-5 text-start">
          {pharmaciesService.renewContractFormFields.slice(0, -1).map((input, index) => {
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
            pharmaciesService.renewContractFormFields.slice(-1).map((input, index) => {
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
          <Button variant="success" type="submit">
            Yes, I&apos;m sure
          </Button>
          <Button type="reset" onClick={handleModalClose}>
            No, cancel
          </Button>
        </div>
      </form>
    ),
    [canRenew, errorList]
  );

  return (
    <>
      <Button
        className="flex flex-row flex-nowrap justify-between"
        variant="primary"
        disable={moment(pharmacy.endOfContract).subtract(1, 'week').isSameOrAfter(moment.now())}
        onClick={() => setOpen(!isOpen)}>
        Renew contract
        <HiCalendarDays className="text-lg" />
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
            {(canRenew && (
              <div className="text-center">
                <HiOutlineExclamationCircle className="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-gray-200" />
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                  Renew contract
                </h3>
                <div>
                  <RenderForm />
                </div>
              </div>
            )) || (
              <div className="space-y-4 text-center">
                <HiOutlineExclamationCircle className="mx-auto mb-4 h-12 w-12 text-danger/60" />

                <h3 className="text-2xl font-semibold">This pharmacy is previously suspended</h3>
                <p className="text-lg">Are you sure you want to renew the contract?</p>

                <div className="mt-8 flex flex-row gap-4">
                  <Button variant="success" onClick={() => setConfirmed(true)}>
                    I&apos;m sure
                  </Button>
                  <Button onClick={handleModalClose}>Don&apos;t proceed</Button>
                </div>
              </div>
            )}
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default RenewContraclModal;
