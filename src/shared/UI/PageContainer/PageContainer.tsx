import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

interface PageContainerProps {
  children: React.ReactNode;
  title: string;
}
const PageContainer: React.FC<PageContainerProps> = ({ children, title }) => {
  const { t } = useTranslation();
  const localizedTitle = t(title);

  return (
    <div className="flex flex-col">
      <Helmet>
        <title>{localizedTitle.charAt(0).toUpperCase() + localizedTitle.slice(1)}</title>
        <meta property="og:title" content={title} />
        <meta name="twitter:title" content={title} />
      </Helmet>
      <h2 className="mb-2 text-3xl font-bold capitalize text-gray-900 dark:text-white">{title}</h2>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
};

export default PageContainer;
