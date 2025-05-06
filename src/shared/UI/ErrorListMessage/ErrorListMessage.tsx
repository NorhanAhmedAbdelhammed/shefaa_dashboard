import * as React from 'react';

export interface IErrorListMessageProps {
  errorList: string[];
}

export default function ErrorListMessage({ errorList }: IErrorListMessageProps) {
  if (!errorList.length) return null;
  return (
    <div className="col-span-2 mt-5 w-full rounded-md border border-danger/20 p-3">
      <ul className="flex list-inside list-disc flex-col gap-1 text-start">
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
  );
}
