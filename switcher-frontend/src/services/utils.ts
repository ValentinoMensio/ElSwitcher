import { createStandaloneToast } from '@chakra-ui/react';
import { ErrorType, isError, ResponseModel } from '../api/types';
const { toast } = createStandaloneToast();

export const sendToast = (
  title: string,
  description: string | null,
  status: 'success' | 'error' | 'warning' | 'info' | 'loading'
) => {
  toast({
    title,
    description,
    status,
    duration: 2500,
    isClosable: true,
    position: 'top',
  });
};

const sendErrorToast = (error: ErrorType, title: string) => {
  if (Array.isArray(error.detail)) {
    error.detail.forEach((errorItem) => {
      sendToast(title, errorItem.msg, 'error');
    });
  } else {
    sendToast(title, error.detail, 'error');
  }
};

export const handleNotificationResponse = (
  data: ResponseModel | ErrorType,
  text_success: string,
  text_error: string,
  action: () => void
) => {
  if (isError(data)) {
    sendErrorToast(data, text_error);
  } else {
    action();
    //sendToast(text_success, null, 'success');
  }
};
