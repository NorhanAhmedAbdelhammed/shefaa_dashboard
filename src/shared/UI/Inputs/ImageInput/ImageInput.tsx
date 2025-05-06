import classNames from 'classnames';
import { ActualFileObject, FilePondFile, FilePondInitialFile } from 'filepond';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import { useEffect } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import { Control, FieldValues, UseFormRegisterReturn, useFormState } from 'react-hook-form';

interface ImageInputProps {
  files: (string | Blob | FilePondInitialFile | ActualFileObject)[] | undefined;
  onChange: ((files: FilePondFile[]) => void) | undefined;
  label?: string;
  register?: UseFormRegisterReturn;
  control: Control<FieldValues, any>;
}

const ImageInput = ({ files, onChange, register, label, control }: ImageInputProps) => {
  const { errors } = useFormState({ control });
  const error = errors[register?.name ?? '']?.message?.toString();

  useEffect(() => {
    registerPlugin(
      FilePondPluginImageExifOrientation,
      FilePondPluginImagePreview,
      FilePondPluginFileValidateType,
      FilePondPluginFileValidateSize
    );
  }, []);

  return (
    <div className="col-span-2">
      {label && <label className="mb-2 block capitalize">{label}</label>}

      <FilePond
        dropOnPage
        name="images"
        files={files} // Use watch function to get the current value of the "images" field
        allowReorder
        allowMultiple
        onupdatefiles={onChange}
        maxFileSize="10MB"
        maxFiles={4}
        className={classNames(
          'relative w-full overflow-hidden rounded-md ring-2 ring-gray-300 focus-within:ring-blue-500',
          {
            'ring-danger/75 [&>*]:!text-danger/70': !!error,
          }
        )}
        acceptedFileTypes={['image/png', 'image/jpg', 'image/jpeg']}
        credits={false}
        labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
      />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default ImageInput;
