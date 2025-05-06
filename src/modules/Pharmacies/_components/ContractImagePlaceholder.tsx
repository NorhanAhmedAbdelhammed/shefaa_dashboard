import classNames from 'classnames';
import { Modal } from 'flowbite-react';
import { useState } from 'react';
import { IoNewspaperSharp } from 'react-icons/io5';

const ContractImagePlaceholder = ({ img }: { img?: string }) => {
  const [open, setOpen] = useState(false);

  const showPreview = () => {
    if (!img || open) return;
    setOpen(true);
  };

  return (
    <div
      className={classNames(
        { 'cursor-pointer hover:shadow-xl': !!img },
        'flex h-64 w-48 select-none items-center justify-center rounded-lg border-4 border-dashed border-black/50 bg-primary/10 shadow-md'
      )}
      onClick={showPreview}>
      {img ? (
        <>
          <img className="h-full w-full object-cover" src={img} loading="lazy" />
          {open && (
            <Modal show={open} dismissible onClose={() => setOpen(false)}>
              <Modal.Header className="border-b-0 pb-0" />
              <Modal.Body className="">
                <img className="object-fit rounded-md" src={img} loading="lazy" />
              </Modal.Body>
            </Modal>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2">
          <IoNewspaperSharp size="40" className="text-primary" />
          <p>No contract added</p>
        </div>
      )}
    </div>
  );
};

export default ContractImagePlaceholder;
