import React, { useRef } from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";

export interface ConfirmRequest {
  title: string;
  body: string;
  confirmLabel: string;
  onConfirm: () => void;
}

interface ConfirmDialogProps {
  request: ConfirmRequest | null;
  onClose: () => void;
}

/** In-page replacement for window.confirm. Cancel gets initial focus. */
const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ request, onClose }) => {
  const cancelRef = useRef<HTMLButtonElement>(null);
  return (
    <AlertDialog isOpen={request !== null} leastDestructiveRef={cancelRef} onClose={onClose} isCentered>
      <AlertDialogOverlay>
        <AlertDialogContent rounded="xl">
          <AlertDialogHeader fontSize="lg" fontWeight="800">
            {request?.title}
          </AlertDialogHeader>
          <AlertDialogBody color="gray.600">{request?.body}</AlertDialogBody>
          <AlertDialogFooter gap={3}>
            <Button ref={cancelRef} onClick={onClose} variant="ghost">
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={() => {
                request?.onConfirm();
                onClose();
              }}
            >
              {request?.confirmLabel}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default ConfirmDialog;
