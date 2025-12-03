//

import Link from "next/link";

interface BreadcrumbPath {
  name: string;
  href?: string;
}

interface BreadcrumbProps {
  pageName?: string;
  paths?: { name: string; href?: string }[];
}

const Breadcrumb = ({ paths = [], pageName }: BreadcrumbProps) => {
  const lastIndex = paths.length > 0 ? paths.length - 1 : 0;

  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-[26px] font-bold leading-[30px] text-dark dark:text-white">
        {pageName || paths[lastIndex]?.name}
      </h2>

      {paths.length > 0 && (
        <ol className="flex items-center gap-2 text-sm text-gray-600">
          {paths.map((path, index) => (
            <li key={index} className="flex items-center gap-2">
              {path.href ? (
                <Link href={path.href} className="hover:underline">
                  {path.name}
                </Link>
              ) : (
                <span className="font-medium text-[#48a64b]">{path.name}</span>
              )}
              {index < lastIndex && <span>/</span>}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default Breadcrumb;
