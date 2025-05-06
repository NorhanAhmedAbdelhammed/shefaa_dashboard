import { Button, MainModal } from '@UI/index';
import { getUpdatedKeys, splitCamelCase } from '@app/utils';
import requestsService from '@services/requests.service';
import { IPharmacy } from '@servicesTypes/pharmacies.types';
import { IRequest } from '@servicesTypes/requests.types';
import { Table } from 'flowbite-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HiOutlineArrowLongRight } from 'react-icons/hi2';
import { IoCheckmarkCircle, IoCloseCircle, IoInformationCircle } from 'react-icons/io5';
import { toast } from 'react-toastify';
import type { KeyedMutator } from 'swr';
import ContractImagePlaceholder from '@/modules/Pharmacies/_components/ContractImagePlaceholder';

interface RequestActionModalProps {
  request: IRequest;
  refetch: KeyedMutator<IEndpointResponse<any[], any>>;
}

const ReqestActionsModal: React.FC<RequestActionModalProps> = function ({ request, refetch }) {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorList, setErrorList] = useState([]);

  const { Admin, Pharmacy, reason, ...item } = request;
  const changes = getUpdatedKeys(Pharmacy, item, [
    'id',
    'adminId',
    // 'contractId',
    'pharmacyId',
    'createdAt',
    'reasonId',
    'approval',
  ]);

  // const updatedContract =
  const hasNoChange =
    !Object.keys(changes).length && !request.reason?.statement && !request.reason?.images.length;

  const acceptRequest = (id: number) => {
    setLoading(true);
    requestsService
      .accept(id)
      .then(() => {
        toast.success('Request accepted successfully!');
      })
      .catch((error) => {
        toast.error(t('Something went wrong!'));
      })
      .finally(() => {
        setLoading(false);
        refetch();
      });
  };

  const rejectRequest = (id: number) => {
    setLoading(true);
    requestsService
      .reject(id)
      .then(() => {
        toast.success('Request rejected successfully!');

        refetch();
      })
      .catch((error) => {
        toast.error(t('Something went wrong!'));
      })
      .finally(() => {
        setLoading(false);
        refetch();
      });
  };

  const handleModalClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} disabled={request.approval !== 'PENDING'}>
        <IoInformationCircle className="text-lg" />
        Details
      </Button>
      <MainModal
        size="lg"
        body={
          <div className="flex flex-col">
            {(!!Object.keys(changes).length && (
              <>
                <h3 className="text-2xl font-bold">Changes</h3>
                <Table className="!shadow-sm">
                  <Table.Head>
                    <Table.Cell className="min-w-[8rem]">Current</Table.Cell>
                    <Table.Cell>
                      <HiOutlineArrowLongRight />
                    </Table.Cell>
                    <Table.Cell className="min-w-[8rem]">Change</Table.Cell>
                  </Table.Head>
                  <Table.Body>
                    {Object.keys(changes)?.map(
                      (change: string) =>
                        (change !== 'contractId' && (
                          <Table.Row key={change}>
                            <Table.Cell className="text-black/70">
                              {Pharmacy[change as keyof IPharmacy] as any}
                            </Table.Cell>
                            <Table.Cell className="flex flex-col">
                              <span className="text-sm capitalize">{splitCamelCase(change)}</span>
                              <HiOutlineArrowLongRight />
                            </Table.Cell>{' '}
                            <Table.Cell className="text-black">
                              {request[change as keyof IRequest] as any}
                            </Table.Cell>
                          </Table.Row>
                        )) || (
                          <Table.Row key={change}>
                            <Table.Cell className="text-center text-black/70" colSpan={3}>
                              Renew Contract
                            </Table.Cell>
                          </Table.Row>
                        )
                    )}
                  </Table.Body>
                </Table>

                <hr className="mt-8" />
              </>
            )) || (
              <div>
                <h3 className="m-4 rounded-xl p-4 text-center text-xl font-semibold text-primary/80 outline outline-primary/20">
                  The required changes is the same as the currently applied
                </h3>
              </div>
            )}
            {!!request.reason?.statement && (
              <>
                <h4 className="text-xl font-bold">Reason</h4>

                <p className="pl-1">{request.reason?.statement}</p>
                <hr className="mt-8" />
              </>
            )}
            {!!request.reason?.images.length && (
              <>
                <h4 className="text-xl font-bold">Attachments</h4>
                <div className="mt-4 flex flex-row gap-4">
                  {request.reason?.images.map((image) => (
                    <ContractImagePlaceholder img={image.imageLink} key={image.imageLink} />
                  ))}
                </div>
              </>
            )}
            {/* {hasNoChange&&
            
            <p className='text-4xl'>Pharma</p>
            } */}
          </div>
        }
        footer={
          <div className="flex w-full flex-row items-center gap-3">
            <Button
              loading={loading}
              variant="success"
              onClick={() => acceptRequest(request.id)}
              disabled={request.approval !== 'PENDING'}>
              <IoCheckmarkCircle className="text-lg" />
              Accept
            </Button>
            <Button
              loading={loading}
              variant="danger"
              onClick={() => rejectRequest(request.id)}
              disabled={request.approval !== 'PENDING'}>
              <IoCloseCircle className="text-lg" />
              Reject
            </Button>
          </div>
        }
        onClose={handleModalClose}
        show={isOpen}
        title={`@${request.Admin.username} request for ${request.Pharmacy.nameEn}`}
      />
    </>
  );
};
export default ReqestActionsModal;
