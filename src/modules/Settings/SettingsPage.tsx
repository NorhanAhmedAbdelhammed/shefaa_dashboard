import { Button, Input, PageContainer } from '@UI/index';
import profileServices from '@app/api/services/profile.services';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAppSelector } from '@hooks';
import classNames from 'classnames';
import { Avatar, Badge, Modal } from 'flowbite-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { HiUser } from 'react-icons/hi2';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import { ERole } from '@servicesTypes/auth.types';
import { selectAuth } from '@/store/slices/auth.slice';

interface ISettingsProps {
  children: React.ReactNode;
  className?: string;
}

const SettingCard = ({ children, className }: ISettingsProps) => (
  <div className={classNames(className, 'rounded-xl bg-white p-4 shadow')}>{children}</div>
);

// TODO: form components could be splitted to be reusable
const SettingsPage = () => {
  const [updatePasswordErrorList, setUpdatePaswwordErrorList] = useState([]);
  const [pointsErrorList, setPointsErrorList] = useState([]);
  const [imageUploading, setImageUploading] = useState(false);

  const { t } = useTranslation();
  const auth = useAppSelector(selectAuth);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue: setAdminValues,
  } = useForm({
    mode: 'onBlur',
  });

  const {
    register: registerImageUpload,
    handleSubmit: handleImageUpload,

    control: controlImageUpload,
    reset: resetImageUpload,
  } = useForm({
    mode: 'onBlur',
  });

  const {
    register: registerUpdatePassword,
    handleSubmit: handlePasswordSubmit,
    control: controlPassword,
  } = useForm({
    resolver: yupResolver(profileServices.updatePasswordSchema),
    mode: 'onBlur',
  });

  const {
    register: registerUpdatePoints,
    handleSubmit: handlePointsSubmit,
    control: controlPoints,
    setValue: setPointsValue,
  } = useForm({
    resolver: yupResolver(profileServices.updatePointsSchema),
    mode: 'onBlur',
  });

  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  const { data, mutate: reloadAdminProfile } = useSWR('admin-profile', profileServices.get, {
    onSuccess(data) {
      const { admin, point } = data;

      Object.entries(admin).map(([key, val]) => {
        setAdminValues(key, val);
      });

      Object.entries(point).map(([key, val]) => {
        setPointsValue(key, val);
      });
    },
  });

  const onProfileDetailsUpdate = () => {
    //
  };

  const handleResetPassword = (data: any) => {
    profileServices
      .updatePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      })
      .then((data) => {
        toast.success(t('Account Updated!'));
        setPasswordModalOpen(false);
        reloadAdminProfile();
      })
      .catch((error) => {
        if (error?.response?.data?.messages) {
          setUpdatePaswwordErrorList(error.response.data.messages);
        } else {
          toast.error(t('Something went wrong!'));
        }
      });
  };

  const handleUpdatePoints = (data: any) => {
    profileServices
      .updatePoints({ minimumOrder: +data.minimumOrder, rewardPerPoint: +data.rewardPerPoint })
      .then((data) => {
        toast.success(t('Points Updated!'));
        reloadAdminProfile();
      })
      .catch((error) => {
        if (error?.response?.data?.messages) {
          setPointsErrorList(error.response.data.messages);
        } else {
          toast.error(t('Something went wrong!'));
        }
      });
  };

  const onImageUpload = (data: any) => {
    if (!data) return toast.error('Add image to upload!');

    const formData = new FormData();
    formData.append('image', data.image[0]);
    setImageUploading(true);

    profileServices
      .updateProfile(formData)
      .then(() => {
        toast.success('Photo updated successfully!');
        reloadAdminProfile();
      })
      .catch((error) => {
        if (error?.response?.data?.messages) {
          setPointsErrorList(error.response.data.messages);
        } else {
          toast.error(t('Something went wrong!'));
        }
      })
      .finally(() => {
        setTimeout(() => {
          setImageUploading(false);
        }, 500);

        resetImageUpload();
      });
  };

  return (
    <PageContainer title="settings">
      <main className="mt-20 grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
        <SettingCard className="relative row-span-2">
          <div className="flex w-full flex-col flex-nowrap gap-3 pb-8 pt-20">
            <div className="absolute inset-x-0 -top-16 flex flex-row items-center justify-center pt-3">
              <Avatar
                img={data?.admin.profilePictureLink ?? HiUser}
                alt="Default avatar with alt text"
                rounded
                bordered
                placeholderInitials={'MK'}
                color="primary"
                size="xl"
                className="drop-shadow-xl"
              />
              <div
                className={classNames(
                  {
                    'bg-secondary': auth.role === ERole.SUPERADMIN,
                    'bg-primary': auth.role === ERole.SUBADMIN,
                  },
                  'absolute -bottom-2 h-4 w-4 rounded-full bg-primary ring'
                )}></div>
            </div>
            <section className="mx-auto w-full max-w-xs dark:text-white">
              <form
                noValidate
                className="flex flex-col gap-3"
                onChange={handleImageUpload(onImageUpload)}>
                <Input
                  label={t('image')}
                  type={'file'}
                  className={classNames({
                    'pointer-events-none animate-pulse cursor-default duration-1000':
                      imageUploading,
                  })}
                  control={controlImageUpload}
                  register={registerImageUpload('image', { shouldUnregister: false })}
                  accept="image/png, image/jpg, image/jpeg"
                />
              </form>
              <form
                noValidate
                className="mt-5 flex flex-col gap-3"
                onSubmit={handleSubmit(onProfileDetailsUpdate)}>
                {profileServices.editProfileDetails.map((input) => {
                  const { pattern, ...rest } = input; // extract pattern to outer
                  return (
                    <Input
                      key={input.name}
                      label={t(input.title)}
                      type={input.type}
                      className={input.wrapperClassName}
                      control={control}
                      register={register(input.name, { shouldUnregister: false, ...rest })}
                      {...rest}
                    />
                  );
                })}
                <Button className="ml-auto mt-5 w-min" onClick={() => setPasswordModalOpen(true)}>
                  Update Password
                </Button>
              </form>
            </section>
          </div>
        </SettingCard>
        <SettingCard>
          <div className="flex items-center gap-5 px-5 py-4">
            <div className="h-px flex-grow bg-black/10"></div>
            <h1 className="text-center text-3xl font-medium">Points</h1>
            <div className="h-px flex-grow bg-black/10"></div>
          </div>

          <section className="mx-auto w-full max-w-xs dark:text-white">
            <form
              noValidate
              className="flex flex-col gap-4"
              onSubmit={handlePointsSubmit(handleUpdatePoints)}>
              {profileServices.pointFields.map((input) => {
                const { pattern, ...rest } = input; // extract pattern to outer
                return (
                  <Input
                    key={input.name}
                    label={t(input.title)}
                    type={input.type}
                    className={input.wrapperClassName}
                    control={controlPoints}
                    register={registerUpdatePoints(input.name, {
                      shouldUnregister: false,
                      ...rest,
                    })}
                    {...rest}
                  />
                );
              })}

              {!!pointsErrorList.length && (
                <div className="mt-5 w-full rounded-md border border-danger/20 p-3">
                  <ul className="flex list-inside list-disc flex-col gap-1">
                    {Array.isArray(pointsErrorList) ? (
                      pointsErrorList.map((error) => (
                        <li className="text-danger/75" key={error}>
                          {error}
                        </li>
                      ))
                    ) : (
                      <li className="text-danger/75">{pointsErrorList}</li>
                    )}
                  </ul>
                </div>
              )}
              <Button className="ml-auto mt-5 w-min" type="submit">
                Update Points
              </Button>
            </form>
          </section>
        </SettingCard>
      </main>

      {passwordModalOpen && (
        <Modal
          size="md"
          dismissible
          popup={true}
          onClose={() => setPasswordModalOpen(false)}
          show={passwordModalOpen}>
          <Modal.Header />
          <Modal.Body>
            <h1 className="pb-4 text-center text-2xl font-semibold text-gray-400 dark:text-gray-200">
              <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14" />
              <span>Update Password</span>
            </h1>
            <form
              noValidate
              className="flex flex-col gap-4"
              onSubmit={handlePasswordSubmit(handleResetPassword)}>
              {profileServices.updatePasswordFields.map((input) => {
                const { pattern, ...rest } = input; // extract pattern to outer
                return (
                  <Input
                    key={input.name}
                    label={t(input.title)}
                    type={input.type}
                    className={input.wrapperClassName}
                    control={controlPassword}
                    register={registerUpdatePassword(input.name, {
                      shouldUnregister: false,
                      ...rest,
                    })}
                    {...rest}
                  />
                );
              })}

              {!!updatePasswordErrorList.length && (
                <div className="mt-5 w-full rounded-md border border-danger/20 p-3">
                  <ul className="flex list-inside list-disc flex-col gap-1">
                    {Array.isArray(updatePasswordErrorList) ? (
                      updatePasswordErrorList.map((error) => (
                        <li className="text-danger/75" key={error}>
                          {error}
                        </li>
                      ))
                    ) : (
                      <li className="text-danger/75">{updatePasswordErrorList}</li>
                    )}
                  </ul>
                </div>
              )}

              <div className="mt-8 flex justify-center gap-4">
                <Button
                  className={classNames('bg-success/70 hover:bg-success/80 active:bg-success')}
                  type="submit">
                  Yes, I&apos;m sure
                </Button>
                <Button type="button" onClick={() => setPasswordModalOpen(false)}>
                  No, cancel
                </Button>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      )}
    </PageContainer>
  );
};

export default SettingsPage;
