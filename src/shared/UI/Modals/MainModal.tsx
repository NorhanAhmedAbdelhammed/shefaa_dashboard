import { Modal as FlowbiteModal, ModalSizes } from 'flowbite-react';
import { isValidElement } from 'react';
import { useTranslation } from 'react-i18next';

interface ModalProps {
  show: boolean;
  onClose: () => void;
  title?: string;
  trigger?: React.ReactNode;

  header?: React.ReactNode;
  body: React.ReactNode;
  footer?: React.ReactNode;
  size?: keyof ModalSizes;
}

const MainModal: React.FC<ModalProps> = ({
  show,
  title,
  trigger,
  body,
  footer,
  size = 'sm',
  onClose,
}) => {
  const { t } = useTranslation();
  const Trigger = isValidElement(trigger) ? () => trigger : () => <></>;

  const closeModalHandler = () => {
    onClose();
  };

  return (
    <>
      <Trigger />
      {show && (
        <FlowbiteModal size={size} dismissible popup onClose={closeModalHandler} show={show}>
          <FlowbiteModal.Header className="justify-between">
            {!!title && t(title)}
          </FlowbiteModal.Header>
          <FlowbiteModal.Body>{body}</FlowbiteModal.Body>
          <FlowbiteModal.Footer>{footer}</FlowbiteModal.Footer>
        </FlowbiteModal>
      )}
    </>
  );
};

export default MainModal;
