import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Requests } from '@app/api';
import { setPopup } from '@slices/selectionSlice';
import FormBuilder from './form.builder';
import { getEntityUrl } from './parser';
import { checkIf, errorData } from './utils';

export default function FormComponent({ boundId: id, data }) {
  const dispatch = useDispatch();
  const [initialData, setInitialData] = useState();
  const companyIdentifier = useSelector(state => state.selection.identifier);
  const url = getEntityUrl({
    api: { port: data.group.service.port, url: data.group.service.url },
  });

  useEffect(() => {
    const getEntityById = async id => {
      try {
        let response = await Requests().CommonRequest.getById({
          url,
          content: { id },
          headers: { CompanyIdentifier: companyIdentifier },
          loading: true,
        });
        setInitialData(response.data.Data);
      } catch (error) {
        dispatch(setPopup({ display: true, ...errorData(error) }));
      }
    };
    if (checkIf(id)) getEntityById(id);
  }, [id]);

  return (
    <FormBuilder
      name={data.group.model}
      dataModel={{ edit: false }}
      mode="edit"
      initialData={initialData}
      data={[{ group: null, fields: data.fields }]}
    />
  );
}
