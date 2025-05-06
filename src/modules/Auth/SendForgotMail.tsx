import { Button, Input } from '@UI/index';
import { ROUTES } from '@constants/routes';
import authService from '@services/auth.service';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { ReactSVG } from 'react-svg';
import { toast } from 'react-toastify';

const SendForgotMail = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [errorList, setErrorList] = useState([]);

  const { register, handleSubmit, control, reset } = useForm({
    mode: 'onBlur',
  });

  const SidebarLogo = new URL('/assets/logo/logo.svg', import.meta.url ?? import.meta.env.BASE_URL)
    .href;

  const onSubmit = (data: any) => {
    setLoading(true);
    setErrorList([]);

    authService
      .sendForgotPasswordMail(data.email)
      .then(() => {
        toast.success('Please check your E-mail!');

        setTimeout(() => {
          navigate(ROUTES.LOGIN);
        }, 2000);
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
              <Input
                label={t('Enter your email')}
                type={'text'}
                className={'col-span-2'}
                placeholder={t('Enter your mail')!}
                control={control}
                register={register('email', { shouldUnregister: false })}
              />
              {!!errorList.length && (
                <div className="col-span-2 mt-5 w-full rounded-md border border-danger/20 p-3">
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

              <div className="col-span-2 mx-auto mt-8 flex w-fit flex-row items-baseline gap-4">
                <Button type="submit" loading={loading}>
                  Send reset password request
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

export default SendForgotMail;
