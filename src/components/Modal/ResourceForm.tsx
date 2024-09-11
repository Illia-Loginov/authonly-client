import { FormEvent, useState } from 'react';
import { Resource } from '../../types/Resource';
import { useModalContext } from '../../context/ModalContext';
import { useErrorContext } from '../../context/ErrorContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  isBadRequest,
  isForbidden,
  isUnauthenticated
} from '../../utils/apiErrors';
import { toCapitalized } from '../../utils/stringDisplayFormatting';

interface ResourceFormProps {
  displayName: string;
  mutationFn: (
    payload: Pick<Resource, 'value'>
  ) => Promise<Pick<Resource, 'id' | 'value' | 'created_at'>>;
  defaultValue: Pick<Resource, 'value'>;
  userData: Pick<Resource, 'owner_id' | 'owner_username'>;
  queryUpdate: (
    oldResources: Resource[] | undefined,
    newResource: Resource
  ) => Resource[] | undefined;
}

const ResourceForm = ({
  displayName,
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

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn,
    onError: (error) => {
      setFormData({
        value: ''
      });

      if (isUnauthenticated(error) || isForbidden(error)) {
        // TODO: Cancel mutation and open log in modal
        setIssueMessages({
          globalIssue: error.response.data.message
        });
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
        ['resources', { sort: { created_at: 'desc' } }],
        (oldResources: Resource[] | undefined): Resource[] | undefined =>
          queryUpdate(oldResources, {
            ...resource,
            ...userData
          })
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
      <h2 className="text-2xl mb-4">{displayName}</h2>
      <form onSubmit={handleFormSubmit} className="flex flex-col w-64">
        {issueMessages.globalIssue && (
          <p className="mb-4">{issueMessages.globalIssue}</p>
        )}

        <label htmlFor="value">Value</label>
        {issueMessages.value && <p>{issueMessages.value}</p>}
        <input
          className="mb-4"
          type="text"
          name="value"
          id="value"
          value={formData.value}
          onChange={(e) => setFormData({ ...formData, value: e.target.value })}
          {...(mutation.isPending && { disabled: true })}
        />

        <button type="submit" {...(mutation.isPending && { disabled: true })}>
          {displayName}
        </button>
      </form>
    </>
  );
};

export default ResourceForm;
