// TODO : TO BE DELETED after 4 sprints from 17-5
import { Button } from '@UI/index';
import pharmaciesService from '@app/api/services/pharmacies.service';
import { Modal } from 'flowbite-react';
import { useState } from 'react';
import { HiOutlineExclamationCircle, HiTrash } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { KeyedMutator } from 'swr';

const DeletePharmacyModal: React.FC<{ id: string; refetch: KeyedMutator<any> }> = function ({
  id,
  refetch,
}) {
  const [isOpen, setOpen] = useState(false);
  const navigate = useNavigate();
  const handleDeletePharmacy = () => {
    pharmaciesService
      .delete(id)
      .then(() => {
        toast.success('Deleted Successfully!');
        navigate('/');
        refetch();
      })
      .catch((error) => {
        toast.error('Something went wrong!');
      })
      .finally(() => {
        setTimeout(() => {
          setOpen(false);
        }, 900);
      });
  };

  return (
    <>
      <Button
        variant="danger"
        className="flex flex-row flex-nowrap "
        onClick={() => setOpen(!isOpen)}>
        <HiTrash className="text-lg" />
        Delete
      </Button>
      {isOpen && (
        <Modal size="md" dismissible popup={true} onClose={() => setOpen(false)} show={isOpen}>
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Are you sure you want to delete this phramacy?
              </h3>
              <div className="flex justify-center gap-4">
                <Button variant="danger" onClick={handleDeletePharmacy}>
                  Yes, I&apos;m sure
                </Button>
                <Button onClick={() => setOpen(false)}>No, cancel</Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default DeletePharmacyModal;
