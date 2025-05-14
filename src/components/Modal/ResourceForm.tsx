import { FormEvent, useState } from 'react';
import { Resource, ResourceSort } from '../../types/Resource';
import { useModalContext } from '../../context/ModalContext';
import { useErrorContext } from '../../context/ErrorContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  isBadRequest,
  isForbidden,
  isUnauthenticated
} from '../../utils/apiErrors';
import { toCapitalized } from '../../utils/stringFormatting';
import LogIn from './LogIn';
import {
  FetchResourcesQueryKey,
  FetchResourcesQueryUpdate
} from '../../api/resources.api';
import { useResourceSortContext } from '../../context/ResourceSortContext';
import Button from '../Shared/Button';
import InputSection from '../Shared/InputSection';

interface ResourceFormProps {
  heading: string;
  buttonLabel: string;
  mutationFn: (
    payload: Pick<Resource, 'value'>
  ) => Promise<Pick<Resource, 'id' | 'value' | 'created_at'>>;
  defaultValue: Pick<Resource, 'value'>;
  userData: Pick<Resource, 'owner_id' | 'owner_username'>;
  queryUpdate: (
    newResource: Resource,
    sort: ResourceSort
  ) => [FetchResourcesQueryKey, FetchResourcesQueryUpdate];
}

const ResourceForm = ({
  heading,
  buttonLabel,
  mutationFn,
  defaultValue,
  userData,
  queryUpdate
}: ResourceFormProps) => {
  const [formData, setFormData] =
    useState<Pick<Resource, 'value'>>(defaultValue);

  const [issueMessages, setIssueMessages] = useState<{
    value?: string;
    globalIssue?: string;
  }>({});

  const { dispatch: modalDispatch } = useModalContext();
  const { dispatch: errorDispatch } = useErrorContext();
  const { sort } = useResourceSortContext();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn,
    onError: (error) => {
      setFormData({
        value: ''
      });

      if (isUnauthenticated(error) || isForbidden(error)) {
        queryClient.setQueryData(['users'], null);
        modalDispatch({ type: 'open', component: <LogIn /> });
      } else if (isBadRequest(error)) {
        if (error.response.data.message === 'Invalid input') {
          setIssueMessages({
            value: error.response.data.issues?.value?.join('; ')
          });
        } else {
          setIssueMessages({
            globalIssue: toCapitalized(error.response.data.message)
          });
        }
      } else {
        errorDispatch({ type: 'throw', error });
      }
    },
    onSuccess: (resource) => {
      queryClient.setQueryData(
        ...queryUpdate(
          {
            ...resource,
            ...userData
          },
          sort
        )
      );

      modalDispatch({ type: 'close' });
    }
  });

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIssueMessages({});

    mutation.mutate(formData);
  };

  return (
    <>
      <h2 className="text-xl p-4 bg-green-700 text-green-200">{heading}</h2>
      <form onSubmit={handleFormSubmit} className="flex flex-col p-4 gap-4">
        {issueMessages.globalIssue && (
          <p className="text-green-600 text-sm">{issueMessages.globalIssue}</p>
        )}

        <InputSection
          label="Value"
          type="text"
          name="value"
          id="value"
          value={formData.value}
          issue={issueMessages.value}
          onChange={(e) => setFormData({ ...formData, value: e.target.value })}
          {...(mutation.isPending && { disabled: true })}
        />

        <Button {...(mutation.isPending && { disabled: true })}>
          {buttonLabel}
        </Button>
      </form>
    </>
  );
};

export default ResourceForm;
