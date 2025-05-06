import classNames from 'classnames';
import { HiHome, HiOutlineChevronRight } from 'react-icons/hi';
import { Link, NavLink } from 'react-router-dom';

const MainBreadCrumb: React.FC<{ list: { title: string; link: string }[] }> = ({ list }) => {
  if (!list?.length) return null;

  return (
    <nav
      className="sticky -top-8 mb-4 flex border-b bg-[inherit] bg-gray-50 px-1 py-3"
      aria-label="Bread Crumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link
            to={list[0].link}
            className="inline-flex items-center text-sm font-light capitalize text-gray-700 hover:text-primary dark:text-gray-400 dark:hover:text-white">
            <HiHome className="mr-2 h-4 w-4" />
            <span>{list[0].title}</span>
          </Link>
        </li>
        {list.slice(1).map(({ title, link }) => (
          <li key={link} className="flex items-center">
            <HiOutlineChevronRight />
            <NavLink
              to={link}
              className={({ isActive }): string =>
                classNames(
                  'ml-1 md:ml-2',
                  'text-sm font-light first-letter:capitalize',
                  'text-gray-700 hover:text-primary/80 dark:text-gray-400 dark:hover:text-white',
                  {
                    'font-medim text-primary': isActive,
                  }
                )
              }>
              {title}
            </NavLink>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default MainBreadCrumb;
