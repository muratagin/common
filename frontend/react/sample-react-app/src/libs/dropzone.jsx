import { useCallback, useState } from 'react';
import readXlsxFile from 'read-excel-file';
import { useDropzone } from 'react-dropzone';
import Icon from '@components/icon';

export default function Dropzone(props) {
  const [errorMessage, setErrorMessage] = useState(false);

  const onDrop = useCallback(acceptedFiles => {
    acceptedFiles.forEach(file => {
      let fileName = file.name.split('.');
      let extension = fileName.pop();
      if (!extension.match('xls') && !extension.match('XLS')) {
        setErrorMessage(true);
        return false;
      }
      setErrorMessage(false);
      const reader = new FileReader();
      reader.onabort = () => {};
      reader.onerror = () => {};
      reader.onload = () => {
        readXlsxFile(reader.result).then(rows => {
          props.onComplete(rows);
          // `rows` is an array of rows
          // each row being an array of cells.
        });
      };
      reader.addEventListener('progress', event => {
        if (event.loaded && event.total) {
          const percent = (event.loaded / event.total) * 100;
        }
      });
      reader.readAsArrayBuffer(file);
    });
  }, []);
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
  });

  const files = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <p>
          İçe aktarılacak EXCEL dosyasını buraya sürükleyip bırakabilir ya da
          tıklayıp bilgisayarınızdan seçebilirsiniz.
        </p>
        <div className="my-20 flex w-full justify-center">
          <Icon
            icon="FaCloudUploadAlt"
            className="mx-auto cursor-pointer fill-gray-300 text-[10rem]"
          />
        </div>
      </div>
      <ul>{files}</ul>
      {errorMessage && (
        <span className="text-danger">
          Lütfen xls veya xlsx formatında dosya yüklemesi yapınız!
        </span>
      )}
    </>
  );
}
