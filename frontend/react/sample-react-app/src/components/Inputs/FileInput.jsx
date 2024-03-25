import Icon from '@components/icon';
import { generateAcceptString, getBase64 } from '@libs/utils';
import classNames from 'classnames';
import { ErrorMessage } from 'formik';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const FileInput = ({
  setFieldValue,
  errors,
  currentFiles,
  title,
  description,
  acceptExtensions,
  maxFileSize,
  multiple,
  label,
  ...props
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]);

  const inputAccept = generateAcceptString(
    acceptExtensions || ['png', 'jpeg', 'jpg']
  );

  useEffect(() => {
    if (currentFiles.length > 0) {
      setFiles(currentFiles);
    }
  }, [currentFiles]);

  useEffect(() => {
    setFieldValue(props.name, files);
  }, [files]);

  const handleDragEnter = e => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragOver = e => {
    e.preventDefault();
  };

  const handleDragLeave = e => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async e => {
    try {
      e.preventDefault();

      let file = '';
      if (e.dataTransfer?.items) {
        file = [...e.dataTransfer.items]
          .find(item => item.kind === 'file')
          .getAsFile();
      } else {
        file = e.dataTransfer?.files[0] || e.target.files[0];
      }
      await getBase64(file, uploadCallback);

      setIsDragging(false);
    } catch (error) {
      console.log(error);
    }
  };

  const nonAcceptFiles = file => {
    const extension = file.fileExtension.toLowerCase();
    return !acceptExtensions.includes(extension);
  };

  const fileSizeValid = file => {
    const result = file.fileSize <= maxFileSize || 5 * 1024 * 1024;
    return result;
  };

  const uploadCallback = fileInfo => {
    try {
      const file = { ...fileInfo, id: uuidv4() };
      if (multiple) setFiles([...files, file]);
      else setFiles([file]);
    } catch (error) {}
  };

  const removeFile = id => {
    try {
      setFiles(files => files.filter(file => file.id !== id));
    } catch (error) {}
  };

  return (
    <div>
      <span className="text-sm font-semibold text-black">{label}</span>
      <div className="bg-azure">
        <div className="flex w-full justify-center">
          <label
            htmlFor={props.name}
            className={classNames({
              'border-upload-blue relative z-50 flex w-full cursor-pointer flex-col items-center justify-center border-2 border-dashed px-2 py-3 text-center': true,
              'bg-gray-200': isDragging,
            })}
            onDragEnter={handleDragEnter}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              className="hidden"
              type="file"
              id={props.name}
              name={props.name}
              onChange={handleDrop}
              accept={inputAccept}
            />
            <div className="pointer-events-none flex flex-col items-center justify-center">
              <Icon icon="FaDownload" className="h-10 w-10" />
              <span className="text-upload-blue text-md pb-2 pt-5 font-bold">
                {title}
              </span>
              <div className="text-gray-500">
                <span className="text-sm">
                  Yüklenecek dosyayı seçiniz veya buraya sürükleyerek bırakınız.
                </span>
                <br />
                <span className="text-xs font-light italic">
                  {description ||
                    `(Dosya maks. 5mb jpeg,jpg veya png formatında olabilir. ${(
                      <br />
                    )} Maks. 1 adet dosya yükleyebilirsiniz.)`}
                </span>
              </div>
            </div>
          </label>
        </div>
      </div>
      <div className="mt-2 flex max-w-lg flex-wrap gap-x-2 gap-y-2">
        {files?.map((file, index) => (
          <div
            key={index}
            className={classNames({
              'bg-azure shadow-input-box-lg flex items-center justify-between gap-x-2 rounded-[10px] pl-1 pr-1.5': true,
              '!bg-red-600': nonAcceptFiles(file) || !fileSizeValid(file),
            })}
          >
            <span
              className={classNames({
                'text-sm': true,
                'text-white': nonAcceptFiles(file) || !fileSizeValid(file),
              })}
            >
              {file.fileName}
            </span>
            <button
              onClick={() => removeFile(file.id)}
              className={classNames({
                'flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border-none bg-red-600 text-center text-white': true,
                '!bg-azure !text-red-600':
                  nonAcceptFiles(file) || !fileSizeValid(file),
              })}
            >
              <Icon icon="FaTimes" className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>

      {files.map(file => {
        if (nonAcceptFiles(file)) {
          return (
            <div className="mt-3 flex flex-col gap-y-1" key={file.id}>
              <span className="text-xs font-normal text-red-500">
                *{file.fileName} dosya formatı hatalıdır. Lütfen kontrol ediniz.
              </span>
            </div>
          );
        } else if (!fileSizeValid(file)) {
          return (
            <div className="mt-3 flex flex-col gap-y-1" key={file.id}>
              <span className="text-xs font-normal text-red-500">
                *{file.fileName} dosya çok büyük. Lütfen kontrol ediniz.
              </span>
            </div>
          );
        }
      })}
      <ErrorMessage
        className="pl-1 text-xs text-red-500"
        component="span"
        name={props.name}
      />
    </div>
  );
};
