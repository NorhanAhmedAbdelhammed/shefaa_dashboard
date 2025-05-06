import ErrorListMessage from '@UI/ErrorListMessage/ErrorListMessage';
import { Button, Input } from '@UI/index';
import authService from '@app/api/services/auth.service';
import { getPublicSVG } from '@app/utils/get-public-assets';
import { ROUTES } from '@constants/routes';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ReactSVG } from 'react-svg';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [errorList, setErrorList] = useState([]);

  const { register, handleSubmit, control, reset } = useForm({
    resolver: yupResolver(authService.forgotPasswordSchema),
    mode: 'onBlur',
  });

  const SidebarLogo = getPublicSVG('logo', 'logo');

  const onSubmit = (data: any) => {
    const token = searchParams.get('token') ?? ''; // 'name'

    setLoading(true);
    setErrorList([]);

    authService
      .resetPassword({
        verificationToken: token,
        password: data.password,
      })
      .then(() => {
        toast.success('New password updated successfully!');

        setTimeout(() => {
          navigate(ROUTES.LOGIN);
        }, 5000);
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
        reset();
      });
    setLoading(true);
  };

  return (
    <main className="bg-gray-50 dark:bg-gray-900">
      <div className="pt:mt-0 mx-auto flex flex-col items-center justify-center px-6 pt-8 dark:bg-gray-900 md:h-screen">
        <a
          href={import.meta.env.BASE_URL}
          className="mb-8 flex items-center justify-center gap-3 text-2xl font-semibold dark:text-white lg:mb-10">
          <ReactSVG
            wrapper="svg"
            src={SidebarLogo}
            className="h-12 w-9"
            beforeInjection={(svg) => {
              svg.setAttribute('style', 'height: 100%;');
              return svg;
            }}
            title="Shefaa Logo"
          />
          <span className="text-blue-1">Shefaa</span>
        </a>
        <div className="w-full max-w-xl space-y-8 rounded-lg bg-white p-6 shadow dark:bg-gray-800 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reset your password</h2>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {authService.forgotPassowrd.map((input) => (
                <Input
                  key={input.name}
                  label={t(input.title)}
                  type={input.type}
                  className={input.wrapperClassName}
                  placeholder={t(input.placeholder) ?? ''}
                  control={control}
                  register={register(input.name, { shouldUnregister: false })}
                />
              ))}

              <ErrorListMessage errorList={errorList} />

              <div className="col-span-2 mx-auto mt-8 flex w-fit flex-row items-baseline gap-4">
                <Button type="submit" loading={loading}>
                  Reset password{' '}
                </Button>
                <Link className="underline hover:text-primary" to={ROUTES.LOGIN}>
                  Login
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default ForgotPassword;
